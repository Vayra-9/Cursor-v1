import { NextResponse } from "next/server";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assuming this exports initialized db

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { expenses } = body;

        if (!expenses || !Array.isArray(expenses)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // In a real app, we would batch write to Firestore
        // For now, we'll just log and pretend
        console.log("Received sync batch:", expenses.length);

        // Placeholder for Firestore write
        // const batch = writeBatch(db);
        // ...

        return NextResponse.json({ success: true, count: expenses.length });
    } catch (error) {
        console.error("Sync API error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
