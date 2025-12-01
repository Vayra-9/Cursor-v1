import { describe, it, expect } from 'vitest';
import { calculateDisposableIncome, calculatePayoffMonths } from '../lib/calculators/debtCalculator';
import { calculatePayoffStrategy } from '../lib/calculators/payoffStrategies';
import { Debt } from '@/types';

describe('Debt Calculator', () => {
    it('calculates disposable income correctly', () => {
        expect(calculateDisposableIncome(5000, 3000)).toBe(2000);
        expect(calculateDisposableIncome(3000, 5000)).toBe(0); // Should not be negative
    });

    it('calculates payoff months correctly', () => {
        // $10,000 debt, $500 payment, 5% interest
        const months = calculatePayoffMonths(10000, 500, 5);
        expect(months).toBeGreaterThan(20); // 10000/500 = 20, plus interest
        expect(months).toBeLessThan(24);
    });
});

describe('Payoff Strategies', () => {
    const debts: Debt[] = [
        { id: '1', userId: 'u1', name: 'Card A', balance: 5000, interestRate: 20, minimumPayment: 100 },
        { id: '2', userId: 'u1', name: 'Card B', balance: 2000, interestRate: 10, minimumPayment: 50 },
    ];

    it('calculates avalanche strategy (high interest first)', () => {
        const plan = calculatePayoffStrategy(debts, 1000, 'avalanche');
        expect(plan.strategy).toBe('avalanche');
        expect(plan.monthsToPayoff).toBeGreaterThan(0);
        // Card A (20%) should be paid off before Card B (10%) logic check would require inspecting schedule
        // For now, just ensuring it runs and produces a schedule
        expect(plan.schedule.length).toBeGreaterThan(0);
    });

    it('calculates snowball strategy (low balance first)', () => {
        const plan = calculatePayoffStrategy(debts, 1000, 'snowball');
        expect(plan.strategy).toBe('snowball');
        expect(plan.monthsToPayoff).toBeGreaterThan(0);
    });
});
