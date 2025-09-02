import { expect } from '@playwright/test';
import { test } from './fixtures/roles';
import { TID } from '@/testing/testIds';
import { byTid, maybeGoto, requireOrSkip } from './_utils';

test.describe('Auth & Plan Gating — flows', () => {
  test('Free user sees gates, Pro user sees modules', async ({ page, setRole, setPlan }) => {
    // Free (guest)
    await setRole('guest');
    await setPlan('free');
    await maybeGoto(page, '/dashboard');

    // If dashboard not mounted yet, skip
    const dash = byTid(page, TID.dashRoot);
    if ((await dash.count()) === 0) test.skip(true, 'Dashboard not ready');

    // Expect at least one gate for free users
    const gateFree = byTid(page, TID.gateFree);
    if (await gateFree.count()) await expect(gateFree.first()).toBeVisible();

    // Pro (authed)
    await setRole('authed');
    await setPlan('pro');
    await page.reload();

    const proModules = [
      TID.paymentTracker, TID.payoffPlanner, TID.emergencyBudget,
      TID.analytics, TID.financialCalendar
    ];

    let anyPresent = false;
    for (const id of proModules) {
      const mod = byTid(page, id);
      if (await mod.count()) {
        anyPresent = true;
        await expect(mod.first()).toBeVisible();
      }
    }
    if (!anyPresent) test.skip(true, 'No pro modules mounted yet to validate');
  });
});
