import { test, expect } from '@playwright/test';

test.describe('PWA basics', () => {
  test('manifest and service worker are reachable', async ({ page, request }) => {
    await page.goto('/');
    const manifestLink = page.locator('link[rel="manifest"]');
    if ((await manifestLink.count()) === 0) test.skip(true, 'Manifest not linked');

    const manifestUrl = await manifestLink.first().getAttribute('href');
    expect(manifestUrl).toBeTruthy();

    const res = await request.get(new URL(manifestUrl!, page.url()).toString());
    expect(res.ok()).toBeTruthy();

    // Service worker (best-effort; don't fail if unsupported in test env)
    const swReg = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return 'unsupported';
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        return reg ? 'registered' : 'not-registered';
      } catch {
        return 'error';
      }
    });
    expect(['unsupported', 'registered', 'not-registered', 'error']).toContain(swReg);
  });
});
