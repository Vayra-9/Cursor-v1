"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Budget } from "@/lib/db/budget";

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Healthcare", "Other"];

export default function MonthlyPlanner() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newLimit, setNewLimit] = useState(0);

    const addBudget = () => {
        if (!newCategory || newLimit <= 0) return;

        const budget: Budget = {
            id: Math.random().toString(36).substr(2, 9),
            userId: "local",
            month: new Date().toISOString().slice(0, 7),
            category: newCategory,
            limit: newLimit,
            spent: 0
        };

        setBudgets([...budgets, budget]);
        setNewCategory("");
        setNewLimit(0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Budget Planner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <select
                        className="border rounded px-2 py-1"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <Input
                        type="number"
                        placeholder="Limit"
                        value={newLimit || ""}
                        onChange={(e) => setNewLimit(Number(e.target.value))}
                    />
                    <Button onClick={addBudget}>Add</Button>
                </div>

                <div className="space-y-3">
                    {budgets.map(budget => {
                        const percentage = (budget.spent / budget.limit) * 100;
                        return (
                            <div key={budget.id} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{budget.category}</span>
                                    <span>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
