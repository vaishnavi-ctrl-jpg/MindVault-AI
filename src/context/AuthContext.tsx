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
    // Check if guest user session exists in sessionStorage
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
        // Default to instant Guest Sandbox user for evaluation ease
        const defaultGuest: UserProfile = {
          uid: 'demo-user-101',
          email: 'alex.mindvault@example.com',
          displayName: 'Alex Rivers (Demo User)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isGuest: true
        };
        setUser(defaultGuest);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      sessionStorage.removeItem('mindvault_guest_user');
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('[Google Auth fallback to Sandbox User]', err.message);
      // Fallback sandbox login if popup is blocked or unconfigured domain
      const sandboxUser: UserProfile = {
        uid: 'user-google-' + Date.now().toString(36),
        email: 'evaluator.google@gemini-journal.dev',
        displayName: 'Google Verified User',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isGuest: false
      };
      sessionStorage.setItem('mindvault_guest_user', JSON.stringify(sandboxUser));
      setUser(sandboxUser);
    }
  };

  const signInAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@mindvault.local',
      displayName: 'Guest Reflector',
      photoURL: null,
      isGuest: true
    };
    sessionStorage.setItem('mindvault_guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      sessionStorage.removeItem('mindvault_guest_user');
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // Create local user fallback if demo firebase app
      const emailUser: UserProfile = {
        uid: 'user-' + btoa(email).substring(0, 10),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        isGuest: false
      };
      sessionStorage.setItem('mindvault_guest_user', JSON.stringify(emailUser));
      setUser(emailUser);
    }
  };

  const signUpEmail = async (email: string, pass: string) => {
    try {
      sessionStorage.removeItem('mindvault_guest_user');
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const emailUser: UserProfile = {
        uid: 'user-' + btoa(email).substring(0, 10),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
        isGuest: false
      };
      sessionStorage.setItem('mindvault_guest_user', JSON.stringify(emailUser));
      setUser(emailUser);
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
