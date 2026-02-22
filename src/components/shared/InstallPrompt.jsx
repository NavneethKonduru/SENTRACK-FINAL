import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { t } from '../../utils/translations';
import { useLanguage } from './LanguageToggle';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const hasDismissed = localStorage.getItem('sentrak_dismiss_install');
    
    if (!isStandalone && !hasDismissed) {
      // Small delay before showing prompt
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed', bottom: '85px', left: '16px', right: '16px',
      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
      color: 'white', padding: '12px 16px', borderRadius: '12px',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 30px rgba(99,102,241,0.4)', zIndex: 90
    }}>
      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
        <Download size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
          {language === 'ta' ? 'SENTRAK செயலியை நிறுவவும்' : 'Install SENTRAK App'}
        </h4>
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', opacity: 0.9 }}>
          {language === 'ta' ? 'ஆஃப்லைனில் வேலை செய்ய முகப்புத்திரையில் சேர்க்கவும்' : 'Add to home screen for offline access'}
        </p>
      </div>
      <button 
        onClick={() => {
          setShow(false);
          localStorage.setItem('sentrak_dismiss_install', 'true');
        }}
        style={{ background: 'none', border: 'none', color: 'white', padding: '4px', cursor: 'pointer' }}
      >
        <X size={20} />
      </button>
    </div>
  );
}
