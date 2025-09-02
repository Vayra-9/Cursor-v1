import { test, expect } from '@playwright/test';

test.describe('Lite Calculator', () => {
  test('computes disposable income and payoff estimate', async ({ page }) => {
    await page.goto('/');
    // Navigate if calculator is not on the homepage (optional)
    // await page.getByTestId('nav-features').click();

    const income = page.getByTestId('calc-income');
    const expenses = page.getByTestId('calc-expenses');
    const debt = page.getByTestId('calc-debt');

    if ((await income.count()) === 0) test.skip(true, 'Lite calculator not present on this route');

    await income.fill('3000');
    await expenses.fill('2200');
    await debt.fill('5000');

    const disposable = page.getByTestId('disposable');
    const months = page.getByTestId('payoff-estimate-months');

    await expect(disposable).toHaveText(/800/);
    // 5000 / 800 = 6.25 -> 7 (ceil)
    await expect(months).toHaveText(/7/);
  });
});
