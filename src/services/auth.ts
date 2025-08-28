import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  updateEmail,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserPreferences } from '@/types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ 
  prompt: "select_account", 
  response_type: "id_token" 
});

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

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
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update last login
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: new Date(),
      });

      // Get user data
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      // Try popup first, fallback to redirect if blocked
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('Popup blocked or closed, falling back to redirect');
          await signInWithRedirect(auth, googleProvider);
          // The redirect will handle the rest, so we return here
          throw new Error('Redirecting to Google sign-in...');
        }
        throw popupError;
      }

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
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  static async updateProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user preferences
  static async updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        'preferences': preferences,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update Firebase profile
  static async updateFirebaseProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');

      await updateProfile(user, updates);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update email
  static async updateEmail(newEmail: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');

      await updateEmail(user, newEmail);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');

      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Delete account
  static async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in');

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete Firebase user
      await deleteUser(user);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const user = userDoc.exists() ? (userDoc.data() as User) : null;
          callback(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Error message mapping
  private static getErrorMessage(code: string): string {
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
  }
} 