import { useRef } from 'react';
import { Shield, Award, CheckCircle, Key, Download } from 'lucide-react';
import { getRatingTier } from '../../utils/dataShapes';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

export default function SenPassCard({ athlete, assessment }) {
    const cardRef = useRef(null);

    if (!athlete || !assessment) return null;

    const tier = getRatingTier(athlete.talentRating || 1000);
    const dateStr = new Date(assessment.timestamp).toLocaleDateString();
    const verificationUrl = `${window.location.origin}/verify/${assessment.id}`;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            // Apply a temporary class or style if needed to remove the hover transform during capture
            const originalTransform = cardRef.current.style.transform;
            cardRef.current.style.transform = 'none';

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#141416', // Dark background to prevent transparent edges
                scale: 2,
                useCORS: true,
                logging: false,
            });

            // Restore transform
            cardRef.current.style.transform = originalTransform;

            const link = document.createElement('a');
            link.download = `SenPass-${athlete.name.replace(/\s+/g, '-')}-${assessment.testType}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div 
                ref={cardRef}
                style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(20,20,22,0.9), rgba(30,30,35,0.95))',
                    borderRadius: '16px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-mono)',
                    width: '100%',
                    maxWidth: '400px',
                    transform: 'perspective(1000px) rotateX(2deg)',
                    transition: 'transform 0.3s ease'
                }} 
                className="senpass-hologram"
            >
                
                {/* Holographic overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(125deg, transparent 20%, rgba(255,255,255,0.05) 40%, transparent 60%)',
                    backgroundSize: '200% 200%',
                    animation: 'hologramText 4s linear infinite',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                            SENTRAK // VERIFIED
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '1px' }}>
                            SEN-PASS™
                        </div>
                    </div>
                    <div style={{ background: 'rgba(99,102,241,0.1)', padding: '8px', borderRadius: '50%' }}>
                        <Key size={20} color="var(--accent-primary)" />
                    </div>
                </div>

                {/* Athlete Info */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '8px',
                        background: 'var(--bg-tertiary)', overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        {athlete.photoURL ? (
                            <img src={athlete.photoURL} alt={athlete.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Award size={24} color="var(--text-muted)" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{athlete.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            ID: {athlete.id.split('-')[1]?.toUpperCase() || 'USR-X'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Tier: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tier.name}</span>
                        </div>
                    </div>
                </div>

                {/* Assessment Details */}
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{assessment.testType.replace(/_/g, ' ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Metric</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-success)' }}>
                            {assessment.value} {assessment.unit} <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>({assessment.percentile}th %ile)</span>
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{dateStr}</span>
                    </div>
                </div>

                {/* Verification Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px outset rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <CheckCircle size={12} color="var(--accent-success)" />
                            <span style={{ fontSize: '0.65rem', color: 'var(--accent-success)', letterSpacing: '1px', fontWeight: 700 }}>3/3 ATTESTED</span>
                        </div>
                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', maxWidth: '180px', wordBreak: 'break-all', opacity: 0.7 }}>
                            SHA-256: {assessment.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                        <QRCodeSVG value={verificationUrl} size={40} />
                    </div>
                </div>

                <style>{`
                    .senpass-hologram:hover {
                        transform: perspective(1000px) rotateX(0deg) translateY(-5px) !important;
                        box-shadow: 0 25px 50px rgba(99,102,241,0.2), inset 0 1px 1px rgba(255,255,255,0.2) !important;
                    }
                    @keyframes hologramText {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
            </div>
            
            <button className="btn btn-ghost" onClick={handleDownload} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> Download Certificate
            </button>
        </div>
    );
}
