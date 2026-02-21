import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { DEMO_ATHLETES } from '../utils/dataShapes';

export default function AthleteProfile() {
  const { id } = useParams();
  const athlete = DEMO_ATHLETES.find(a => a.id === id);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <User size={28} color="var(--accent-primary)" />
          Athlete Profile
        </h1>
        <p className="page-subtitle">Digital Talent Passport</p>
      </div>
      {athlete ? (
        <div className="glass-card">
          <h2 className="heading-3">{athlete.name}</h2>
          <p className="tamil text-secondary">{athlete.nameTamil}</p>
          <p className="mt-sm">Sport: {athlete.sport} | Age: {athlete.age} | District: {athlete.district}</p>
          <p className="mt-sm">Talent Rating: <strong className="text-accent">{athlete.talentRating}</strong></p>
          <p className="text-muted mt-md" style={{ fontSize: '0.85rem' }}>Full profile built by Rahul — feat/athlete branch</p>
        </div>
      ) : (
        <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
          <p className="text-secondary">Athlete profile loading...</p>
          <p className="text-muted mt-sm" style={{ fontSize: '0.85rem' }}>Built by Rahul — feat/athlete branch</p>
        </div>
      )}
    </div>
  );
}
