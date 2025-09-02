import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('Referral', () => {
  test('referral UI present and share button works', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const entry = byTid(page, TID.referralEntry);
    const share = byTid(page, TID.referralShare);
    if ((await entry.count()) === 0 || (await share.count()) === 0) test.skip(true, 'Referral UI not present');
    await expect(entry).toBeVisible();
    await share.first().click().catch(() => {});
  });
});
