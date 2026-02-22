import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Globe, WifiOff } from 'lucide-react';

export default function LandingHero() {
  const [counter, setCounter] = useState(0);
  const target = 2300000;

  useEffect(() => {
    const duration = 3000;
    const steps = 80;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCounter(target);
        clearInterval(timer);
      } else {
        setCounter(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--space-3xl) var(--space-lg)',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 50%)',
        zIndex: 0,
      }} />

      {/* Floating orbs */}
      <div className="animate-float" style={{
        position: 'absolute', top: '15%', left: '10%',
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
        filter: 'blur(40px)', zIndex: 0,
      }} />
      <div className="animate-float" style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)',
        filter: 'blur(50px)', zIndex: 0, animationDelay: '1.5s',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        {/* Badge */}
        <div className="animate-fade-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 'var(--radius-full)',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: 'var(--space-lg)', fontSize: '0.85rem', color: 'var(--text-accent)',
        }}>
          <Activity size={14} />
          <span>India's First Athlete Discovery Ecosystem</span>
        </div>

        {/* Counter */}
        <div className="animate-slide-up stagger-1" style={{ marginBottom: 'var(--space-md)' }}>
          <span style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}>
            {counter.toLocaleString('en-IN')}+
          </span>
        </div>

        {/* Headline */}
        <h1 className="heading-1 animate-slide-up stagger-2" style={{ marginBottom: 'var(--space-md)' }}>
          Undiscovered Athletes.<br />
          <span style={{ color: 'var(--text-muted)' }}>Zero Scouting Infrastructure.</span>
        </h1>

        {/* Sub-headline */}
        <p className="animate-slide-up stagger-3" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto var(--space-xl)',
          lineHeight: 1.7,
        }}>
          SENTRAK turns any ₹8,000 phone into a certified scouting station.
          Voice-first. Offline-first. Tamil-first.
          <br />
          <strong style={{ color: 'var(--text-primary)' }}>Performance-based discovery regardless of geography.</strong>
        </p>

        {/* CTA Buttons */}
        <div className="animate-slide-up stagger-4 flex justify-center gap-md" style={{ flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary btn-lg animate-glow">
            Access Platform <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-in stagger-5 flex justify-center gap-lg mt-xl" style={{ flexWrap: 'wrap' }}>
          {[
            { icon: '🏏', label: '12 Sports' },
            { icon: '🗣️', label: 'Tamil Voice-First' },
            { icon: '📡', label: 'Works Offline' },
            { icon: '🔐', label: 'Tamper-Proof' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.85rem', color: 'var(--text-secondary)',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
