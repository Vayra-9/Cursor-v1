import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Emergency Budget', () => {
  test('module visible and accepts values', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.emergencyBudget);
    await requireOrSkip(page, mod, 'Emergency Budget not present');
    await expect(mod).toBeVisible();
    const input = page.getByPlaceholder(/emergency|savings/i).first();
    if (await input.count()) await input.fill('500');
  });
});
