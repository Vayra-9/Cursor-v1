/* Static pricing matrix for MVP.
   Later we can swap this to Firestore (/config/pricing) with the same shape.
*/
let _PlanTier: any
let _PricingPlanMatrix: any
try {
  // Prefer shared types if present
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _PlanTier = undefined; _PricingPlanMatrix = undefined;
} catch {}

export type PlanTier = import('@/types/db').PlanTier
export type PricingPlanMatrix = import('@/types/db').PricingPlanMatrix

// Fallback types if the above import path doesn't exist
// (TypeScript will erase these if the import works)
type _FallbackPlanTier = 'free' | 'starter' | 'pro' | 'premium'
type _FallbackPricingPlanMatrix = Record<_FallbackPlanTier, {
  features: string[]
  limits?: { debts?: number; expenses?: number; aiPrompts?: number }
  priceUSD?: number
}>

// Main data (compatible with PricingPlanMatrix)
export const pricing: PricingPlanMatrix | _FallbackPricingPlanMatrix = {
  free: {
    priceUSD: 0,
    features: [
      'Lite Debt Calculator',
      'Blurred Pro Previews',
      '2 AI Prompts',
      'Lite Expense Tracker'
    ],
    limits: { debts: 2, expenses: 10, aiPrompts: 2 }
  },
  starter: {
    priceUSD: 9,
    features: [
      'Full Expense Tracker',
      'Budget Templates',
      'Debt Charts',
      'Priority Email Support'
    ],
    limits: { debts: 5, expenses: 50, aiPrompts: 10 }
  },
  pro: {
    priceUSD: 29,
    features: [
      'All Starter Features',
      'Advanced Debt Analytics',
      'AI Money Coach',
      'PDF Exports',
      'Savings & Emergency Planner',
      'Community Vault Access'
    ],
    limits: { debts: 20, expenses: 200, aiPrompts: 50 }
  },
  premium: {
    priceUSD: 49,
    features: [
      'All Pro Features',
      '1-on-1 Email Coaching',
      'Weekly WhatsApp Coaching',
      'Bonus AI Income Planner'
    ],
    limits: { debts: 50, expenses: 500, aiPrompts: 200 }
  }
}

// Tiny helpers
export function getPlanPriceUSD(tier: PlanTier | _FallbackPlanTier) {
  // @ts-ignore – compatible whether we use fallback or shared types
  return pricing[tier]?.priceUSD ?? 0
}

export function planIncludes(tier: PlanTier | _FallbackPlanTier, feature: string) {
  // @ts-ignore
  return (pricing[tier]?.features ?? []).includes(feature)
}
