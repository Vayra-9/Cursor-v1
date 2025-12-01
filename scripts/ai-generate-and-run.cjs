// scripts/ai-generate-and-run.cjs
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const instruction = process.argv.slice(2).join(' ').trim();
if (!instruction) {
  console.error('Usage: npm run ai:test "<plain English test instruction>"');
  process.exit(1);
}

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const baseURL = process.env.BASE_URL || 'http://localhost:5174';
const outDir = process.env.TEST_OUT_DIR || 'tests/ai';
fs.mkdirSync(outDir, { recursive: true });

const systemPrompt =
  [
    'You are a senior QA who writes robust Playwright tests in TypeScript using @playwright/test.',
    'Output MUST be a SINGLE, complete .ts file with NO markdown, NO code fences, NO commentary.',
    'Rules:',
    '- Use: import { test, expect } from "@playwright/test";',
    `- Use page.goto('/') with baseURL=${baseURL} (relative paths).`,
    '- Prefer data-testid selectors when available; otherwise use role/text with regex.',
    '- Tag at least one test with @smoke where appropriate.',
  ].join('\n');

const userPrompt =
  [
    'Write a Playwright spec that achieves the following:',
    instruction,
    '',
    'File must compile as-is. No markdown. No backticks. No explanation.',
  ].join('\n');

function extractTs(source) {
  // If the model still returned fences, extract the first TS/JS block
  const fences = [
    /```ts([\s\S]*?)```/i,
    /```typescript([\s\S]*?)```/i,
    /```js([\s\S]*?)```/i,
    /```([\s\S]*?)```/i
  ];
  for (const re of fences) {
    const m = source.match(re);
    if (m) return m[1].trim();
  }
  return source.trim();
}

function ensurePlaywrightImports(code) {
  if (!/from ['"]@playwright\/test['"]/.test(code)) {
    code = `import { test, expect } from '@playwright/test';\n` + code;
  }
  return code;
}

function suggestFilename(code, fallback = 'ai-generated.spec.ts') {
  const m = code.match(/\/\/\s*file:\s*([^\s]+\.spec\.ts)/i);
  const raw = (m && m[1]) || fallback;
  return raw.replace(/[^a-zA-Z0-9._-]/g, '-');
}

(async () => {
  console.log('🧠 Generating Playwright spec from:', instruction, '\n');

  const resp = await client.responses.create({
    model,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  let content = resp.output_text || '';
  content = extractTs(content);
  if (!content || content.length < 20) {
    throw new Error('Model did not return usable TypeScript. Try re-running with a clearer instruction.');
  }

  content = ensurePlaywrightImports(content);

  // Basic sanity: must contain at least one `test(` call
  if (!/\btest\(/.test(content)) {
    throw new Error('Generated content lacks any test(). Please try again with a clearer flow.');
  }

  const filePath = path.join(outDir, suggestFilename(content));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✍️  Wrote', filePath);

  console.log('\n▶️  Running tests...');
  execSync('npx playwright test', { stdio: 'inherit' });

  console.log('\n✅ Done. See reports/TEST_REPORT.md for the Markdown report.');
})().catch((e) => {
  console.error('❌ AI test generation failed:', e.message);
  process.exit(1);
});
