# Apify B2B Lead Enrichment, Hiring-Intent & SEO/GEO Audit Workflows (n8n, Clay & Make)

Ready-to-import, zero-API-key automation templates chaining three pay-per-event Apify Actors from **[AegisAudit](https://apify.com/aegisaudit)** (using only built-in n8n nodes and native n8n HTTP Bearer Auth credentials):

1. **[Company Career Page & ATS Hiring-Intent Finder](https://apify.com/aegisaudit/company-hiring-intent-ats-jobs-finder)**
   - Automatically discovers company ATS boards across **Greenhouse, Ashby, Lever, SmartRecruiters, Workable, Recruitee & Schema.org JobPosting JSON-LD** from any domain list
   - Extracts live open roles, hiring velocity, disclosed salary ranges, **60+ internal tech stack mentions from JDs** (Salesforce, Snowflake, Kubernetes, HubSpot, Clay, n8n, Klaviyo, etc.), and deterministic **`hiringIntentSignals[]`**
   - **Pricing:** `$15 / 1,000` actively hiring companies, `$0` start fee, `$0` when no open roles are found

2. **[Website Tech Stack, Pixels & SEO/GEO Audit Detector](https://apify.com/aegisaudit/website-tech-stack-seo-audit)**
   - Detects **136 technologies** across 12 categories (CMS, e-commerce, ad pixels, analytics, CRM, consent banners, hosting/CDN)
   - Audits **Technical SEO** (0 to 100 score, meta/H1/noindex/sitemap/JSON-LD/TTFB) + **2026 AI Search / GEO readiness** (`/llms.txt`, RFC 9309 `robots.txt` rules for `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`)
   - Checks live **TLS/SSL expiry** (`daysUntilExpiry`), **DNS** (`MX`/`SPF`/`DMARC`), and outputs deterministic **`salesOpportunities[]`**
   - **Pricing:** `$15 / 1,000` analyzed websites, `$0` start fee, `$0` on unreachable domains

3. **[Website Email, Phone & Decision-Maker Finder](https://apify.com/aegisaudit/domain-decision-maker-finder)**
   - Extracts directly published corporate emails, US/UK/EU phones, MX/SPF/DMARC status, mail provider, and verified decision-makers with exact **GDPR Art. 14 `sourceUrl` provenance** (never bills pattern-inferred emails)
   - **Pricing:** `$15 / 1,000` enriched domains, `$40 / 1,000` verified decision-makers, `$0` start fee, `$0` on empty/unreachable/suppressed domains

4. **[Shopify Store Catalog, Apps, Pricing & Revenue Signals Analyzer](https://apify.com/aegisaudit/shopify-store-catalog-apps-analyzer)**
   - Audits SKU counts, pricing, discounts, out-of-stock %, 65+ Shopify apps, PCI-DSS 4.0.1 SHA-256 script inventory, EAA accessibility pre-checks, and Agentic Commerce readiness
   - **Pricing:** `$15 / 1,000` analyzed stores, `$0` start fee, `$0` on non-Shopify or blocked sites

5. **[MCP Server Security, Tool Poisoning & Rug-Pull Scanner](https://apify.com/aegisaudit/mcp-server-security-scanner)**
   - Audits remote Streamable HTTP MCP servers & inline manifests for OWASP MCP03 tool poisoning, credential exfiltration directives, stealth Unicode (`U+200B..U+E007F`), and SHA-256 TOFU rug-pull drift
   - **Pricing:** `$15 / 1,000` audited MCP servers, `$0` start fee, `$0` on unreachable endpoints

6. **[DORA & NIS2 Vendor Risk & Trust Center Monitor](https://apify.com/aegisaudit/dora-nis2-vendor-risk-trust-center-monitor)**
   - Audits SaaS vendors for Ballot SC-081 (200-day TLS cert limits), Certificate Transparency (`crt.sh`), SPF 10-lookup / DMARC / CAA / DNSSEC, and Vanta/SafeBase/Drata Trust Center & AI subprocessor SHA-256 drift
   - **Pricing:** `$15 / 1,000` audited vendor domains, `$0` start fee, `$0` on unreachable domains

---

## Included Templates (n8n Creator-Ready: Native HTTP Bearer Auth + On-Canvas Sticky Notes)

| File | Description | Tools |
| :--- | :--- | :--- |
| [`workflows/01-agency-tech-seo-geo-to-decision-makers.json`](./workflows/01-agency-tech-seo-geo-to-decision-makers.json) | Scan prospect websites -> qualify only domains with real `salesOpportunities` -> enrich verified decision-makers -> output CRM-ready rows with `pitchSummary` and GDPR `sourceUrl`. | n8n (built-in nodes only) |
| [`workflows/02-bulk-domains-to-verified-decision-makers.json`](./workflows/02-bulk-domains-to-verified-decision-makers.json) | Webhook/Google Maps/CSV list -> normalize & deduplicate domains -> enrich verified emails, phones & executives -> flatten CRM-ready output. | n8n (built-in nodes only) |
| [`workflows/03-hiring-intent-to-decision-makers.json`](./workflows/03-hiring-intent-to-decision-makers.json) | Scan target accounts for active ATS hiring signals (`HIRING_SALES_GROWTH`, `HIRING_MARKETING_SEO_GEO`, `HIRING_AI_ML_ENGINEERING`) -> enrich only hiring accounts with verified decision-makers & internal tech stack from JDs. | n8n (built-in nodes only) |
| [`workflows/04-mcp-server-security-rug-pull-gate.json`](./workflows/04-mcp-server-security-rug-pull-gate.json) | Scan remote MCP servers for OWASP MCP03 tool poisoning & compare against pinned `baselineHashes` -> trigger security alerts on `DANGEROUS`, `CAUTION`, or TOFU SHA-256 drift. | n8n (built-in nodes only) |
| [`workflows/05-dora-nis2-vendor-risk-subprocessor-drift-monitor.json`](./workflows/05-dora-nis2-vendor-risk-subprocessor-drift-monitor.json) | Weekly DORA/NIS2 vendor risk audit -> surface TLS >200d certs, AI subprocessor exposure (`OpenAI`/`Anthropic`), and Trust Center `subprocessorHashSha256` drift. | n8n (built-in nodes only) |
| [`make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json`](./make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json) | 1-click importable Make.com blueprint: Tech Stack + SEO/GEO Audit -> Filter qualified leads -> Verified Decision-Makers. | Make.com |
| [`make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json`](./make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json) | 1-click importable Make.com blueprint: ATS Hiring-Intent Finder -> Filter hiring signals -> Verified Decision-Makers. | Make.com |
| [`make-blueprints/03-mcp-server-security-rug-pull-gate.make.json`](./make-blueprints/03-mcp-server-security-rug-pull-gate.make.json) | 1-click importable Make.com blueprint: OWASP MCP03 Security & SHA-256 Rug-Pull Gate -> Slack alert webhook. | Make.com |
| [`make-blueprints/04-dora-nis2-vendor-risk-drift-monitor.make.json`](./make-blueprints/04-dora-nis2-vendor-risk-drift-monitor.make.json) | 1-click importable Make.com blueprint: DORA/NIS2 Vendor Risk & AI Subprocessor Drift Monitor -> Slack alert webhook. | Make.com |
| [`guides/clay-and-make-setup.md`](./guides/clay-and-make-setup.md) | Copy-paste HTTP API columns for **Clay.com** (all Actors) and Make.com import guide. | Clay, Make |
| [`benchmarks/2026-BENCHMARK-REPORT.md`](./benchmarks/2026-BENCHMARK-REPORT.md) | **Free Live 100-Company Benchmark (CSV + Report):** 100 B2B/AI/FinTech/D2C domains scanned with zero proxies (7,596 open ATS roles, Ashby 30 vs Greenhouse 29, `/llms.txt` adoption & internal cloud/CRM stack). | Open Dataset (CSV) |

---

## Quick Start in n8n (60 Seconds)

1. Download any JSON file from [`workflows/`](./workflows/).
2. In n8n, open a new workflow -> click **`...` (top right) -> Import from File...** and select the JSON.
3. In the HTTP Request node(s), select **Credential to connect with -> Create New Credential (HTTP Bearer Auth)** and paste your Apify API token from [Apify Console Integrations](https://console.apify.com/settings/integrations).
4. Click **Test workflow** on the sample domains.
5. Connect **Google Sheets**, **HubSpot**, **Smartlead**, **Instantly**, or **Slack** to the final node.

---

## Validation

All 3 n8n JSON files and their 6 embedded JavaScript Code nodes are validated structurally and functionally (including native Credential Manager compliance and on-canvas sticky notes):

```bash
node scripts/validate-workflows.mjs
```

---

## Links

- **Apify Store Profile:** https://apify.com/aegisaudit
- **Actor #1 (Email & Decision-Maker Finder):** https://apify.com/aegisaudit/domain-decision-maker-finder
- **Actor #2 (Tech Stack, Pixels & SEO/GEO Audit):** https://apify.com/aegisaudit/website-tech-stack-seo-audit
- **Actor #3 (Company Hiring-Intent & ATS Jobs Finder):** https://apify.com/aegisaudit/company-hiring-intent-ats-jobs-finder
- **AegisAudit Platform:** https://aegisaudit.org
- **License:** MIT
