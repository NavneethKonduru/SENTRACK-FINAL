import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Timer, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { DEMO_ATHLETES, createAssessment } from '../utils/dataShapes';
import { SPORT_ICONS } from '../utils/sportMetrics';
import { generateHash } from '../utils/hashVerify';
import { checkAnomalies } from '../utils/fraudDetection';
import { saveAssessment, addToSyncQueue } from '../utils/offlineDB';
import SportSelector from '../components/assessment/SportSelector';
import SAITestEngine from '../components/assessment/SAITestEngine';
import MetricsRecorder from '../components/assessment/MetricsRecorder';
import AttestationForm from '../components/assessment/AttestationForm';
import VideoClipCapture from '../components/assessment/VideoClipCapture';

const STEPS = [
  { label: 'Athlete', icon: '👤' },
  { label: 'Sport', icon: '🏆' },
  { label: 'Test Type', icon: '📋' },
  { label: 'Assessment', icon: '⏱' },
  { label: 'Verify', icon: '🛡️' },
  { label: 'Hash', icon: '🔐' },
  { label: 'Video', icon: '📹' },
];

export default function RecordAssessment() {
  const { athleteId } = useParams();
  const [step, setStep] = useState(0);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [testMode, setTestMode] = useState(''); // 'sai' | 'sport_specific'
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [attestations, setAttestations] = useState([]);
  const [hash, setHash] = useState('');
  const [anomalyReport, setAnomalyReport] = useState([]);
  const [videoClip, setVideoClip] = useState(null);
  const [done, setDone] = useState(false);

  // Load athletes from localStorage + demo
  const athletes = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sentrak_athletes') || '[]');
      return [...DEMO_ATHLETES, ...stored];
    } catch {
      return [...DEMO_ATHLETES];
    }
  })();

  // Pre-select athlete from URL param
  useEffect(() => {
    if (athleteId) {
      const found = athletes.find(a => a.id === athleteId);
      if (found) {
        setSelectedAthlete(found);
        setStep(1);
      }
    }
  }, [athleteId]);

  // After assessment results, generate hash + check anomalies
  const handleAssessmentComplete = useCallback(async (results) => {
    setAssessmentResults(results);

    // Check anomalies for each result
    const anomalies = results.map(r => ({
      ...r,
      anomaly: checkAnomalies(r, selectedSport),
    })).filter(r => r.anomaly.isAnomaly);
    setAnomalyReport(anomalies);

    setStep(4);
  }, [selectedSport]);

  // After attestation
  const handleAttestationComplete = useCallback(async (atts) => {
    setAttestations(atts);

    // Generate hash for each assessment with attestation data
    const firstResult = assessmentResults[0];
    if (firstResult) {
      const withAtts = {
        ...firstResult,
        attestations: atts.map(a => ({ witnessPhone: a.witnessPhone })),
      };
      const h = await generateHash(withAtts);
      setHash(h);
    }

    setStep(5);
  }, [assessmentResults]);

  // Save everything to localStorage and IndexedDB
  const handleFinalize = useCallback(async () => {
    // Save each assessment
    for (const result of assessmentResults) {
      const fullAssessment = {
        ...result,
        attestations: attestations,
        hash: hash,
        videoClipURL: videoClip || '',
        flags: anomalyReport
          .filter(a => a.id === result.id)
          .flatMap(a => a.anomaly.flags),
      };

      // Save to localStorage
      const stored = JSON.parse(localStorage.getItem('sentrak_assessments') || '[]');
      stored.push(fullAssessment);
      localStorage.setItem('sentrak_assessments', JSON.stringify(stored));

      // Save to IndexedDB
      try {
        await saveAssessment(fullAssessment);
        await addToSyncQueue({ ...fullAssessment, type: 'assessment' });
      } catch (err) {
        console.error('[RecordAssessment] DB save error:', err);
      }
    }

    setDone(true);
  }, [assessmentResults, attestations, hash, videoClip, anomalyReport]);

  // Step navigation
  const renderStepIndicator = () => (
    <div className="flex items-center gap-xs mb-lg" style={{ overflowX: 'auto', paddingBottom: 'var(--space-xs)' }}>
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          <div
            className="flex items-center gap-xs"
            style={{
              padding: '4px 10px',
              background: i === step
                ? 'var(--accent-primary)'
                : i < step
                  ? 'var(--accent-success)'
                  : 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: i <= step ? 'white' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-normal)',
            }}
          >
            <span>{s.icon}</span>
            <span className="hide-mobile">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight size={14} color="var(--text-muted)" style={{ margin: '0 2px', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════
  // DONE STATE
  // ═══════════════════════════════════════════════
  if (done) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title flex items-center gap-sm">
            <CheckCircle size={28} color="var(--accent-success)" />
            Assessment Complete!
          </h1>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)', animation: 'float 2s ease-in-out infinite' }}>
            🎉
          </div>
          <h2 className="heading-2 text-gradient mb-md">
            Assessment Recorded Successfully!
          </h2>
          <p className="text-secondary mb-lg">
            {assessmentResults.length} test(s) recorded for {selectedAthlete?.name}
          </p>

          {/* Summary */}
          <div className="glass-card-static mb-lg" style={{ textAlign: 'left' }}>
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between">
                <span className="text-muted">Athlete</span>
                <span className="heading-4">{selectedAthlete?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Sport</span>
                <span>{SPORT_ICONS[selectedSport]} {selectedSport?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tests Recorded</span>
                <span className="text-success">{assessmentResults.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Witnesses</span>
                <span className="text-success">{attestations.length}/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Hash</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-secondary)', wordBreak: 'break-all' }}>
                  {hash ? hash.slice(0, 16) + '...' : 'N/A'}
                </span>
              </div>
              {attestations.length === 3 && (
                <div className="badge badge-verified" style={{ alignSelf: 'center', marginTop: 'var(--space-sm)' }}>
                  🛡️ Community Verified
                </div>
              )}
            </div>
          </div>

          {/* Anomaly warnings */}
          {anomalyReport.length > 0 && (
            <div className="glass-card-static mb-lg" style={{
              textAlign: 'left',
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}>
              <div className="flex items-center gap-sm mb-sm">
                <AlertTriangle size={16} color="var(--accent-warning)" />
                <span className="heading-4" style={{ color: 'var(--accent-warning)' }}>Anomaly Flags</span>
              </div>
              {anomalyReport.map((a, i) => (
                <div key={i} className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                  • {a.anomaly.flags.join(', ')}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-md">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => window.location.reload()}
              style={{ flex: 1 }}
            >
              ➕ New Assessment
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => window.location.href = `/profile/${selectedAthlete?.id}`}
              style={{ flex: 1 }}
            >
              👤 View Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center gap-sm">
          <Timer size={28} color="var(--accent-secondary)" />
          Record Assessment
        </h1>
        <p className="page-subtitle">SAI-standard 8-test battery + sport-specific metrics</p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* ═══ STEP 0: Select Athlete ═══ */}
      {step === 0 && (
        <div className="animate-fade-in">
          <h3 className="heading-3 mb-md">👤 Select Athlete</h3>
          <div className="grid grid-2">
            {athletes.map(athlete => (
              <button
                key={athlete.id}
                className="glass-card hover-lift"
                onClick={() => { setSelectedAthlete(athlete); setStep(1); }}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: selectedAthlete?.id === athlete.id
                    ? '2px solid var(--accent-primary)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-md">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-hero)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {athlete.name.charAt(0)}
                  </div>
                  <div>
                    <div className="heading-4" style={{ fontSize: '0.95rem' }}>{athlete.name}</div>
                    <div className="tamil text-muted" style={{ fontSize: '0.75rem' }}>{athlete.nameTamil}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {athlete.sport?.replace('_', ' ')} • {athlete.district}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ STEP 1: Select Sport ═══ */}
      {step === 1 && (
        <div className="animate-fade-in">
          <div className="mb-md">
            <span className="badge badge-verified">
              👤 {selectedAthlete?.name}
            </span>
          </div>
          <SportSelector
            selected={selectedSport}
            onSelect={(sport) => { setSelectedSport(sport); setStep(2); }}
          />
        </div>
      )}

      {/* ═══ STEP 2: Choose Test Mode ═══ */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div className="mb-md flex gap-sm flex-wrap">
            <span className="badge badge-verified">👤 {selectedAthlete?.name}</span>
            <span className="badge badge-pending">{SPORT_ICONS[selectedSport]} {selectedSport?.replace('_', ' ')}</span>
          </div>
          <h3 className="heading-3 mb-lg">Choose Assessment Type</h3>
          <div className="grid grid-2">
            <button
              className="glass-card hover-lift"
              onClick={() => { setTestMode('sai'); setStep(3); }}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🏅</div>
              <h3 className="heading-3 mb-sm">SAI Battery</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Standard 8-test fitness battery (30m, 60m, 600m, jumps, shuttle, flexibility, BMI)
              </p>
              <div className="badge badge-verified mt-md">8 Tests</div>
            </button>
            <button
              className="glass-card hover-lift"
              onClick={() => { setTestMode('sport_specific'); setStep(3); }}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>
                {SPORT_ICONS[selectedSport] || '🏅'}
              </div>
              <h3 className="heading-3 mb-sm">Sport-Specific</h3>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Metrics specific to {selectedSport?.replace('_', ' ')} — speed, skill, endurance
              </p>
              <div className="badge badge-pending mt-md">
                {selectedSport?.replace('_', ' ')} Metrics
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Run Assessment ═══ */}
      {step === 3 && (
        <div className="animate-fade-in">
          <div className="mb-md flex gap-sm flex-wrap">
            <span className="badge badge-verified">👤 {selectedAthlete?.name}</span>
            <span className="badge badge-pending">{SPORT_ICONS[selectedSport]} {selectedSport?.replace('_', ' ')}</span>
            <span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(99,102,241,0.3)' }}>
              {testMode === 'sai' ? '🏅 SAI Battery' : '🎯 Sport-Specific'}
            </span>
          </div>

          {testMode === 'sai' ? (
            <SAITestEngine
              athleteId={selectedAthlete?.id}
              onComplete={handleAssessmentComplete}
            />
          ) : (
            <MetricsRecorder
              sport={selectedSport}
              athleteId={selectedAthlete?.id}
              onComplete={handleAssessmentComplete}
            />
          )}
        </div>
      )}

      {/* ═══ STEP 4: Attestation ═══ */}
      {step === 4 && (
        <div className="animate-fade-in">
          <div className="mb-md flex gap-sm flex-wrap">
            <span className="badge badge-verified">✅ {assessmentResults.length} tests recorded</span>
          </div>
          <AttestationForm
            assessmentId={assessmentResults[0]?.id}
            onComplete={handleAttestationComplete}
          />
        </div>
      )}

      {/* ═══ STEP 5: Hash + Results ═══ */}
      {step === 5 && (
        <div className="animate-fade-in">
          <div className="glass-card-static mb-lg" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--space-md)',
              animation: 'float 2s ease-in-out infinite',
            }}>
              🔐
            </div>
            <h3 className="heading-3 mb-sm">Integrity Hash Generated</h3>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-secondary)',
              background: 'var(--bg-tertiary)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              wordBreak: 'break-all',
              marginBottom: 'var(--space-md)',
            }}>
              SHA-256: {hash || 'Generating...'}
            </div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              This hash ensures the assessment data cannot be tampered with.
            </p>
          </div>

          {/* Results summary */}
          <div className="glass-card-static mb-lg">
            <h4 className="heading-4 mb-md">📊 Results Summary</h4>
            <div className="flex flex-col gap-xs">
              {assessmentResults.map((r, i) => (
                <div key={r.id} className="flex justify-between items-center" style={{
                  padding: 'var(--space-xs) var(--space-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{r.testType}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-success)' }}>
                    {r.value} {r.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => setStep(6)} style={{ width: '100%' }}>
            📹 Add Video Evidence (Optional)
          </button>
          <button className="btn btn-ghost mt-sm" onClick={handleFinalize} style={{ width: '100%' }}>
            Skip Video → Finalize
          </button>
        </div>
      )}

      {/* ═══ STEP 6: Video Capture ═══ */}
      {step === 6 && (
        <div className="animate-fade-in">
          <VideoClipCapture
            onCapture={(base64) => {
              setVideoClip(base64);
              handleFinalize();
            }}
            onSkip={handleFinalize}
          />
        </div>
      )}

      {/* Back button */}
      {step > 0 && step < 4 && !done && (
        <div className="mt-lg text-center">
          <button
            className="btn btn-ghost"
            onClick={() => setStep(s => Math.max(0, s - 1))}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
