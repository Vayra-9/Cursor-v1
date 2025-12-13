import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { code, idToken } = await req.json();

        if (!code || !idToken) {
            return NextResponse.json({ error: 'Missing code or token' }, { status: 400 });
        }

        // Secure Code Check
        // In a real env, use process.env.UNLOCK_CODE
        const validCode = process.env.UNLOCK_CODE || 'VAYRA_PRO_2025';

        if (code !== validCode) {
            return NextResponse.json({ error: 'Invalid unlock code' }, { status: 403 });
        }

        // Verify User Token
        const auth = getAdminAuth();
        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(idToken);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        const uid = decodedToken.uid;

        // Set Custom Claims
        // Preserve existing role/admin status if present, otherwise default to user
        const currentClaims = decodedToken;
        const newClaims = {
            plan: 'pro', // The goal
            role: currentClaims.role || 'user',
            isAdmin: currentClaims.isAdmin === true
        };

        await auth.setCustomUserClaims(uid, newClaims);

        // Update Firestore User Document
        const db = getAdminDb();
        await db.collection('users').doc(uid).update({
            plan: 'pro',
            updatedAt: Date.now()
        });

        return NextResponse.json({ success: true, message: 'Plan unlocked successfully' });

    } catch (error) {
        console.error('Unlock API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
