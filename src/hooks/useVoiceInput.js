/* ========================================
   SENTRAK — useVoiceInput Hook (Phase 2)
   Robust Web Speech API with timeout,
   retry logic, and graceful fallbacks
   Owner: Rahul (feat/athlete)
   ======================================== */

import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const MAX_RETRIES = 3;
const TIMEOUT_MS = 10000; // 10 seconds max listening with no result

/**
 * Custom hook for voice input using Web Speech API
 * Degrades gracefully: if unsupported, all functions are no-ops.
 * @param {Object} options
 * @param {string} options.language - 'ta-IN' for Tamil, 'en-IN' for English
 * @param {boolean} options.continuous - keep listening after result
 * @param {function} options.onResult - callback when final result received
 */
export default function useVoiceInput({
    language = 'ta-IN',
    continuous = false,
    onResult = null,
} = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState(null);
    const [fallbackToText, setFallbackToText] = useState(false);
    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);
    const failCountRef = useRef(0);
    const isSupported = !!SpeechRecognition;

    // Clear timeout helper
    const clearTimeoutSafe = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Cleanup on unmount — ALWAYS stop to prevent zombie sessions
    useEffect(() => {
        return () => {
            clearTimeoutSafe();
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (_) { /* noop */ }
                recognitionRef.current = null;
            }
        };
    }, [clearTimeoutSafe]);

    const startListening = useCallback(() => {
        // If not supported, set fallback and return (no crash)
        if (!SpeechRecognition) {
            setError('Voice input not supported in this browser');
            setFallbackToText(true);
            return;
        }

        // Stop existing instance
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (_) { /* noop */ }
        }
        clearTimeoutSafe();

        setError(null);
        setInterimTranscript('');

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        // Timeout: auto-stop after 10s with no result
        timeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_) { /* noop */ }
            }
            setIsListening(false);
            setError('No speech detected. Please try again or type instead.');
            failCountRef.current += 1;
            if (failCountRef.current >= MAX_RETRIES) {
                setFallbackToText(true);
            }
        }, TIMEOUT_MS);

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            clearTimeoutSafe(); // Got a result, cancel timeout
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
            }

            if (final) {
                const trimmed = final.trim();
                setTranscript(trimmed);
                setInterimTranscript('');
                failCountRef.current = 0; // Reset fail counter on success
                if (onResult) {
                    onResult(trimmed);
                }
            }
        };

        recognition.onerror = (event) => {
            clearTimeoutSafe();
            let errorMsg = 'Speech recognition error';

            switch (event.error) {
                case 'not-allowed':
                case 'service-not-allowed':
                    errorMsg = 'Microphone permission denied. Please allow mic access in Settings.';
                    setFallbackToText(true);
                    break;
                case 'no-speech':
                    errorMsg = 'No speech detected. Tap the mic and speak clearly.';
                    failCountRef.current += 1;
                    break;
                case 'audio-capture':
                    errorMsg = 'No microphone found. Please connect a microphone.';
                    setFallbackToText(true);
                    break;
                case 'network':
                    errorMsg = 'Speech recognition needs internet. Type your answer instead.';
                    setFallbackToText(true);
                    break;
                case 'aborted':
                    // User intentionally stopped — not an error
                    setIsListening(false);
                    return;
                default:
                    errorMsg = `Recognition error: ${event.error}`;
                    failCountRef.current += 1;
            }

            // After 3 consecutive failures, suggest text fallback
            if (failCountRef.current >= MAX_RETRIES) {
                setFallbackToText(true);
            }

            setError(errorMsg);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };

        try {
            recognition.start();
        } catch (err) {
            clearTimeoutSafe();
            setError('Failed to start speech recognition');
            setIsListening(false);
            failCountRef.current += 1;
            if (failCountRef.current >= MAX_RETRIES) {
                setFallbackToText(true);
            }
        }
    }, [language, continuous, onResult, clearTimeoutSafe]);

    const stopListening = useCallback(() => {
        clearTimeoutSafe();
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* noop */ }
        }
        setIsListening(false);
    }, [clearTimeoutSafe]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const resetFallback = useCallback(() => {
        setFallbackToText(false);
        failCountRef.current = 0;
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        error,
        clearError,
        isSupported,
        fallbackToText,
        resetFallback,
    };
}
