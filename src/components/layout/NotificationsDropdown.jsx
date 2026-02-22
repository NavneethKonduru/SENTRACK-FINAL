import { useState, useRef, useEffect } from 'react';
import { Bell, Award, Trophy, Info, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const dropdownRef = useRef(null);

    // Mock notifications
    const notifications = [
        { id: 1, type: 'match', title: 'Scheme Match', desc: 'You qualify for Khelo India Youth Games. Apply now!', icon: Award, color: 'var(--accent-success)', time: '2h ago' },
        { id: 2, type: 'challenge', title: 'New Challenge', desc: '"Fastest U-16 100m in Chennai" just went live.', icon: Trophy, color: 'var(--accent-gold)', time: '1d ago' },
        { id: 3, type: 'system', title: 'Vault Updated', desc: '3 new attestations received for your last assessment.', icon: Info, color: 'var(--accent-primary)', time: '2d ago' },
    ];

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated) return null;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
                    position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)',
                    transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <Bell size={20} />
                <span style={{
                    position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px',
                    background: 'var(--accent-danger)', borderRadius: '50%', border: '2px solid var(--bg-primary)'
                }} />
            </button>

            {isOpen && (
                <div className="animate-fade-in" style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    width: '320px', background: 'var(--bg-secondary)', borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)', border: '1px solid var(--border-primary)',
                    zIndex: 100, overflow: 'hidden'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 className="heading-4" style={{ margin: 0 }}>Notifications</h4>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={16} />
                        </button>
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.map(n => (
                            <div key={n.id} style={{
                                padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                                    background: `${n.color}20`, color: n.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <n.icon size={18} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</h5>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.time}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>Mark all as read</a>
                    </div>
                </div>
            )}
        </div>
    );
}
