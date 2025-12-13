"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { isAdmin, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#1A1A2E]">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1A1A2E] p-4 text-center">
                <div className="mb-4 rounded-full bg-red-500/10 p-4 text-red-500">
                    <ShieldAlert className="h-12 w-12" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-white">Access Denied</h1>
                <p className="mb-6 max-w-md text-gray-400">
                    This area is restricted to administrators only. You do not have permission to view this page.
                </p>
                <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 hover:text-white"
                    onClick={() => router.push('/dashboard')}
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return <>{children}</>;
}
