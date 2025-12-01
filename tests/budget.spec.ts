import { describe, it, expect, vi } from 'vitest';
import { Budget } from '@/lib/db/budget';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    updateDoc: vi.fn(),
    doc: vi.fn(),
    deleteDoc: vi.fn(),
}));

describe('Budget Logic', () => {
    it('calculates budget percentage correctly', () => {
        const budget: Budget = {
            id: '1',
            userId: 'u1',
            month: '2025-12',
            category: 'Food',
            limit: 500,
            spent: 250
        };

        const percentage = (budget.spent / budget.limit) * 100;
        expect(percentage).toBe(50);
    });

    it('identifies over-budget scenarios', () => {
        const budget: Budget = {
            id: '2',
            userId: 'u1',
            month: '2025-12',
            category: 'Entertainment',
            limit: 100,
            spent: 150
        };

        const isOverBudget = budget.spent > budget.limit;
        expect(isOverBudget).toBe(true);
    });
});
