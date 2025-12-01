import InstantExpenseInput from "@/components/expenses/instant-expense-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function InstantExpensePage() {
    return (
        <div className="min-h-screen bg-background p-4 flex flex-col">
            <div className="mb-4">
                <Link href="/">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <InstantExpenseInput />
            </div>
        </div>
    );
}
