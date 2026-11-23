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

  // Verify n8n Creator Portal compliance: overview sticky note + no hardcoded Bearer headers
  const stickyNotes = wf.nodes.filter((n) => n.type === 'n8n-nodes-base.stickyNote');
  assert.ok(stickyNotes.length >= 2, `${fileName}: expected overview + section sticky notes for n8n review`);
  const overview = stickyNotes[0].parameters.content || '';
  assert.ok(overview.includes('### How it works'), `${fileName}: missing '### How it works' in overview sticky note`);
  assert.ok(overview.includes('### Setup'), `${fileName}: missing '### Setup' in overview sticky note`);

  for (const node of wf.nodes) {
    if (node.type === 'n8n-nodes-base.httpRequest') {
      assert.equal(node.parameters.authentication, 'genericCredentialType', `${fileName}: HTTP node must use native n8n Credential Manager`);
      assert.equal(node.parameters.genericAuthType, 'httpBearerAuth', `${fileName}: HTTP node must use httpBearerAuth`);
      const hdrs = node.parameters.headerParameters?.parameters || [];
      assert.ok(!hdrs.some((h) => String(h.name).toLowerCase() === 'authorization'), `${fileName}: must not hardcode Authorization header`);
    }
  }

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

// --- Workflow 01 ---
const wf1 = loadWorkflow('01-agency-tech-seo-geo-to-decision-makers.json');
const qualified = runCodeNode(
  wf1,
  'Filter Qualified Agency Leads',
  [
    {
      json: {
        domain: 'lakefrontbrewery.com',
        status: 'analyzed',
        cms: 'WordPress',
        technologyCount: 14,
        seo: { seoScore: 82 },
        geo: { geoReadinessScore: 45, hasLlmsTxt: false, blockedAiBots: [] },
        ssl: { daysUntilExpiry: 64 },
        dns: { hasDmarc: false },
        salesOpportunities: ['MISSING_LLMS_TXT_FOR_AI_SEARCH', 'MISSING_DMARC_EMAIL_SECURITY'],
      },
    },
    { json: { domain: 'dead.invalid', status: 'unreachable', salesOpportunities: [] } },
  ],
  { 'Configure Prospect Domains': { json: { minOpportunities: 1 } } }
);
assert.equal(qualified.length, 1);
assert.deepEqual(qualified[0].json.domains, ['lakefrontbrewery.com']);

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
      extractedAtUtc: '2026-11-23T18:00:00Z',
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
          sourceUrl: 'https://lakefrontbrewery.com/about',
        },
        {
          fullName: 'Unbilled Guess',
          role: 'VP',
          email: 'guess@lakefrontbrewery.com',
          emailSource: 'pattern_inferred',
          confidence: 0.4,
          verifiedForBilling: false,
          sourceUrl: 'https://lakefrontbrewery.com/about',
        },
      ],
    },
  },
];

const merged1 = runCodeNode(wf1, 'Merge Audit & Verified Contacts', mockActor1Rows, {
  'Filter Qualified Agency Leads': qualified[0],
});
assert.equal(merged1.length, 1);
assert.equal(merged1[0].json.contactEmail, 'russ@lakefrontbrewery.com');

// --- Workflow 02 ---
const wf2 = loadWorkflow('02-bulk-domains-to-verified-decision-makers.json');
const normalized = runCodeNode(wf2, 'Normalize & Deduplicate Domains', [
  { json: { body: { domains: ['https://www.Stripe.com/pricing', 'stripe.com', 'http://allbirds.com/?ref=1'] } } },
]);
assert.deepEqual(normalized[0].json.domains, ['stripe.com', 'allbirds.com']);

const flattened = runCodeNode(wf2, 'Flatten Verified Contacts & Provenance', mockActor1Rows);
assert.equal(flattened.length, 1);
assert.equal(flattened[0].json.email, 'russ@lakefrontbrewery.com');

// --- Workflow 03 ---
const wf3 = loadWorkflow('03-hiring-intent-to-decision-makers.json');
const hiringFiltered = runCodeNode(
  wf3,
  'Filter Accounts Matching Hiring Intent',
  [
    {
      json: {
        domain: 'lakefrontbrewery.com',
        status: 'hiring',
        atsProvider: 'ashby',
        careersUrl: 'https://jobs.ashbyhq.com/lakefront',
        openRolesCount: 12,
        hiringIntentSignals: ['HIRING_SALES_GROWTH', 'RAPID_HIRING_SURGE'],
        techStackFromJobs: ['Salesforce', 'HubSpot'],
        velocity: { postedLast14Days: 4 },
        jobs: [{ title: 'VP of Sales' }],
      },
    },
    {
      json: {
        domain: 'not-hiring.com',
        status: 'no_jobs_found',
        hiringIntentSignals: [],
      },
    },
  ],
  { 'Configure Target Accounts & Signals': { json: { targetSignals: ['HIRING_SALES_GROWTH'] } } }
);
assert.equal(hiringFiltered.length, 1);
assert.deepEqual(hiringFiltered[0].json.domains, ['lakefrontbrewery.com']);

const merged3 = runCodeNode(wf3, 'Merge Hiring Signals & Contacts', mockActor1Rows, {
  'Filter Accounts Matching Hiring Intent': hiringFiltered[0],
});
assert.equal(merged3.length, 1);
assert.equal(merged3[0].json.contactEmail, 'russ@lakefrontbrewery.com');
assert.equal(merged3[0].json.atsProvider, 'ashby');
assert.equal(merged3[0].json.matchedSignals, 'HIRING_SALES_GROWTH');

// --- Make.com Blueprints Validation ---
const makeDir = path.resolve(__dirname, '..', 'make-blueprints');
const makeFiles = [
  '01-agency-tech-seo-geo-to-decision-makers.make.json',
  '02-hiring-intent-ats-to-decision-makers.make.json',
];
for (const mf of makeFiles) {
  const raw = fs.readFileSync(path.join(makeDir, mf), 'utf8');
  const bp = JSON.parse(raw);
  assert.ok(typeof bp.name === 'string' && bp.name.length > 5, `${mf}: missing name`);
  assert.ok(Array.isArray(bp.flow) && bp.flow.length >= 4, `${mf}: expected >= 4 modules`);
  assert.ok(bp.metadata && typeof bp.metadata === 'object', `${mf}: missing metadata`);
  assert.ok(!raw.includes('apify_api_'), `${mf}: leaked real Apify API token`);
  const httpMods = bp.flow.filter((m) => m.module === 'http:ActionSendData');
  assert.equal(httpMods.length, 2, `${mf}: expected 2 HTTP modules`);
  for (const hm of httpMods) {
    assert.ok(
      String(hm.mapper?.url || '').startsWith('https://api.apify.com/v2/acts/aegisaudit~'),
      `${mf}: invalid Apify Actor URL`
    );
  }
}

console.log('ALL 3 N8N CREATOR-COMPLIANT WORKFLOWS + 2 MAKE.COM BLUEPRINTS PASSED VALIDATION');
