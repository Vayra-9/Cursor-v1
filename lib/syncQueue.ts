import { openDB } from "idb";
import { ExpenseRecord } from "@/types";

const DB_NAME = "vayra-db";
const STORE_NAME = "expense-queue";

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });
};

export const queueExpense = async (expense: ExpenseRecord) => {
    const db = await initDB();
    await db.put(STORE_NAME, expense);
};

export const getQueuedExpenses = async (): Promise<ExpenseRecord[]> => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const clearQueuedExpense = async (id: string) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const processQueue = async () => {
    if (!navigator.onLine) return;

    const expenses = await getQueuedExpenses();
    if (expenses.length === 0) return;

    try {
        const response = await fetch("/api/sync/receive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expenses }),
        });

        if (response.ok) {
            const result = await response.json();
            // Assuming server returns IDs of successfully synced items
            // For now, clear all if batch succeeds
            for (const expense of expenses) {
                await clearQueuedExpense(expense.id);
            }
            return result;
        }
    } catch (error) {
        console.error("Sync failed", error);
    }
};
