import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore'

let analytics: any = null

// Check if Firebase environment variables are set
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
  console.error('Please set these variables in your Vercel deployment settings');
  
  // Provide fallback configuration for development
  if (import.meta.env.DEV) {
    console.warn('Using fallback Firebase config for development');
  }
}

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
}

const app = getApps().length ? getApps()[0]! : initializeApp(cfg)

initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
})

if (typeof window !== 'undefined' && cfg.measurementId) {
  import('firebase/analytics').then(({ getAnalytics }) => {
    try { analytics = getAnalytics(app) } catch {}
  })
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export { analytics }
