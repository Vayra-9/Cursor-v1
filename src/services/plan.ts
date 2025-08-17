import { onSnapshot } from 'firebase/firestore'
import { paths } from './db'
import type { PlanTier, PricingPlanMatrix } from '@/types/db'

export function watchUserPlan(uid: string, cb: (plan: { tier: PlanTier; grandfathered?: boolean }) => void) {
  return onSnapshot(paths.userAccess(uid), s => {
    const d = s.data() as any
    cb(d?.plan ? { tier: d.plan, grandfathered: d?.grandfathered } : { tier: 'free' })
  })
}

export function watchActivePricing(cb: (version: string, matrix?: PricingPlanMatrix) => void) {
  const unsubState = onSnapshot(paths.pricingState(), stateSnap => {
    const v = (stateSnap.data() as any)?.activeVersion || 'v1'
    const unsubVer = onSnapshot(paths.pricingVersion(v), priceSnap => {
      cb(v, priceSnap.data() as PricingPlanMatrix | undefined)
    })
    return unsubVer
  })
  return () => unsubState()
}

export function canUse(feature: string, tier: PlanTier, matrix?: PricingPlanMatrix) {
  if (!matrix) return tier !== 'free' ? true : feature.toLowerCase().includes('lite')
  const allowed = matrix[tier]?.features ?? []
  return allowed.includes(feature)
}
