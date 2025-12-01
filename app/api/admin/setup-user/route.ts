import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

/**
 * Admin User Setup Endpoint
 * WARNING: This endpoint should be protected or removed after initial setup
 * 
 * Usage: POST /api/admin/setup-user
 * Body: { email: "admin@example.com", uid: "optional-uid" }
 */
export async function POST(request: Request) {
    try {
        const { email, uid } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Get or create user
        let userRecord;
        if (uid) {
            try {
                userRecord = await adminAuth.getUser(uid);
            } catch (error) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
        } else {
            // Find user by email
            try {
                userRecord = await adminAuth.getUserByEmail(email);
            } catch (error) {
                return NextResponse.json({
                    error: 'User not found. Please sign up first, then use this endpoint with your UID.'
                }, { status: 404 });
            }
        }

        // Update user document in Firestore with admin/premium privileges
        const userDocRef = adminDb.collection('users').doc(userRecord.uid);

        await userDocRef.set({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || 'Admin User',
            photoURL: userRecord.photoURL || null,
            plan: 'premium',
            grandfathered: true,
            planVersion: 'v1_early',
            role: 'admin', // Custom role for admin users
            createdAt: Date.now(),
            updatedAt: Date.now(),
            softDelete: false,
        }, { merge: true });

        return NextResponse.json({
            success: true,
            message: 'Admin user setup complete',
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                plan: 'premium',
                grandfathered: true,
                role: 'admin'
            }
        });

    } catch (error: any) {
        console.error('Admin setup error:', error);
        return NextResponse.json({
            error: 'Failed to setup admin user',
            details: error.message
        }, { status: 500 });
    }
}
