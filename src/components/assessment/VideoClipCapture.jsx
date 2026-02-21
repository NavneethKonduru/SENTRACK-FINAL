import { useState, useRef, useCallback, useEffect } from 'react';
import { Video, Circle, Square, Play, X } from 'lucide-react';

/**
 * VideoClipCapture — Camera capture component (15s max)
 * Props: { onCapture(base64String), onSkip() }
 */
export default function VideoClipCapture({ onCapture, onSkip }) {
    const [phase, setPhase] = useState('idle'); // idle | preview | recording | playback
    const [countdown, setCountdown] = useState(15);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const countdownRef = useRef(null);
    const recordedBlobRef = useRef(null);

    // Start camera preview
    const startPreview = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'environment',
                },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setPhase('preview');
        } catch (err) {
            console.error('[VideoClipCapture] Camera error:', err);
            setError('Camera access denied or unavailable. You can skip this step.');
        }
    }, []);

    // Start recording
    const startRecording = useCallback(() => {
        if (!streamRef.current) return;
        chunksRef.current = [];
        setCountdown(15);

        const options = { mimeType: 'video/webm;codecs=vp8' };
        // Fallback if webm not supported
        let recorder;
        try {
            recorder = new MediaRecorder(streamRef.current, options);
        } catch {
            recorder = new MediaRecorder(streamRef.current);
        }

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            recordedBlobRef.current = blob;

            // Show playback
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = URL.createObjectURL(blob);
            }
            setPhase('playback');
        };

        mediaRecorderRef.current = recorder;
        recorder.start(100); // 100ms timeslice
        setPhase('recording');

        // Auto-stop after 15s
        let remaining = 15;
        countdownRef.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(countdownRef.current);
                if (recorder.state === 'recording') {
                    recorder.stop();
                }
            }
        }, 1000);

        if (navigator.vibrate) navigator.vibrate(100);
    }, []);

    // Stop recording manually
    const stopRecording = useCallback(() => {
        clearInterval(countdownRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }, []);

    // Save captured video
    const handleSave = useCallback(async () => {
        if (!recordedBlobRef.current) return;
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                onCapture(base64);
            };
            reader.readAsDataURL(recordedBlobRef.current);
        } catch (err) {
            console.error('[VideoClipCapture] Save error:', err);
        }
    }, [onCapture]);

    // Retake
    const handleRetake = useCallback(() => {
        recordedBlobRef.current = null;
        if (videoRef.current) {
            videoRef.current.src = '';
        }
        startPreview();
    }, [startPreview]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(countdownRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    return (
        <div className="glass-card-static animate-fade-in">
            <div className="flex items-center gap-md mb-md">
                <Video size={20} color="var(--accent-secondary)" />
                <div>
                    <h4 className="heading-4">Video Evidence</h4>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Optional — 15 second clip max
                    </p>
                </div>
            </div>

            {error && (
                <div className="glass-card mb-md" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: 'var(--space-md)',
                }}>
                    <p className="text-danger" style={{ fontSize: '0.85rem' }}>⚠️ {error}</p>
                </div>
            )}

            {/* Video element */}
            {phase !== 'idle' && (
                <div style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-md)',
                    background: '#000',
                    aspectRatio: '4/3',
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={phase !== 'playback'}
                        controls={phase === 'playback'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Recording overlay */}
                    {phase === 'recording' && (
                        <div style={{
                            position: 'absolute',
                            top: 'var(--space-sm)',
                            right: 'var(--space-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-xs)',
                            background: 'rgba(239, 68, 68, 0.8)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            animation: 'pulse 1s ease-in-out infinite',
                        }}>
                            <Circle size={8} fill="white" color="white" />
                            <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                {countdown}s
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-md">
                {phase === 'idle' && (
                    <>
                        <button className="btn btn-primary btn-lg" onClick={startPreview} style={{ flex: 1 }}>
                            📹 Open Camera
                        </button>
                        <button className="btn btn-ghost" onClick={onSkip}>
                            Skip →
                        </button>
                    </>
                )}

                {phase === 'preview' && (
                    <button
                        className="btn btn-danger"
                        onClick={startRecording}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1.5rem',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                        }}
                    >
                        ●
                    </button>
                )}

                {phase === 'recording' && (
                    <button
                        className="btn btn-danger"
                        onClick={stopRecording}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: 'var(--radius-full)',
                            animation: 'pulse 1s ease-in-out infinite',
                        }}
                    >
                        <Square size={24} />
                    </button>
                )}

                {phase === 'playback' && (
                    <>
                        <button className="btn btn-success btn-lg" onClick={handleSave} style={{ flex: 1 }}>
                            ✓ Use This Clip
                        </button>
                        <button className="btn btn-secondary" onClick={handleRetake}>
                            🔄 Retake
                        </button>
                    </>
                )}
            </div>

            {/* Skip at any time */}
            {phase !== 'idle' && (
                <div className="text-center mt-md">
                    <button className="btn btn-ghost" onClick={onSkip} style={{ fontSize: '0.8rem' }}>
                        Skip video capture →
                    </button>
                </div>
            )}
        </div>
    );
}
