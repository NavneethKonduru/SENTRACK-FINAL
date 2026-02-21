import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Shield, ArrowRight, Zap, Eye } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone'); // phone | otp | error
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOTP, verifyOTP, enterDemoMode } = useAuth();
  const navigate = useNavigate();

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
      setError('Could not send OTP. Check your number or try Demo Mode.');
    }
    setLoading(false);
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
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

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOTP(code);
      navigate('/select-role');
    } catch (err) {
      console.error('[Login] OTP verify failed:', err);
      setError('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleDemoMode = (role) => {
    enterDemoMode(role);
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem', fontSize: '2rem',
        }}>
          <Shield size={36} />
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome to SENTRAK</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Sign in with your phone number
        </p>
      </div>

      {step === 'phone' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Phone Number
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem',
            }}>
              🇮🇳 +91
            </div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
              style={{
                flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)', fontSize: '1.1rem', letterSpacing: '1px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSendOTP}
            disabled={loading}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Sending...' : <><Phone size={18} /> Send OTP</>}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
            Enter the 6-digit code sent to +91 {phone}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOTPChange(i, e.target.value)}
                onKeyDown={e => handleOTPKeyDown(i, e)}
                style={{
                  width: '48px', height: '56px', textAlign: 'center',
                  fontSize: '1.4rem', fontWeight: '700', borderRadius: '12px',
                  background: 'var(--bg-secondary)', border: `2px solid ${digit ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                  color: 'var(--text-primary)', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ color: 'var(--status-error)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleVerifyOTP}
            disabled={loading}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? 'Verifying...' : <><ArrowRight size={18} /> Verify & Continue</>}
          </button>

          <button
            onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
            style={{
              width: '100%', padding: '0.75rem', marginTop: '0.75rem',
              background: 'transparent', border: '1px solid var(--border-primary)',
              borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            ← Change Phone Number
          </button>
        </div>
      )}

      {/* Demo Mode */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          — or explore without login —
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { role: 'coach', icon: '🏫', label: 'Demo as Coach' },
            { role: 'scout', icon: '🔍', label: 'Demo as Scout' },
            { role: 'athlete', icon: '🏃', label: 'Demo as Athlete' },
          ].map(item => (
            <button
              key={item.role}
              onClick={() => handleDemoMode(item.role)}
              style={{
                padding: '0.6rem 1rem', borderRadius: '10px',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
