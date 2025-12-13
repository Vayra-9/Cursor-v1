"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface PlanGuardProps {
    children: React.ReactNode;
    requiredPlan: 'starter' | 'pro' | 'premium';
}

const PLAN_LEVELS = {
    starter: 0,
    pro: 1,
    premium: 2
};

export default function PlanGuard({ children, requiredPlan }: PlanGuardProps) {
    const { userProfile, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const userPlan = userProfile?.plan || 'starter';
    const currentLevel = PLAN_LEVELS[userPlan];
    const requiredLevel = PLAN_LEVELS[requiredPlan];

    if (currentLevel < requiredLevel) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#1e1e2e]">
                {/* Blurred Content Placeholder to tease user */}
                <div className="blur-sm opacity-20 pointer-events-none p-8" aria-hidden="true">
                    {children}
                </div>

                {/* Overlay Card */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-sm">
                    <Card className="w-full max-w-sm border-indigo-500/20 bg-[#1A1A2E]/90 shadow-2xl">
                        <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                            <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-400">
                                <Lock className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {requiredPlan === 'pro' ? 'Pro Feature' : 'Premium Feature'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Upgrade to {requiredPlan} to unlock access to this tool.
                                </p>
                            </div>
                            {/* We can route to a pricing page or trigger the unlock modal. For now, maybe just a placeholder or route to dashboard/settings */}
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                                onClick={() => router.push('/dashboard/settings')} // Assuming settings is where they might upgrade/enter code
                            >
                                Upgrade Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
