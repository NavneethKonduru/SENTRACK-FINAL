import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, ClipboardCheck, Search } from 'lucide-react';

const ROLES = [
  {
    id: 'athlete',
    icon: User,
    emoji: '🏃',
    title: 'Athlete',
    description: 'View your profile, track progress, download your SenPass, and discover government schemes.',
    color: '#00d4aa',
    redirectTo: '/',
  },
  {
    id: 'coach',
    icon: ClipboardCheck,
    emoji: '🏫',
    title: 'Coach / Referee',
    description: 'Register athletes, record SAI assessments, manage your team, and request community attestation.',
    color: '#6c5ce7',
    redirectTo: '/register',
  },
  {
    id: 'scout',
    icon: Search,
    emoji: '🔍',
    title: 'Scout / Government',
    description: 'Discover talent across Tamil Nadu, search athletes, make offers, and view analytics.',
    color: '#fdcb6e',
    redirectTo: '/scout',
  },
];

export default function RoleSelect() {
  const { selectRole, role } = useAuth();
  const navigate = useNavigate();

  // If already has role, redirect
  if (role) {
    const found = ROLES.find(r => r.id === role);
    navigate(found?.redirectTo || '/');
    return null;
  }

  const handleSelect = async (selectedRole) => {
    await selectRole(selectedRole.id);
    navigate(selectedRole.redirectTo);
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Choose Your Role</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          This determines what you can see and do in SENTRAK
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => handleSelect(role)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${role.color}`;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 30px ${role.color}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--border-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: `${role.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', flexShrink: 0,
            }}>
              {role.emoji}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                {role.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                {role.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
