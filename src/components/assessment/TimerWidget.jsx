import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * TimerWidget — Precision stopwatch component
 * Props: { onStop(timeMs), onLap(lapMs), autoStart? }
 */
export default function TimerWidget({ onStop, onLap, autoStart = false }) {
    const [status, setStatus] = useState('ready'); // ready | running | stopped
    const [displayTime, setDisplayTime] = useState(0);
    const [laps, setLaps] = useState([]);
    const startTimeRef = useRef(0);
    const rafRef = useRef(null);
    const elapsedRef = useRef(0);

    const formatTime = useCallback((ms) => {
        const totalCs = Math.floor(ms / 10);
        const cs = totalCs % 100;
        const totalSecs = Math.floor(ms / 1000);
        const secs = totalSecs % 60;
        const mins = Math.floor(totalSecs / 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    }, []);

    const updateDisplay = useCallback(() => {
        const now = performance.now();
        const elapsed = elapsedRef.current + (now - startTimeRef.current);
        setDisplayTime(elapsed);
        rafRef.current = requestAnimationFrame(updateDisplay);
    }, []);

    const handleStart = useCallback(() => {
        if (status === 'running') return;
        setStatus('running');
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(updateDisplay);
        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate(100);
    }, [status, updateDisplay]);

    const handleStop = useCallback(() => {
        if (status !== 'running') return;
        cancelAnimationFrame(rafRef.current);
        const now = performance.now();
        const finalTime = elapsedRef.current + (now - startTimeRef.current);
        elapsedRef.current = finalTime;
        setDisplayTime(finalTime);
        setStatus('stopped');
        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (onStop) onStop(finalTime);
    }, [status, onStop]);

    const handleReset = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setStatus('ready');
        setDisplayTime(0);
        setLaps([]);
        elapsedRef.current = 0;
        startTimeRef.current = 0;
    }, []);

    const handleLap = useCallback(() => {
        if (status !== 'running') return;
        const now = performance.now();
        const currentTime = elapsedRef.current + (now - startTimeRef.current);
        const lapTime = laps.length > 0
            ? currentTime - laps.reduce((sum, l) => sum + l, 0)
            : currentTime;
        setLaps(prev => [...prev, lapTime]);
        if (onLap) onLap(lapTime);
        if (navigator.vibrate) navigator.vibrate(50);
    }, [status, laps, onLap]);

    // Auto-start support
    useEffect(() => {
        if (autoStart) handleStart();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const timerColorClass = status === 'running'
        ? 'timer-running'
        : status === 'stopped'
            ? 'timer-stopped'
            : 'timer-ready';

    return (
        <div className="glass-card-static animate-scale-in" style={{ textAlign: 'center' }}>
            {/* Timer Display */}
            <div className={`timer-display ${timerColorClass}`}>
                {formatTime(displayTime)}
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-md" style={{ marginBottom: 'var(--space-lg)' }}>
                {status !== 'running' ? (
                    <button
                        className="btn btn-success"
                        onClick={handleStart}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        {status === 'stopped' ? 'RESUME' : 'START'}
                    </button>
                ) : (
                    <button
                        className="btn btn-danger"
                        onClick={handleStop}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                    >
                        STOP
                    </button>
                )}

                {status === 'running' && (
                    <button
                        className="btn btn-primary"
                        onClick={handleLap}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                        }}
                    >
                        LAP
                    </button>
                )}

                <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                    }}
                >
                    RESET
                </button>
            </div>

            {/* Lap Display */}
            {laps.length > 0 && (
                <div className="animate-fade-in" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <h4 className="heading-4 text-secondary mb-sm" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Lap Times
                    </h4>
                    <div className="flex flex-col gap-xs">
                        {laps.map((lap, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center"
                                style={{
                                    padding: 'var(--space-xs) var(--space-md)',
                                    background: 'var(--bg-glass)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                <span className="text-muted">Lap {i + 1}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                    {formatTime(lap)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
