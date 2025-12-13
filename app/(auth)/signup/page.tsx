"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    // We can use useAuth to detect if a user is already logged in or to trigger profile creation if needed
    // But here we primarily rely on the explicit signup action
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setIsLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Redirect handled by success, but we can also push.
            // The AuthProvider normally listens to onAuthStateChanged and will handle profile creation.
            // We redirect immediately to dashboard where the AuthProvider will pick it up and ensure the DB doc is created (as per our previous logic).
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Signup error:", err);
            let message = "Failed to create account. Please try again.";
            if (err.code === "auth/email-already-in-use") {
                message = "This email is already in use.";
            } else if (err.code === "auth/weak-password") {
                message = "Password is too weak.";
            } else if (err.code === "auth/invalid-email") {
                message = "Invalid email address.";
            }
            setError(message);
            setIsLoading(false); // Only set loading false on error. On success, we redirect.
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#1A1A2E] p-4 text-white">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Brand */}
                <div className="text-center space-y-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Start your journey to financial freedom
                    </h1>
                    <p className="text-sm text-gray-400">
                        Create your account to start tracking your debt
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/5 bg-[#2C2C40] p-8 shadow-xl shadow-black/20">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-10 transition-all shadow-lg shadow-indigo-500/20 border-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        <span className="mr-1">Already have an account?</span>
                        <Link
                            href="/login"
                            className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium"
                        >
                            Log in
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-4">
                        <p className="text-xs text-center text-gray-500 leading-relaxed">
                            By creating an account, you agree to VAYRA's terms of service and privacy policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
