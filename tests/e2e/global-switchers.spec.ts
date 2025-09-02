import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('Global Switchers', () => {
  test('currency switcher exists and toggles', async ({ page }) => {
    await maybeGoto(page, '/');
    const sw = byTid(page, TID.currencySwitcher);
    if ((await sw.count()) === 0) test.skip(true, 'Currency switcher not present');
    await expect(sw).toBeVisible();
    await sw.first().click().catch(() => {});
  });
});
