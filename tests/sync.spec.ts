import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateWhatsAppLink } from '../lib/whatsappLogger';
import { ExpenseRecord } from '@/types';

// Mock IDB
vi.mock('idb', () => ({
    openDB: vi.fn().mockResolvedValue({
        put: vi.fn(),
        getAll: vi.fn().mockResolvedValue([]),
        delete: vi.fn(),
    }),
}));

describe('WhatsApp Logger', () => {
    it('generates correct link', () => {
        const expense: ExpenseRecord = {
            id: '1',
            userId: 'u1',
            amount: 100,
            category: 'Food',
            note: 'Lunch',
            date: 1600000000000
        };
        const link = generateWhatsAppLink(expense);
        expect(link).toContain('wa.me');
        expect(link).toContain('100');
        expect(link).toContain('Food');
        expect(link).toContain('Lunch');
    });
});

// Note: Testing IndexedDB wrapper fully requires a browser environment or more complex mocking.
// We are testing the helper logic here.
