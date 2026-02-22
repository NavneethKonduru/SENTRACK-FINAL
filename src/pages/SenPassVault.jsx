import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllAthletes, getAllAssessments } from '../utils/demoLoader';
import { getRatingTier } from '../utils/dataShapes';
import SenPassCard from '../components/athlete/SenPassCard';
import { Key, Filter, PlusCircle } from 'lucide-react';

export default function SenPassVault() {
    const { role } = useAuth();
    const navigate = useNavigate();
    const [athletes, setAthletes] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [tierFilter, setTierFilter] = useState('ALL');

    useEffect(() => {
        // In a real app, query by user.id or role
        const allAthletes = getAllAthletes();
        const allAssessments = getAllAssessments();
        
        // Filter to only verified assessments (has 3 attestations)
        const verifiedAssessments = allAssessments.filter(a => a.attestations?.length >= 3);
        
        setAthletes(allAthletes);
        setAssessments(verifiedAssessments);
    }, []);

    const getAthleteForAssessment = (assessment) => {
        return athletes.find(a => a.id === assessment.athleteId);
    };

    const filteredAssessments = assessments.filter(assessment => {
        if (tierFilter === 'ALL') return true;
        const athlete = getAthleteForAssessment(assessment);
        if (!athlete) return false;
        const tier = getRatingTier(athlete.talentRating || 1000);
        return tier.name.toUpperCase().includes(tierFilter);
    });

    return (
        <div className="animate-fade-in" style={{ padding: 'var(--space-md) var(--space-sm)', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 'var(--space-md)' }}>
                    <Key size={32} color="var(--text-primary)" />
                </div>
                <h1 className="heading-1" style={{ marginBottom: 'var(--space-xs)' }}>SenPass Vault</h1>
                <p className="text-secondary mb-lg">Your securely verified athletic records.</p>
                
                {isCoach && (
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/assess')}
                        style={{ display: 'inline-flex', gap: '8px', margin: '0 auto' }}
                    >
                        <PlusCircle size={18} /> Generate New SenPass
                    </button>
                )}
            </div>

            {/* Tier Filter */}
            <div className="flex justify-center gap-sm mb-xl flex-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px', color: 'var(--text-muted)' }}>
                    <Filter size={16} /> Filters:
                </div>
                {['ALL', 'GOLD', 'SILVER', 'BRONZE'].map(tier => (
                    <button 
                        key={tier}
                        className={`btn ${tierFilter === tier ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTierFilter(tier)}
                        style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem' }}
                    >
                        {tier}
                    </button>
                ))}
            </div>

            {filteredAssessments.length === 0 ? (
                <div className="glass-card-static text-center" style={{ padding: 'var(--space-2xl)' }}>
                    <p className="text-muted">No SenPass certificates found for the selected tier.</p>
                </div>
            ) : (
                <div className="grid grid-2" style={{ gap: 'var(--space-2xl)', maxWidth: '1200px', margin: '0 auto', paddingBottom: 'var(--space-2xl)' }}>
                    {filteredAssessments.map(assessment => {
                        const athlete = getAthleteForAssessment(assessment);
                        if (!athlete) return null;
                        return (
                            <div key={assessment.id} style={{ display: 'flex', justifyContent: 'center' }}>
                                <SenPassCard athlete={athlete} assessment={assessment} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
