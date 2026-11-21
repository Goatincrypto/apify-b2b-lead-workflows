# Apify B2B Lead Enrichment & SEO/GEO Audit Workflows (n8n, Clay & Make)

Ready-to-import, zero-API-key automation templates chaining two pay-per-event Apify Actors from **[AegisAudit](https://apify.com/aegisaudit)**:

1. **[Website Tech Stack, Pixels & SEO/GEO Audit Detector](https://apify.com/aegisaudit/website-tech-stack-seo-audit)**
   - Detects **136 technologies** across 12 categories (CMS, e-commerce, ad pixels, analytics, CRM, consent banners, hosting/CDN)
   - Audits **Technical SEO** (0 to 100 score, meta/H1/noindex/sitemap/JSON-LD/TTFB) + **2026 AI Search / GEO readiness** (`/llms.txt`, RFC 9309 `robots.txt` rules for `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`)
   - Checks live **TLS/SSL expiry** (`daysUntilExpiry`), **DNS** (`MX`/`SPF`/`DMARC`), and HTTP security headers
   - Outputs deterministic **`salesOpportunities[]`** flags for outbound qualification
   - **Pricing:** `$15 / 1,000` analyzed websites, `$0` start fee, `$0` on unreachable domains (platform usage included)

2. **[Website Email, Phone & Decision-Maker Finder](https://apify.com/aegisaudit/domain-decision-maker-finder)**
   - Extracts directly published corporate emails, US/UK/EU phones, MX/SPF/DMARC status, mail provider (Google Workspace / Microsoft 365), and verified decision-makers with exact **GDPR Art. 14 `sourceUrl` provenance**
   - Never bills guessed/pattern-inferred emails (`inferPatternEmails: false` by default)
   - **Pricing:** `$15 / 1,000` enriched domains, `$40 / 1,000` verified decision-makers, `$0` start fee, `$0` on empty/unreachable/suppressed domains (platform usage included)

---

## Included Templates

| File | Description | Tools |
| :--- | :--- | :--- |
| [`workflows/01-agency-tech-seo-geo-to-decision-makers.json`](./workflows/01-agency-tech-seo-geo-to-decision-makers.json) | Scan prospect websites -> qualify only domains with real `salesOpportunities` -> enrich verified decision-makers -> output CRM-ready rows with `pitchSummary` and GDPR `sourceUrl`. | n8n (built-in nodes only, no community node needed) |
| [`workflows/02-bulk-domains-to-verified-decision-makers.json`](./workflows/02-bulk-domains-to-verified-decision-makers.json) | Webhook/Google Maps/CSV list -> normalize & deduplicate domains -> enrich verified emails, phones & executives -> flatten CRM-ready output. | n8n (built-in nodes only) |
| [`guides/clay-and-make-setup.md`](./guides/clay-and-make-setup.md) | Copy-paste HTTP API columns for **Clay.com** and 4-module blueprint for **Make.com**. | Clay, Make |

---

## Quick Start in n8n (60 Seconds)

1. Download either JSON file from [`workflows/`](./workflows/).
2. In n8n, open a new workflow -> click **`...` (top right) -> Import from File...** and select the JSON.
3. Add your Apify API token (`APIFY_TOKEN` from [Apify Console Integrations](https://console.apify.com/settings/integrations)) as an n8n environment variable, or paste it into the `Authorization: Bearer ...` header of the HTTP Request node(s).
4. Click **Test workflow** to run on the sample domains (`baremetrics.com`, `allbirds.com`, `posthog.com`, `lakefrontbrewery.com`).
5. Connect **Google Sheets**, **HubSpot**, **Smartlead**, **Instantly**, or **Slack** to the final node.

---

## Example Output Row (Workflow 01)

```json
{
  "domain": "lakefrontbrewery.com",
  "companyName": "Lakefront Brewery",
  "cms": "WordPress",
  "ecommercePlatform": "WooCommerce",
  "technologyCount": 14,
  "seoScore": 82,
  "geoReadinessScore": 45,
  "hasLlmsTxt": false,
  "blockedAiBots": "",
  "sslDaysUntilExpiry": 64,
  "salesOpportunities": "MISSING_LLMS_TXT_FOR_AI_SEARCH, MISSING_DMARC_EMAIL_SECURITY",
  "pitchSummary": "Missing /llms.txt for AI search visibility; Missing DMARC email authentication record",
  "contactType": "verified_decision_maker",
  "contactName": "Russ Klisch",
  "contactRole": "President",
  "contactEmail": "russ@lakefrontbrewery.com",
  "emailSource": "direct_match",
  "sourceUrl": "https://lakefrontbrewery.com/about",
  "hasMx": true,
  "hasDmarc": false,
  "confidence": 0.95
}
```

---

## Validation

Both n8n JSON files and their embedded JavaScript Code nodes are structurally and functionally validated with zero external dependencies:

```bash
node scripts/validate-workflows.mjs
```

---

## Links

- **Apify Store Profile:** https://apify.com/aegisaudit
- **Actor #1 (Email & Decision-Maker Finder):** https://apify.com/aegisaudit/domain-decision-maker-finder
- **Actor #2 (Tech Stack, Pixels & SEO/GEO Audit):** https://apify.com/aegisaudit/website-tech-stack-seo-audit
- **AegisAudit Platform:** https://aegisaudit.org
- **License:** MIT
