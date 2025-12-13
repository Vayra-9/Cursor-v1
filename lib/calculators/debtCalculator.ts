import { Debt } from "@/types";

export const calculateDisposableIncome = (monthlyIncome: number, monthlyExpenses: number): number => {
    return Math.max(0, monthlyIncome - monthlyExpenses);
};

export const calculatePayoffMonths = (totalDebt: number, monthlyPayment: number, interestRate: number): number => {
    if (monthlyPayment <= 0 || totalDebt <= 0) return 0;

    // Estimate using simple interest if rate is 0, or compound if > 0
    // However, for the specific "Simple Calculation: Total Debt / Available Cash Flow" requested in the prompt,
    // we might want a simpler version for the 'Cash Flow' based payoff.
    // But keeping the robust one is better if we have the data.
    // The prompt asks for: "Estimated Payoff Time (Simple Calculation: Total Debt / Available Cash Flow)"
    // I will add a specific function for that simple calculation as requested.

    // Legacy robust calculation (keep for advanced mode)
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

export const calculateSimplePayoffMonths = (totalDebt: number, availableCashFlow: number): number => {
    if (availableCashFlow <= 0) return Infinity;
    if (totalDebt <= 0) return 0;
    return Math.ceil(totalDebt / availableCashFlow);
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

// DTI Calculation
export interface DTIResult {
    ratio: number;
    status: 'healthy' | 'manageable' | 'critical';
    message: string;
    color: string; // Taildwind class part or hex
}

export const calculateDTI = (totalMonthlyDebtPayments: number, grossMonthlyIncome: number): DTIResult => {
    if (grossMonthlyIncome <= 0) {
        return {
            ratio: 0,
            status: 'critical',
            message: "Income is zero, cannot calculate DTI.",
            color: "text-red-500"
        };
    }

    const ratio = (totalMonthlyDebtPayments / grossMonthlyIncome) * 100;

    let status: DTIResult['status'];
    let message: string;
    let color: string;

    if (ratio < 36) {
        status = 'healthy';
        message = "Excellent! This is a healthy and manageable ratio.";
        color = "text-green-500";
    } else if (ratio <= 50) {
        status = 'manageable';
        message = "Manageable, but be careful with new debt.";
        color = "text-yellow-500";
    } else {
        status = 'critical';
        message = "High risk. Focus on reducing debt immediately.";
        color = "text-red-500";
    }

    return { ratio, status, message, color };
};
