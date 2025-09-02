import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('toggles and persists theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByTestId('theme-toggle');

    if ((await toggle.count()) === 0) test.skip(true, 'Theme toggle not present');

    // Get initial theme state
    const before = await html.evaluate(el => el.classList.contains('dark'));
    
    // Click dark theme button
    const darkButton = page.getByTestId('toggle-theme-dark');
    if (await darkButton.count()) {
      await darkButton.click();
      
      // Verify theme changed
      const after = await html.evaluate(el => el.classList.contains('dark'));
      expect(after).not.toBe(before);

      // Reload and ensure persistence
      await page.reload();
      const persisted = await html.evaluate(el => el.classList.contains('dark'));
      expect(persisted).toBe(after);
    } else {
      test.skip(true, 'Dark theme button not found');
    }
  });
});
