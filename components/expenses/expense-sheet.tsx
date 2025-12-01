"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseRecord } from "@/types";

const MOCK_EXPENSES: ExpenseRecord[] = [
    { id: "1", userId: "u1", amount: 50, category: "Food", note: "Groceries", date: Date.now() - 86400000, synced: true },
    { id: "2", userId: "u1", amount: 120, category: "Transport", note: "Gas", date: Date.now() - 172800000, synced: true },
    { id: "3", userId: "u1", amount: 30, category: "Entertainment", note: "Movie", date: Date.now(), synced: true },
];

export default function ExpenseSheet() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Sheet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b">
                            <tr className="text-left">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Category</th>
                                <th className="pb-2">Note</th>
                                <th className="pb-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_EXPENSES.map(expense => (
                                <tr key={expense.id} className="border-b last:border-0">
                                    <td className="py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="py-2">{expense.category}</td>
                                    <td className="py-2">{expense.note || "-"}</td>
                                    <td className="py-2 text-right font-medium">${expense.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
