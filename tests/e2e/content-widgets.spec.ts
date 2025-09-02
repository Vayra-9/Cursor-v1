import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, expectVisibleIfPresent } from './_utils';

test.describe('Content Widgets', () => {
  test('tips carousel and testimonials visible if present', async ({ page }) => {
    await maybeGoto(page, '/');
    await expectVisibleIfPresent(page, byTid(page, TID.tipsCarousel));
    await expectVisibleIfPresent(page, byTid(page, TID.testimonials));
  });
});
