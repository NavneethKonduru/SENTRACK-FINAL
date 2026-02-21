/* ========================================
   SENTRAK — VoiceInput Component (Phase 2)
   Voice-first text input with visual feedback,
   sound wave animation, "type instead" fallback
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, AlertCircle } from 'lucide-react';
import useVoiceInput from '../../hooks/useVoiceInput';

export default function VoiceInput({
    value = '',
    onChange,
    placeholder = '',
    label = '',
    language = 'ta-IN',
    className = '',
    speakQuestion = false,
}) {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);
    const flashRef = useRef(null);

    const {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        error,
        clearError,
        isSupported,
        fallbackToText,
    } = useVoiceInput({
        language,
        continuous: false,
        onResult: (text) => {
            setLocalValue(text);
            if (onChange) onChange(text);
            // Haptic feedback on result
            if (navigator.vibrate) navigator.vibrate(50);
            // Green flash on input border
            if (flashRef.current) {
                flashRef.current.classList.add('voice-input-success');
                setTimeout(() => {
                    flashRef.current?.classList.remove('voice-input-success');
                }, 400);
            }
        },
    });

    // Sync external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Speak question aloud before listening (conversational UX)
    const speakAndListen = useCallback(() => {
        if (speakQuestion && label && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(label);
            utter.lang = language.startsWith('ta') ? 'ta-IN' : 'en-IN';
            utter.rate = 0.85;
            utter.onend = () => startListening();
            window.speechSynthesis.speak(utter);
        } else {
            startListening();
        }
    }, [speakQuestion, label, language, startListening]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            speakAndListen();
        }
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        if (onChange) onChange(val);
    };

    const clearField = () => {
        setLocalValue('');
        if (onChange) onChange('');
        inputRef.current?.focus();
    };

    const handleRetry = () => {
        clearError();
        startListening();
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label}</label>}

            {/* Input row */}
            <div className="flex gap-sm items-center">
                <div className="flex-1" style={{ position: 'relative' }} ref={flashRef}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-input"
                        value={localValue}
                        onChange={handleTextChange}
                        placeholder={isListening
                            ? (interimTranscript || '🎤 Listening...')
                            : placeholder
                        }
                        style={{
                            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                    />
                    {localValue && (
                        <button
                            type="button"
                            onClick={clearField}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                            }}
                            aria-label="Clear"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Mic button — only show if supported and not in permanent fallback */}
                {isSupported && !fallbackToText && (
                    <button
                        type="button"
                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleListening}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                    </button>
                )}
            </div>

            {/* Listening state — sound wave + label */}
            {isListening && (
                <div className="flex items-center gap-sm mt-sm animate-fade-in">
                    {/* Sound wave bars */}
                    <div className="voice-wave">
                        <span className="voice-wave-bar" style={{ animationDelay: '0s' }} />
                        <span className="voice-wave-bar" style={{ animationDelay: '0.15s' }} />
                        <span className="voice-wave-bar" style={{ animationDelay: '0.3s' }} />
                        <span className="voice-wave-bar" style={{ animationDelay: '0.45s' }} />
                    </div>
                    <span className="text-accent" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {language.startsWith('ta') ? 'கேட்கிறேன்...' : 'Listening...'}
                    </span>
                </div>
            )}

            {/* Interim transcript preview */}
            {interimTranscript && !isListening && (
                <p className="text-muted mt-xs" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {interimTranscript}
                </p>
            )}

            {/* Error state */}
            {error && (
                <div className="flex items-center gap-sm mt-sm animate-fade-in" style={{
                    padding: '8px 12px',
                    background: 'rgba(239,68,68,0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(239,68,68,0.2)',
                }}>
                    <AlertCircle size={16} color="var(--accent-error, #ef4444)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-error, #ef4444)', flex: 1 }}>
                        {error}
                    </span>
                    <button
                        type="button"
                        onClick={handleRetry}
                        style={{
                            background: 'none',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: 'var(--accent-error, #ef4444)',
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        {language.startsWith('ta') ? 'மீண்டும்' : 'Try Again'}
                    </button>
                </div>
            )}

            {/* Type instead link — always visible under mic (except when listening) */}
            {isSupported && !isListening && !fallbackToText && (
                <button
                    type="button"
                    onClick={focusInput}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        padding: '4px 0',
                        marginTop: '4px',
                    }}
                >
                    {language.startsWith('ta') ? '⌨️ தட்டச்சு செய்' : '⌨️ Type instead'}
                </button>
            )}

            {/* Sound wave + success flash CSS (injected once) */}
            <style>{`
                .voice-wave {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    height: 20px;
                }
                .voice-wave-bar {
                    width: 3px;
                    height: 8px;
                    background: var(--accent-primary);
                    border-radius: 2px;
                    animation: voiceWave 0.6s ease-in-out infinite alternate;
                }
                @keyframes voiceWave {
                    0% { height: 4px; opacity: 0.4; }
                    100% { height: 18px; opacity: 1; }
                }
                .voice-input-success .form-input {
                    border-color: var(--accent-success, #10b981) !important;
                    box-shadow: 0 0 0 2px rgba(16,185,129,0.2) !important;
                }
            `}</style>
        </div>
    );
}
