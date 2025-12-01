"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DebtCalculatorForm from "@/components/calculators/debt-calculator-form";
import PaymentTrackerList from "@/components/dashboard/payment-tracker-list";
import { useAuth } from "@/components/auth/auth-provider";

export default function DashboardHome() {
    const { userProfile } = useAuth();

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="space-x-2">
                    <Button variant="outline">Add Expense</Button>
                    <Button>Add Payment</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">+0% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disposable Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">Based on input</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">None</div>
                        <p className="text-xs text-muted-foreground">Due in 0 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-4">
                    <h2 className="text-xl font-semibold mb-4">Calculate Your Debt</h2>
                    <DebtCalculatorForm />
                </div>
                <div className="col-span-3">
                    <PaymentTrackerList />
                </div>
            </div>
        </div>
    );
}
