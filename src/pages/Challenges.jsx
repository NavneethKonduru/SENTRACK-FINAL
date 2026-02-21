import { Trophy } from 'lucide-react';

export default function Challenges() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Trophy size={28} color="var(--accent-gold)" />
          District Challenges
        </h1>
        <p className="page-subtitle">Compete with athletes in your district</p>
      </div>
      <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
        <p className="text-secondary">Challenges loading...</p>
        <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>Built by Sharvesh — feat/assessment branch</p>
      </div>
    </div>
  );
}
