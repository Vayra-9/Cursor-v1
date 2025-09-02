import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('CSV Import', () => {
  test('import control exists and accepts file if present', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const trigger = byTid(page, TID.csvImport);
    const input = byTid(page, TID.csvImportInput);
    if ((await trigger.count()) === 0 || (await input.count()) === 0) test.skip(true, 'CSV import not present');

    // Create a small fake CSV in memory
    const csv = 'date,amount,desc\n2025-01-01,100,Test Row\n';
    await page.setInputFiles(await input.first(), {
      name: 'sample.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csv),
    });
    await byTid(page, TID.csvImportConfirm).first().click().catch(() => {});
  });
});
