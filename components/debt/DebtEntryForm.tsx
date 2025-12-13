"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Plus, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DebtEntryForm({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");
    const [rate, setRate] = useState("");
    const [minPayment, setMinPayment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setError("");

        try {
            const idToken = await user.getIdToken();

            const res = await fetch('/api/debt/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idToken,
                    name,
                    balance: parseFloat(balance),
                    interestRate: parseFloat(rate),
                    minimumPayment: parseFloat(minPayment)
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to add debt');

            // Reset Form
            setName("");
            setBalance("");
            setRate("");
            setMinPayment("");

            if (onSuccess) onSuccess();
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save debt.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-white/5 bg-[#1e1e2e] text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-indigo-400" />
                    Add New Debt
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Securely track a loan or credit card.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Debt Name</label>
                        <Input
                            placeholder="e.g. Chase Sapphire"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Balance</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                required
                                className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">APR %</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Min Payment</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={minPayment}
                            onChange={(e) => setMinPayment(e.target.value)}
                            className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Securely"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
