import { Debt, PayoffPlan, PayoffStrategy } from "@/types";
import { calculatePayoffMonths } from "./debtCalculator";

export const calculatePayoffStrategy = (
    debts: Debt[],
    monthlyBudget: number,
    strategy: PayoffStrategy
): PayoffPlan => {
    // Deep copy debts to avoid mutating original array
    let currentDebts = debts.map(d => ({ ...d }));
    let totalInterest = 0;
    let months = 0;
    const schedule = [];

    // Sort debts based on strategy
    if (strategy === 'avalanche') {
        // Highest interest rate first
        currentDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else {
        // Snowball: Lowest balance first
        currentDebts.sort((a, b) => a.balance - b.balance);
    }

    let remainingBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);

    while (remainingBalance > 0 && months < 1200) { // Safety break at 100 years
        months++;
        let monthlyInterest = 0;
        let monthlyPrincipal = 0;
        let availableBudget = monthlyBudget;

        // 1. Pay minimums on all debts
        for (const debt of currentDebts) {
            if (debt.balance > 0) {
                const interest = debt.balance * (debt.interestRate / 100 / 12);
                monthlyInterest += interest;

                let payment = Math.min(debt.balance + interest, debt.minimumPayment);

                // If we can't afford minimums, we have a problem (simplified logic here)
                if (availableBudget < payment) {
                    payment = availableBudget;
                }

                const principal = Math.max(0, payment - interest);
                debt.balance -= principal;
                monthlyPrincipal += principal;
                availableBudget -= payment;
                totalInterest += interest;
            }
        }

        // 2. Apply remaining budget to target debt (first in sorted list with balance > 0)
        if (availableBudget > 0) {
            for (const debt of currentDebts) {
                if (debt.balance > 0) {
                    const interest = debt.balance * (debt.interestRate / 100 / 12); // Already accrued, but checking for payoff
                    // We already paid minimum, so this is extra principal
                    const extraPayment = Math.min(debt.balance, availableBudget);
                    debt.balance -= extraPayment;
                    monthlyPrincipal += extraPayment;
                    availableBudget -= extraPayment;
                    break; // Only apply extra to the top priority debt
                }
            }
        }

        remainingBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);

        schedule.push({
            month: months,
            remainingBalance: Math.max(0, remainingBalance),
            interestPaid: monthlyInterest,
            principalPaid: monthlyPrincipal
        });

        if (remainingBalance < 0.01) remainingBalance = 0; // Floating point fix
    }

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    return {
        strategy,
        totalInterest,
        payoffDate,
        monthsToPayoff: months,
        monthlyPayment: monthlyBudget,
        schedule
    };
};
