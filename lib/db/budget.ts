import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";

export interface Budget {
    id: string;
    userId: string;
    month: string; // Format: "YYYY-MM"
    category: string;
    limit: number;
    spent: number;
}

const COLLECTION_NAME = "budgets";

export const createBudget = async (userId: string, budget: Omit<Budget, "id" | "userId">) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...budget,
            userId,
            createdAt: Date.now()
        });
        return { id: docRef.id, ...budget, userId };
    } catch (error) {
        console.error("Error creating budget", error);
        throw error;
    }
};

export const getUserBudgets = async (userId: string, month?: string): Promise<Budget[]> => {
    try {
        let q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        if (month) {
            q = query(q, where("month", "==", month));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
    } catch (error) {
        console.error("Error fetching budgets", error);
        throw error;
    }
};

export const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
        const budgetRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(budgetRef, updates);
    } catch (error) {
        console.error("Error updating budget", error);
        throw error;
    }
};

export const deleteBudget = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting budget", error);
        throw error;
    }
};
