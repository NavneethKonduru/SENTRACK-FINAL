/* ========================================
   SENTRAK — LanguageToggle Component (Phase 2)
   Sliding pill toggle with persistence,
   globe icon, and haptic feedback
   Owner: Rahul (feat/athlete)
   ======================================== */

import { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const STORAGE_KEY = 'sentrak_language';

const LanguageContext = createContext({ language: 'ta', setLanguage: () => { } });

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'ta'; // Tamil-first default
        } catch {
            return 'ta';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch { /* noop */ }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggle = () => {
        const next = language === 'en' ? 'ta' : 'en';
        setLanguage(next);
        if (navigator.vibrate) navigator.vibrate(30);
    };

    return (
        <>
            <button
                type="button"
                className="lang-toggle"
                onClick={toggle}
                aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
            >
                <Globe size={14} className="lang-toggle-icon" />
                <span className="lang-toggle-track">
                    <span className={`lang-toggle-option ${language === 'ta' ? 'active' : ''}`}>
                        தமிழ்
                    </span>
                    <span className={`lang-toggle-option ${language === 'en' ? 'active' : ''}`}>
                        EN
                    </span>
                    <span
                        className="lang-toggle-indicator"
                        style={{ transform: language === 'en' ? 'translateX(100%)' : 'translateX(0)' }}
                    />
                </span>
            </button>

            <style>{`
                .lang-toggle {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--bg-glass, rgba(255,255,255,0.05));
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px;
                    padding: 4px 6px 4px 10px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: all 0.2s ease;
                    min-width: 110px;
                }
                .lang-toggle:hover {
                    border-color: rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.08);
                }
                .lang-toggle-icon {
                    flex-shrink: 0;
                    opacity: 0.7;
                }
                .lang-toggle-track {
                    position: relative;
                    display: flex;
                    flex: 1;
                    border-radius: 999px;
                    overflow: hidden;
                }
                .lang-toggle-option {
                    flex: 1;
                    text-align: center;
                    padding: 4px 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                    transition: color 0.3s ease;
                    white-space: nowrap;
                }
                .lang-toggle-option.active {
                    color: var(--text-primary, #fff);
                }
                .lang-toggle-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    background: var(--accent-primary, #6366f1);
                    border-radius: 999px;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.3;
                }
            `}</style>
        </>
    );
}
