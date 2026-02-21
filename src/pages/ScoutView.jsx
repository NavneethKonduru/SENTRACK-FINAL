import { Search } from 'lucide-react';

export default function ScoutView() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Search size={28} color="var(--accent-warning)" />
          Scout Command Center
        </h1>
        <p className="page-subtitle">Search, discover, and recruit grassroots talent</p>
      </div>
      <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
        <p className="text-secondary">Scout dashboard loading...</p>
        <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>Built by Uday — feat/scout branch</p>
      </div>
    </div>
  );
}
