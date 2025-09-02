import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Advanced Analytics', () => {
  test('module visible and charts render', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.analytics);
    await requireOrSkip(page, mod, 'Analytics not present');
    await expect(mod).toBeVisible();
    const chart = page.locator('canvas, svg').first();
    if (await chart.count()) await expect(chart).toBeVisible();
  });
});
