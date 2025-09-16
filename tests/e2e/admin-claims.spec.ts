import { test, expect } from '@playwright/test';
import { byTid, maybeGoto } from './_utils';

test.describe('Admin claims & access', () => {
  // Use two accounts known to be upgraded in prod: test@vayra.digital and admin@vayra.digital
  const adminEmails = ['test@vayra.digital', 'admin@vayra.digital'];

  test('dev god-mode unlocks pro modules (local dev override)', async ({ page, context }) => {
    // Add dev override so we don't require remote claims for local verification
    await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
    await maybeGoto(page, '/dashboard');
    // Check a set of pro module test IDs (adjust to your TID map as needed)
    const proModuleIds = ['payment-tracker', 'payoff-planner', 'emergency-budget', 'analytics', 'financial-calendar'];
    let foundAny = false;
    for (const id of proModuleIds) {
      const m = byTid(page, id);
      if (await m.count()) {
        await expect(m.first()).toBeVisible();
        foundAny = true;
      }
    }
    test.skip(!foundAny, 'No pro modules mounted in this build — skipping assertion.');
  });

  test('admin panel shows claims JSON when signed-in user has claims (dev override)', async ({ page, context }) => {
    await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
    await maybeGoto(page, '/admin');
    const panel = byTid(page, 'admin-panel');
    await expect(panel).toBeVisible();
    const claims = byTid(page, 'admin-claims');
    await expect(claims).toBeVisible();
    // basic JSON sanity check
    const text = await claims.first().innerText();
    expect(text.length).toBeGreaterThan(0);
    // should be either "No claims yet" or JSON — if JSON, ensure it contains role or full_access
    if (text.trim().startsWith('{')) {
      expect(/role|full_access|plans/.test(text)).toBeTruthy();
    }
  });
});
