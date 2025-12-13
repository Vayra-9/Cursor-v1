"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile } from "@/types";

interface AuthContextType {
    user: User | null;
    plan: UserProfile['plan'] | null; // Using specific type from UserProfile
    isAdmin: boolean;
    isLoading: boolean;
    userProfile: UserProfile | null; // Keeping full profile for utility
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    plan: null,
    isAdmin: false,
    isLoading: true,
    userProfile: null,
});

export const AuthProviderContext = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [plan, setPlan] = useState<UserProfile['plan'] | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 1. Set User
                setUser(firebaseUser);

                try {
                    // 2. Admin Claim Check
                    // Force refresh to ensure we have latest claims
                    const token = await getIdTokenResult(firebaseUser, true);
                    const adminStatus = !!(token.claims.admin || token.claims.role === 'admin' || token.claims.isAdmin === true);
                    setIsAdmin(adminStatus);

                    // 3. Document Sync
                    const userRef = doc(db, "users", firebaseUser.uid);
                    const userSnap = await getDoc(userRef);

                    let profileData: UserProfile;

                    if (!userSnap.exists()) {
                        // Create if new
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || null,
                            displayName: firebaseUser.displayName || null,
                            photoURL: firebaseUser.photoURL || null,
                            plan: 'starter', // Default to starter (free)
                            role: 'user',
                            isAdmin: false,
                            grandfathered: false,
                            planVersion: 'v2_standard',
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        };

                        // Use normal SetDoc but avoiding the helper to ensure we control the flow here
                        // Using current time instead of serverTimestamp for the typed object (Firestore will handle date conversion if needed, strictly typescript expects number per type def)
                        // or adapting type. Type says number. `Date.now()` is number.
                        await setDoc(userRef, newProfile);
                        profileData = newProfile;
                    } else {
                        profileData = userSnap.data() as UserProfile;
                    }

                    // 4. Set State
                    setUserProfile(profileData);
                    setPlan(profileData.plan);

                } catch (error) {
                    console.error("AuthContext: Error fetching/creating user doc", error);
                    // Fallback to minimal state so app doesn't crash but is effectively locked or free
                    setPlan('starter');
                }
            } else {
                // Logged out
                setUser(null);
                setUserProfile(null);
                setPlan(null);
                setIsAdmin(false);
            }

            // 5. Done Loading
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, plan, isAdmin, isLoading, userProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
