import { useState } from 'react';
import { SPORT_METRICS } from '../../utils/sportMetrics';
import { createAssessment } from '../../utils/dataShapes';
import TimerWidget from './TimerWidget';

/**
 * MetricsRecorder — Dynamic form for sport-specific metrics
 * Props: { sport, athleteId, onComplete(results[]) }
 */
export default function MetricsRecorder({ sport, athleteId, onComplete }) {
    const [values, setValues] = useState({});
    const [completedKeys, setCompletedKeys] = useState([]);

    const metrics = SPORT_METRICS[sport] || [];

    const handleTimerStop = (key, timeMs) => {
        const seconds = (timeMs / 1000).toFixed(2);
        setValues(prev => ({ ...prev, [key]: seconds }));
        setCompletedKeys(prev => prev.includes(key) ? prev : [...prev, key]);
    };

    const handleManualChange = (key, val) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    const handleCountIncrement = (key, delta) => {
        setValues(prev => {
            const cur = parseInt(prev[key] || 0);
            const newVal = Math.max(0, cur + delta);
            return { ...prev, [key]: String(newVal) };
        });
    };

    const handleRatingSelect = (key, rating) => {
        setValues(prev => ({ ...prev, [key]: String(rating) }));
        setCompletedKeys(prev => prev.includes(key) ? prev : [...prev, key]);
    };

    const handleSaveAll = () => {
        const results = metrics
            .filter(m => values[m.key])
            .map(m => createAssessment({
                athleteId,
                sport,
                testType: m.key,
                testCategory: 'sport_specific',
                value: parseFloat(values[m.key]),
                unit: m.unit,
            }));
        onComplete(results);
    };

    const filledCount = metrics.filter(m => values[m.key]).length;
    const progressPercent = metrics.length > 0 ? (filledCount / metrics.length) * 100 : 0;

    return (
        <div className="animate-fade-in">
            {/* Progress */}
            <div className="flex justify-between items-center mb-sm">
                <span className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {sport.replace('_', ' ')} Metrics
                </span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {filledCount}/{metrics.length} recorded
                </span>
            </div>
            <div style={{
                height: '6px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: 'var(--space-lg)',
            }}>
                <div style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: 'var(--gradient-hero)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                }} />
            </div>

            {/* Metric Cards */}
            <div className="flex flex-col gap-md">
                {metrics.map((metric, index) => (
                    <div
                        key={metric.key}
                        className={`glass-card-static animate-fade-in stagger-${Math.min(index % 5 + 1, 5)}`}
                        style={{
                            border: values[metric.key]
                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                    >
                        <div className="flex justify-between items-center mb-md">
                            <div>
                                <h4 className="heading-4">{metric.name}</h4>
                                <span className="tamil text-muted" style={{ fontSize: '0.8rem' }}>
                                    {metric.nameTamil}
                                </span>
                            </div>
                            <div className="flex items-center gap-sm">
                                <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                                    {metric.unit}
                                </span>
                                {values[metric.key] && (
                                    <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>✓</span>
                                )}
                            </div>
                        </div>

                        <p className="text-muted mb-md" style={{ fontSize: '0.8rem' }}>
                            {metric.description}
                        </p>

                        {/* Input by type */}
                        {metric.inputType === 'timer' && (
                            <TimerWidget
                                onStop={(ms) => handleTimerStop(metric.key, ms)}
                            />
                        )}

                        {metric.inputType === 'manual' && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder={`Enter ${metric.name} (${metric.unit})`}
                                    value={values[metric.key] || ''}
                                    onChange={e => handleManualChange(metric.key, e.target.value)}
                                    inputMode="decimal"
                                    step="0.01"
                                    style={{ textAlign: 'center', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}
                                />
                            </div>
                        )}

                        {metric.inputType === 'count' && (
                            <div className="flex items-center justify-center gap-lg">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleCountIncrement(metric.key, -1)}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    −
                                </button>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 'clamp(2rem, 6vw, 3rem)',
                                    fontWeight: 800,
                                    color: 'var(--accent-secondary)',
                                    minWidth: '80px',
                                    textAlign: 'center',
                                }}>
                                    {values[metric.key] || '0'}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleCountIncrement(metric.key, 1)}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        )}

                        {metric.inputType === 'rating' && (
                            <div className="flex justify-center gap-sm">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        className={`btn ${parseInt(values[metric.key]) >= star ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handleRatingSelect(metric.key, star)}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '1.3rem',
                                            transition: 'all var(--transition-fast)',
                                        }}
                                    >
                                        {parseInt(values[metric.key]) >= star ? '★' : '☆'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Show recorded value */}
                        {values[metric.key] && metric.inputType !== 'timer' && (
                            <div className="text-center mt-sm animate-fade-in">
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-success)',
                                }}>
                                    Recorded: {values[metric.key]} {metric.unit}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Save All Button */}
            <div className="mt-lg" style={{ position: 'sticky', bottom: '80px', zIndex: 10 }}>
                <button
                    className="btn btn-success btn-lg"
                    onClick={handleSaveAll}
                    disabled={filledCount === 0}
                    style={{
                        width: '100%',
                        boxShadow: filledCount > 0 ? '0 -4px 20px rgba(16, 185, 129, 0.3)' : 'none',
                    }}
                >
                    💾 Save All Metrics ({filledCount}/{metrics.length})
                </button>
            </div>
        </div>
    );
}
