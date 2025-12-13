"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UnlockForm() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useAuth();

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setErrorMessage("You must be logged in to unlock.");
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // 1. Get fresh token for the request
            const idToken = await user.getIdToken();

            // 2. Call API
            const res = await fetch('/api/plan/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, idToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to unlock');
            }

            // 3. Success! Force refresh token to see new claims immediately
            await user.getIdToken(true);

            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <Card className="w-full max-w-md border-indigo-500/20 bg-[#1e1e2e] shadow-2xl">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">Congratulations!</h3>
                        <p className="text-gray-300">
                            Welcome to VAYRA Pro. Your new tools are now available.
                        </p>
                    </div>
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md border-white/5 bg-[#1e1e2e] text-white shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Lock className="h-5 w-5 text-indigo-400" />
                    Unlock Pro Features
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Enter your invite code to upgrade your plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUnlock} className="space-y-4">
                    <Input
                        placeholder="Enter Unlock Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-11"
                    />
                    {status === 'error' && (
                        <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                            {errorMessage}
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={status === 'loading' || !code}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20 h-11 transition-all"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying Code...
                            </>
                        ) : (
                            "Unlock Now"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
