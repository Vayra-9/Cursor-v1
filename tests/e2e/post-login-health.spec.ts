import { test, expect } from '@playwright/test';
import { maybeGoto } from './_utils';

const IGNORE_CONSOLE = [
  'FIREBASE', 'manifest.json', 'service-worker', 'Vercel', 'Non-serializable', 'permission-denied',
  'auth/api-key-not-valid', 'auth/network-request-failed', 'Failed to load resource: the server responded with a status of 400'
];

const adminUsers = [
  { email: 'test@vayra.digital', password: 'VayraTest@2025' },
  { email: 'admin@vayra.digital', password: 'TempP@ss!234' }
];

test('post-login health — no critical console/network errors (god-mode)', async ({ page, context }) => {
  await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
  
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

  // Test dashboard with god-mode
  await maybeGoto(page, '/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([]);
  if (badResponses.length > 0) {
    throw new Error(`Network errors detected:\n${badResponses.join('\n')}`);
  }
});

for (const user of adminUsers) {
  test(`post-login health for ${user.email}`, async ({ page }) => {
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

    // Try to login
    await maybeGoto(page, '/auth/sign-in');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill(user.email);
      await page.locator('input[type="password"], input[name="password"]').first().fill(user.password);
      await page.locator('button[type="submit"], button:has-text("Sign In")').first().click();
      await page.waitForTimeout(2000);
    }

    // Navigate to dashboard
    await maybeGoto(page, '/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(errors, `Console errors for ${user.email}:\n${errors.join('\n')}`).toEqual([]);
    if (badResponses.length > 0) {
      throw new Error(`Network errors for ${user.email}:\n${badResponses.join('\n')}`);
    }
  });
}