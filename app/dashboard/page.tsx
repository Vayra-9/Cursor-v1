"use client";

import DashboardHome from "@/components/dashboard/dashboard-home";
import MonthlyPlanner from "@/components/budget/monthly-planner";
import ExpenseSheet from "@/components/expenses/expense-sheet";
import IncomeTracker from "@/components/income/income-tracker";
import SpendingChart from "@/components/analytics/spending-chart";
import YearlyOverview from "@/components/analytics/yearly-overview";
import { Button } from "@/components/ui/button";
import { generateFinancialReport } from "@/lib/pdf-generator";
import { useAuth } from "@/components/auth/auth-provider";

export default function DashboardPage() {
    const { userProfile } = useAuth();

    const handleExportReport = () => {
        const reportData = {
            userName: "Demo User",
            month: new Date().toISOString().slice(0, 7),
            totalIncome: 5000,
            totalExpenses: 3500,
            totalSaved: 1500,
            expenses: [
                { date: "2025-12-01", category: "Food", amount: 50, note: "Groceries" },
                { date: "2025-11-30", category: "Transport", amount: 120, note: "Gas" },
            ]
        };
        generateFinancialReport(reportData);
    };

    return (
        <div className="p-8 space-y-8">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">DEBUG MODE V4</p>
                <p>Plan: {userProfile?.plan || 'undefined'}</p>
                <p>Role: {userProfile?.role || 'undefined'}</p>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                <Button onClick={handleExportReport}>Export PDF Report</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <YearlyOverview />
                <SpendingChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <MonthlyPlanner />
                <IncomeTracker />
            </div>

            <ExpenseSheet />

            <DashboardHome />
        </div>
    );
}
