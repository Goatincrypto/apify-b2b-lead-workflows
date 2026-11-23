# 2026 B2B Tech Stack, AI Search (GEO) & Public ATS Hiring-Intent Benchmark (100 Companies)

**Dataset CSV (free, MIT license):** [`2026-b2b-ai-search-geo-hiring-benchmark.csv`](./2026-b2b-ai-search-geo-hiring-benchmark.csv)  
**Measured Live:** `2026-11-23T23:32:59Z`  
**Total Runtime (100 companies, 2 full stages, zero proxies, zero headless browser):** **`30.2 seconds`** (`12.8s` Website Tech/SEO/GEO + `17.4s` Public ATS Hiring-Intent)

---

## Executive Summary (Key Findings)

We ran two deterministic, zero-proxy AegisAudit Apify Actors ([Website Tech Stack, Pixels & SEO/GEO Audit Detector](https://apify.com/aegisaudit/website-tech-stack-seo-audit) and [Company Career Page & ATS Hiring-Intent Finder](https://apify.com/aegisaudit/company-hiring-intent-ats-jobs-finder)) across **100 well-known companies** split evenly across 5 verticals (**20 B2B SaaS**, **20 DevTools & Infra**, **20 AI & Data**, **20 FinTech**, and **20 D2C E-Commerce**):

1. **Ashby Has Virtually Tied Greenhouse Among Top 100 Tech & D2C Brands:**
   - Out of **65 companies** with auto-discovered public ATS job boards (zero login, zero proxy), **Greenhouse led by just 1 company (`31`) over Ashby (`30`)**, followed by SmartRecruiters (`3`) and Lever (`1`).
   - Across those 65 companies, we extracted **`8,479` live open roles**, including **`1,531` roles posted in just the last 14 days**.
2. **The 2026 `/llms.txt` Paradox (Shopify & DevTools Outpace AI Labs):**
   - Overall, **`70 / 89` analyzed homepages (78.7%)** already serve `/llms.txt`, led by **DevTools & Infra (`95.0%`, 19/20)** and **Shopify-powered D2C brands (`85.7%`, 12/14)** thanks to Shopify's native `# Agent Instructions` markdown endpoint.
   - Surprisingly, **`19 / 89` (21.3%)** still have no `/llms.txt` on their root domain, including major AI & SaaS names (`openai.com`, `anthropic.com`, `perplexity.ai`, `huggingface.co`, `scale.com`, `clay.com`, `figma.com`, `airtable.com`, `miro.com`, `webflow.com`, `ramp.com`, `mercury.com`, `wise.com`).
3. **Structured Data, Security Headers & Live SSL Gaps Remain High-Signal Agency Triggers:**
   - **`21 / 89` (23.6%)** lack Schema.org JSON-LD structured data on the homepage.
   - **`12 / 89` (13.5%)** score `< 50/100` on HTTP security headers (`typeform.com`, `braze.com`, `posthog.com`, `sentry.io`, `netlify.com`, `planetscale.com`, `neon.tech`, `gitlab.com`, `scale.com`, `pinecone.io`, `weaviate.io`, `plaid.com`).
   - **`2 / 89`** explicitly block `GPTBot` in `robots.txt` (`figma.com`, `loom.com`; `figma.com` also blocks `ClaudeBot` and `Google-Extended`).
   - **`1 / 89`** (`olaplex.com`) triggered `SSL_CERTIFICATE_EXPIRING_SOON` with **`17 days`** remaining on its TLS certificate.
4. **Domain-First ATS Probing Bypasses Homepage WAF Friction:**
   - **`11 / 100`** homepages sit behind strict WAF/bot protection and returned unreachable in Stage 1 (billed at **`$0.00`** by Actor #2).
   - Even when the marketing homepage was WAF-blocked (`snowflake.com`), Stage 2 still uncovered **`375` live open Ashby roles (`77` posted in the last 14 days)** directly from the public ATS API.
5. **Internal GTM & Cloud Tools Invisible to HTML Scrapers (Extracted from Job Descriptions):**
   - Standard BuiltWith/Wappalyzer website scrapers only see frontend scripts. Parsing public job postings across the 65 hiring accounts surfaced internal backend & RevOps stacks:
     - **Salesforce (`34` companies)**, **Outreach (`28`)**, **Anthropic (`25`)**, **Segment (`20`)**, **Snowflake (`13`)**, alongside **Go (`56`)**, **AWS (`46`)**, **Python (`45`)**, **Kubernetes (`38`)**, **GCP (`30`)**, **Terraform (`23`)**, and **Azure (`21`)**.

---

## Segment Breakdown (100 Companies, 20 Per Vertical)

| Segment | Homepages Analyzed | `/llms.txt` Live | Blocking AI Bots | Avg SEO Score | Avg GEO Score | Public ATS Found | Live Open Roles |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **B2B SaaS** | 20 / 20 | 15 (75.0%) | 2 | 90.5 | 86.2 | 14 / 20 | 1,193 |
| **DevTools & Infra** | 20 / 20 | 19 (95.0%) | 0 | 94.7 | 95.8 | 16 / 20 | 1,429 |
| **AI & Data** | 19 / 20 | 13 (68.4%) | 0 | 90.6 | 82.6 | 17 / 20 | 3,817 |
| **FinTech** | 16 / 20 | 11 (68.8%) | 0 | 91.1 | 85.1 | 10 / 20 | 1,883 |
| **D2C E-Commerce** | 14 / 20 | 12 (85.7%) | 0 | 80.8 | 83.4 | 8 / 20 | 157 |
| **TOTAL / AVG** | **89 / 100** | **70 (78.7%)** | **2** | **90.0** | **86.9** | **65 / 100** | **8,479** |

---

## Fastest-Hiring Companies by 14-Day Velocity

| Company | Segment | ATS Platform | Open Roles | Posted Last 14 Days |
| :--- | :--- | :--- | ---: | ---: |
| `openai.com` | AI & Data | Ashby | 855 | 177 |
| `stripe.com` | FinTech | Greenhouse | 770 | 115 |
| `wise.com` | FinTech | SmartRecruiters | 100 | 100 |
| `cloudflare.com` | DevTools & Infra | Greenhouse | 503 | 88 |
| `snowflake.com` | AI & Data | Ashby | 375 | 77 |
| `anthropic.com` | AI & Data | Greenhouse | 632 | 72 |
| `databricks.com` | AI & Data | Greenhouse | 882 | 69 |
| `braze.com` | B2B SaaS | Greenhouse | 355 | 67 |

---

## Top B2B Buying-Intent Signals Detected (Out of 65 Hiring Companies)

| Signal Flag | Companies Triggered | Ideal Outbound Use Case |
| :--- | ---: | :--- |
| `HIRING_SALES_GROWTH` | 58 | Pitch outbound tooling, Clay/n8n workflows, CRM ops, sales enablement |
| `RAPID_HIRING_SURGE` | 54 | Target fast-scaling teams (`>= 10` open roles or `>= 3` in 14 days) |
| `HIRING_MARKETING_SEO_GEO` | 52 | Pitch SEO/GEO agencies, paid acquisition, analytics, attribution |
| `HIRING_LEADERSHIP_EXECUTIVE` | 52 | New VP/C-suite leaders bring fresh 90-day tool & agency budgets |
| `TRANSPARENT_SALARY_DISCLOSED` | 46 | Recruiting agencies & compensation/HR SaaS benchmarking |
| `HIRING_SECURITY_COMPLIANCE` | 44 | AppSec, SOC2/ISO compliance, DevSecOps & security audits |
| `HIRING_AI_ML_ENGINEERING` | 42 | AI infra, LLM evals, vector DBs, compute & AI security |
| `HIRING_DEVOPS_CLOUD` | 42 | Cloud cost optimization, observability, CI/CD & Kubernetes |
| `REMOTE_FIRST_HIRING` | 40 | Distributed team ops, global payroll/EOR & async collaboration |

---

## Cost Breakdown (Reproducing This Exact 100-Company Study on Apify)

Running this exact 2-stage intelligence pipeline on 100 domains using AegisAudit's pay-per-event Apify Actors:
- **Stage 1 (`website-tech-stack-seo-audit`):** `89` analyzed domains x `$0.015` = **`$1.34`** (`11` WAF-blocked sites billed at **`$0.00`**, `$0.00` start fee)
- **Stage 2 (`company-hiring-intent-ats-jobs-finder`):** `65` actively hiring companies x `$0.015` = **`$0.98`** (`35` non-hiring/non-public ATS sites billed at **`$0.00`**, `$0.00` start fee)
- **Total cost for 100 companies (both stages):** **`$2.31`** (or **`~$23`** per 1,000 companies, versus `$63-$150/1k` for legacy scrapers that also charge actor-start fees and failed-domain charges)
- **Optional Stage 3 (`domain-decision-maker-finder`):** Enrich ONLY your filtered high-intent subset (e.g., accounts hiring Sales + missing JSON-LD) at **`$0.015`** per enriched domain / **`$0.04`** per MX-verified decision-maker (`$0.00` on empty sites, with GDPR Art. 14 `sourceUrl` provenance).

---

## Reproduce This Pipeline in 60 Seconds

- **n8n Templates (native HTTP Bearer Auth):** [`workflows/01-agency-tech-seo-geo-to-decision-makers.json`](../workflows/01-agency-tech-seo-geo-to-decision-makers.json) · [`workflows/03-hiring-intent-to-decision-makers.json`](../workflows/03-hiring-intent-to-decision-makers.json)
- **Make.com 1-Click Blueprints:** [`make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json`](../make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json) · [`make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json`](../make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json)
- **Clay HTTP API Columns:** [`guides/clay-and-make-setup.md`](../guides/clay-and-make-setup.md)
- **Apify Store Profile:** [https://apify.com/aegisaudit](https://apify.com/aegisaudit)
