"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { queueExpense, processQueue } from "@/lib/syncQueue";
import { generateWhatsAppLink } from "@/lib/whatsappLogger";
import { Mic, MicOff, Send } from "lucide-react";
import { ExpenseRecord } from "@/types";

export default function InstantExpenseInput() {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "queued">("idle");

    const { isListening, transcript, isSupported, startListening, stopListening, setTranscript } = useVoiceInput();

    useEffect(() => {
        if (transcript) {
            // Simple heuristic: if transcript contains a number, assume it's amount
            const match = transcript.match(/(\d+(\.\d{1,2})?)/);
            if (match) {
                setAmount(match[0]);
                // Remove amount from note
                setNote(transcript.replace(match[0], "").trim());
            } else {
                setNote(transcript);
            }
        }
    }, [transcript]);

    // Try to sync on mount
    useEffect(() => {
        processQueue();
        window.addEventListener('online', processQueue);
        return () => window.removeEventListener('online', processQueue);
    }, []);

    const handleSubmit = async () => {
        if (!amount || !category) return;

        setStatus("saving");

        const expense: ExpenseRecord = {
            id: Math.random().toString(36).substr(2, 9),
            userId: "local", // Placeholder
            amount: parseFloat(amount),
            category,
            note,
            date: Date.now(),
            synced: false
        };

        try {
            if (navigator.onLine) {
                // Try direct send (mocked)
                await fetch("/api/sync/receive", {
                    method: "POST",
                    body: JSON.stringify({ expenses: [expense] })
                });
                setStatus("saved");
            } else {
                throw new Error("Offline");
            }
        } catch (e) {
            // Fallback to queue
            await queueExpense(expense);
            setStatus("queued");
        }

        // Reset form
        setAmount("");
        setCategory("");
        setNote("");
        setTranscript("");

        setTimeout(() => setStatus("idle"), 3000);
    };

    const handleWhatsAppLog = () => {
        if (!amount || !category) return;
        const expense: ExpenseRecord = {
            id: "temp",
            userId: "local",
            amount: parseFloat(amount),
            category,
            note,
            date: Date.now()
        };
        window.open(generateWhatsAppLink(expense), "_blank");
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Quick Expense</span>
                    {status === "saved" && <span className="text-green-500 text-sm">Saved!</span>}
                    {status === "queued" && <span className="text-amber-500 text-sm">Queued (Offline)</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                    />
                    {isSupported && (
                        <Button
                            size="icon"
                            variant={isListening ? "destructive" : "outline"}
                            onClick={isListening ? stopListening : startListening}
                        >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                    )}
                </div>

                <Input
                    placeholder="Category (e.g. Food, Transport)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <Input
                    placeholder="Note (Optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleSubmit}>
                        Save Expense
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleWhatsAppLog}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
