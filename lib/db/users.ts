import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile } from "@/types";
import { User } from "firebase/auth";

export const createUserDocument = async (user: User, additionalData?: Partial<UserProfile>) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { email, displayName, photoURL } = user;
        const createdAt = Date.now();

        const newUser: UserProfile = {
            uid: user.uid,
            email: email || null,
            displayName: displayName || null,
            photoURL: photoURL || null,
            plan: 'starter',
            role: 'user',
            isAdmin: false,
            grandfathered: false,
            planVersion: 'v2_standard',
            createdAt,
            updatedAt: createdAt,
            ...additionalData,
        };

        try {
            await setDoc(userRef, newUser);
            return newUser;
        } catch (error) {
            console.error("Error creating user document", error);
            throw error;
        }
    }

    return userSnap.data() as UserProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    return null;
};

export const updateUserPlan = async (uid: string, plan: 'starter' | 'pro' | 'premium', grandfathered: boolean = false) => {
    const userRef = doc(db, "users", uid);

    try {
        await updateDoc(userRef, {
            plan,
            grandfathered,
            planVersion: grandfathered ? 'v1_early' : 'v2_standard',
            updatedAt: Date.now()
        });
    } catch (error) {
        console.error("Error updating user plan", error);
        throw error;
    }
};
