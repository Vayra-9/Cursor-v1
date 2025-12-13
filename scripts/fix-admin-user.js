const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config({ path: '.env.local' });

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (getApps().length === 0) {
    initializeApp({
        credential: cert(firebaseAdminConfig),
    });
}

const db = getFirestore();
const auth = getAuth();
const email = 'hello@vayra.digital';

async function fixAdminUser() {
    try {
        console.log(`Looking up user ${email}...`);
        const user = await auth.getUserByEmail(email);
        console.log(`Found user ${user.uid}`);

        const userRef = db.collection('users').doc(user.uid);

        // Update user document with correct admin fields
        const updateData = {
            plan: 'premium',
            role: 'admin',
            isAdmin: true,
            planVersion: 'v1_early',
            updatedAt: Date.now()
        };

        await userRef.set(updateData, { merge: true });
        console.log('Successfully updated user document:', updateData);

        // Verify the update
        const docSnap = await userRef.get();
        console.log('Verified document data:', docSnap.data());

    } catch (error) {
        console.error('Error fixing admin user:', error);
        process.exit(1);
    }
}

fixAdminUser();
