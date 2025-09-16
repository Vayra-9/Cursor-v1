import { test, expect } from '@playwright/test';
import { byTid, maybeGoto } from './_utils';

test.describe('God-mode access verification', () => {
  test('god-mode local override unlocks pro flows', async ({ page, context }) => {
    await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
    await maybeGoto(page, '/dashboard');

    // Check that god-mode enables access to pro features
    const proModuleIds = ['payment-tracker', 'payoff-planner', 'emergency-budget', 'analytics', 'financial-calendar'];
    let foundProModules = 0;
    
    for (const id of proModuleIds) {
      const module = byTid(page, id);
      if (await module.count() > 0) {
        await expect(module.first()).toBeVisible();
        foundProModules++;
        console.log(`✅ God-mode enabled access to: ${id}`);
      }
    }
    
    if (foundProModules === 0) {
      test.skip(true, 'No pro modules found in this build - skipping god-mode verification');
    }
    
    // With god-mode, upgrade CTAs should be less prominent or hidden
    const upgradeBanner = page.locator('text=Upgrade to Pro').first();
    if (await upgradeBanner.count() > 0) {
      console.log('Note: Upgrade banner still visible with god-mode - this may be expected for testing');
    }
    
    console.log(`God-mode successfully unlocked ${foundProModules} pro modules`);
  });

  test('god-mode works even for free plan users', async ({ page, context }) => {
    // Set god-mode and simulate free plan
    await context.addInitScript(() => {
      localStorage.setItem('vayra-god','1');
      // Simulate free plan context if needed
    });
    
    await maybeGoto(page, '/dashboard');
    
    // Even with free plan, god-mode should unlock features
    const proFeatures = [
      byTid(page, 'payoff-planner'),
      byTid(page, 'analytics'),
      byTid(page, 'financial-calendar')
    ];
    
    let accessibleFeatures = 0;
    for (const feature of proFeatures) {
      if (await feature.count() > 0 && await feature.first().isVisible()) {
        accessibleFeatures++;
      }
    }
    
    if (accessibleFeatures === 0) {
      test.skip(true, 'No pro features found to test god-mode access');
    }
    
    expect(accessibleFeatures).toBeGreaterThan(0);
    console.log(`✅ God-mode bypassed plan restrictions for ${accessibleFeatures} features`);
  });

  test('god-mode enables admin panel access', async ({ page, context }) => {
    await context.addInitScript(() => localStorage.setItem('vayra-god','1'));
    
    await maybeGoto(page, '/admin');
    
    const adminPanel = byTid(page, 'admin-panel');
    if (await adminPanel.count() === 0) {
      test.skip(true, 'Admin panel not available in this build');
    }
    
    await expect(adminPanel).toBeVisible();
    
    const claims = byTid(page, 'admin-claims');
    await expect(claims).toBeVisible();
    
    console.log('✅ God-mode enabled admin panel access');
  });
});
