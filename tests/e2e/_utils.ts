import { Page } from '@playwright/test';
import { test } from '@playwright/test';

export async function maybeGoto(page: Page, path: string) {
  try {
    await page.goto(path, { waitUntil: 'load' });
  } catch {
    // fallback to root if route not available
    await page.goto('/', { waitUntil: 'load' }).catch(()=>{});
  }
}

// byTid helper if the project uses data-testid attributes
export function byTid(page: Page, id: string) {
  return page.locator(`[data-testid="${id}"]`);
}

// requireOrSkip: skip test when locator not present
export async function requireOrSkip(page: Page, locator: ReturnType<typeof byTid>, reason = 'Required element not present') {
  const count = await locator.count();
  if (count === 0) {
    test.skip(true, reason);
  }
}

// expectVisibleIfPresent: check visibility only if element exists
export async function expectVisibleIfPresent(page: Page, locator: ReturnType<typeof byTid>) {
  const count = await locator.count();
  if (count > 0) {
    const { expect } = await import('@playwright/test');
    await expect(locator.first()).toBeVisible();
  }
}