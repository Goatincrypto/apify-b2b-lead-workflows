# Clay & Make.com Setup Guide (Zero Start Fees, Zero Dead-Domain Billing)

All three AegisAudit Apify Actors expose Apify's synchronous HTTP endpoint (`run-sync-get-dataset-items`), so you can wire them directly into **Clay** or **Make.com** in under 2 minutes without paying third-party enrichment subscriptions or BuiltWith keys.

- **Actor #1 (Contact & Decision-Maker Enrichment):** `aegisaudit~domain-decision-maker-finder` ([Apify Store](https://apify.com/aegisaudit/domain-decision-maker-finder))
- **Actor #2 (Tech Stack, Pixels & SEO/GEO Audit):** `aegisaudit~website-tech-stack-seo-audit` ([Apify Store](https://apify.com/aegisaudit/website-tech-stack-seo-audit))
- **Actor #3 (Company Career Page & ATS Hiring-Intent Finder):** `aegisaudit~company-hiring-intent-ats-jobs-finder` ([Apify Store](https://apify.com/aegisaudit/company-hiring-intent-ats-jobs-finder))

---

## 1. Clay.com Setup (HTTP API Enrichment Column)

### Column A: Tech Stack, Ad Pixels & AI/GEO Audit
1. Add a new **Enrich Data -> HTTP API** column in your Clay table.
2. Set **Method** to `POST` and **Endpoint** to:
   ```
   https://api.apify.com/v2/acts/aegisaudit~website-tech-stack-seo-audit/run-sync-get-dataset-items
   ```
3. Add Header:
   - `Authorization`: `Bearer YOUR_APIFY_API_TOKEN`
   - `Content-Type`: `application/json`
