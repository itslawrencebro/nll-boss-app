# New Limits Legacy Consulting — BOSS Logistics Landing Page (`/logistics`)

Production-ready, mobile-responsive landing page and server-side CRM/n8n lead adapter for New Limits Legacy Consulting's **BOSS Logistics** division, designed to deploy cleanly under `/logistics` on `newlimitslegacy.com` without altering the existing root website.

> **Legacy App Preserved**: The original imported BOSS App HTML file is preserved untouched at `legacy/boss-app.html` and served in preview at `/boss-app`.

## Project Structure

```text
├── index.html                          # SEO entry point, Schema.org JSON-LD, fonts & favicons
├── server.ts                           # Express + Vite server, API endpoints, /logistics routing
├── server/
│   ├── adapters/
│   │   ├── airtable.ts                 # Airtable REST API upsert + email/company deduplication
│   │   └── n8n.ts                      # n8n webhook adapter with HMAC signature support
│   └── security.ts                     # Rate limiter & sensitive token guard
├── src/
│   ├── App.tsx                         # Main BOSS Logistics landing page composition
│   ├── index.css                       # Tailwind v4 theme tokens (NLL 2027 Brand Guide)
│   ├── data/logisticsContent.ts        # Grounded consulting copy & FAQ content
│   ├── lib/analytics.ts                # CTA & form conversion beacon + GA4 dataLayer hook
│   ├── shared/leadSchema.ts            # Shared Zod validation schema (client + server)
│   └── components/                     # Reusable UI sections (Navbar, Hero, Problem, Solutions, Process, Assessment, LeadForm, Faq, Footer, PrivacyModal)
├── public/assets/                      # Official NLL 2027 logos (extracted untouched from PDF), favicons, WebP/JPG editorial imagery
├── legacy/boss-app.html                # Untouched archive of original imported index.html
├── docs/
│   ├── LEAD_SCHEMA_AND_CRM_MAPPING.md  # Field validation, Airtable & n8n mapping, deduplication
│   ├── DEPLOYMENT_AND_ROLLBACK.md      # /logistics subpath deployment, test checklist, rollback
│   └── SANDWARD_ASSESSMENT_AGENDA.md   # Internal 30-min discovery agenda (NOT on public page)
└── .env.example                        # Environment variable template (no secrets)
```

## Quick Start (Local / AI Studio)

1. Copy `.env.example` to `.env` and set server-side credentials when ready for live CRM testing:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies & run dev server on port `3000`:
   ```bash
   npm install
   npm run dev
   ```
3. Preview routes:
   - Landing Page: `http://localhost:3000/` or `http://localhost:3000/logistics`
   - Health Check: `http://localhost:3000/api/logistics/health`
   - Preserved Legacy BOSS App: `http://localhost:3000/boss-app`

## Building for `/logistics` Subpath Deployment

To build a bundle mounted strictly under `https://newlimitslegacy.com/logistics`:

```bash
VITE_BASE_PATH=/logistics/ npm run build
```

See `docs/DEPLOYMENT_AND_ROLLBACK.md` for full pre-flight checks, reverse-proxy/static-host rules, and rollback steps.
