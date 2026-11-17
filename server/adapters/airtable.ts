import type { NormalizedLeadRecord } from '../../src/shared/leadSchema.ts';

export interface AdapterResult {
  configured: boolean;
  ok: boolean;
  action?: 'created' | 'updated' | 'skipped';
  recordId?: string;
  error?: string;
}

function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export async function syncLeadToAirtable(lead: NormalizedLeadRecord): Promise<AdapterResult> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();
  const baseId = process.env.AIRTABLE_BASE_ID?.trim();
  const tableName = (process.env.AIRTABLE_TABLE_NAME || 'Logistics Leads').trim();

  if (!apiKey || !baseId) {
    return {
      configured: false,
      ok: true,
      action: 'skipped',
    };
  }

  const endpoint = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const fields = {
    'Lead ID': lead.lead_id,
    'Lead Source': lead.lead_source,
    'Created At': lead.created_at,
    Status: lead.status,
    Owner: lead.owner,
    'Dedupe Key': lead.dedupe_key,
    'Full Name': lead.full_name,
    'Company Name': lead.company_name,
    'Job Title': lead.job_title || undefined,
    Email: lead.email,
    Phone: lead.phone,
    'Business Type': lead.business_type,
    'Monthly Load Volume': lead.monthly_load_volume || undefined,
    'Current TMS': lead.current_tms || undefined,
    'Primary Bottleneck': lead.primary_bottleneck,
    'Preferred Meeting Time': lead.preferred_meeting_time || undefined,
    'Consent to Contact': lead.consent_to_contact,
  };

  try {
    // Check for duplicate by normalized email or company name
    const emailEsc = escapeFormulaValue(lead.email.toLowerCase());
    const companyEsc = escapeFormulaValue(lead.company_name.toLowerCase());
    const formula = `OR(LOWER({Email})="${emailEsc}", LOWER({Company Name})="${companyEsc}")`;
    const searchUrl = `${endpoint}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;

    const searchRes = await fetch(searchUrl, { method: 'GET', headers });
    if (!searchRes.ok) {
      const detail = await searchRes.text();
      return {
        configured: true,
        ok: false,
        error: `Airtable lookup failed (${searchRes.status}): ${detail.slice(0, 200)}`,
      };
    }

    const existing = (await searchRes.json()) as { records?: Array<{ id: string }> };
    const existingId = existing.records?.[0]?.id;

    if (existingId) {
      const patchRes = await fetch(`${endpoint}/${existingId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields, typecast: true }),
      });

      if (!patchRes.ok) {
        const detail = await patchRes.text();
        return {
          configured: true,
          ok: false,
          error: `Airtable update failed (${patchRes.status}): ${detail.slice(0, 200)}`,
        };
      }

      return {
        configured: true,
        ok: true,
        action: 'updated',
        recordId: existingId,
      };
    }

    const createRes = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!createRes.ok) {
      const detail = await createRes.text();
      return {
        configured: true,
        ok: false,
        error: `Airtable create failed (${createRes.status}): ${detail.slice(0, 200)}`,
      };
    }

    const created = (await createRes.json()) as { records?: Array<{ id: string }> };
    return {
      configured: true,
      ok: true,
      action: 'created',
      recordId: created.records?.[0]?.id,
    };
  } catch (err) {
    return {
      configured: true,
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Airtable network error',
    };
  }
}
