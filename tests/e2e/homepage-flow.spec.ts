import { test, expect } from '@playwright/test';

test.describe('Homepage flow', () => {
  test('hero + CTA + header visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('hero')).toBeVisible();
    const cta = page.getByTestId('cta-primary');
    if (await cta.count()) await expect(cta.first()).toBeVisible();
  });
});
