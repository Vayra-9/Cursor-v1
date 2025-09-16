import { test, expect } from '@playwright/test';
import { byTid, maybeGoto } from './_utils';

test('god-mode local override unlocks pro flows', async ({ page, context }) => {
  await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
  await maybeGoto(page, '/dashboard');

  // check a primary CTA and one pro module as proof
  const cta = page.getByRole('link', { name: /get started|upgrade|try pro/i }).first();
  // if CTA exists, ensure it is visible — otherwise skip
  if ((await cta.count()) > 0) {
    await expect(cta).toBeVisible();
  }

  const proCheck = byTid(page, 'payoff-planner');
  if ((await proCheck.count()) === 0) test.skip(true, 'payoff-planner not present in this build');
  await expect(proCheck.first()).toBeVisible();
});
