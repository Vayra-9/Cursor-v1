import { test, expect } from '@playwright/test';
import { maybeGoto } from './_utils';

const IGNORE_CONSOLE = [
  'FIREBASE', 'manifest.json', 'service-worker', 'Vercel', 'Non-serializable'
];

test('post-login health — no critical console/network errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (!IGNORE_CONSOLE.some(s => t.includes(s))) errors.push(t);
    }
  });

  const badResponses: string[] = [];
  page.on('response', (res) => {
    const status = res.status();
    if (status >= 400) {
      const url = res.url();
      if (!url.endsWith('.map') && !url.includes('favicon')) badResponses.push(`${status} ${url}`);
    }
  });

  // Attempt to hit the dashboard (fallback to root)
  await maybeGoto(page, '/dashboard');

  // Allow app to settle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([]);
  if (badResponses.length > 0) {
    throw new Error(`Network errors detected:\n${badResponses.join('\n')}`);
  }
});