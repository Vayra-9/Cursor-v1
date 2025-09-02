import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { maybeGoto, byTid, expectVisibleIfPresent } from './_utils';

test.describe('Auth & Plan Gating', () => {
  test('login/logout controls present when implemented', async ({ page }) => {
    await maybeGoto(page, '/');
    await expectVisibleIfPresent(page, byTid(page, TID.authLoginBtn));
    await expectVisibleIfPresent(page, byTid(page, TID.authLogoutBtn));
  });

  test('plan gates render when implemented', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    await expectVisibleIfPresent(page, byTid(page, TID.gateFree));
    await expectVisibleIfPresent(page, byTid(page, TID.gateStarter));
    await expectVisibleIfPresent(page, byTid(page, TID.gatePro));
    await expectVisibleIfPresent(page, byTid(page, TID.gatePremium));
  });
});
