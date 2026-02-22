/* ========================================
   SENTRAK — SchemesMatcher Component (Phase 2)
   Matching schemes with qualification badges,
   total potential value, gradient benefit amounts,
   staggered card animations, and CTA for no matches
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState } from 'react';
import { Award, ExternalLink, CheckCircle, Target, IndianRupee, Loader, Shield } from 'lucide-react';
import { matchSchemes } from '../../utils/schemes';
import { t } from '../../utils/translations';

function calculateMatchScore(athlete, scheme) {
    let score = 60; // base score for meeting hard requirements
    const elig = scheme.eligibility;
    const rating = athlete.talentRating || 1000;
    const percentile = Math.max(0, Math.min(100, ((rating - 1000) / 1500) * 100));
    
    if (elig.minPercentile > 0) {
        if (percentile >= elig.minPercentile) {
            score += 15 + ((percentile - elig.minPercentile) / (100 - elig.minPercentile)) * 20;
        }
    } else {
        score += Math.min(30, (rating - 1000) / 40);
    }
    
    // Boost if verified payload
    if (athlete.attestations?.length >= 3 || athlete.syncStatus === 'synced') {
        score += 10;
    }
    
    // Slight randomness for flavor base on scheme id length
    score += (scheme.id.length % 5);
    
    return Math.min(100, Math.max(50, Math.round(score)));
}

// Parse benefit amount string to number for totaling (crude but works for demo)
function parseBenefit(str) {
    if (!str) return 0;
    const cleaned = str.replace(/[₹,/year+\s]/g, '');
    // Handle range like "50,000-5,00,000" — take the max
    const parts = cleaned.split('-');
    const num = parseInt(parts[parts.length - 1].replace(/,/g, ''), 10);
    return isNaN(num) ? 0 : num;
}

function formatRupees(num) {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
}

export default function SchemesMatcher({ athlete, language = 'en' }) {
    const [hasChecked, setHasChecked] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    if (!athlete || !athlete.age) {
        return (
            <div className="glass-card-static text-center animate-fade-in" style={{ padding: 'var(--space-2xl)' }}>
                <Award size={40} className="text-muted" style={{ marginBottom: 'var(--space-md)' }} />
                <p className="text-secondary">{t('noSchemes', language)}</p>
            </div>
        );
    }

    const handleCheck = () => {
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            setHasChecked(true);
            if (navigator.vibrate) navigator.vibrate(50);
        }, 1200);
    };

    if (!hasChecked) {
        return (
            <div className="glass-card-static text-center animate-fade-in" style={{ padding: 'var(--space-2xl)', borderTop: '3px solid var(--accent-primary)' }}>
                <Award size={42} className="text-accent" style={{ marginBottom: 'var(--space-md)' }} />
                <h3 className="heading-3 mb-sm">Government Sport Schemes</h3>
                <p className="text-secondary mb-lg" style={{ fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto 24px' }}>
                    Click to analyze your verified profile data against state and national sports scholarships.
                </p>
                <button 
                    className="btn btn-primary" 
                    onClick={handleCheck} 
                    disabled={isChecking}
                    style={{ minWidth: '200px', gap: '8px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isChecking ? (
                        <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                    ) : (
                        <><Shield size={18} /> Check Eligibility</>
                    )}
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const rawMatched = matchSchemes(athlete);
    const matched = rawMatched.map(s => ({ ...s, matchScore: calculateMatchScore(athlete, s) }))
                             .sort((a, b) => b.matchScore - a.matchScore);

    const totalPotential = matched.reduce((sum, s) => sum + parseBenefit(s.benefitAmount), 0);

    return (
        <div className="animate-fade-in">
            {/* Header with match count */}
            <div className="flex items-center gap-sm mb-md">
                <Award size={24} className="text-accent" />
                <h3 className="heading-3">{t('schemesTitle', language)}</h3>
                <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>
                    {matched.length} {language === 'ta' ? 'திட்டங்கள்' : 'schemes'}
                </span>
            </div>

            {matched.length === 0 ? (
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-2xl)' }}>
                    <Target size={40} className="text-muted" style={{ marginBottom: 'var(--space-md)' }} />
                    <p className="text-secondary mb-md">{t('noSchemes', language)}</p>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {language === 'ta'
                            ? 'மேலும் மதிப்பீடுகளை முடிக்கவும் மற்றும் உங்கள் திறமை மதிப்பீட்டை உயர்த்தவும்'
                            : 'Complete more assessments and improve your talent rating to qualify'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Total potential value banner */}
                    {totalPotential > 0 && (
                        <div className="glass-card-static mb-md animate-fade-in" style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
                            textAlign: 'center',
                            padding: 'var(--space-md)',
                        }}>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {t('totalPotentialValue', language)}
                            </span>
                            <p style={{
                                fontSize: '1.75rem', fontWeight: 900,
                                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {formatRupees(totalPotential)}+
                            </p>
                        </div>
                    )}

                    {/* Scheme cards */}
                    <div className="flex-col gap-md" style={{ display: 'flex' }}>
                        {matched.map((scheme, i) => (
                            <div
                                key={scheme.id}
                                className="glass-card scheme-card-appear"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="flex justify-between items-start mb-sm">
                                    <div style={{ flex: 1, paddingRight: '12px' }}>
                                        <h4 className="heading-4" style={{ marginBottom: '2px' }}>{scheme.name}</h4>
                                        <p className="tamil text-secondary" style={{ fontSize: '0.75rem' }}>
                                            {scheme.nameTamil}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: scheme.matchScore >= 80 ? '#10b981' : scheme.matchScore >= 65 ? '#f59e0b' : '#3b82f6', lineHeight: 1 }}>
                                            {scheme.matchScore}%
                                        </div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Match
                                        </div>
                                    </div>
                                </div>

                                {/* Match Progress Bar */}
                                <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${scheme.matchScore}%`, height: '100%', 
                                        background: scheme.matchScore >= 80 ? '#10b981' : scheme.matchScore >= 65 ? '#f59e0b' : '#3b82f6', 
                                        borderRadius: '2px', transition: 'width 1s cubic-bezier(.4,0,.2,1)',
                                        animation: 'growRight 1s ease-out'
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.65rem', color: scheme.deadline ? 'var(--accent-warning)' : 'var(--text-muted)', marginBottom: '8px' }}>
                                    Deadline: {scheme.deadline || 'Rolling'}
                                </div>

                                <p className="text-secondary mb-md" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    {scheme.description}
                                </p>

                                {/* Benefit summary */}
                                <p className="text-muted mb-sm" style={{ fontSize: '0.8rem' }}>
                                    {scheme.benefit}
                                </p>

                                <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block' }}>
                                            {t('benefit', language)}
                                        </span>
                                        <span style={{
                                            fontWeight: 800, fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}>
                                            {scheme.benefitAmount}
                                        </span>
                                    </div>
                                    <a
                                        href={scheme.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-ghost"
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        {t('applyNow', language)} <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <style>{`
                .scheme-card-appear {
                    animation: schemeSlideUp 0.4s ease-out backwards;
                }
                @keyframes schemeSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes growRight {
                    from { width: 0; }
                }
            `}</style>
        </div>
    );
}
