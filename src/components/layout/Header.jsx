import { Link, useLocation } from 'react-router-dom';
import { Activity, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageToggle from '../shared/LanguageToggle';
import NotificationsDropdown from './NotificationsDropdown';

export default function Header() {
  const location = useLocation();
  const { role, isAuthenticated } = useAuth();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
      ];
    }

    if (role === 'coach') {
      return [
        { to: '/', label: 'Dashboard' },
        { to: '/register', label: 'Register' },
        { to: '/assess', label: 'Assess' },
        { to: '/vault', label: 'Vault' },
      ];
    }

    if (role === 'scout') {
      return [
        { to: '/', label: 'Dashboard' },
        { to: '/scout', label: 'Discover' },
        { to: '/challenges', label: 'Challenges' },
      ];
    }

    if (role === 'witness') {
      return [
        { to: '/', label: 'Dashboard' },
        { to: '/vault', label: 'Verify Athletes' },
      ];
    }

    if (role === 'admin') {
      return [
        { to: '/', label: 'Platform Stats' },
        { to: '/scout', label: 'Master View' },
        { to: '/settings', label: 'System Settings' },
      ];
    }

    // Default athlete view
    return [
      { to: '/', label: 'Dashboard' },
      { to: '/vault', label: 'My Vault' },
      { to: '/challenges', label: 'Challenges' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <Activity size={28} color="var(--accent-primary)" />
        <span className="header-logo-text">
          <span className="text-gradient">SEN</span>TRAK
        </span>
      </Link>

      <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`header-nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {/* Global Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NotificationsDropdown />
          <LanguageToggle />
          {isAuthenticated && (
            <Link to="/settings" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', textDecoration: 'none', marginLeft: '8px',
              border: '2px solid rgba(255,255,255,0.2)', transition: 'all 0.2s',
            }} title="User Profile">
              <User size={18} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
