import { useState, useEffect, useCallback } from 'react';
import { SAI_TESTS } from '../../utils/sportMetrics';
import { createAssessment } from '../../utils/dataShapes';
import TimerWidget from './TimerWidget';

/**
 * SAITestEngine — Guided flow through all 8 SAI battery tests
 * Props: { athleteId, onComplete(results[]) }
 */
export default function SAITestEngine({ athleteId, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState('intro'); // intro | countdown | test | result
    const [countdown, setCountdown] = useState(3);
    const [results, setResults] = useState([]);
    const [currentValue, setCurrentValue] = useState('');
    const [bmiHeight, setBmiHeight] = useState('');
    const [bmiWeight, setBmiWeight] = useState('');

    const test = SAI_TESTS[currentStep];
    const isBMI = test?.key === 'bmi';
    const isTimer = test?.inputType === 'timer';
    const totalTests = SAI_TESTS.length;
    const progressPercent = ((currentStep) / totalTests) * 100;

    // Countdown effect
    useEffect(() => {
        if (phase !== 'countdown') return;
        if (countdown <= 0) {
            setPhase('test');
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [phase, countdown]);

    const handleReady = () => {
        setPhase('countdown');
        setCountdown(3);
    };

    const handleTimerStop = useCallback((timeMs) => {
        const seconds = (timeMs / 1000).toFixed(2);
        setCurrentValue(seconds);
        setPhase('result');
    }, []);

    const handleManualSubmit = () => {
        if (isBMI) {
            const h = parseFloat(bmiHeight) / 100; // cm to m
            const w = parseFloat(bmiWeight);
            if (h > 0 && w > 0) {
                setCurrentValue((w / (h * h)).toFixed(1));
                setPhase('result');
            }
            return;
        }
        if (currentValue) {
            setPhase('result');
        }
    };

    const handleNext = () => {
        // Save result
        const assessment = createAssessment({
            athleteId,
            sport: 'SAI_Battery',
            testType: test.key,
            testCategory: 'sai',
            value: parseFloat(currentValue),
            unit: test.unit,
        });
        const newResults = [...results, assessment];
        setResults(newResults);

        if (currentStep >= totalTests - 1) {
            // All tests done
            onComplete(newResults);
            return;
        }

        // Move to next test
        setCurrentStep(prev => prev + 1);
        setPhase('intro');
        setCurrentValue('');
        setBmiHeight('');
        setBmiWeight('');
    };

    const handleSkip = () => {
        if (currentStep >= totalTests - 1) {
            onComplete(results);
            return;
        }
        setCurrentStep(prev => prev + 1);
        setPhase('intro');
        setCurrentValue('');
        setBmiHeight('');
        setBmiWeight('');
    };

    if (!test) return null;

    return (
        <div className="animate-fade-in">
            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="flex justify-between items-center mb-sm">
                    <span className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Test {currentStep + 1} of {totalTests}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {Math.round(progressPercent)}% complete
                    </span>
                </div>
                <div style={{
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        background: 'var(--gradient-hero)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />
                </div>
            </div>

            {/* Test Card */}
            <div className="glass-card-static">
                {/* Test Header */}
                <div className="flex items-center gap-md mb-lg">
                    <div style={{
                        fontSize: '2.5rem',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        {test.icon}
                    </div>
                    <div>
                        <h3 className="heading-3">{test.name}</h3>
                        <p className="tamil text-muted" style={{ fontSize: '0.85rem' }}>
                            {test.nameTamil}
                        </p>
                    </div>
                </div>

                {/* INTRO PHASE */}
                {phase === 'intro' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{
                            background: 'rgba(99, 102, 241, 0.05)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            marginBottom: 'var(--space-lg)',
                        }}>
                            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                📋 {test.description}
                            </p>
                            <div className="mt-md">
                                <span className="badge badge-pending">Unit: {test.unit}</span>
                                <span className="badge badge-verified" style={{ marginLeft: 'var(--space-sm)' }}>
                                    {test.inputType === 'timer' ? '⏱ Timed' : test.inputType === 'calculated' ? '🧮 Calculated' : '📏 Manual'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-md">
                            <button className="btn btn-primary btn-lg" onClick={handleReady} style={{ flex: 1 }}>
                                Ready? Let's Go! 🚀
                            </button>
                            <button className="btn btn-ghost" onClick={handleSkip}>
                                Skip →
                            </button>
                        </div>
                    </div>
                )}

                {/* COUNTDOWN PHASE */}
                {phase === 'countdown' && (
                    <div className="animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
                        <div style={{
                            fontSize: 'clamp(5rem, 15vw, 8rem)',
                            fontWeight: 900,
                            background: 'var(--gradient-hero)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'pulse 0.8s ease-in-out infinite',
                        }}>
                            {countdown > 0 ? countdown : 'GO!'}
                        </div>
                        <p className="text-secondary mt-md" style={{ fontSize: '1.1rem' }}>
                            {countdown > 0 ? 'Get ready...' : 'Start now!'}
                        </p>
                    </div>
                )}

                {/* TEST PHASE */}
                {phase === 'test' && (
                    <div className="animate-fade-in">
                        {isTimer ? (
                            <TimerWidget onStop={handleTimerStop} />
                        ) : isBMI ? (
                            <div className="flex flex-col gap-md" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label className="form-label">Height (cm)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="e.g. 165"
                                        value={bmiHeight}
                                        onChange={e => setBmiHeight(e.target.value)}
                                        inputMode="decimal"
                                        style={{ textAlign: 'center', fontSize: '1.2rem' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="e.g. 55"
                                        value={bmiWeight}
                                        onChange={e => setBmiWeight(e.target.value)}
                                        inputMode="decimal"
                                        style={{ textAlign: 'center', fontSize: '1.2rem' }}
                                    />
                                </div>
                                {bmiHeight && bmiWeight && (
                                    <div className="text-center animate-fade-in">
                                        <div style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            color: 'var(--accent-secondary)',
                                        }}>
                                            BMI: {(parseFloat(bmiWeight) / ((parseFloat(bmiHeight) / 100) ** 2)).toFixed(1)}
                                        </div>
                                    </div>
                                )}
                                <button className="btn btn-primary btn-lg" onClick={handleManualSubmit}>
                                    Record BMI ✓
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-md" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label className="form-label">{test.name} ({test.unit})</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder={`Enter ${test.unit}`}
                                        value={currentValue}
                                        onChange={e => setCurrentValue(e.target.value)}
                                        inputMode="decimal"
                                        step="0.01"
                                        style={{ textAlign: 'center', fontSize: '1.5rem', fontFamily: 'var(--font-mono)' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleManualSubmit}
                                    disabled={!currentValue}
                                >
                                    Record Value ✓
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* RESULT PHASE */}
                {phase === 'result' && (
                    <div className="animate-scale-in" style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: 'var(--space-sm)',
                            animation: 'float 2s ease-in-out infinite',
                        }}>
                            ✅
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(2rem, 6vw, 3rem)',
                            fontWeight: 800,
                            color: 'var(--accent-success)',
                            marginBottom: 'var(--space-xs)',
                        }}>
                            {currentValue} {test.unit}
                        </div>
                        <p className="text-secondary mb-lg">{test.name} recorded</p>
                        <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ minWidth: '200px' }}>
                            {currentStep >= totalTests - 1 ? '🏁 Finish All Tests' : '➡️ Next Test'}
                        </button>
                    </div>
                )}
            </div>

            {/* Completed Tests Summary */}
            {results.length > 0 && (
                <div className="glass-card-static mt-lg animate-fade-in">
                    <h4 className="heading-4 text-secondary mb-md" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        ✅ Completed ({results.length}/{totalTests})
                    </h4>
                    <div className="flex flex-col gap-xs">
                        {results.map((r, i) => {
                            const t = SAI_TESTS.find(s => s.key === r.testType);
                            return (
                                <div key={r.id} className="flex justify-between items-center" style={{
                                    padding: 'var(--space-xs) var(--space-md)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.85rem',
                                }}>
                                    <span>{t?.icon} {t?.name}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-success)' }}>
                                        {r.value} {r.unit}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
