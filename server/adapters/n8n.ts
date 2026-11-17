import crypto from 'node:crypto';
import type { NormalizedLeadRecord } from '../../src/shared/leadSchema.ts';
import type { AdapterResult } from './airtable.ts';

export async function forwardLeadToN8n(lead: NormalizedLeadRecord): Promise<AdapterResult> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (!webhookUrl) {
    return {
      configured: false,
      ok: true,
      action: 'skipped',
    };
  }

  const payload = JSON.stringify({
    event: 'logistics_assessment_requested',
    lead,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'NLL-BOSS-Logistics-Adapter/1.0',
  };

  if (webhookSecret) {
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');
    headers['X-NLL-Signature'] = `sha256=${signature}`;
    headers['Authorization'] = `Bearer ${webhookSecret}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: payload,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const detail = await response.text();
      return {
        configured: true,
        ok: false,
        error: `n8n webhook returned ${response.status}: ${detail.slice(0, 200)}`,
      };
    }

    return {
      configured: true,
      ok: true,
      action: 'created',
    };
  } catch (err) {
    return {
      configured: true,
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown n8n webhook error',
    };
  }
}
