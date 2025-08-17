export type PlanTier = 'free' | 'starter' | 'pro' | 'premium'

export interface UserProfile {
  name: string
  email: string
  country: string
  createdAt: any // Firestore Timestamp
}

export interface UserAccess {
  plan: PlanTier
  grandfathered?: boolean
  joinedAt: any
  pricePaid?: number
}

export interface DebtDoc {
  name: string
  principal: number
  apr: number
  minPayment: number
  createdAt: any
}

export interface PaymentDoc {
  debtId: string
  amount: number
  date: any
  note?: string
}

export interface ExpenseDoc {
  category: string
  amount: number
  date: any
  note?: string
}

export type StrategyMethod = 'snowball' | 'avalanche' | 'custom'
export interface StrategyDoc {
  method: StrategyMethod
  monthlyBudget: number
  estDebtFreeDate: any
  generatedAt: any
}

export interface PricingStateDoc { activeVersion: string } // e.g., "v1"

export type PricingPlanMatrix = Record<PlanTier, {
  features: string[]
  limits?: { debts?: number; expenses?: number; aiPrompts?: number }
  priceUSD?: number
}>
