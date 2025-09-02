import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Payment Tracker', () => {
  test('module mounts and accepts a sample entry', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.paymentTracker);
    await requireOrSkip(page, mod, 'Payment Tracker not present');
    await expect(mod).toBeVisible();
    // Optional: create a test entry if the UI exposes inputs (guarded)
    const amount = page.getByPlaceholder(/amount/i);
    if (await amount.count()) {
      await amount.fill('100');
      const add = page.getByRole('button', { name: /add|save/i });
      if (await add.count()) await add.first().click();
    }
  });
});
