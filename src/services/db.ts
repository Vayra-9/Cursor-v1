import { db } from '@/lib/firebase'
import { collection, doc } from 'firebase/firestore'

export const paths = {
  user: (uid: string) => doc(db, 'users', uid),
  userProfile: (uid: string) => doc(db, 'users', uid, 'profile', 'profile'),
  userAccess: (uid: string) => doc(db, 'users', uid, 'access', 'access'),
  debts: (uid: string) => collection(db, 'users', uid, 'debts'),
  debt: (uid: string, debtId: string) => doc(db, 'users', uid, 'debts', debtId),
  payments: (uid: string) => collection(db, 'users', uid, 'payments'),
  payment: (uid: string, id: string) => doc(db, 'users', uid, 'payments', id),
  expenses: (uid: string) => collection(db, 'users', uid, 'expenses'),
  expense: (uid: string, id: string) => doc(db, 'users', uid, 'expenses', id),
  strategies: (uid: string) => collection(db, 'users', uid, 'strategies'),
  strategy: (uid: string, id: string) => doc(db, 'users', uid, 'strategies', id),
  pricingState: () => doc(db, 'config', 'pricingState'),
  pricingVersion: (v: string) => doc(db, 'config', 'pricing', v),
  appFlags: () => doc(db, 'config', 'appFlags'),
}
