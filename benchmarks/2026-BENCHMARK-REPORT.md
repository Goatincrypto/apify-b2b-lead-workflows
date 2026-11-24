# 2026 B2B Tech Stack, AI Search (GEO) & Public ATS Hiring-Intent Benchmark (100 Companies)

**Dataset CSV (free, MIT license):** [`2026-b2b-ai-search-geo-hiring-benchmark.csv`](./2026-b2b-ai-search-geo-hiring-benchmark.csv)  
**Measured Live:** `2026-11-24T00:19:35Z`  
**Total Runtime (100 companies, 2 full stages, zero proxies, zero headless browser):** **`63.1 seconds`** (`16.7s` Website Tech/SEO/GEO + `46.4s` Public ATS Hiring-Intent)

---

## Executive Summary (Key Findings)

We ran two deterministic, zero-proxy AegisAudit Apify Actors ([Website Tech Stack, Pixels & SEO/GEO Audit Detector](https://apify.com/aegisaudit/website-tech-stack-seo-audit) and [Company Career Page & ATS Hiring-Intent Finder](https://apify.com/aegisaudit/company-hiring-intent-ats-jobs-finder)) across **100 well-known companies** split evenly across 5 verticals (**20 B2B SaaS**, **20 DevTools & Infra**, **20 AI & Data**, **20 FinTech**, and **20 D2C E-Commerce**):

1. **Ashby Edged Out Greenhouse (`30` vs `29`) Among Top 100 Tech & D2C Brands:**
   - Out of **64 companies** with auto-discovered public ATS job boards (zero login, zero proxy), **Ashby led with `30`**, **Greenhouse followed closely at `29`**, plus SmartRecruiters (`3`), Lever (`1`), and Workable (`1`).
   - Across those 64 companies, we extracted **`7,596` live open roles**, including **`1,420` roles posted in just the last 14 days**.
2. **The 2026 `/llms.txt` Paradox (Shopify & DevTools Outpace AI Labs):**
   - Overall, **`70 / 89` analyzed homepages (78.7%)** already serve `/llms.txt`, led by **DevTools & Infra (`95.0%`, 19/20)** and **Shopify-powered D2C brands (`85.7%`, 12/14)** thanks to Shopify's native `# Agent Instructions` markdown endpoint.
   - Surprisingly, **`19 / 89` (21.3%)** still have no `/llms.txt` on their root domain, including major AI & SaaS names (`openai.com`, `anthropic.com`, `perplexity.ai`, `huggingface.co`, `scale.com`, `clay.com`, `figma.com`, `airtable.com`, `miro.com`, `webflow.com`, `ramp.com`, `mercury.com`, `wise.com`).
3. **Structured Data, Security Headers & Live SSL Gaps Remain High-Signal Agency Triggers:**
   - **`21 / 89` (23.6%)** lack Schema.org JSON-LD structured data on the homepage.
   - **`12 / 89` (13.5%)** score `< 50/100` on HTTP security headers (`typeform.com`, `braze.com`, `posthog.com`, `sentry.io`, `netlify.com`, `planetscale.com`, `neon.tech`, `gitlab.com`, `scale.com`, `pinecone.io`, `weaviate.io`, `plaid.com`).
   - **`2 / 89`** explicitly block `GPTBot` in `robots.txt` (`figma.com`, `loom.com`; `figma.com` also blocks `ClaudeBot` and `Google-Extended`).
   - **`2 / 89`** triggered `SSL_CERTIFICATE_EXPIRING_SOON` within 21 days (`olaplex.com` with `16 days` left, `tailscale.com` with `19 days` left).
4. **Domain-First ATS Probing Bypasses Homepage WAF Friction:**
   - **`11 / 100`** homepages sit behind strict WAF/bot protection and returned unreachable in Stage 1 (billed at **`$0.00`** by Actor #2).
   - Even when the marketing homepage was WAF-blocked (`snowflake.com`), Stage 2 still uncovered **`373` live open Ashby roles (`77` posted in the last 14 days)** directly from the public ATS API.
5. **Internal Cloud, Data & CRM Tools Invisible to HTML Scrapers (Strict Zero-False-Positive JD Extraction):**
   - Standard BuiltWith/Wappalyzer website scrapers only see frontend scripts. Parsing public job postings across the 64 hiring accounts with strict case-sensitive/contextual matching surfaced internal stacks:
     - **Python (`46` companies)**, **AWS (`46`)**, **Kubernetes (`39`)**, **TypeScript (`34`)**, **Salesforce (`33`)**, **GCP (`33`)**, **Go (`31`)**, **React (`28`)**, **Anthropic (`25`)**, **Azure (`23`)**, **Terraform (`23`)**, **PostgreSQL (`17`)**, **dbt (`17`)**, **Snowflake (`13`)**, and **Docker (`13`)**.

---

## Segment Breakdown (100 Companies, 20 Per Vertical)

| Segment | Homepages Analyzed | `/llms.txt` Live | Blocking AI Bots | Avg SEO Score | Avg GEO Score | Public ATS Found | Live Open Roles |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **B2B SaaS** | 20 / 20 | 15 (75.0%) | 2 | 89.5 | 86.2 | 14 / 20 | 1,192 |
| **DevTools & Infra** | 20 / 20 | 19 (95.0%) | 0 | 95.2 | 95.8 | 16 / 20 | 1,431 |
| **AI & Data** | 19 / 20 | 13 (68.4%) | 0 | 90.6 | 82.6 | 17 / 20 | 3,193 |
| **FinTech** | 16 / 20 | 11 (68.8%) | 0 | 89.5 | 85.1 | 9 / 20 | 1,623 |
| **D2C E-Commerce** | 14 / 20 | 12 (85.7%) | 0 | 77.9 | 83.4 | 8 / 20 | 157 |
| **TOTAL / AVG** | **89 / 100** | **70 (78.7%)** | **2** | **89.2** | **86.9** | **64 / 100** | **7,596** |

---

## Fastest-Hiring Companies by 14-Day Velocity

| Company | Segment | ATS Platform | Open Roles | Posted Last 14 Days |
| :--- | :--- | :--- | ---: | ---: |
| `openai.com` | AI & Data | Ashby | 854 | 175 |
| `stripe.com` | FinTech | Greenhouse | 770 | 116 |
| `wise.com` | FinTech | SmartRecruiters | 100 | 100 |
| `cloudflare.com` | DevTools & Infra | Greenhouse | 504 | 89 |
| `snowflake.com` | AI & Data | Ashby | 373 | 77 |
| `databricks.com` | AI & Data | Greenhouse | 882 | 69 |
| `braze.com` | B2B SaaS | Greenhouse | 355 | 67 |
| `gitlab.com` | DevTools & Infra | Greenhouse | 250 | 56 |

---

## Top B2B Buying-Intent Signals Detected (Out of 64 Hiring Companies)

| Signal Flag | Companies Triggered | Ideal Outbound Use Case |
| :--- | ---: | :--- |
| `HIRING_SALES_GROWTH` | 56 | Pitch outbound tooling, Clay/n8n workflows, CRM ops, sales enablement |
| `RAPID_HIRING_SURGE` | 53 | Target fast-scaling teams (`>= 10` open roles or `>= 3` in 14 days) |
| `HIRING_MARKETING_SEO_GEO` | 50 | Pitch SEO/GEO agencies, paid acquisition, analytics, attribution |
| `HIRING_LEADERSHIP_EXECUTIVE` | 50 | New VP/C-suite leaders bring fresh 90-day tool & agency budgets |
| `TRANSPARENT_SALARY_DISCLOSED` | 45 | Recruiting agencies & compensation/HR SaaS benchmarking |
| `HIRING_SECURITY_COMPLIANCE` | 42 | AppSec, SOC2/ISO compliance, DevSecOps & security audits |
| `HIRING_AI_ML_ENGINEERING` | 41 | AI infra, LLM evals, vector DBs, compute & AI security |
| `HIRING_DEVOPS_CLOUD` | 41 | Cloud cost optimization, observability, CI/CD & Kubernetes |
| `REMOTE_FIRST_HIRING` | 41 | Distributed team ops, global payroll/EOR & async collaboration |

---

## Cost Breakdown (Reproducing This Exact 100-Company Study on Apify)

Running this exact 2-stage intelligence pipeline on 100 domains using AegisAudit's pay-per-event Apify Actors:
- **Stage 1 (`website-tech-stack-seo-audit`):** `89` analyzed domains x `$0.015` = **`$1.335`** (`11` WAF-blocked sites billed at **`$0.00`**, `$0.00` start fee)
- **Stage 2 (`company-hiring-intent-ats-jobs-finder`):** `64` actively hiring companies x `$0.015` = **`$0.960`** (`36` non-hiring/non-public ATS sites billed at **`$0.00`**, `$0.00` start fee)
- **Exact total cost for 100 companies (both stages):** **`$2.295`** (**`~$2.30`** total, versus `$63-$150/1k` for legacy scrapers that also charge actor-start fees and failed-domain charges)
- **Optional Stage 3 (`domain-decision-maker-finder`):** Enrich ONLY your filtered high-intent subset (e.g., accounts hiring Sales + missing JSON-LD) at **`$0.015`** per enriched domain / **`$0.04`** per MX-verified decision-maker (`$0.00` on empty sites, with GDPR Art. 14 `sourceUrl` provenance).

---

## Reproduce This Pipeline in 60 Seconds

- **n8n Templates (native HTTP Bearer Auth):** [`workflows/01-agency-tech-seo-geo-to-decision-makers.json`](../workflows/01-agency-tech-seo-geo-to-decision-makers.json) · [`workflows/03-hiring-intent-to-decision-makers.json`](../workflows/03-hiring-intent-to-decision-makers.json)
- **Make.com 1-Click Blueprints:** [`make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json`](../make-blueprints/01-agency-tech-seo-geo-to-decision-makers.make.json) · [`make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json`](../make-blueprints/02-hiring-intent-ats-to-decision-makers.make.json)
- **Clay HTTP API Columns:** [`guides/clay-and-make-setup.md`](../guides/clay-and-make-setup.md)
- **Apify Store Profile:** [https://apify.com/aegisaudit](https://apify.com/aegisaudit)
