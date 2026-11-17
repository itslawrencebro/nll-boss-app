# Deployment, Test Checklist & Rollback Guide (`/logistics`)

## 1. Pre-Publish Test Checklist

### Visual, Brand & Responsive Checks
- [ ] **Desktop (1440px)**: Header fits single row with `>=10%` clear space around NLL compact logo; Hero split renders evenly; asymmetric Solutions grid aligns cleanly.
- [ ] **Tablet (768px–1024px)**: Problem and Solutions cards stack without horizontal overflow; Process tabs remain legible.
- [ ] **Mobile (375px–430px)**: Hamburger menu opens/closes cleanly (`aria-expanded`), touch targets >= 44px, sticky header height stays compact, zero horizontal scrolling.
- [ ] **Brand Fidelity**: `#073B2B` forest green, `#C99A32` metallic gold accents, `#FFFFFF` and `#F4F5F4` smoky-gray surfaces, untouched NLL 2027 logo artwork.

### Functional, Accessibility & Security Checks
- [ ] **Navigation & CTAs**: Header links (`Solutions`, `How It Works`, `Assessment`, `Contact`) and all CTAs smoothly scroll to target sections or `#assessment-form` and focus `full_name`.
- [ ] **Process Stepper & FAQ**: Clicking or keyboard-activating each of the 5 stages (`Discover` → `Measure`) and all 4 FAQs updates panels accurately.
- [ ] **Form Validation**: Missing required fields, invalid email, <7-digit phone, or unchecked `consent_to_contact` block submission with inline `aria-describedby` errors.
- [ ] **Spam & Sensitive Data**: Honeypot submission returns filtered response without hitting CRM; SSN/routing patterns are rejected.
- [ ] **No Exposed Keys**: Browser bundle contains zero Airtable/n8n secrets (`grep -rn "AIRTABLE_\|N8N_" dist/` returns nothing).
- [ ] **Truthfulness**: Zero fabricated logistics testimonials, ROI percentages, compliance badges, or customer claims for Sandward Trucking.

---

## 2. Safe `/logistics` Subpath Deployment (Zero Impact to Root Site)

1. Build the `/logistics`-scoped production bundle:
   ```bash
   VITE_BASE_PATH=/logistics/ npm run build
   ```
2. Run the Node/Express service (or mount `dist/` under `/logistics` and proxy `/logistics/api/logistics/*` to `server.ts`):
   - **Option A — Reverse Proxy (Recommended for full-stack n8n/Airtable adapter)**:
     Route `/logistics` and `/logistics/*` on `newlimitslegacy.com` (Nginx / Caddy / Cloudflare / Cloud Run) to this Node service running `NODE_ENV=production npm start`. The root `newlimitslegacy.com/` traffic stays completely untouched.
   - **Option B — Static `/logistics` Folder + Serverless/Node API**:
     Upload `dist/` to `/logistics/` on the web root without modifying root `index.html`, and point `/logistics/api/logistics/leads` to the Express API service with server-side `.env` variables set.
3. Verify live routes after deploy (with Sean's approval):
   - `GET https://newlimitslegacy.com/` (confirm existing homepage unchanged)
   - `GET https://newlimitslegacy.com/logistics` (confirm 200 OK, canonical title & assets)
   - `GET https://newlimitslegacy.com/logistics/api/logistics/health` (confirm `airtableConfigured` / `n8nConfigured`)
   - Submit one controlled test lead with Sean's permission and verify Airtable deduplication + n8n trigger.

---

## 3. Immediate Rollback Procedure

Because `/logistics` is isolated from the root site:
1. **Reverse Proxy**: Remove or comment out the `/logistics` location block in Nginx/Caddy/load balancer and reload config (`nginx -s reload`) — takes < 5 seconds with zero downtime to `newlimitslegacy.com`.
2. **Static Subfolder**: Rename or remove the `/logistics/` directory on the origin host (`mv logistics logistics.disabled`).
3. **DNS / Cache**: Purge CDN cache for `/logistics*` if applicable.
