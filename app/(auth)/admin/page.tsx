"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, Activity, ShieldAlert, Lock } from "lucide-react";

export default function AdminPage() {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#1A1A2E] text-white p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Panel</h1>
                            <p className="text-gray-400">Full System Control & Monitoring</p>
                        </div>
                        <div className="px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                            Status: Secure
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-indigo-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-gray-500">+12% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Active Plans</CardTitle>
                                <Activity className="h-4 w-4 text-green-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">85%</div>
                                <p className="text-xs text-gray-500">Pro conversion rate</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">System Logs</CardTitle>
                                <FileText className="h-4 w-4 text-yellow-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Safe</div>
                                <p className="text-xs text-gray-500">No anomalies detected</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Settings</CardTitle>
                                <Settings className="h-4 w-4 text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">v1.2.0</div>
                                <p className="text-xs text-gray-500">System up to date</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full justify-start text-left bg-black/20 hover:bg-black/40 border border-white/10">
                                    <Users className="mr-2 h-4 w-4" /> View All Users
                                </Button>
                                <Button className="w-full justify-start text-left bg-black/20 hover:bg-black/40 border border-white/10">
                                    <ShieldAlert className="mr-2 h-4 w-4" /> Manage Permissions
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#2C2C40] border-white/5 text-white">
                            <CardHeader>
                                <CardTitle>System Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button className="w-full justify-start text-left bg-black/20 hover:bg-black/40 border border-white/10">
                                    <Activity className="mr-2 h-4 w-4" /> View Audit Logs
                                </Button>
                                <Button variant="destructive" className="w-full justify-start text-left bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20">
                                    <Lock className="mr-2 h-4 w-4" /> Emergency Lockdown
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
