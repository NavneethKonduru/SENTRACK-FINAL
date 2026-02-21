import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/register', label: 'Register' },
    { to: '/assess', label: 'Assess' },
    { to: '/scout', label: 'Scout' },
    { to: '/challenges', label: 'Challenges' },
  ];

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <Activity size={28} color="var(--accent-primary)" />
        <span className="header-logo-text">
          <span className="text-gradient">SEN</span>TRAK
        </span>
      </Link>

      <nav className="header-nav">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`header-nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
