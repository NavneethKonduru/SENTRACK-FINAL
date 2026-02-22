import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AthleteForm from '../components/onboarding/AthleteForm';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Onboarding() {
    const { role, onboardingComplete, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (onboardingComplete) {
            navigate('/', { replace: true });
        }
    }, [onboardingComplete, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderForm = () => {
        switch (role) {
            case 'athlete':
                return <AthleteForm />;
            case 'scout':
            case 'coach':
            case 'witness':
                return (
                    <div className="card text-center" style={{ padding: '3rem 1.5rem', marginTop: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '1rem' }}>
                            <ShieldAlert size={32} color="var(--accent-warning)" />
                        </div>
                        <h2 className="heading-3 mb-sm">Coming Soon</h2>
                        <p className="text-secondary mb-lg">
                            Registration forms for {role}s are currently under development. Please check back later or login with a different account.
                        </p>
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Return to Login
                        </button>
                    </div>
                );
            case 'admin':
                return (
                    <div className="card text-center" style={{ padding: '3rem 1.5rem', marginTop: '2rem' }}>
                        <h2 className="heading-3 mb-sm">Admin Access</h2>
                        <p className="text-secondary mb-lg">Admins do not require onboarding.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/', { replace: true })}>
                            Enter Dashboard
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="card text-center" style={{ padding: '3rem 1.5rem', marginTop: '2rem' }}>
                        <h2 className="heading-3 mb-sm">Unknown Role</h2>
                        <p className="text-secondary mb-lg">We couldn't determine your role. Please try logging in again.</p>
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Return to Login
                        </button>
                    </div>
                );
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div className="animate-fade-in">
                <h1 className="heading-2 text-center mb-xs">Complete Your Profile</h1>
                <p className="text-secondary text-center text-sm mb-xl">
                    We need a few details to finalize your {role} account.
                </p>

                {renderForm()}
            </div>
        </div>
    );
}
