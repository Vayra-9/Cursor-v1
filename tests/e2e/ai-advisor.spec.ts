import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid } from './_utils';

test.describe('AI Advisor', () => {
  test('panel renders when present', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    const mod = byTid(page, TID.aiAdvisor);
    if ((await mod.count()) === 0) test.skip(true, 'AI Advisor not present');
    await expect(mod).toBeVisible();
  });
});
