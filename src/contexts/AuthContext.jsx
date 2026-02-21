import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    // Check if demo mode is active
    const demo = localStorage.getItem('sentrak_demo_mode');
    if (demo === 'true') {
      setDemoMode(true);
      setRole(localStorage.getItem('sentrak_demo_role') || 'coach');
      setUser({ uid: 'demo-user', phoneNumber: '+910000000000', displayName: 'Demo User' });
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole(null); // New user, needs role selection
          }
        } catch (err) {
          console.warn('[Auth] Firestore read failed, checking localStorage', err);
          setRole(localStorage.getItem('sentrak_user_role') || null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Setup reCAPTCHA (invisible)
  function setupRecaptcha(elementId) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {},
      });
    }
    return window.recaptchaVerifier;
  }

  // Send OTP
  async function sendOTP(phoneNumber) {
    const appVerifier = setupRecaptcha('recaptcha-container');
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmation;
    return confirmation;
  }

  // Verify OTP
  async function verifyOTP(code) {
    if (!window.confirmationResult) throw new Error('Send OTP first');
    const result = await window.confirmationResult.confirm(code);
    return result.user;
  }

  // Set user role (first-time)
  async function selectRole(selectedRole) {
    if (!user) return;
    const userData = {
      uid: user.uid,
      phone: user.phoneNumber,
      role: selectedRole,
      createdAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (err) {
      console.warn('[Auth] Firestore write failed, saving to localStorage', err);
    }
    localStorage.setItem('sentrak_user_role', selectedRole);
    setRole(selectedRole);
  }

  // Demo mode login (for hackathon)
  function enterDemoMode(selectedRole = 'coach') {
    localStorage.setItem('sentrak_demo_mode', 'true');
    localStorage.setItem('sentrak_demo_role', selectedRole);
    setDemoMode(true);
    setRole(selectedRole);
    setUser({ uid: 'demo-user', phoneNumber: '+910000000000', displayName: 'Demo User' });
  }

  // Logout
  async function logout() {
    localStorage.removeItem('sentrak_demo_mode');
    localStorage.removeItem('sentrak_demo_role');
    localStorage.removeItem('sentrak_user_role');
    setDemoMode(false);
    setUser(null);
    setRole(null);
    try { await signOut(auth); } catch {}
  }

  const value = {
    user, role, loading, demoMode,
    sendOTP, verifyOTP, selectRole, enterDemoMode, logout,
    isAuthenticated: !!user || demoMode,
    isCoach: role === 'coach' || role === 'admin',
    isScout: role === 'scout' || role === 'admin',
    isAthlete: role === 'athlete',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
