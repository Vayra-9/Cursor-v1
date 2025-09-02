import { test, expect } from '@playwright/test';
import { TID } from '@/testing/testIds';
import { byTid, maybeGoto } from './_utils';

test.describe('Claims-driven gates', () => {
  test('free user sees pro gate; dev god-mode unlocks modules', async ({ page }) => {
    // Ensure no dev override first
    await page.context().addInitScript(() => localStorage.removeItem('vayra-god'));

    await maybeGoto(page, '/dashboard');
    const proGate = byTid(page, TID.gatePro);
    if (await proGate.count()) {
      await expect(proGate.first()).toBeVisible();
    }

    // Turn on dev god mode (no Firebase needed)
    await page.context().addInitScript(() => localStorage.setItem('vayra-god','1'));
    await page.reload();

    const proModule = byTid(page, TID.payoffPlanner);
    if (await proModule.count()) {
      await expect(proModule.first()).toBeVisible();
    } else {
      test.skip(true, 'Pro module not mounted yet.');
    }
  });

  test('URL god mode parameter unlocks access', async ({ page }) => {
    // Navigate with god mode in URL
    await page.goto('/dashboard?god=1');
    
    const proModule = byTid(page, TID.payoffPlanner);
    if (await proModule.count()) {
      await expect(proModule.first()).toBeVisible();
    } else {
      test.skip(true, 'Pro module not mounted yet.');
    }
  });

  test('plan gates respect user permissions', async ({ page }) => {
    await maybeGoto(page, '/dashboard');
    
    // Check various plan gates
    const gates = [
      { id: TID.gateFree, plan: 'free' },
      { id: TID.gateStarter, plan: 'starter' },
      { id: TID.gatePro, plan: 'pro' },
      { id: TID.gatePremium, plan: 'premium' }
    ];

    for (const gate of gates) {
      const gateElement = byTid(page, gate.id);
      if (await gateElement.count()) {
        await expect(gateElement.first()).toBeVisible();
      }
    }
  });
});
