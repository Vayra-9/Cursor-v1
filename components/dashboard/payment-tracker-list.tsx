"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentRecord } from "@/types";

// Placeholder data until we connect to Firestore in the parent component
const MOCK_PAYMENTS: PaymentRecord[] = [
    { id: "1", userId: "1", debtId: "d1", amount: 200, date: Date.now(), note: "Credit Card Payment" },
    { id: "2", userId: "1", debtId: "d2", amount: 150, date: Date.now() - 86400000 * 5, note: "Car Loan" },
];

export default function PaymentTrackerList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {MOCK_PAYMENTS.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                            <div>
                                <p className="font-medium">{payment.note || "Payment"}</p>
                                <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                            <span className="font-bold text-green-600">-${payment.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
