import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Debt } from "@/types";

const COLLECTION_NAME = "debts";

export const addDebt = async (userId: string, debt: Omit<Debt, "id" | "userId">) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...debt,
            userId,
            createdAt: Date.now()
        });
        return { id: docRef.id, ...debt, userId };
    } catch (error) {
        console.error("Error adding debt", error);
        throw error;
    }
};

export const getUserDebts = async (userId: string): Promise<Debt[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Debt));
    } catch (error) {
        console.error("Error fetching debts", error);
        throw error;
    }
};

export const updateDebt = async (id: string, updates: Partial<Debt>) => {
    try {
        const debtRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(debtRef, updates);
    } catch (error) {
        console.error("Error updating debt", error);
        throw error;
    }
};

export const deleteDebt = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting debt", error);
        throw error;
    }
};
