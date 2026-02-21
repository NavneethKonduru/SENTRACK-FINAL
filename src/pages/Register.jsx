import { UserPlus } from 'lucide-react';

export default function Register() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <UserPlus size={28} color="var(--accent-primary)" />
          Register Athlete
        </h1>
        <p className="page-subtitle">Voice-first registration — speak in Tamil or English</p>
      </div>
      <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
        <p className="text-secondary">Registration form loading...</p>
        <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>Built by Rahul — feat/athlete branch</p>
      </div>
    </div>
  );
}
