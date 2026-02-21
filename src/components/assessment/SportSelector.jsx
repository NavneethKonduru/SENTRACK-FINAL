import { useState } from 'react';
import { SPORTS } from '../../utils/dataShapes';
import { SPORT_ICONS } from '../../utils/sportMetrics';

/**
 * SportSelector — grid of 12 sport cards
 * Props: { selected, onSelect }
 */
export default function SportSelector({ selected, onSelect }) {
    return (
        <div className="animate-fade-in">
            <h3 className="heading-4 mb-md" style={{ color: 'var(--text-secondary)' }}>
                🏆 Select Sport
            </h3>
            <div className="grid grid-4">
                {SPORTS.map((sport, index) => (
                    <button
                        key={sport}
                        className={`glass-card hover-lift animate-fade-in stagger-${Math.min(index % 5 + 1, 5)}`}
                        onClick={() => onSelect(sport)}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: 'var(--space-lg) var(--space-md)',
                            border: selected === sport
                                ? '2px solid var(--accent-primary)'
                                : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: selected === sport
                                ? '0 0 20px var(--accent-primary-glow), 0 0 40px rgba(99, 102, 241, 0.1)'
                                : 'none',
                            transform: selected === sport ? 'scale(1.03)' : 'none',
                            transition: 'all var(--transition-normal)',
                            background: selected === sport
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.08))'
                                : 'var(--bg-card)',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                            {SPORT_ICONS[sport] || '🏅'}
                        </div>
                        <div className="heading-4" style={{
                            color: selected === sport ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontSize: '0.9rem',
                        }}>
                            {sport.replace('_', ' ')}
                        </div>
                        {selected === sport && (
                            <div className="badge badge-verified mt-sm animate-scale-in" style={{ fontSize: '0.65rem' }}>
                                ✓ Selected
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
