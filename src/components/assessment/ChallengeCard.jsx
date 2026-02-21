import { Link } from 'react-router-dom';
import { Clock, Users, Trophy, MapPin } from 'lucide-react';
import { SPORT_ICONS } from '../../utils/sportMetrics';

/**
 * ChallengeCard — Display card for a district challenge
 * Props: { challenge }
 */
export default function ChallengeCard({ challenge }) {
    const {
        title,
        sport,
        ageGroup,
        district,
        endDate,
        entries = [],
        testType,
    } = challenge;

    // Calculate days remaining
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const isUrgent = daysRemaining <= 3;

    // Top 3 leaders (from entries)
    const topEntries = entries
        .sort((a, b) => {
            // Lower time is better for timer events, higher is better for others
            if (['sprint', 'run', 'shuttle'].some(k => testType?.includes(k))) {
                return a.value - b.value;
            }
            return b.value - a.value;
        })
        .slice(0, 3);

    return (
        <div className="glass-card hover-lift animate-fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Gradient accent top bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'var(--gradient-hero)',
            }} />

            {/* Header */}
            <div className="flex items-center gap-md mb-md" style={{ paddingTop: 'var(--space-xs)' }}>
                <div style={{
                    fontSize: '2rem',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    {SPORT_ICONS[sport] || '🏅'}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 className="heading-4" style={{ fontSize: '1rem', lineHeight: 1.3 }}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-xs mt-xs">
                        <MapPin size={12} color="var(--text-muted)" />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {district}
                        </span>
                    </div>
                </div>
            </div>

            {/* Badges row */}
            <div className="flex gap-sm flex-wrap mb-md">
                <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                    {ageGroup}
                </span>
                <span className="badge" style={{
                    fontSize: '0.65rem',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                }}>
                    {sport?.replace('_', ' ')}
                </span>
                {/* Timer badge */}
                <span className={`badge ${isUrgent ? 'badge-danger' : 'badge-verified'}`} style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>
                    <Clock size={10} />
                    {daysRemaining}d left
                </span>
            </div>

            {/* Entry count */}
            <div className="flex items-center gap-sm mb-md" style={{ fontSize: '0.85rem' }}>
                <Users size={14} color="var(--accent-secondary)" />
                <span className="text-secondary">
                    {entries.length} athlete{entries.length !== 1 ? 's' : ''} entered
                </span>
            </div>

            {/* Top 3 leaders */}
            {topEntries.length > 0 && (
                <div className="mb-md">
                    <h4 className="text-muted mb-xs" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        🏆 Current Leaders
                    </h4>
                    <div className="flex flex-col gap-xs">
                        {topEntries.map((entry, i) => (
                            <div key={i} className="flex items-center gap-sm" style={{
                                padding: '4px 8px',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                            }}>
                                <span style={{
                                    fontWeight: 700,
                                    color: i === 0 ? 'var(--accent-gold)' : i === 1 ? '#c0c0c0' : '#cd7f32',
                                }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="text-secondary" style={{ flex: 1 }}>{entry.name}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-success)' }}>
                                    {entry.value} {entry.unit}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enter challenge button */}
            <Link to="/assess" className="btn btn-primary" style={{
                width: '100%',
                textDecoration: 'none',
                marginTop: 'var(--space-sm)',
            }}>
                <Trophy size={16} />
                Enter Challenge
            </Link>
        </div>
    );
}
