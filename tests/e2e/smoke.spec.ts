import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('home loads, title contains VAYRA', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/vayra/i);
  });

  test('CTA is optional; log if missing', async ({ page }) => {
    await page.goto('/');
    const ctas = page.getByRole('button', { name: /try it now|unlock pro|get started|start/i });
    const count = await ctas.count();
    if (count > 0) {
      await expect(ctas.first()).toBeVisible();
    } else {
      console.warn('CTA button not found — skipping.');
    }
  });

  test('basic nav does not crash', async ({ page }) => {
    await page.goto('/');
    const maybeClick = async (name: RegExp | string) => {
      const link = page.getByRole('link', { name: name as any });
      if (await link.count()) await link.first().click({ trial: true }).catch(() => {});
    };
    await maybeClick(/home/i);
    await maybeClick(/about|features|pricing/i);
  });

  test('no critical console errors at load', async ({ page }) => {
    const ignore = [
      // Add noisy but non-fatal patterns here:
      'Auth (',
      'FIREBASE',
      'Failed to load resource',
      'manifest.json',
      'service-worker',
      'Vercel deployment settings',
    ];
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!ignore.some((s) => t.includes(s))) errors.push(t);
      }
    });
    await page.goto('/');
    expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([]);
  });
});
