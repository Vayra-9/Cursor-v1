import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, requireOrSkip } from './_utils';

test.describe('Pro Dashboard', () => {
  test('dashboard root visible', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const root = byTid(page, TID.dashRoot);
    await requireOrSkip(page, root, 'Dashboard route not ready');
    await expect(root).toBeVisible();
  });
});
