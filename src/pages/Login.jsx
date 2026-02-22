import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Shield, ArrowRight, User, ClipboardCheck, Search, Award, Settings } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/shared/Toast';

const ROLES = [
  { id: 'athlete', title: 'Athlete', icon: User, emoji: '🏃', color: 'var(--accent-primary)', desc: 'Register as talent' },
  { id: 'coach', title: 'Coach / Academy', icon: ClipboardCheck, emoji: '🏫', color: 'var(--accent-secondary)', desc: 'Record assessments' },
  { id: 'scout', title: 'Scout / Recruiter', icon: Search, emoji: '🔍', color: 'var(--accent-warning)', desc: 'Discover talent' },
  { id: 'witness', title: 'Verification Officer', icon: Award, emoji: '🛡️', color: 'var(--accent-success)', desc: 'Attest results' },
  { id: 'admin', title: 'System Admin', icon: Settings, emoji: '⚙️', color: 'var(--accent-danger)', desc: 'Manage platform' },
];

export default function Login() {
  // Navigation Flow States: 'role-select' -> 'action-select' -> 'phone' -> 'otp'
  const [step, setStep] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [authAction, setAuthAction] = useState(null); // 'signin' or 'signup'
  
  // Auth Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { sendOTP, verifyOTP, selectRole, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already logged in and configured
  useEffect(() => {
    if (currentUser) {
       navigate('/');
    }
  }, [currentUser, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('action-select');
  };

  const handleActionSelect = (action) => {
    setAuthAction(action);
    setStep('phone');
  };

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendOTP(`+91${cleaned}`);
      setStep('otp');
    } catch (err) {
      console.error('[Login] OTP send failed:', err);
      setError(`Error: ${err.message || 'Could not send OTP.'} Try Demo Mode.`);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) { return setError('Enter all 6 digits'); }

    setLoading(true);
    setError('');
    try {
      const authenticatedUser = await verifyOTP(code);
      
      // Determine what to do based on Sign In vs Sign Up
      try {
        const userDocRef = doc(db, 'users', authenticatedUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (authAction === 'signup') {
            if (userDoc.exists()) {
                toast.info("Account already exists. Logging you in with existing role.");
                await selectRole(userDoc.data().role);
            } else {
                toast.success(`Successfully registered as ${selectedRole.title}`);
                await selectRole(selectedRole.id);
            }
        } 
        else if (authAction === 'signin') {
             if (userDoc.exists()) {
                 const existingRole = userDoc.data().role;
                 if (existingRole !== selectedRole.id) {
                     toast.info(`Logged in utilizing your existing '${existingRole}' access.`);
                 }
                 await selectRole(existingRole);
             } else {
                 toast.success(`No account found. We've created one for you as a ${selectedRole.title}.`);
                 await selectRole(selectedRole.id);
             }
        }
        navigate('/');
      } catch (dbErr) {
        console.warn("Firestore routing failed, logging in locally", dbErr);
        await selectRole(selectedRole.id);
        navigate('/');
      }

    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handlers (same as original)
  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };
  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };
  const handlePasteOTP = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const newOTP = [...otp];
    for (let i = 0; i < pastedData.length; i++) newOTP[i] = pastedData[i];
    setOtp(newOTP);
    const nextFocusIndex = Math.min(pastedData.length, 5);
    const next = document.getElementById(`otp-${nextFocusIndex}`);
    if (next) next.focus();
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Step 1: Role Selection */}
      {step === 'role-select' && (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Shield size={28} color="var(--accent-primary)"/>
            </div>
            <h1 className="heading-2">Welcome to SENTRAK</h1>
            <p className="text-secondary text-sm">Select your platform role to get started</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROLES.map(role => (
              <button key={role.id} onClick={() => handleRoleSelect(role)} className="glass-card hover-lift" style={{ 
                padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${role.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  {role.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{role.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{role.desc}</div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Step 2: Action Selection (Sign In or Sign Up) */}
      {step === 'action-select' && (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <button onClick={() => setStep('role-select')} className="btn btn-ghost" style={{ marginBottom: '1.5rem', alignSelf: 'flex-start' }}>← Change Role</button>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `${selectedRole?.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>
            {selectedRole?.emoji}
          </div>
          <h2 className="heading-2 mb-xs">{selectedRole?.title}</h2>
          <p className="text-secondary mb-xl">How would you like to continue?</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button onClick={() => handleActionSelect('signup')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Create New Account
             </button>
             <button onClick={() => handleActionSelect('signin')} className="btn btn-secondary btn-lg" style={{ width: '100%', border: '1px solid var(--border-primary)' }}>
                Sign In to Existing Account
             </button>
          </div>
        </div>
      )}

      {/* Step 3: Phone Entry */}
      {step === 'phone' && (
        <div className="card animate-slide-up" style={{ padding: '1.5rem' }}>
          <button onClick={() => setStep('action-select')} className="btn btn-ghost" style={{ marginBottom: '1rem', padding: 0 }}>← Back</button>
          
          <h3 className="heading-3 mb-xs">{authAction === 'signup' ? 'Create Account' : 'Welcome Back'}</h3>
          <p className="text-secondary text-sm mb-lg">Enter your phone number to continue as a {selectedRole?.title.split(' ')[0]}.</p>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone Number</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem' }}>
              🇮🇳 +91
            </div>
            <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} style={{
                flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontSize: '1.1rem', letterSpacing: '1px', outline: 'none',
              }} />
          </div>

          {error && <p style={{ color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

          <button className="btn btn-primary" onClick={handleSendOTP} disabled={loading} style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? 'Sending...' : <><Phone size={18} /> Send OTP</>}
          </button>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.3)', textAlign: 'center', fontSize: '0.8rem' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}><strong>Jury Test Credentials:</strong></div>
            <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>Phone: <strong>+91 99999 99999</strong> | OTP: <strong>123456</strong></div>
          </div>
        </div>
      )}

      {/* Step 4: OTP Entry */}
      {step === 'otp' && (
        <div className="card animate-slide-up" style={{ padding: '1.5rem' }}>
          <button onClick={() => setStep('phone')} className="btn btn-ghost" style={{ marginBottom: '1rem', padding: 0 }}>← Edit Number</button>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>Enter the 6-digit code sent to +91 {phone}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {otp.map((digit, i) => (
              <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOTPChange(i, e.target.value)} onKeyDown={e => handleOTPKeyDown(i, e)} onPaste={e => { if (i === 0) handlePasteOTP(e); }} style={{
                  width: '48px', height: '56px', textAlign: 'center', fontSize: '1.4rem', fontWeight: '700', borderRadius: '12px', background: 'var(--bg-secondary)', border: `2px solid ${digit ? 'var(--accent-primary)' : 'var(--border-primary)'}`, color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
                }} />
            ))}
          </div>

          {error && <p style={{ color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

          <button className="btn btn-primary" onClick={handleVerifyOTP} disabled={loading} style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? 'Verifying...' : <><ArrowRight size={18} /> {authAction === 'signup' ? 'Complete Profile' : 'Access Account'}</>}
          </button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
