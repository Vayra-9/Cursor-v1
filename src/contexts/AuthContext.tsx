import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { AuthService } from '@/services/auth';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ensureUserDoc } from '@/lib/ensureUserDoc';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on app init
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Google OAuth redirect result received');
          await ensureUserDoc(result.user.uid, result.user.email || undefined);
        }
      } catch (error: any) {
        console.warn('Google redirect err:', error?.code, error?.message);
        // Non-fatal error, continue with normal auth flow
      }
    };

    handleRedirectResult();

    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const newUser = await AuthService.signUp(email, password, displayName);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await AuthService.signIn(email, password);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await AuthService.signInWithGoogle();
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user signed in');
    
    try {
      await AuthService.updateProfile(user.uid, updates);
      setUser({ ...user, ...updates });
    } catch (error) {
      throw error;
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) throw new Error('No user signed in');
    
    try {
      await AuthService.updatePreferences(user.uid, preferences);
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences },
      });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 