"use client";

import { useAuth } from "@/context/AuthContext";

export default function TestAccessPage() {
    const { user, userProfile, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>Not logged in</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Access Test</h1>
            <div className="space-y-2">
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Plan:</strong> {userProfile?.plan}</p>
                <p><strong>Role:</strong> {userProfile?.role}</p>
                <p><strong>Is Admin:</strong> {userProfile?.isAdmin ? "Yes" : "No"}</p>
            </div>
        </div>
    );
}
