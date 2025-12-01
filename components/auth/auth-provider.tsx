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
                // Fetch existing user profile first
                try {
                    let profile = await getUserProfile(firebaseUser.uid);

                    // Only create if doesn't exist
                    if (!profile) {
                        profile = (await createUserDocument(firebaseUser)) || null;
                    }

                    setUserProfile(profile || null);
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
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
