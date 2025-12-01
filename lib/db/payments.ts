import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { PaymentRecord } from "@/types";

const COLLECTION_NAME = "payments";

export const addPayment = async (userId: string, payment: Omit<PaymentRecord, "id" | "userId">) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...payment,
            userId,
            createdAt: Date.now()
        });
        return { id: docRef.id, ...payment, userId };
    } catch (error) {
        console.error("Error adding payment", error);
        throw error;
    }
};

export const getUserPayments = async (userId: string): Promise<PaymentRecord[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("userId", "==", userId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord));
    } catch (error) {
        console.error("Error fetching payments", error);
        throw error;
    }
};
