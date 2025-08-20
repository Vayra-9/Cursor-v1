import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<User> => {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: displayName || firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'system',
        currency: 'USD',
        language: 'en',
        plan: 'free',
        notifications: {
          email: true,
          push: true,
          paymentReminders: true,
          milestoneAlerts: true,
          tipsAndMotivation: true,
        },
        privacy: {
          shareProgress: false,
          shareTestimonials: false,
          analytics: true,
        },
      },
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), user);
    return user;
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      lastLoginAt: new Date(),
    });

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Google Sign In
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      // Create new user document
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'system',
          currency: 'USD',
          language: 'en',
          plan: 'free',
          notifications: {
            email: true,
            push: true,
            paymentReminders: true,
            milestoneAlerts: true,
            tipsAndMotivation: true,
          },
          privacy: {
            shareProgress: false,
            shareTestimonials: false,
            analytics: true,
          },
        },
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), user);
      return user;
    } else {
      // Update last login for existing user
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: new Date(),
      });

      return userDoc.data() as User;
    }
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Reset Password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Error message mapping
const getErrorMessage = (code: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups for this site.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/invalid-credential': 'Invalid credentials.',
    'auth/user-mismatch': 'The provided credentials do not correspond to the previously signed in user.',
    'auth/invalid-verification-code': 'Invalid verification code.',
    'auth/invalid-verification-id': 'Invalid verification ID.',
    'auth/quota-exceeded': 'Quota exceeded.',
    'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
    'auth/timeout': 'The operation timed out.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
    'auth/unsupported-persistence-type': 'The current environment does not support the specified persistence type.',
    'auth/web-storage-unsupported': 'Web storage is not supported or is disabled.',
    'auth/expired-action-code': 'The action code has expired.',
    'auth/invalid-action-code': 'The action code is invalid.',
    'auth/missing-action-code': 'The action code is missing.',
  };

  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
};
