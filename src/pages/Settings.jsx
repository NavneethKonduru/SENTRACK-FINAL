import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Globe, Bell, Database, Info, LogOut, ChevronRight, Award } from 'lucide-react';

export default function Settings() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('sentrak_language') || 'en');
  const [stats, setStats] = useState({ athletes: 0, assessments: 0 });

  useEffect(() => {
    try {
      const athletes = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      const assessments = JSON.parse(localStorage.getItem('sentrak_assessments') || '[]');
      setStats({ athletes: athletes.length, assessments: assessments.length });
    } catch {}
  }, []);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ta' : 'en';
    setLanguage(next);
    localStorage.setItem('sentrak_language', next);
    window.dispatchEvent(new CustomEvent('sentrak-language-change', { detail: next }));
  };

  const handleExport = () => {
    const data = {
      athletes: JSON.parse(localStorage.getItem('sentrak_athletes') || '[]'),
      assessments: JSON.parse(localStorage.getItem('sentrak_assessments') || '[]'),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentrak-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  const handleClearCache = () => {
    if (confirm('Clear local cache? This removes downloaded data. (Offline items not yet synced to cloud will be lost).')) {
      localStorage.removeItem('sentrak_athletes');
      localStorage.removeItem('sentrak_assessments');
      localStorage.removeItem('sentrak_demo_seeded');
      setStats({ athletes: 0, assessments: 0 });
      alert('Cache cleared successfully. Reloading platform...');
      window.location.reload();
    }
  };

  const ROLE_LABELS = { coach: '🏫 Coach', scout: '🔍 Scout', athlete: '🏃 Athlete', admin: '🛡️ Admin' };

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Settings</h1>

      {/* Profile Section */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: '700', color: '#fff',
          }}>
            {(user?.displayName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
              {user?.displayName || 'User'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              {user?.phoneNumber || '+91 XXXXXXXXXX'}
            </p>
            <span style={{
              display: 'inline-block', marginTop: '0.3rem', padding: '0.15rem 0.6rem',
              borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
              background: 'var(--accent-primary)18', color: 'var(--accent-primary)',
            }}>
              {ROLE_LABELS[role] || '⚙️ No Role'}
            </span>
          </div>
        </div>
        {demoMode && (
          <div style={{
            padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem',
            background: 'var(--status-warning)15', color: 'var(--status-warning)',
            border: '1px solid var(--status-warning)30',
          }}>
            ⚠️ Demo Mode — data is local only
          </div>
        )}
      </div>

      {/* Language */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe size={20} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>மொழி / Language</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                {language === 'en' ? 'English' : 'தமிழ் (Tamil)'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLanguage}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
              background: language === 'ta' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: language === 'ta' ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s',
            }}
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Bell size={20} style={{ color: 'var(--accent-warning)' }} />
          <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Notifications</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontWeight: '500', fontSize: '0.9rem', margin: '0 0 2px' }}>Push Notifications</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>Alerts for new schemes and offers</p>
          </div>
          <label className="ios-switch">
            <input type="checkbox" defaultChecked />
            <span className="ios-slider"></span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: '500', fontSize: '0.9rem', margin: '0 0 2px' }}>Assessment Reminders</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>Weekly prompts to update stats</p>
          </div>
          <label className="ios-switch">
            <input type="checkbox" defaultChecked />
            <span className="ios-slider"></span>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Database size={20} style={{ color: 'var(--accent-secondary)' }} />
          <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Data Management</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem',
        }}>
          <div style={{
            padding: '0.75rem', borderRadius: '10px', background: 'var(--bg-tertiary)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-primary)', margin: 0 }}>
              {stats.athletes}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Athletes</p>
          </div>
          <div style={{
            padding: '0.75rem', borderRadius: '10px', background: 'var(--bg-tertiary)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-secondary)', margin: 0 }}>
              {stats.assessments}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Assessments</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            onClick={handleExport}
            className="btn"
            style={{
              padding: '0.7rem', fontSize: '0.85rem',
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
              borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer',
            }}
          >
            📥 Export JSON
          </button>
          <button
            onClick={handleClearCache}
            className="btn"
            style={{
              padding: '0.7rem', fontSize: '0.85rem',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px', color: 'var(--status-error)', cursor: 'pointer',
            }}
          >
            🗑️ Clear Cache
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'center' }}>
          {navigator.onLine ? '🟢 Online — Live Cloud Syncing' : '🔴 Offline — Priority Local Write'}
        </p>
      </div>

      {/* Business Model */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Award size={20} style={{ color: 'var(--accent-gold)' }} />
          <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>SENTRAK Business Model</p>
        </div>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          <li style={{ marginBottom: '8px' }}><strong>Free for Athletes:</strong> Core mission—no corruption, no bias.</li>
          <li style={{ marginBottom: '8px' }}><strong>Academy Subs:</strong> ₹999/month for bulk athlete management.</li>
          <li style={{ marginBottom: '8px' }}><strong>Scout Licenses:</strong> ₹4,999/month for advanced discovery tools.</li>
          <li style={{ marginBottom: '8px' }}><strong>Official Fees:</strong> ₹199/assessment for verification services.</li>
          <li><strong>B2G SaaS:</strong> Data pipeline for Khelo India / SAI.</li>
        </ul>
      </div>

      {/* About */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Info size={20} style={{ color: 'var(--text-secondary)' }} />
          <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>About</p>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
          <strong>SENTRAK v1.0.0</strong><br />
          Grassroots Talent Discovery Platform<br />
          Team Flexinator — NXTGEN'26
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%', padding: '0.9rem', borderRadius: '12px',
          background: 'transparent', border: '1px solid var(--status-error)',
          color: 'var(--status-error)', cursor: 'pointer',
          fontSize: '0.95rem', fontWeight: '600',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
      >
        <LogOut size={18} /> Logout
      </button>
      <style>{`
        .ios-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .ios-switch input { opacity: 0; width: 0; height: 0; }
        .ios-slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--bg-tertiary); transition: .3s; border-radius: 24px;
          border: 1px solid var(--border-primary);
        }
        .ios-slider:before {
          position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px;
          background-color: var(--text-secondary); transition: .3s; border-radius: 50%;
        }
        .ios-switch input:checked + .ios-slider {
          background-color: var(--accent-primary); border-color: var(--accent-primary);
        }
        .ios-switch input:checked + .ios-slider:before {
          transform: translateX(20px); background-color: #fff;
        }
      `}</style>
    </div>
  );
}
