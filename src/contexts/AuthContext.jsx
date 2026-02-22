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
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {


    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
            setOnboardingComplete(userDoc.data().onboardingComplete || false);
          } else {
            setRole(null); // New user, needs role selection
            setOnboardingComplete(false);
          }
        } catch (err) {
          console.warn('[Auth] Firestore read failed, checking localStorage', err);
          setRole(localStorage.getItem('sentrak_user_role') || null);
          setOnboardingComplete(localStorage.getItem('sentrak_onboarding_complete') === 'true');
        }
      } else {
        setUser(null);
        setRole(null);
        setOnboardingComplete(false);
        localStorage.removeItem('sentrak_user_role');
        localStorage.removeItem('sentrak_onboarding_complete');
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Setup reCAPTCHA (invisible)
  function setupRecaptcha(elementId) {
    const el = document.getElementById(elementId);
    if (!el) {
      console.warn(`[Auth] Recaptcha element #${elementId} not found in DOM`);
      return null;
    }

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {},
      });
      return window.recaptchaVerifier;
    } catch (err) {
      console.error('[Auth] Recaptcha initialization failed:', err);
      return null;
    }
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
      onboardingComplete: false,
      createdAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    } catch (err) {
      console.warn('[Auth] Firestore write failed, saving to localStorage', err);
    }
    localStorage.setItem('sentrak_user_role', selectedRole);
    localStorage.setItem('sentrak_onboarding_complete', 'false');
    setRole(selectedRole);
    setOnboardingComplete(false);
  }

  // Complete onboarding
  function completeOnboarding() {
    localStorage.setItem('sentrak_onboarding_complete', 'true');
    setOnboardingComplete(true);
  }

  // Logout
  async function logout() {
    localStorage.removeItem('sentrak_demo_mode');
    localStorage.removeItem('sentrak_demo_role');
    localStorage.removeItem('sentrak_user_role');
    setUser(null);
    setRole(null);
    try { await signOut(auth); } catch {}
  }

  const value = {
    user, role, onboardingComplete, loading,
    sendOTP, verifyOTP, selectRole, completeOnboarding, logout,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isCoach: role === 'coach' || role === 'admin',
    isScout: role === 'scout' || role === 'admin',
    isAthlete: role === 'athlete' || role === 'admin',
    isWitness: role === 'witness' || role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
