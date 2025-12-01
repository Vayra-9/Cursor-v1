import { Debt } from "@/types";

export const calculateDisposableIncome = (monthlyIncome: number, monthlyExpenses: number): number => {
    return Math.max(0, monthlyIncome - monthlyExpenses);
};

export const calculatePayoffMonths = (totalDebt: number, monthlyPayment: number, interestRate: number): number => {
    if (monthlyPayment <= 0 || totalDebt <= 0) return 0;

    // Simple amortization formula approximation for estimation
    // n = -log(1 - (r * P) / A) / log(1 + r)
    // r = monthly interest rate
    // P = principal
    // A = monthly payment

    const r = interestRate / 100 / 12;

    if (r === 0) {
        return Math.ceil(totalDebt / monthlyPayment);
    }

    if (monthlyPayment <= totalDebt * r) {
        return Infinity; // Payment doesn't cover interest
    }

    const n = -Math.log(1 - (r * totalDebt) / monthlyPayment) / Math.log(1 + r);
    return Math.ceil(n);
};

export const calculatePayoffDate = (months: number): Date => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
};

export const calculateTotalDebt = (debts: Debt[]): number => {
    return debts.reduce((sum, debt) => sum + debt.balance, 0);
};

export const calculateTotalMinimumPayment = (debts: Debt[]): number => {
    return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
};
