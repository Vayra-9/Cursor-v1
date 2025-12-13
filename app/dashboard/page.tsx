"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Context
import { useAuth } from "@/context/AuthContext";

// Components
import DashboardHome from "@/components/dashboard/dashboard-home";
import DebtCalculator from "@/components/dashboard/DebtCalculator";
import DebtEntryForm from "@/components/debt/DebtEntryForm";
import MonthlyPlanner from "@/components/budget/monthly-planner";
import ExpenseSheet from "@/components/expenses/expense-sheet";
import IncomeTracker from "@/components/income/income-tracker";
import SpendingChart from "@/components/analytics/spending-chart";
import YearlyOverview from "@/components/analytics/yearly-overview";

// Types
import { Debt } from "@/types";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [debts, setDebts] = useState<Debt[]>([]);

    const fetchDebts = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/debt/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setDebts(data.debts);
            }
        } catch (error) {
            console.error("Failed to fetch debts", error);
        }
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/signin");
        } else if (user) {
            fetchDebts();
        }
    }, [user, isLoading, router]);

    // Removed handleExportReport as it's not used in the new structure

    if (isLoading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#1A1A2E]">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Core Debt Assessment Module */}
                <section className="grid gap-8 lg:grid-cols-3 col-span-2">
                    <div className="lg:col-span-2">
                        <DebtCalculator initialDebts={debts} />
                    </div>
                    <div>
                        <DebtEntryForm onSuccess={fetchDebts} />
                    </div>
                </section>
                <div className="grid gap-6 md:grid-cols-2">
                    <YearlyOverview />
                    <SpendingChart />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <MonthlyPlanner />
                <IncomeTracker />
            </div>

            <ExpenseSheet />

            <DashboardHome />
        </div >
    );
}
