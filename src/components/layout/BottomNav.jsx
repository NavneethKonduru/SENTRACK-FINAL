import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Timer, Search, Trophy, Settings, User, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_CONFIGS = {
  coach: [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/register', icon: UserPlus, label: 'Register' },
    { to: '/assess', icon: Timer, label: 'Assess' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
  scout: [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/scout', icon: Search, label: 'Discover' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
  athlete: [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
  // Default (not logged in or no role)
  default: [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/register', icon: UserPlus, label: 'Register' },
    { to: '/assess', icon: Timer, label: 'Assess' },
    { to: '/scout', icon: Search, label: 'Scout' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
  ],
};

export default function BottomNav() {
  const location = useLocation();
  const { role, isAuthenticated } = useAuth();

  // Don't show nav on login/select-role pages
  if (['/login', '/select-role'].includes(location.pathname)) return null;

  const items = NAV_CONFIGS[role] || NAV_CONFIGS.default;

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`bottom-nav-item ${item.to === '/' ? location.pathname === '/' ? 'active' : '' : location.pathname.startsWith(item.to) ? 'active' : ''}`}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
