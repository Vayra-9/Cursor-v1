import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Financial Calendar', () => {
  test('renders calendar UI', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.financialCalendar);
    await requireOrSkip(page, mod, 'Calendar not present');
    await expect(mod).toBeVisible();
  });
});
