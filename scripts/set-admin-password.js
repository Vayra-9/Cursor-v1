require('dotenv').config({ path: '.env.local' });
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

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

const auth = getAuth();
const email = 'hello@vayra.digital';
const password = 'Test@123';

async function setPassword() {
    try {
        const user = await auth.getUserByEmail(email);
        await auth.updateUser(user.uid, {
            password: password
        });
        console.log(`Successfully set password for user ${email}`);
    } catch (error) {
        console.error('Error setting password:', error);
        process.exit(1);
    }
}

setPassword();
