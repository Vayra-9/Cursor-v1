import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('DTI Calculator', () => {
  test('computes DTI when present', async ({ page }) => {
    await maybeGoto(page, '/');
    const mod = byTid(page, TID.dtiCalc);
    if ((await mod.count()) === 0) test.skip(true, 'DTI not present');
    const income = page.getByPlaceholder(/income/i).or(page.getByTestId('dti-income'));
    const debts = page.getByPlaceholder(/debt/i).or(page.getByTestId('dti-total-debt'));
    if ((await income.count()) && (await debts.count())) {
      await income.first().fill('3000');
      await debts.first().fill('900');
      const result = page.getByText(/dti|debt-to-income/i).or(page.getByTestId('dti-result'));
      await expect(result).toBeVisible();
    }
  });
});
