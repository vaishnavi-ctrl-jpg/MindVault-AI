import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  signInEmail: (e: string, p: string) => Promise<void>;
  signUpEmail: (e: string, p: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if guest sandbox session exists
    const savedGuest = sessionStorage.getItem('mindvault_guest_user');
    if (savedGuest) {
      try {
        setUser(JSON.parse(savedGuest));
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem('mindvault_guest_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Authenticated User',
          photoURL: firebaseUser.photoURL,
          isGuest: false
        });
      } else {
        // If not authenticated and no guest session, default to null unauthenticated state
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    sessionStorage.removeItem('mindvault_guest_user');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('[Google Auth Error]', err);
      throw new Error(`Google Sign-In failed: ${err.message}`);
    }
  };

  const signInAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest-sandbox-' + Math.random().toString(36).substring(2, 9),
      email: 'sandbox@mindvault.local',
      displayName: 'Guest Sandbox User',
      photoURL: null,
      isGuest: true
    };
    sessionStorage.setItem('mindvault_guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const signInEmail = async (email: string, pass: string) => {
    sessionStorage.removeItem('mindvault_guest_user');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('[Firebase Email Sign In Error]', err);
      throw new Error(`Authentication failed: ${err.message}`);
    }
  };

  const signUpEmail = async (email: string, pass: string) => {
    sessionStorage.removeItem('mindvault_guest_user');
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('[Firebase Email Sign Up Error]', err);
      throw new Error(`Registration failed: ${err.message}`);
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem('mindvault_guest_user');
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut, signInEmail, signUpEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
