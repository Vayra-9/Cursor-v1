"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export default function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                        <p className="font-semibold">Install VAYRA</p>
                        <p className="text-xs opacity-90">Add to home screen for quick access</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={handleInstall}>
                            Install
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsVisible(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
