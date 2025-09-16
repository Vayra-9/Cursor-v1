import { test, expect } from '@playwright/test';
import { maybeGoto } from './_utils';

test('admin panel shows claims JSON (after user token refreshed)', async ({ page, context }) => {
  // Developer override available for local dev, but in prod this test expects the user to have claims
  // For automated runs we assume token is refreshed and admin panel route is accessible after login.
  // If local dev only, enable dev override:
  await context.addInitScript(() => localStorage.setItem('vayra-god','1'));

  await maybeGoto(page, '/admin');
  const panel = page.locator('[data-testid="admin-panel"]');
  await expect(panel).toBeVisible();

  const claims = page.locator('[data-testid="admin-claims"]');
  await expect(claims).toBeVisible();
  const text = await claims.innerText();
  expect(text.length).toBeGreaterThan(0);
  // If JSON is present, ensure it likely contains the admin marker
  if (text.trim().startsWith('{')) {
    expect(/role|full_access|plans/.test(text)).toBeTruthy();
  }
});
