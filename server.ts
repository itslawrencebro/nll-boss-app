import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { leadFormSchema, type NormalizedLeadRecord } from './src/shared/leadSchema.ts';
import { syncLeadToAirtable } from './server/adapters/airtable.ts';
import { forwardLeadToN8n } from './server/adapters/n8n.ts';
import { checkRateLimit, containsSensitiveTokens } from './server/security.ts';

// Load local .env if present (Node 22 built-in)
try {
  if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
    process.loadEnvFile(path.resolve(process.cwd(), '.env'));
  }
} catch {
  // Ignore when .env is absent
}

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';

// In-memory staging buffer during preview/testing when CRM env vars are not yet connected
const stagingLeads = new Map<string, NormalizedLeadRecord>();
const analyticsLog: Array<{ event: string; page: string; timestamp: string }> = [];

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '64kb' }));

  // Preserve original imported BOSS App untouched at /boss-app
  app.get('/boss-app', (_req: Request, res: Response) => {
    const legacyPath = path.resolve(process.cwd(), 'legacy/boss-app.html');
    if (fs.existsSync(legacyPath)) {
      return res.sendFile(legacyPath);
    }
    return res.status(404).send('Legacy app archive not found.');
  });

  // Public runtime configuration (never returns secrets)
  const handleConfig = (_req: Request, res: Response) => {
    res.json({
      contactEmail: process.env.PUBLIC_CONTACT_EMAIL?.trim() || 'contact@newlimitslegacy.com',
      contactPhone: process.env.PUBLIC_CONTACT_PHONE?.trim() || '',
      schedulerUrl: process.env.VERIFIED_SCHEDULER_URL?.trim() || '',
      integrations: {
        airtableConfigured: Boolean(
          process.env.AIRTABLE_API_KEY?.trim() && process.env.AIRTABLE_BASE_ID?.trim()
        ),
        n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL?.trim()),
      },
    });
  };

  app.get('/api/logistics/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'nll-boss-logistics',
      airtableConfigured: Boolean(
        process.env.AIRTABLE_API_KEY?.trim() && process.env.AIRTABLE_BASE_ID?.trim()
      ),
      n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL?.trim()),
      stagingLeadCount: stagingLeads.size,
      analyticsEventsRecorded: analyticsLog.length,
    });
  });

  app.get(['/api/logistics/config', '/logistics/api/logistics/config'], handleConfig);

  const handleAnalytics = (req: Request, res: Response) => {
    const body = req.body as { event?: unknown; page?: unknown; timestamp?: unknown };
    if (typeof body?.event === 'string' && body.event.length <= 64) {
      analyticsLog.push({
        event: body.event,
        page: typeof body.page === 'string' ? body.page : '/logistics',
        timestamp: typeof body.timestamp === 'string' ? body.timestamp : new Date().toISOString(),
      });
      if (analyticsLog.length > 500) analyticsLog.shift();
    }
    res.status(204).end();
  };

  app.post(['/api/logistics/analytics', '/logistics/api/logistics/analytics'], handleAnalytics);

  const handleLeadSubmission = async (req: Request, res: Response) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        ok: false,
        message: 'Too many requests from this network. Please wait a few minutes and try again.',
      });
    }

    const parsed = leadFormSchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || 'form');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return res.status(400).json({
        ok: false,
        message: 'Please review the highlighted fields and try again.',
        fieldErrors,
      });
    }

    const data = parsed.data;

    // Honeypot check (return generic success without forwarding spam)
    if (data.website_url && data.website_url.trim().length > 0) {
      return res.status(202).json({
        ok: true,
        leadId: `SPAM-${Date.now()}`,
        mode: 'filtered',
        message: 'Thank you. Your inquiry has been received.',
      });
    }

    // Minimum human dwell check (2 seconds)
    if (typeof data.form_loaded_at === 'number' && Date.now() - data.form_loaded_at < 2000) {
      return res.status(400).json({
        ok: false,
        message: 'Submission occurred too quickly. Please review your details and submit again.',
      });
    }

    // Guard against accidentally pasted sensitive freight/banking numbers
    if (
      containsSensitiveTokens([
        data.current_tms,
        data.preferred_meeting_time,
        data.job_title,
        data.company_name,
      ])
    ) {
      return res.status(400).json({
        ok: false,
        message:
          'Please do not include banking numbers, SSNs, or sensitive freight documents in this inquiry form.',
      });
    }

    const dedupeKey = `${data.email.toLowerCase()}::${data.company_name.toLowerCase().trim()}`;
    const existingStaging = stagingLeads.get(dedupeKey);
    const leadId =
      existingStaging?.lead_id ||
      `NLL-LOG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const record: NormalizedLeadRecord = {
      lead_id: leadId,
      lead_source: 'NLL Logistics',
      created_at: new Date().toISOString(),
      status: 'New Lead',
      owner: process.env.DEFAULT_LEAD_OWNER?.trim() || 'Sean Frierson',
      dedupe_key: dedupeKey,
      full_name: data.full_name,
      company_name: data.company_name,
      job_title: data.job_title || '',
      email: data.email,
      phone: data.phone,
      business_type: data.business_type,
      monthly_load_volume: data.monthly_load_volume || '',
      current_tms: data.current_tms || '',
      primary_bottleneck: data.primary_bottleneck,
      preferred_meeting_time: data.preferred_meeting_time || '',
      consent_to_contact: data.consent_to_contact,
    };

    stagingLeads.set(dedupeKey, record);

    const [airtableResult, n8nResult] = await Promise.all([
      syncLeadToAirtable(record),
      forwardLeadToN8n(record),
    ]);

    const anyConfigured = airtableResult.configured || n8nResult.configured;
    const anyFailed =
      (airtableResult.configured && !airtableResult.ok) ||
      (n8nResult.configured && !n8nResult.ok);

    if (anyFailed) {
      console.error('[NLL Logistics CRM Adapter Warning]', {
        leadId,
        airtable: airtableResult.error,
        n8n: n8nResult.error,
      });
      return res.status(502).json({
        ok: false,
        leadId,
        message:
          'We encountered an upstream CRM delivery error. Please try again or email us directly while our team resolves the connection.',
      });
    }

    return res.status(201).json({
      ok: true,
      leadId,
      deduplicated: Boolean(existingStaging) || airtableResult.action === 'updated',
      integrationMode: anyConfigured ? 'live' : 'staging',
      integrations: {
        airtable: airtableResult.configured ? airtableResult.action : 'not_configured',
        n8n: n8nResult.configured ? 'forwarded' : 'not_configured',
      },
      message: anyConfigured
        ? 'Your Operations Assessment request has been logged and routed to our consulting team.'
        : 'Your Operations Assessment request was validated and captured in staging mode. Live CRM/n8n credentials are awaiting final connection.',
    });
  };

  app.post(['/api/logistics/leads', '/logistics/api/logistics/leads'], handleLeadSubmission);

  if (IS_PROD) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use('/logistics', express.static(distDir));
    app.use('/', express.static(distDir));

    app.get(['/logistics', '/logistics/*path', '*path'], (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Serve assets when previewed at /logistics/assets/... as well as /assets/...
    app.use('/logistics/assets', express.static(path.resolve(process.cwd(), 'public/assets')));
    app.use(vite.middlewares);

    app.get(['/logistics', '/logistics/*path'], async (req, res, next) => {
      try {
        const htmlPath = path.resolve(process.cwd(), 'index.html');
        const template = fs.readFileSync(htmlPath, 'utf-8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NLL BOSS Logistics server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
