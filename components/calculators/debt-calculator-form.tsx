"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Debt } from "@/types";
import { calculateDisposableIncome, calculateTotalDebt, calculatePayoffMonths } from "@/lib/calculators/debtCalculator";

export default function DebtCalculatorForm() {
    const [income, setIncome] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [debts, setDebts] = useState<Debt[]>([]);

    // Temporary state for new debt input
    const [newDebtName, setNewDebtName] = useState("");
    const [newDebtBalance, setNewDebtBalance] = useState(0);
    const [newDebtRate, setNewDebtRate] = useState(0);
    const [newDebtMin, setNewDebtMin] = useState(0);

    const addDebt = () => {
        const debt: Debt = {
            id: Math.random().toString(36).substr(2, 9),
            userId: "local",
            name: newDebtName,
            balance: newDebtBalance,
            interestRate: newDebtRate,
            minimumPayment: newDebtMin
        };
        setDebts([...debts, debt]);
        setNewDebtName("");
        setNewDebtBalance(0);
        setNewDebtRate(0);
        setNewDebtMin(0);
    };

    const disposableIncome = calculateDisposableIncome(income, expenses);
    const totalDebt = calculateTotalDebt(debts);

    // Estimate payoff assuming all disposable income goes to debt (simplified for now)
    // Using average interest rate for quick estimation
    const avgRate = debts.length > 0 ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length : 0;
    const payoffMonths = calculatePayoffMonths(totalDebt, disposableIncome, avgRate);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Financial Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Monthly Income</label>
                        <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Monthly Expenses</label>
                        <Input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} />
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="mb-2 font-semibold">Add Debt</h3>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input placeholder="Name" value={newDebtName} onChange={(e) => setNewDebtName(e.target.value)} />
                            <Input type="number" placeholder="Balance" value={newDebtBalance} onChange={(e) => setNewDebtBalance(Number(e.target.value))} />
                            <Input type="number" placeholder="Rate %" value={newDebtRate} onChange={(e) => setNewDebtRate(Number(e.target.value))} />
                            <Input type="number" placeholder="Min Payment" value={newDebtMin} onChange={(e) => setNewDebtMin(Number(e.target.value))} />
                        </div>
                        <Button onClick={addDebt} className="w-full">Add Debt</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>Disposable Income:</span>
                        <span className="font-bold text-green-600">${disposableIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total Debt:</span>
                        <span className="font-bold text-red-600">${totalDebt.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Est. Payoff Time:</span>
                        <span className="font-bold">{payoffMonths === Infinity ? "Never" : `${payoffMonths} months`}</span>
                    </div>

                    <div className="mt-4">
                        <h4 className="font-medium mb-2">Debts List</h4>
                        <ul className="space-y-2">
                            {debts.map(debt => (
                                <li key={debt.id} className="text-sm border p-2 rounded flex justify-between">
                                    <span>{debt.name}</span>
                                    <span>${debt.balance.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
