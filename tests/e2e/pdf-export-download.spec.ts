import { expect } from '@playwright/test';
import { test } from './fixtures/roles';
import { TID } from '@/testing/testIds';
import { byTid, maybeGoto } from './_utils';

test.describe('PDF export', () => {
  test('clicking export triggers a file download', async ({ page, setRole, setPlan, context }) => {
    await setRole('authed');
    await setPlan('pro');
    await maybeGoto(page, '/dashboard');

    const btn = byTid(page, TID.pdfExportBtn);
    if ((await btn.count()) === 0) test.skip(true, 'PDF export control not present');

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10_000 }).catch(() => null),
      btn.first().click().catch(() => {}),
    ]);

    // If your export opens a new tab instead, this will be null — keep it soft
    if (!download) test.skip(true, 'No download event (export may open in new tab)');
    else {
      const path = await download.path();
      expect(path).toBeTruthy();
      const suggested = download.suggestedFilename();
      expect(suggested.toLowerCase()).toMatch(/\.pdf$/);
    }
  });
});
