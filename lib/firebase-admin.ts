import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

export function initAdmin() {
    if (adminApp) {
        return; // Already initialized
    }

    if (getApps().length > 0) {
        adminApp = getApps()[0];
        adminAuthInstance = getAuth(adminApp);
        adminDbInstance = getFirestore(adminApp);
        return;
    }

    const firebaseAdminConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    adminApp = initializeApp({
        credential: cert(firebaseAdminConfig),
    });

    adminAuthInstance = getAuth(adminApp);
    adminDbInstance = getFirestore(adminApp);
}

export function getAdminAuth(): Auth {
    if (!adminAuthInstance) {
        initAdmin();
    }
    if (!adminAuthInstance) {
        throw new Error('Firebase Admin Auth not initialized');
    }
    return adminAuthInstance;
}

export function getAdminDb(): Firestore {
    if (!adminDbInstance) {
        initAdmin();
    }
    if (!adminDbInstance) {
        throw new Error('Firebase Admin Firestore not initialized');
    }
    return adminDbInstance;
}

// Legacy exports for backward compatibility (will initialize on first use)
export const adminAuth = new Proxy({} as Auth, {
    get(target, prop) {
        return getAdminAuth()[prop as keyof Auth];
    }
});

export const adminDb = new Proxy({} as Firestore, {
    get(target, prop) {
        return getAdminDb()[prop as keyof Firestore];
    }
});
