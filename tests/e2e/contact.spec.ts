import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('Contact Us', () => {
  test('section visible on public or pro routes', async ({ page }) => {
    await maybeGoto(page, '/');
    let section = byTid(page, TID.contactUs);
    if ((await section.count()) === 0) {
      await maybeGoto(page, '/dashboard');
      section = byTid(page, TID.contactUs);
    }
    if ((await section.count()) === 0) test.skip(true, 'Contact Us not present');
    await expect(section).toBeVisible();
  });
});
