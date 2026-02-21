import { useState, useMemo } from 'react';
import { Trophy, Filter } from 'lucide-react';
import { createChallenge, SPORTS, AGE_GROUPS } from '../utils/dataShapes';
import ChallengeCard from '../components/assessment/ChallengeCard';

// ─── Seeded Demo Challenges ───────────────────────
const DEMO_CHALLENGES = [
  createChallenge({
    id: 'ch-1',
    title: 'Fastest U-16 60m Sprint',
    sport: 'Athletics_Track',
    testType: '60m_sprint',
    ageGroup: 'U-16',
    district: 'Dharmapuri',
    startDate: Date.now(),
    endDate: new Date('2026-02-28').getTime(),
    entries: [
      { name: 'Murugan K.', value: 7.8, unit: 's' },
      { name: 'Surya P.', value: 8.1, unit: 's' },
      { name: 'Ravi D.', value: 8.5, unit: 's' },
      { name: 'Karthik V.', value: 8.9, unit: 's' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-2',
    title: 'Longest U-14 Broad Jump',
    sport: 'Athletics_Field',
    testType: 'standing_broad_jump',
    ageGroup: 'U-14',
    district: 'Salem',
    startDate: Date.now(),
    endDate: new Date('2026-02-28').getTime(),
    entries: [
      { name: 'Saranya T.', value: 2.45, unit: 'm' },
      { name: 'Priya M.', value: 2.3, unit: 'm' },
      { name: 'Anitha B.', value: 2.15, unit: 'm' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-3',
    title: 'Best U-18 Bowling Speed',
    sport: 'Cricket',
    testType: 'bowling_speed',
    ageGroup: 'U-18',
    district: 'Madurai',
    startDate: Date.now(),
    endDate: new Date('2026-02-28').getTime(),
    entries: [
      { name: 'Arjun S.', value: 125, unit: 'km/h' },
      { name: 'Ravi D.', value: 118, unit: 'km/h' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-4',
    title: 'Most Push-ups U-16',
    sport: 'Wrestling',
    testType: 'pushups_60s',
    ageGroup: 'U-16',
    district: 'Coimbatore',
    startDate: Date.now(),
    endDate: new Date('2026-02-28').getTime(),
    entries: [
      { name: 'Ravi D.', value: 52, unit: 'count' },
      { name: 'Surya P.', value: 48, unit: 'count' },
      { name: 'Karthik V.', value: 45, unit: 'count' },
      { name: 'Murugan K.', value: 40, unit: 'count' },
      { name: 'Arjun S.', value: 38, unit: 'count' },
    ],
    status: 'active',
  }),
  createChallenge({
    id: 'ch-5',
    title: 'Fastest U-14 Shuttle Run',
    sport: 'Badminton',
    testType: 'shuttle_run_4x10m',
    ageGroup: 'U-14',
    district: 'Thanjavur',
    startDate: Date.now(),
    endDate: new Date('2026-02-28').getTime(),
    entries: [
      { name: 'Priya M.', value: 10.2, unit: 's' },
      { name: 'Divya K.', value: 10.8, unit: 's' },
      { name: 'Saranya T.', value: 11.3, unit: 's' },
    ],
    status: 'active',
  }),
];

// ─── All districts appearing in challenges ────────
const DISTRICTS = ['All', 'Dharmapuri', 'Salem', 'Madurai', 'Coimbatore', 'Thanjavur', 'Tirunelveli'];

export default function Challenges() {
  const [sportFilter, setSportFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  const filtered = useMemo(() => {
    return DEMO_CHALLENGES.filter(ch => {
      if (sportFilter !== 'All' && ch.sport !== sportFilter) return false;
      if (ageFilter !== 'All' && ch.ageGroup !== ageFilter) return false;
      if (districtFilter !== 'All' && ch.district !== districtFilter) return false;
      return true;
    });
  }, [sportFilter, ageFilter, districtFilter]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Trophy size={28} color="var(--accent-gold)" />
          District Challenges
        </h1>
        <p className="page-subtitle">Compete with athletes in your district</p>
      </div>

      {/* Filters */}
      <div className="glass-card-static mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <Filter size={16} color="var(--text-muted)" />
          <span className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Filters
          </span>
        </div>
        <div className="flex gap-md flex-wrap">
          {/* Sport filter */}
          <div className="form-group" style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}>
            <label className="form-label">Sport</label>
            <select
              className="form-select"
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
            >
              <option value="All">All Sports</option>
              {SPORTS.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Age group filter */}
          <div className="form-group" style={{ flex: 1, minWidth: '120px', marginBottom: 0 }}>
            <label className="form-label">Age Group</label>
            <select
              className="form-select"
              value={ageFilter}
              onChange={e => setAgeFilter(e.target.value)}
            >
              <option value="All">All Ages</option>
              {AGE_GROUPS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* District filter */}
          <div className="form-group" style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}>
            <label className="form-label">District</label>
            <select
              className="form-select"
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
            >
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-md">
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
          Showing {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
        </span>
        {(sportFilter !== 'All' || ageFilter !== 'All' || districtFilter !== 'All') && (
          <button
            className="btn btn-ghost"
            onClick={() => { setSportFilter('All'); setAgeFilter('All'); setDistrictFilter('All'); }}
            style={{ fontSize: '0.8rem' }}
          >
            Clear Filters ✕
          </button>
        )}
      </div>

      {/* Challenge Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-2">
          {filtered.map((challenge, index) => (
            <div key={challenge.id} className={`animate-fade-in stagger-${Math.min(index + 1, 5)}`}>
              <ChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card text-center" style={{ padding: 'var(--space-3xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔍</div>
          <h3 className="heading-3 mb-sm">No Challenges Found</h3>
          <p className="text-secondary">
            Try adjusting your filters to see more challenges.
          </p>
        </div>
      )}
    </div>
  );
}
