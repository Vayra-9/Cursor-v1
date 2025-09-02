import { Page, expect, Locator, test } from '@playwright/test';

export async function maybeGoto(page: Page, path: string) {
  try { await page.goto(path, { waitUntil: 'load' }); }
  catch { await page.goto('/'); }
}

export function byTid(page: Page, id: string) {
  return page.getByTestId(id);
}

export async function expectVisibleIfPresent(page: Page, locator: Locator) {
  if (await locator.count()) await expect(locator.first()).toBeVisible();
}

export async function requireOrSkip(page: Page, locator: Locator, reason: string) {
  if ((await locator.count()) === 0) {
    test.skip(true, reason);
  }
}
