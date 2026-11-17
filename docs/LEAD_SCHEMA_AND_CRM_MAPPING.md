# Lead Form Schema & CRM Integration Mapping

## 1. Lead Form Schema (`src/shared/leadSchema.ts`)

| Field | Type | Required | Validation / Allowed Values |
| :--- | :--- | :--- | :--- |
| `full_name` | `string` | Yes | Trimmed, 2–120 chars |
| `company_name` | `string` | Yes | Trimmed, 2–150 chars |
| `job_title` | `string` | No | Trimmed, max 120 chars |
| `email` | `string` | Yes | Valid email format, max 180 chars |
| `phone` | `string` | Yes | Min 7 digits, max 40 chars |
| `business_type` | `enum` | Yes | `broker` \| `carrier` \| `broker-carrier` \| `3PL` \| `other` |
| `monthly_load_volume` | `string` | No | `Under 100 loads/month` \| `100–250 loads/month` \| `250–500 loads/month` \| `500–1,000 loads/month` \| `1,000+ loads/month` |
| `current_tms` | `string` | No | Trimmed, max 120 chars |
| `primary_bottleneck` | `enum` | Yes | `paperwork` \| `dispatch` \| `tracking` \| `invoicing` \| `carrier verification` \| `other` |
| `preferred_meeting_time` | `string` | No | Trimmed, max 160 chars |
| `consent_to_contact` | `boolean` | Yes | Must equal `true` |

### Anti-Spam & Data Safety Controls
- **Honeypot (`website_url`)**: Hidden field; if non-empty, submission is silently dropped without writing to Airtable or firing n8n.
- **Dwell Check (`form_loaded_at`)**: Rejects automated submissions completed in under `2000ms`.
- **Rate Limiter**: Max 8 submissions per IP per 15-minute window (`server/security.ts`).
- **Sensitive Token Guard**: Rejects inputs matching SSN/routing/account number patterns and explicitly warns visitors not to attach BOLs, rate confirmations, or banking records.

---

## 2. Server-Generated System Fields

Every validated lead is enriched server-side before hitting Airtable or n8n:
- `lead_id`: `NLL-LOG-<6HEX>` (or preserves existing staging ID on duplicate)
- `lead_source`: `"NLL Logistics"` (constant)
- `created_at`: ISO-8601 UTC timestamp (`new Date().toISOString()`)
- `status`: `"New Lead"`
- `owner`: `process.env.DEFAULT_LEAD_OWNER || "Sean Frierson"`
- `dedupe_key`: `${email.toLowerCase()}::${company_name.toLowerCase().trim()}`

---

## 3. Airtable Field Mapping (`server/adapters/airtable.ts`)

Target table: `process.env.AIRTABLE_TABLE_NAME` (default: `Logistics Leads`).

| Normalized Key | Airtable Column Name | Type Recommendation |
| :--- | :--- | :--- |
| `lead_id` | `Lead ID` | Single line text |
| `lead_source` | `Lead Source` | Single line text / Single select (`NLL Logistics`) |
| `created_at` | `Created At` | Date (ISO / include time) |
| `status` | `Status` | Single select (`New Lead`) |
| `owner` | `Owner` | Single line text |
| `dedupe_key` | `Dedupe Key` | Single line text |
| `full_name` | `Full Name` | Single line text |
| `company_name` | `Company Name` | Single line text |
| `job_title` | `Job Title` | Single line text |
| `email` | `Email` | Email |
| `phone` | `Phone` | Phone number |
| `business_type` | `Business Type` | Single select (`broker`, `carrier`, `broker-carrier`, `3PL`, `other`) |
| `monthly_load_volume` | `Monthly Load Volume` | Single select |
| `current_tms` | `Current TMS` | Single line text |
| `primary_bottleneck` | `Primary Bottleneck` | Single select |
| `preferred_meeting_time` | `Preferred Meeting Time` | Long text / Single line text |
| `consent_to_contact` | `Consent to Contact` | Checkbox |

### Duplicate Handling
Before creating a record, `syncLeadToAirtable` queries Airtable with:
```text
OR(LOWER({Email})="<email>", LOWER({Company Name})="<company>")
```
- **Match found**: Executes `PATCH` on the existing Airtable record ID with updated fields and timestamp (`action: 'updated'`).
- **No match**: Executes `POST` to create a new record (`action: 'created'`).

---

## 4. n8n Webhook Payload (`server/adapters/n8n.ts`)

Posted to `process.env.N8N_WEBHOOK_URL` with `X-NLL-Signature: sha256=<hmac>` and `Authorization: Bearer <N8N_WEBHOOK_SECRET>` when `N8N_WEBHOOK_SECRET` is configured:

```json
{
  "event": "logistics_assessment_requested",
  "lead": {
    "lead_id": "NLL-LOG-A1B2C3",
    "lead_source": "NLL Logistics",
    "created_at": "2026-11-17T17:30:00.000Z",
    "status": "New Lead",
    "owner": "Sean Frierson",
    "dedupe_key": "ops@carrier.example::apex freight llc",
    "full_name": "Jordan Rivera",
    "company_name": "Apex Freight LLC",
    "job_title": "Director of Operations",
    "email": "ops@carrier.example",
    "phone": "(817) 555-0140",
    "business_type": "broker-carrier",
    "monthly_load_volume": "250–500 loads/month",
    "current_tms": "McLeod LoadMaster",
    "primary_bottleneck": "paperwork",
    "preferred_meeting_time": "Thursday afternoon Central",
    "consent_to_contact": true
  }
}
```
