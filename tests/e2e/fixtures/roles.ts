import { test as base } from '@playwright/test';

type Plan = 'free' | 'starter' | 'pro' | 'premium';

export const test = base.extend<{
  setRole: (role: 'guest' | 'authed') => Promise<void>;
  setPlan: (plan: Plan) => Promise<void>;
}>({
  setRole: async ({ page }, use) => {
    const fn = async (role: 'guest' | 'authed') => {
      // App convention: localStorage flags the UI state (adjust keys to your app)
      localStorage.setItem('vayra-role', role);
      // Example: mark a fake uid for gated views to mount
      if (role === 'authed') localStorage.setItem('vayra-uid', 'test-user-uid');
      else localStorage.removeItem('vayra-uid');
    };
    await use(async (role) => page.addInitScript(fn, role));
  },
  setPlan: async ({ page }, use) => {
    const fn = async (plan: Plan) => {
      localStorage.setItem('vayra-plan', plan);
    };
    await use(async (plan) => page.addInitScript(fn, plan));
  },
});

export const expect = base.expect;