4. Set **Body**:
   ```json
   {
     "domains": ["/{{Company Domain}}"],
     "checkSeoAndGeo": true,
     "checkDnsAndSsl": true,
     "includeFailedDomainsInDataset": true
   }
   ```
   *(Replace `"/{{Company Domain}}"` with Clay's `{{Company Domain}}` column token.)*
5. Map useful child columns from the first returned array item (`[0]`):
   - `cms` -> CMS / platform
   - `ecommercePlatform` -> E-commerce platform (Shopify, WooCommerce, etc.)
   - `marketingSignals.adPixels` -> Active ad pixels
   - `seo.seoScore` -> 0 to 100 technical SEO score
   - `geo.hasLlmsTxt` -> Whether `/llms.txt` exists
   - `geo.blockedAiBots` -> Blocked AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`)
   - `ssl.daysUntilExpiry` -> Days until TLS certificate expiry
   - `salesOpportunities` -> Deterministic outreach triggers (e.g. `MISSING_META_PIXEL_ON_ECOMMERCE`, `MISSING_LLMS_TXT_FOR_AI_SEARCH`, `MISSING_DMARC_EMAIL_SECURITY`)

### Column B: Conditional Verified Decision-Maker Enrichment (Run Only If Qualified!)
1. Add a second **HTTP API** column with **Run Settings -> Only run if** `{{salesOpportunities}}` is not empty.
2. Set **Method** to `POST` and **Endpoint** to:
   ```
   https://api.apify.com/v2/acts/aegisaudit~domain-decision-maker-finder/run-sync-get-dataset-items
   ```
3. Set **Body**:
   ```json
   {
     "domains": ["{{Company Domain}}"],
     "maxPagesPerDomain": 6,
     "verifyDns": true,
     "extractDecisionMakers": true,
     "inferPatternEmails": false,
     "includeEmptyDomainsInDataset": false
   }
   ```
4. Map `[0].primaryEmail`, `[0].decisionMakers`, `[0].phones`, `[0].dns.emailProvider`, and `[0].sourceUrl` (GDPR Art. 14 provenance).
5. **Cost control:** If a domain has no published emails or is unreachable, Apify charges **$0.00**.

### Column C: Active ATS Hiring-Intent & Internal Tech Stack (Greenhouse / Ashby / Lever / Workable / SmartRecruiters)
1. Add an **Enrich Data -> HTTP API** column in Clay.
2. Set **Method** to `POST` and **Endpoint** to:
   ```
   https://api.apify.com/v2/acts/aegisaudit~company-hiring-intent-ats-jobs-finder/run-sync-get-dataset-items
   ```
3. Set **Body**:
   ```json
   {
     "domains": ["{{Company Domain}}"],
     "maxJobsPerCompany": 50,
     "includeJobDescriptions": false,
     "includeEmptyDomainsInDataset": true
   }
   ```
4. Map `[0].atsProvider`, `[0].openRolesCount`, `[0].velocity.postedLast14Days`, `[0].hiringIntentSignals`, and `[0].techStackFromJobs` (60+ internal tools detected inside job descriptions).
5. **Cost control:** If a company has no open roles or no detectable ATS, Apify charges **$0.00**.

### Column D: OWASP MCP03 Server Security & SHA-256 Rug-Pull Gate
1. Add an **HTTP API** column with **Method** `POST` and **Endpoint**:
   ```
   https://api.apify.com/v2/acts/aegisaudit~mcp-server-security-scanner/run-sync-get-dataset-items
   ```
2. Set **Body**:
   ```json
   {
     "serverUrls": ["{{MCP Server URL}}"],
     "baselineHashes": {},
     "concurrency": 5,
     "requestTimeoutMs": 10000
   }
   ```
3. Map `[0].grade`, `[0].verdict`, `[0].riskScore`, `[0].manifestHashSha256`, and `[0].rugPullDriftDetected`.

### Column E: DORA & NIS2 Vendor Risk, TLS 200d & Trust Center Drift
1. Add an **HTTP API** column with **Method** `POST` and **Endpoint**:
   ```
   https://api.apify.com/v2/acts/aegisaudit~dora-nis2-vendor-risk-trust-center-monitor/run-sync-get-dataset-items
   ```
2. Set **Body**:
   ```json
   {
     "domains": ["{{Company Domain}}"],
     "includeCtDiscovery": true,
     "concurrency": 4,
     "requestTimeoutMs": 10000
   }
   ```
3. Map `[0].grade`, `[0].doraNis2Score`, `[0].tlsCert.ballotSc081Status`, `[0].trustCenter.platform`, `[0].trustCenter.aiSubprocessors`, and `[0].trustCenter.subprocessorHashSha256`.

---

## 2. Make.com Import-Ready Blueprints (1-Click JSON Import)

Skip manual module wiring by importing our validated Make.com scenario blueprints directly:
- [`make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json`](../make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json): Tech Stack + SEO/GEO Audit -> Filter `salesOpportunities >= 1` -> Verified Decision-Maker Enrichment.
- [`make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json`](../make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json): Public ATS Hiring-Intent Scan -> Filter `hiringIntentSignals >= 1` -> Verified Decision-Maker Enrichment.
- [`make-blueprints/03-mcp-server-security-rug-pull-gate.make.json`](../make-blueprints/03-mcp-server-security-rug-pull-gate.make.json): OWASP MCP03 & SHA-256 Rug-Pull Gate -> Slack alert webhook.
- [`make-blueprints/04-dora-nis2-vendor-risk-drift-monitor.make.json`](../make-blueprints/04-dora-nis2-vendor-risk-drift-monitor.make.json): DORA & NIS2 Vendor Risk & AI Subprocessor Drift Monitor -> Slack alert webhook.

**How to import in Make.com (30 seconds):**
1. Open a new Scenario in Make.com -> click **`...` (More) -> Import Blueprint** and pick either `.make.json` file.
2. Replace `YOUR_APIFY_API_TOKEN` in the `Authorization` header of both HTTP modules with your token from Apify Console -> Settings -> Integrations.
3. Attach Google Sheets, HubSpot, Pipedrive, Smartlead, or Slack after Module 4.

### Manual 4-Module Make.com Setup (Alternative)

1. **Trigger:** Google Sheets (`Search Rows`) or Webhook receiving prospect domains.
2. **Module 2 (Apify -> Run an Actor):**
   - Actor: `aegisaudit/website-tech-stack-seo-audit`
   - Run synchronously: `Yes`
   - Input JSON: `{ "domains": ["{{1.domain}}"], "checkSeoAndGeo": true, "checkDnsAndSsl": true, "includeFailedDomainsInDataset": false }`
3. **Module 3 (Apify -> Get Dataset Items + Filter):**
   - Filter condition: `salesOpportunities` (Array length) `Greater than` `0`
   - Optional vertical filters: `salesOpportunities` contains `MISSING_META_PIXEL_ON_ECOMMERCE` OR `MISSING_LLMS_TXT_FOR_AI_SEARCH` OR `SSL_CERTIFICATE_EXPIRING_SOON`.
4. **Module 4 (Apify -> Run an Actor + Get Dataset Items):**
   - Actor: `aegisaudit/domain-decision-maker-finder`
   - Input JSON: `{ "domains": ["{{3.domain}}"], "verifyDns": true, "extractDecisionMakers": true, "inferPatternEmails": false, "includeEmptyDomainsInDataset": false }`
5. **Module 5 (Destination):** Send verified decision-makers (`decisionMakers[].email`, `fullName`, `role`, `sourceUrl`) + `salesOpportunities` to HubSpot, Pipedrive, Smartlead, or Google Sheets.
