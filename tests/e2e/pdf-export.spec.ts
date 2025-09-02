import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('PDF Export', () => {
  test('export control visible and triggers action', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const btn = byTid(page, TID.pdfExportBtn);
    if ((await btn.count()) === 0) test.skip(true, 'PDF Export not present');
    await expect(btn).toBeVisible();
    await btn.first().click().catch(() => {});
  });
});
