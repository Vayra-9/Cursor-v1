import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { idToken, name, balance, interestRate, minimumPayment } = await req.json();

        if (!idToken || !name || balance === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify User Token
        const auth = getAdminAuth();
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const uid = decodedToken.uid;

        // 2. Prepare Data
        const newDebt = {
            name,
            balance: Number(balance),
            interestRate: Number(interestRate || 0),
            minimumPayment: Number(minimumPayment || 0),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // 3. Save to Firestore (Subcollection: users/{uid}/debts)
        const db = getAdminDb();
        const docRef = await db.collection('users').doc(uid).collection('debts').add(newDebt);

        return NextResponse.json({
            success: true,
            debtId: docRef.id,
            message: 'Debt added successfully'
        });

    } catch (error) {
        console.error('Add Debt API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
