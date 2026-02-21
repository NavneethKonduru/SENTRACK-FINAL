import { Timer } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function RecordAssessment() {
  const { athleteId } = useParams();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Timer size={28} color="var(--accent-secondary)" />
          Record Assessment
        </h1>
        <p className="page-subtitle">SAI-standard 8-test battery + sport-specific metrics</p>
        {athleteId && <p className="text-muted mt-sm">Athlete ID: {athleteId}</p>}
      </div>
      <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
        <p className="text-secondary">Assessment engine loading...</p>
        <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>Built by Sharvesh — feat/assessment branch</p>
      </div>
    </div>
  );
}
