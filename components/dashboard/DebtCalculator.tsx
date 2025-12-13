"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateDisposableIncome, calculateDTI, calculateSimplePayoffMonths, DTIResult } from "@/lib/calculators/debtCalculator";
import { DollarSign, Percent, TrendingDown, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

import { Debt } from "@/types";

interface DebtCalculatorProps {
    initialDebts?: Debt[];
}

export default function DebtCalculator({ initialDebts = [] }: DebtCalculatorProps) {
    // Inputs
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
    const [monthlyDebtPayments, setMonthlyDebtPayments] = useState<number>(0); // Required for DTI
    const [totalDebt, setTotalDebt] = useState<number>(0);

    // Results state
    const [cashFlow, setCashFlow] = useState<number>(0);
    const [dti, setDti] = useState<DTIResult | null>(null);
    const [payoffMonths, setPayoffMonths] = useState<number>(0);

    // Load initial debts if provided
    useEffect(() => {
        if (initialDebts && initialDebts.length > 0) {
            const calculatedTotalDebt = initialDebts.reduce((sum, d) => sum + (d.balance || 0), 0);
            const calculatedMinPayments = initialDebts.reduce((sum, d) => sum + (d.minimumPayment || 0), 0);

            setTotalDebt(calculatedTotalDebt);
            setMonthlyDebtPayments(calculatedMinPayments);
        }
    }, [initialDebts]);

    useEffect(() => {
        // Calculate on every change
        const cf = calculateDisposableIncome(monthlyIncome, monthlyExpenses);
        const dtiRes = calculateDTI(monthlyDebtPayments, monthlyIncome);
        const months = calculateSimplePayoffMonths(totalDebt, cf);

        setCashFlow(cf);
        setDti(dtiRes);
        setPayoffMonths(months);
    }, [monthlyIncome, monthlyExpenses, monthlyDebtPayments, totalDebt]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <Card className="w-full max-w-4xl mx-auto border-white/5 bg-[#1e1e2e] text-white shadow-2xl overflow-hidden relative">
            {/* VAYRA PRO Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Core Debt Assessment</CardTitle>
                        <CardDescription className="text-gray-400">
                            Analyze your financial health and debt-to-income ratio.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 relative z-10">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Column: Inputs */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-indigo-400" /> Financial Inputs
                        </h3>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Total Monthly Income (Gross)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={monthlyIncome || ''}
                                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-12 text-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Monthly Expenses (Excl. Debt)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={monthlyExpenses || ''}
                                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-12 text-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Total Monthly Debt Payments</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={monthlyDebtPayments || ''}
                                    onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-12 text-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                />
                                <p className="text-xs text-gray-500">Includes minimum payments on credit cards, loans, mortgages.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Total Debt Balance</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={totalDebt || ''}
                                    onChange={(e) => setTotalDebt(Number(e.target.value))}
                                    className="bg-black/20 border-white/10 text-white h-12 text-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Results & Visualization */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                            <Percent className="h-5 w-5 text-indigo-400" /> Analysis & Projections
                        </h3>

                        {/* Top Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[#2C2C40] border border-white/5 space-y-1">
                                <p className="text-sm text-gray-400">Available Cash Flow</p>
                                <p className={cn("text-2xl font-bold", cashFlow > 0 ? "text-indigo-400" : "text-gray-500")}>
                                    {formatCurrency(cashFlow)}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-[#2C2C40] border border-white/5 space-y-1">
                                <p className="text-sm text-gray-400">Est. Payoff Time</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-white">
                                        {payoffMonths === Infinity ? "∞" : payoffMonths}
                                    </p>
                                    <span className="text-sm text-gray-500 mb-1">months</span>
                                </div>
                            </div>
                        </div>

                        {/* DTI Visualization */}
                        <div className="p-6 rounded-xl bg-black/20 border border-white/10 space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-medium text-gray-300 mb-1">Debt-to-Income (DTI) Ratio</p>
                                    <p className={cn("text-3xl font-bold", dti?.color)}>
                                        {dti ? dti.ratio.toFixed(1) : 0}%
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={cn("px-2 py-1 rounded text-xs font-medium bg-white/5 uppercase tracking-wider", dti?.color)}>
                                        {dti?.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Health Bar */}
                            <div className="h-3 w-full bg-gray-700/30 rounded-full overflow-hidden relative">
                                {/* Zone markers (approximate visual guide) */}
                                <div className="absolute top-0 bottom-0 left-[36%] w-0.5 bg-white/10 z-10" />
                                <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/10 z-10" />

                                <div
                                    className={cn("h-full transition-all duration-500 ease-out rounded-full",
                                        dti?.status === 'healthy' ? "bg-green-500" :
                                            dti?.status === 'manageable' ? "bg-yellow-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${Math.min(dti?.ratio || 0, 100)}%` }}
                                />
                            </div>

                            <p className="text-sm text-gray-400 italic">
                                {dti?.message || "Enter your details to calculate DTI."}
                            </p>
                        </div>

                        {/* Supportive Note */}
                        {payoffMonths !== Infinity && payoffMonths > 0 && (
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-start">
                                <TrendingDown className="h-5 w-5 text-indigo-400 mt-0.5" />
                                <p className="text-sm text-indigo-200">
                                    With ${formatCurrency(cashFlow)} extra monthly, you could be debt-free in just <strong>{Math.floor(payoffMonths / 12)} years and {payoffMonths % 12} months</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
