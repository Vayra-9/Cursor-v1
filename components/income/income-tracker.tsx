"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IncomeSource {
    id: string;
    name: string;
    amount: number;
    skills?: string[];
}

export default function IncomeTracker() {
    const [sources, setSources] = useState<IncomeSource[]>([]);
    const [newName, setNewName] = useState("");
    const [newAmount, setNewAmount] = useState(0);

    const addSource = () => {
        if (!newName || newAmount <= 0) return;

        const source: IncomeSource = {
            id: Math.random().toString(36).substr(2, 9),
            name: newName,
            amount: newAmount,
            skills: []
        };

        setSources([...sources, source]);
        setNewName("");
        setNewAmount(0);
    };

    const totalIncome = sources.reduce((sum, s) => sum + s.amount, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Income Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <Input
                        placeholder="Source Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={newAmount || ""}
                        onChange={(e) => setNewAmount(Number(e.target.value))}
                    />
                    <Button onClick={addSource}>Add</Button>
                </div>

                <div className="space-y-2">
                    {sources.map(source => (
                        <div key={source.id} className="flex justify-between items-center border-b pb-2">
                            <span className="font-medium">{source.name}</span>
                            <span className="text-green-600 font-bold">${source.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t flex justify-between font-bold">
                    <span>Total Monthly Income:</span>
                    <span className="text-green-600">${totalIncome.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
