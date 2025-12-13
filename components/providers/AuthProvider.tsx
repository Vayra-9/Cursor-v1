"use client";

import { useAuth, AuthProviderContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// The inner component that handles the loading UI
const AuthLoadGate = ({ children }: { children: React.ReactNode }) => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#1A1A2E] text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                    <p className="text-sm text-gray-400 font-medium animate-pulse">
                        Loading VAYRA...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

// The wrapper that provides the context AND the UI gate
// This is what should be imported in layout.tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProviderContext>
            <AuthLoadGate>{children}</AuthLoadGate>
        </AuthProviderContext>
    );
};
