import { useState } from 'react';
import { createAttestation } from '../../utils/dataShapes';
import { Shield, CheckCircle, Phone, User } from 'lucide-react';

/**
 * AttestationForm — 3 witness verification slots with OTP
 * Props: { assessmentId, onComplete(attestations[]) }
 */
export default function AttestationForm({ assessmentId, onComplete }) {
    const [witnesses, setWitnesses] = useState([
        { name: '', phone: '', otp: '', otpSent: false, verified: false },
        { name: '', phone: '', otp: '', otpSent: false, verified: false },
        { name: '', phone: '', otp: '', otpSent: false, verified: false },
    ]);

    const verifiedCount = witnesses.filter(w => w.verified).length;
    const allVerified = verifiedCount === 3;

    const updateWitness = (index, field, value) => {
        setWitnesses(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSendOTP = (index) => {
        const w = witnesses[index];
        // Validate 10-digit Indian mobile
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(w.phone)) {
            alert('Please enter a valid 10-digit Indian mobile number');
            return;
        }
        if (!w.name.trim()) {
            alert('Please enter the witness name');
            return;
        }
        updateWitness(index, 'otpSent', true);
        // Demo: vibration feedback
        if (navigator.vibrate) navigator.vibrate(100);
    };

    const handleVerifyOTP = (index) => {
        const w = witnesses[index];
        // Demo: accept any 6-digit OTP
        if (w.otp.length === 6 && /^\d{6}$/.test(w.otp)) {
            updateWitness(index, 'verified', true);
            if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
        } else {
            alert('Enter a valid 6-digit OTP');
        }
    };

    const handleComplete = () => {
        const attestations = witnesses
            .filter(w => w.verified)
            .map(w => createAttestation({
                assessmentId,
                witnessName: w.name,
                witnessPhone: w.phone,
                otpVerified: true,
            }));
        onComplete(attestations);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-md mb-lg">
                <Shield size={24} color="var(--accent-secondary)" />
                <div>
                    <h3 className="heading-4">Community Attestation</h3>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        3 witnesses needed for verification
                    </p>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center gap-md mb-lg">
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex flex-col items-center gap-xs">
                        <div
                            className={`animate-scale-in ${witnesses[i].verified ? 'animate-glow' : ''}`}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-full)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                background: witnesses[i].verified
                                    ? 'var(--accent-success)'
                                    : 'var(--bg-tertiary)',
                                color: witnesses[i].verified
                                    ? 'white'
                                    : 'var(--text-muted)',
                                border: witnesses[i].verified
                                    ? '2px solid var(--accent-success)'
                                    : '2px solid rgba(255,255,255,0.1)',
                                transition: 'all var(--transition-normal)',
                            }}
                        >
                            {witnesses[i].verified ? '✓' : i + 1}
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                            Witness {i + 1}
                        </span>
                    </div>
                ))}
            </div>

            {/* Status badge */}
            <div className="text-center mb-lg">
                {allVerified ? (
                    <div className="badge badge-verified animate-scale-in" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                        <CheckCircle size={16} /> Community Verified ✓
                    </div>
                ) : (
                    <span className="badge badge-pending">
                        {verifiedCount}/3 Verified
                    </span>
                )}
            </div>

            {/* Witness slots */}
            <div className="flex flex-col gap-md">
                {witnesses.map((w, i) => (
                    <div
                        key={i}
                        className="glass-card-static animate-fade-in"
                        style={{
                            border: w.verified
                                ? '1px solid rgba(16, 185, 129, 0.4)'
                                : '1px solid rgba(255, 255, 255, 0.08)',
                            background: w.verified
                                ? 'rgba(16, 185, 129, 0.05)'
                                : 'var(--bg-card)',
                            animationDelay: `${i * 0.1}s`,
                        }}
                    >
                        <div className="flex items-center gap-sm mb-md">
                            <User size={16} color={w.verified ? 'var(--accent-success)' : 'var(--text-muted)'} />
                            <span className="heading-4" style={{ fontSize: '0.9rem' }}>
                                Witness {i + 1}
                            </span>
                            {w.verified && (
                                <span className="badge badge-verified" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>
                                    VERIFIED ✓
                                </span>
                            )}
                        </div>

                        {!w.verified ? (
                            <>
                                <div className="form-group">
                                    <label className="form-label">
                                        <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Witness name"
                                        value={w.name}
                                        onChange={e => updateWitness(i, 'name', e.target.value)}
                                        disabled={w.otpSent}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        Phone (10 digits)
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="9876543210"
                                        value={w.phone}
                                        onChange={e => updateWitness(i, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        inputMode="numeric"
                                        maxLength={10}
                                        disabled={w.otpSent}
                                    />
                                </div>

                                {!w.otpSent ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSendOTP(i)}
                                        disabled={!w.name.trim() || w.phone.length !== 10}
                                        style={{ width: '100%' }}
                                    >
                                        📲 Send OTP
                                    </button>
                                ) : (
                                    <div className="animate-fade-in">
                                        <div className="form-group">
                                            <label className="form-label">Enter 6-digit OTP</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="• • • • • •"
                                                value={w.otp}
                                                onChange={e => updateWitness(i, 'otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                inputMode="numeric"
                                                maxLength={6}
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: '1.5rem',
                                                    fontFamily: 'var(--font-mono)',
                                                    letterSpacing: '0.3em',
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleVerifyOTP(i)}
                                            disabled={w.otp.length !== 6}
                                            style={{ width: '100%' }}
                                        >
                                            ✓ Verify OTP
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center animate-scale-in" style={{ padding: 'var(--space-md) 0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>✅</div>
                                <p style={{ fontWeight: 600, color: 'var(--accent-success)' }}>{w.name}</p>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    {w.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Complete Button */}
            {allVerified && (
                <div className="mt-lg animate-slide-up">
                    <button
                        className="btn btn-success btn-lg"
                        onClick={handleComplete}
                        style={{
                            width: '100%',
                            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        <CheckCircle size={20} />
                        Complete Attestation — All 3 Verified ✓
                    </button>
                </div>
            )}

            {/* Skip option */}
            {!allVerified && (
                <div className="text-center mt-lg">
                    <button
                        className="btn btn-ghost"
                        onClick={() => onComplete(witnesses.filter(w => w.verified).map(w => createAttestation({
                            assessmentId,
                            witnessName: w.name,
                            witnessPhone: w.phone,
                            otpVerified: true,
                        })))}
                    >
                        Skip — Continue with {verifiedCount}/3 witnesses
                    </button>
                </div>
            )}
        </div>
    );
}
