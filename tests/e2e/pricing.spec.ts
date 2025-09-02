import { test, expect } from '@playwright/test';

test.describe('Pricing', () => {
  test('tiers render and CTAs visible', async ({ page }) => {
    // Navigate to /pricing via navbar if available; otherwise direct
    await page.goto('/pricing').catch(async () => {
      await page.goto('/');
      const navPricing = page.getByTestId('nav-pricing').or(page.getByRole('link', { name: /pricing/i }));
      if (await navPricing.count()) await navPricing.first().click();
    });

    // Accept either data-testid or role-based fallbacks
    const tiers = page.getByTestId('pricing-tiers').or(page.getByText(/free|starter|pro|premium/i));
    await expect(tiers.first()).toBeVisible();

    // CTA buttons
    const ctas = page.getByRole('button', { name: /buy|start|upgrade|choose|get/i });
    expect(await ctas.count()).toBeGreaterThan(0);
  });
});
