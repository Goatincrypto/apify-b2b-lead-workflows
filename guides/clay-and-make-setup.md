# Clay & Make.com Setup Guide (Zero Start Fees, Zero Dead-Domain Billing)

Both AegisAudit Apify Actors expose Apify's synchronous HTTP endpoint (`run-sync-get-dataset-items`), so you can wire them directly into **Clay** or **Make.com** in under 2 minutes without paying third-party enrichment subscriptions or BuiltWith keys.

- **Actor #1 (Contact & Decision-Maker Enrichment):** `aegisaudit~domain-decision-maker-finder` ([Apify Store](https://apify.com/aegisaudit/domain-decision-maker-finder))
- **Actor #2 (Tech Stack, Pixels & SEO/GEO Audit):** `aegisaudit~website-tech-stack-seo-audit` ([Apify Store](https://apify.com/aegisaudit/website-tech-stack-seo-audit))

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

---

## 2. Make.com Blueprint (4 Modules)

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
