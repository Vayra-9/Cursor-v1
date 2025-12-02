export interface DebtData {
    id: string;
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
}

export interface FinancialMetrics {
    totalDebt: number;
    monthlyPayment: number;
    debtFreeDate: Date | null;
    interestSaved: number;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    plan: 'starter' | 'pro' | 'premium';
    role?: 'user' | 'admin';
    isAdmin?: boolean;
    grandfathered: boolean;
    planVersion: 'v1_early' | 'v2_standard';
    createdAt: number;
    updatedAt: number;
}

export interface Debt {
    id: string;
    userId: string;
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    category?: string;
}

export interface PaymentRecord {
    id: string;
    userId: string;
    debtId: string;
    amount: number;
    date: number; // Timestamp
    note?: string;
}

export interface ExpenseRecord {
    id: string;
    userId: string;
    amount: number;
    category: string;
    note?: string;
    date: number;
    synced?: boolean;
}

export type PayoffStrategy = 'avalanche' | 'snowball';

export interface PayoffPlan {
    strategy: PayoffStrategy;
    totalInterest: number;
    payoffDate: Date;
    monthsToPayoff: number;
    monthlyPayment: number;
    schedule: {
        month: number;
        remainingBalance: number;
        interestPaid: number;
        principalPaid: number;
    }[];
}
