import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }
        const idToken = authHeader.split('Bearer ')[1];

        // 1. Verify User Token
        const auth = getAdminAuth();
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const uid = decodedToken.uid;

        // 2. Fetch Debts from Firestore (Subcollection: users/{uid}/debts)
        const db = getAdminDb();
        const debtsSnapshot = await db.collection('users').doc(uid).collection('debts').get();

        const debts = debtsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            debts
        });

    } catch (error) {
        console.error('Get Debts API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
