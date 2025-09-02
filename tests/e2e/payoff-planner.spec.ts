import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Payoff Planner', () => {
  test('module visible and renders charts if present', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.payoffPlanner);
    await requireOrSkip(page, mod, 'Payoff Planner not present');
    await expect(mod).toBeVisible();
    const chart = page.locator('canvas, svg').first();
    if (await chart.count()) await expect(chart).toBeVisible();
  });
});
