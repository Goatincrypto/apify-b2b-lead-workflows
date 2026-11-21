import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workflowsDir = path.resolve(__dirname, '..', 'workflows');

function loadWorkflow(fileName) {
  const fullPath = path.join(workflowsDir, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const wf = JSON.parse(raw);

  assert.ok(typeof wf.name === 'string' && wf.name.length > 5, `${fileName}: missing name`);
  assert.ok(Array.isArray(wf.nodes) && wf.nodes.length >= 4, `${fileName}: expected >= 4 nodes`);
  assert.ok(wf.connections && typeof wf.connections === 'object', `${fileName}: missing connections`);

  const nodeNames = new Set(wf.nodes.map((n) => n.name));
  const nodeIds = new Set();
  for (const node of wf.nodes) {
    assert.ok(node.id && !nodeIds.has(node.id), `${fileName}: duplicate/missing node id ${node.id}`);
    nodeIds.add(node.id);
    assert.ok(node.type && Array.isArray(node.position) && node.position.length === 2, `${fileName}: invalid node ${node.name}`);
  }

  for (const [src, spec] of Object.entries(wf.connections)) {
    assert.ok(nodeNames.has(src), `${fileName}: connection source '${src}' not in nodes`);
    for (const branch of spec.main || []) {
      for (const edge of branch) {
        assert.ok(nodeNames.has(edge.node), `${fileName}: connection target '${edge.node}' not in nodes`);
      }
    }
  }
  return wf;
}

function runCodeNode(wf, nodeName, inputItems, nodeLookup = {}) {
  const node = wf.nodes.find((n) => n.name === nodeName);
  assert.ok(node && node.type === 'n8n-nodes-base.code', `Code node not found: ${nodeName}`);
  const jsCode = node.parameters.jsCode;

  const sandbox = {
    $input: { all: () => inputItems },
    $: (name) => ({
      first: () => nodeLookup[name] ?? null,
    }),
  };

  const wrapped = `(function() {\n${jsCode}\n})()`;
  const raw = vm.runInNewContext(wrapped, sandbox);
  return JSON.parse(JSON.stringify(raw));
}

// --- Validate Workflow 01 ---
const wf1 = loadWorkflow('01-agency-tech-seo-geo-to-decision-makers.json');

const mockActor2Rows = [
  {
    json: {
      domain: 'lakefrontbrewery.com',
      finalUrl: 'https://lakefrontbrewery.com/',
      status: 'analyzed',
      cms: 'WordPress',
      ecommercePlatform: 'WooCommerce',
      hostingOrCdn: 'Cloudflare',
      technologyCount: 14,
      marketingSignals: { adPixels: [], crmTools: [] },
      seo: { seoScore: 82 },
      geo: { geoReadinessScore: 45, hasLlmsTxt: false, blockedAiBots: [] },
      ssl: { daysUntilExpiry: 64 },
      dns: { hasDmarc: false },
      salesOpportunities: ['MISSING_LLMS_TXT_FOR_AI_SEARCH', 'MISSING_DMARC_EMAIL_SECURITY'],
    },
  },
  {
    json: {
      domain: 'clean-perfect-site.com',
      status: 'analyzed',
      salesOpportunities: [],
    },
  },
  {
    json: {
      domain: 'dead-site.invalid',
      status: 'unreachable',
      salesOpportunities: ['INVALID_OR_MISSING_SSL_CERTIFICATE'],
    },
  },
];

const qualified = runCodeNode(wf1, 'Qualify Agency Leads (Filter Sales Opportunities)', mockActor2Rows, {
  'Set Prospect Domains': { json: { minOpportunities: 1 } },
});

assert.equal(qualified.length, 1);
assert.deepEqual(qualified[0].json.domains, ['lakefrontbrewery.com']);
assert.equal(qualified[0].json.qualifiedCount, 1);
assert.match(qualified[0].json.auditsByDomain['lakefrontbrewery.com'].pitchSummary, /Missing \/llms\.txt/);

const mockActor1Rows = [
  {
    json: {
      domain: 'lakefrontbrewery.com',
      status: 'enriched',
      companyName: 'Lakefront Brewery',
      primaryEmail: 'info@lakefrontbrewery.com',
      source: '/about',
      sourceUrl: 'https://lakefrontbrewery.com/about',
      confidence: 0.9,
      extractedAtUtc: '2026-11-21T12:00:00Z',
      dns: { hasMx: true, hasSpf: true, hasDmarc: false, emailProvider: 'Microsoft 365' },
      phones: ['+14143728800'],
      socials: { linkedin: 'https://linkedin.com/company/lakefront-brewery' },
      decisionMakers: [
        {
          fullName: 'Russ Klisch',
          role: 'President',
          email: 'russ@lakefrontbrewery.com',
          emailSource: 'direct_match',
          confidence: 0.95,
          verifiedForBilling: true,
          linkedinUrl: null,
          sourceUrl: 'https://lakefrontbrewery.com/about',
        },
        {
          fullName: 'Guessed Person',
          role: 'VP',
          email: 'guessed@lakefrontbrewery.com',
          emailSource: 'pattern_inferred',
          confidence: 0.4,
          verifiedForBilling: false,
          linkedinUrl: null,
          sourceUrl: 'https://lakefrontbrewery.com/about',
        },
      ],
    },
  },
];

const merged = runCodeNode(wf1, 'Merge Audit + Verified Contacts (CRM Ready)', mockActor1Rows, {
  'Qualify Agency Leads (Filter Sales Opportunities)': qualified[0],
});

assert.equal(merged.length, 1, 'Must emit only verified decision-makers, excluding pattern_inferred');
assert.equal(merged[0].json.contactEmail, 'russ@lakefrontbrewery.com');
assert.equal(merged[0].json.contactType, 'verified_decision_maker');
assert.equal(merged[0].json.cms, 'WordPress');
assert.equal(merged[0].json.hasLlmsTxt, false);
assert.equal(merged[0].json.sourceUrl, 'https://lakefrontbrewery.com/about');

// Edge case: 0 qualified domains -> returns [] cleanly so Actor #1 is not called
const emptyQualified = runCodeNode(
  wf1,
  'Qualify Agency Leads (Filter Sales Opportunities)',
  [{ json: { domain: 'ok.com', status: 'analyzed', salesOpportunities: [] } }],
  { 'Set Prospect Domains': { json: { minOpportunities: 1 } } },
);
assert.equal(emptyQualified.length, 0);

// --- Validate Workflow 02 ---
const wf2 = loadWorkflow('02-bulk-domains-to-verified-decision-makers.json');

const normalized = runCodeNode(wf2, 'Normalize & Deduplicate Domains', [
  { json: { body: { domains: ['https://www.Stripe.com/pricing', 'stripe.com', 'http://allbirds.com/?ref=1', 'invalid', ''] } } },
]);
assert.equal(normalized.length, 1);
assert.deepEqual(normalized[0].json.domains, ['stripe.com', 'allbirds.com']);

const flattened = runCodeNode(wf2, 'Flatten Verified Contacts & GDPR Provenance', [
  ...mockActor1Rows,
  {
    json: {
      domain: 'company-only.co.uk',
      status: 'enriched',
      companyName: 'Company Only Ltd',
      primaryEmail: 'hello@company-only.co.uk',
      source: '/contact',
      sourceUrl: 'https://company-only.co.uk/contact',
      confidence: 0.85,
      extractedAtUtc: '2026-11-21T12:00:00Z',
      dns: { hasMx: true, hasSpf: true, hasDmarc: true, emailProvider: 'Google Workspace' },
      phones: [],
      socials: {},
      legal: { vatIds: [], impressumUrl: null },
      billing: { estimatedChargeUsd: 0.015 },
      decisionMakers: [],
    },
  },
  {
    json: {
      domain: 'suppressed.de',
      status: 'suppressed',
      decisionMakers: [],
    },
  },
]);

assert.equal(flattened.length, 2, 'Expected 1 verified DM row + 1 company_contact fallback, skipping suppressed');
assert.equal(flattened[0].json.recordType, 'decision_maker');
assert.equal(flattened[0].json.email, 'russ@lakefrontbrewery.com');
assert.equal(flattened[1].json.recordType, 'company_contact');
assert.equal(flattened[1].json.email, 'hello@company-only.co.uk');

console.log('ALL WORKFLOW VALIDATION CHECKS PASSED (2 workflows, 4 code nodes, 100% schema assertions OK)');
