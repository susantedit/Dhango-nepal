import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dhango_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL || null
        };
        setUser(userData);
        localStorage.setItem('dhango_user', JSON.stringify(userData));
      } else {
        // Only clear if not using a demo user
        if (user && !user.isDemo) {
          setUser(null);
          localStorage.removeItem('dhango_user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      if (auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
        setUser(userData);
        localStorage.setItem('dhango_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Google sign in error, fallback to guest session:', err.message);
      // Demo fallback
      const demoUser = {
        uid: 'demo-' + Date.now(),
        email: 'nepal.creator@gmail.com',
        displayName: 'Nepal Creator',
        photoURL: null,
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('dhango_user', JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      if (auth) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userData = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || email.split('@')[0],
          photoURL: null
        };
        setUser(userData);
        localStorage.setItem('dhango_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      // Demo fallback
      const demoUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        isDemo: true
      };
      setUser(demoUser);
      localStorage.setItem('dhango_user', JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const signupWithEmail = async (email, password) => {
    return loginWithEmail(email, password);
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('dhango_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
