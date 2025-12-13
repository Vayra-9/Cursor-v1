"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/auth";
import { createUserDocument, getUserProfile } from "@/lib/db/users";
import { UserProfile } from "@/types";

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Force refresh token to get latest claims
                    // console.log("Force refreshing token...");
                    await firebaseUser.getIdToken(true);
                    const token = await firebaseUser.getIdTokenResult();
                    const claims = token.claims;
                    console.log("AUTH CLAIMS:", claims);

                    // Fetch existing user profile
                    let profile = await getUserProfile(firebaseUser.uid);

                    // Only create if doesn't exist
                    if (!profile) {
                        profile = (await createUserDocument(firebaseUser)) || null;
                    }

                    // STRICTLY enforce claims as source of truth
                    if (profile) {
                        const newProfile = {
                            ...profile,
                            // If claim is present, use it. Fallback to "starter" only if NO claim and NO profile data.
                            plan: (claims.plan as any) || profile.plan || 'starter',
                            role: (claims.role as any) || profile.role || 'user',
                            isAdmin: (claims.isAdmin as boolean) || false,
                        };
                        // Override even if Firestore says "free" but claim says "pro"
                        if (claims.plan === "pro") newProfile.plan = "pro";
                        if (claims.role === "admin") newProfile.role = "admin";
                        if (claims.isAdmin === true) newProfile.isAdmin = true;

                        profile = newProfile;
                    }

                    setUserProfile(profile || null);
                } catch (error) {
                    console.error("Failed to fetch user profile or claims", error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
