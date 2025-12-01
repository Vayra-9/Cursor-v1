"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function YearlyOverview() {
    const stats = {
        totalIncome: 60000,
        totalExpenses: 45000,
        totalSaved: 15000,
        debtPaid: 5000,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yearly Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded">
                        <p className="text-sm text-muted-foreground">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">${stats.totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded">
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                        <p className="text-sm text-muted-foreground">Total Saved</p>
                        <p className="text-2xl font-bold text-blue-600">${stats.totalSaved.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded">
                        <p className="text-sm text-muted-foreground">Debt Paid</p>
                        <p className="text-2xl font-bold text-purple-600">${stats.debtPaid.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
