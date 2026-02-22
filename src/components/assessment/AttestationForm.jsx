import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, CheckCircle, RefreshCw, Smartphone, AlertCircle, XCircle } from 'lucide-react';
import { toast } from '../shared/Toast';

export default function AttestationForm({ witnesses, updateWitness, onComplete }) {
  const [activeResend, setActiveResend] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [shakeIndex, setShakeIndex] = useState(null);
  const [modalOTP, setModalOTP] = useState(null);

  useEffect(() => {
    const timers = Object.keys(activeResend).map(idx => {
      if (activeResend[idx] > 0) {
        return setInterval(() => {
          setActiveResend(prev => ({ ...prev, [idx]: prev[idx] - 1 }));
        }, 1000);
      }
      return null;
    });
    return () => timers.forEach(t => t && clearInterval(t));
  }, [activeResend]);

  const handleSendOTP = (index) => {
    const w = witnesses[index];
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(w.phone)) {
      toast.error('Enter a valid 10-digit number');
      return;
    }

    // GENERATE RANDOM 6-DIGIT CODE
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    
    updateWitness(index, 'generatedOTP', generated);
    updateWitness(index, 'otpSent', true);
    
    setActiveResend(prev => ({ ...prev, [index]: 30 }));
    setFailedAttempts(prev => ({ ...prev, [index]: 0 }));

    // Show the code in a modal for demonstration/witness sharing
    setModalOTP({ name: w.name || `Witness ${index + 1}`, otp: generated });
    
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const handleVerifyOTP = (index) => {
    const w = witnesses[index];
    if (w.otp === w.generatedOTP) {
      updateWitness(index, 'otpVerified', true);
      updateWitness(index, 'verified', true);
      toast.success(`${w.name || `Witness ${index + 1}`} verified!`);
      if (navigator.vibrate) navigator.vibrate([50, 100]);
    } else {
      const attempts = (failedAttempts[index] || 0) + 1;
      setShakeIndex(index);
      setTimeout(() => setShakeIndex(null), 500);

      if (attempts >= 3) {
        toast.error("Too many failed attempts. OTP expired.");
        updateWitness(index, 'otpSent', false);
        updateWitness(index, 'generatedOTP', '');
        updateWitness(index, 'otp', '');
        setFailedAttempts(prev => ({ ...prev, [index]: 0 }));
      } else {
        toast.error(`Incorrect OTP. ${3 - attempts} attempts left.`);
        setFailedAttempts(prev => ({ ...prev, [index]: attempts }));
        updateWitness(index, 'otp', ''); // Clear input for retry
      }
      
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const allVerified = witnesses.length > 0 && witnesses.every(w => w.verified);

  return (
    <div className="attestation-flow animate-fade-in relative z-10">
      <style>{`
        @keyframes custom-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .shake-animation {
          animation: custom-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          border-color: var(--accent-danger) !important;
          background: rgba(239, 68, 68, 0.05) !important;
        }
      `}</style>

      {modalOTP && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card-static animate-scale-in" style={{ 
            padding: '2.5rem', textAlign: 'center', maxWidth: '400px', width: '90%', 
            maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid rgba(99, 102, 241, 0.4)', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.2)' 
          }}>
            <Smartphone size={56} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))' }} />
            <h3 className="heading-3 mb-sm">Verification Code</h3>
            <p className="text-secondary mb-xl" style={{ lineHeight: 1.5 }}>Please share this one-time code securely with <strong className="text-white">{modalOTP.name}</strong>.</p>
            <div style={{ 
              fontSize: '3.5rem', fontWeight: 900, letterSpacing: '12px', 
              fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.4)', 
              padding: '1.5rem', borderRadius: '16px', color: 'white', 
              marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)',
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}>
              {modalOTP.otp}
            </div>
            <button className="btn btn-primary btn-lg w-full" onClick={() => setModalOTP(null)} style={{ fontSize: '1.2rem' }}>
              Got it
            </button>
          </div>
        </div>
      )}

      <h3 className="heading-3 mb-lg flex items-center gap-sm">
        <Shield size={24} color="var(--accent-primary)" />
        Witness Attestation
      </h3>
      <p className="text-secondary mb-xl text-sm">
        Recordings must be verified by registered community members or officials present to unlock cloud synchronization.
      </p>

      <div className="flex flex-col gap-md">
        {witnesses.map((w, i) => (
          <div key={i} className={`glass-card ${shakeIndex === i ? 'shake-animation' : ''}`} style={{
            padding: '1.5rem',
            border: `1px solid ${w.verified ? 'var(--status-success)44' : 'rgba(255,255,255,0.1)'}`,
            background: w.verified ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-glass)',
            transition: 'all 0.3s ease'
          }}>
            <div className="flex justify-between items-center mb-md">
              <div className="flex items-center gap-md">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: w.verified ? 'var(--accent-success)' : 'var(--bg-tertiary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 800, color: w.verified ? 'white' : 'var(--text-primary)',
                  boxShadow: w.verified ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                }}>
                  {w.verified ? <CheckCircle size={20} /> : (i + 1)}
                </div>
                <div>
                  <h4 className="heading-4" style={{ marginBottom: '2px' }}>{w.name || `Witness ${i + 1}`}</h4>
                  <p className="text-muted text-xs">{w.phone || 'Enter mobile number for OTP'}</p>
                </div>
              </div>
            </div>

            {!w.verified && (
              <div className="flex flex-col gap-md">
                {!w.otpSent ? (
                  <div className="flex flex-col sm:flex-row gap-sm">
                    <input 
                      type="text" className="form-input flex-1" placeholder="Full Name" 
                      value={w.name} onChange={e => updateWitness(i, 'name', e.target.value)}
                    />
                    <div className="flex gap-sm flex-2">
                      <input 
                        type="tel" className="form-input flex-1" placeholder="Mobile Number" maxLength={10}
                        value={w.phone} onChange={e => updateWitness(i, 'phone', e.target.value.replace(/\D/g, ''))}
                      />
                      <button onClick={() => handleSendOTP(i)} className="btn btn-primary" disabled={w.phone.length < 10}>
                        Send OTP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-sm">
                    <div className="flex gap-sm items-center">
                      <input 
                        type="text" className="form-input" placeholder="6-digit OTP" maxLength={6}
                        value={w.otp} onChange={e => updateWitness(i, 'otp', e.target.value.replace(/\D/g, ''))}
                        style={{ flex: 1, letterSpacing: '8px', textAlign: 'center', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
                      />
                      <button onClick={() => handleVerifyOTP(i)} className="btn btn-primary" disabled={w.otp.length < 6} style={{ padding: '0 1.5rem' }}>
                        Verify
                      </button>
                      <button 
                        className="btn btn-ghost"
                        disabled={activeResend[i] > 0}
                        onClick={() => handleSendOTP(i)}
                        style={{ padding: '0 1rem', fontSize: '0.85rem' }}
                      >
                        {activeResend[i] > 0 ? <span className="text-muted">Wait {activeResend[i]}s</span> : <span className="flex items-center gap-xs"><RefreshCw size={14} /> Resend</span>}
                      </button>
                    </div>
                    <div className="flex justify-between items-center px-xs">
                      <div className="text-success flex items-center gap-xs" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle size={14} /> OTP Sent ✓ — Valid for 5 minutes
                      </div>
                      {failedAttempts[i] > 0 && (
                        <div className="text-danger flex items-center gap-xs" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          <XCircle size={14} /> Failed: {failedAttempts[i]}/3
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-xl flex flex-col gap-md">
        {allVerified ? (
          <button onClick={onComplete} className="btn btn-success btn-lg hover-scale" style={{ width: '100%', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle size={20} /> Authorize Data Sealing Protocol
          </button>
        ) : (
          <button className="btn btn-secondary btn-lg" disabled style={{ width: '100%', opacity: 0.5 }}>
            Awaiting 3-Point Community Verification
          </button>
        )}
      </div>

      <div className="mt-lg p-md flex gap-md items-start" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <AlertCircle size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
          <strong className="text-white">Trust Matrix:</strong> Witness devices are fingerprinted. High volumes of identical-device attestations will trigger a manual review and possible audit of this coach's records.
        </p>
      </div>
    </div>
  );
}

