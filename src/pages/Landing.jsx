import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { UserPlus, Timer, Search, Trophy, Wifi, WifiOff, Globe, ChevronRight, Users, MapPin, BarChart3, Shield } from 'lucide-react';
import LandingHero from '../components/demo/LandingHero';

export default function Landing() {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <LandingHero />

      {/* Feature Cards */}
      <section style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <h2 className="heading-2 text-center mb-xl">How SENTRAK Works</h2>
        <div className="grid grid-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: UserPlus, title: 'Register Athlete', desc: 'Voice-first Tamil registration. Speak name, age, sport — zero typing needed.', link: '/login', color: 'var(--accent-primary)' },
            { icon: Timer, title: 'Record Assessment', desc: 'SAI-standard 8-test battery + sport-specific metrics with built-in timer.', link: '/login', color: 'var(--accent-secondary)' },
            { icon: Shield, title: 'Community Verify', desc: '3 witnesses attest with OTP. Social proof + SHA-256 tamper-proof hashing.', link: '/login', color: 'var(--accent-success)' },
            { icon: Search, title: 'Scout Discovery', desc: 'Search athletes by sport, age, district. Filter by talent rating and mental score.', link: '/login', color: 'var(--accent-warning)' },
            { icon: MapPin, title: 'Talent Heat Map', desc: 'Interactive Tamil Nadu map shows talent density. Click any district to discover.', link: '/login', color: 'var(--accent-danger)' },
            { icon: Trophy, title: 'District Challenges', desc: '"Fastest U-16 in your district" — drives organic data collection and engagement.', link: '/login', color: 'var(--accent-gold)' },
          ].map((feature, i) => (
            <Link to={feature.link} key={i} className="glass-card hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${feature.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <feature.icon size={24} color={feature.color} />
              </div>
              <h3 className="heading-4" style={{ marginBottom: 'var(--space-xs)' }}>{feature.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="glass-card-static" style={{ margin: 'var(--space-xl) var(--space-md)', padding: 'var(--space-2xl) var(--space-lg)' }}>
        <div className="grid grid-4" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <StatCounter end={2847} label="Athletes Discovered" />
          <StatCounter end={23} label="Districts Active" suffix="/38" />
          <StatCounter end={12430} label="Assessments Recorded" />
          <StatCounter end={1247} label="Schemes Matched" />
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-md)' }}>
        <h2 className="heading-2 mb-md">Ready to discover India's next champion?</h2>
        <p className="text-secondary mb-lg" style={{ maxWidth: '500px', margin: '0 auto var(--space-lg)' }}>
          Works offline. Works on 2G. Works for everyone.
        </p>
        <div className="flex justify-center gap-md" style={{ flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary btn-lg">Login / Get Started</Link>
        </div>
      </section>
    </div>
  );
}

function StatCounter({ end, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <div ref={ref} className="stat-card">
      <div className="stat-number text-gradient">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
