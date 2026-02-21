import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

export default function DemoMode() {
  const steps = [
    { time: '0-8s', emoji: '💀', title: 'The Problem', desc: '2.3M undiscovered athletes. Zero scouting infrastructure.', link: '/' },
    { time: '8-16s', emoji: '🗣️', title: 'Voice Registration', desc: 'Speak in Tamil → profile created. Zero typing.', link: '/register' },
    { time: '16-26s', emoji: '🏏', title: 'SAI Assessment', desc: 'Sport-specific recording with built-in timer + hash verification.', link: '/assess' },
    { time: '26-34s', emoji: '🧠', title: 'Mental Profile', desc: 'Voice-asked psych assessment → 5-axis radar chart.', link: '/register' },
    { time: '34-42s', emoji: '👥', title: 'Community Attestation', desc: '3 witnesses + OTP = Community Verified ✓', link: '/assess' },
    { time: '42-50s', emoji: '🎫', title: 'Talent Passport', desc: 'QR-coded profile card. Scan → full verified data.', link: '/profile/demo-1' },
    { time: '50-56s', emoji: '🏛️', title: 'Scheme Match', desc: '"You qualify for Khelo India scholarship (₹5L)!"', link: '/profile/demo-1' },
    { time: '56-64s', emoji: '🗺️', title: 'Scout Discovery', desc: 'Heat map → click district → ranked talent list.', link: '/scout' },
    { time: '64-72s', emoji: '📡', title: 'Offline Proof', desc: 'Works with ZERO internet. Syncs when connected.', link: '/' },
    { time: '72-82s', emoji: '💰', title: 'Revenue Model', desc: '₹47Cr TAM. Real business, not just a project.', link: '/scout' },
    { time: '82-90s', emoji: '🎯', title: 'The Closer', desc: 'Aadhaar = identity. UPI = payments. SENTRAK = athletes.', link: '/' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header text-center">
        <h1 className="page-title">
          <Play size={28} color="var(--accent-primary)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          90-Second Demo Flow
        </h1>
        <p className="page-subtitle">Judge walkthrough — follow each step</p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {steps.map((step, i) => (
          <Link
            to={step.link}
            key={i}
            className="glass-card hover-lift animate-slide-up"
            style={{
              textDecoration: 'none', color: 'inherit',
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              marginBottom: 'var(--space-md)',
              animationDelay: `${i * 0.1}s`, opacity: 0,
            }}
          >
            <div style={{
              minWidth: 60, textAlign: 'center',
              fontSize: '0.75rem', color: 'var(--accent-primary)',
              fontWeight: 700, fontFamily: 'var(--font-mono)',
            }}>
              {step.time}
            </div>
            <div style={{ fontSize: '2rem' }}>{step.emoji}</div>
            <div style={{ flex: 1 }}>
              <h3 className="heading-4">{step.title}</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>{step.desc}</p>
            </div>
            <ArrowRight size={18} color="var(--text-muted)" />
          </Link>
        ))}
      </div>
    </div>
  );
}
