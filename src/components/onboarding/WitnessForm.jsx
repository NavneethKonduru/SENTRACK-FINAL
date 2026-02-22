import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../shared/Toast';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function WitnessForm() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        officialDesignation: '',
        district: '',
        idDocumentType: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.officialDesignation || !formData.district || !formData.idDocumentType) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            if (!user) throw new Error('No user logged in');

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                profileData: formData,
                onboardingComplete: true,
                updatedAt: Date.now()
            });

            toast.success('Witness Profile verified');
            navigate('/');
        } catch (err) {
            console.error('[WitnessForm] Error saving profile:', err);
            toast.error('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card animate-scale-in" style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="text-center mb-lg">
                <div className="flex justify-center mb-sm">
                    <div style={{
                        background: 'var(--accent-primary-glow)',
                        padding: 16,
                        borderRadius: '50%',
                        display: 'inline-flex'
                    }}>
                        <ShieldCheck size={32} className="text-accent" />
                    </div>
                </div>
                <h2 className="heading-2 text-gradient mb-sm">Witness Registration</h2>
                <p className="text-secondary">Provide your official details to become a verified assessor.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-col gap-md">
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        className="form-input"
                        placeholder="E.g., Jane Smith"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="officialDesignation">Official Designation</label>
                    <input
                        id="officialDesignation"
                        name="officialDesignation"
                        type="text"
                        className="form-input"
                        placeholder="E.g., Panchayat President, School Headmaster"
                        value={formData.officialDesignation}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-2">
                    <div className="form-group">
                        <label className="form-label" htmlFor="district">District</label>
                        <select
                            id="district"
                            name="district"
                            className="form-select"
                            value={formData.district}
                            onChange={handleChange}
                        >
                            <option value="">Select District...</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Coimbatore">Coimbatore</option>
                            <option value="Madurai">Madurai</option>
                            <option value="Trichy">Trichy</option>
                            <option value="Salem">Salem</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="idDocumentType">Official ID Document Type</label>
                        <select
                            id="idDocumentType"
                            name="idDocumentType"
                            className="form-select"
                            value={formData.idDocumentType}
                            onChange={handleChange}
                        >
                            <option value="">Select ID Type...</option>
                            <option value="Aadhar">Aadhar</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Official Employment ID">Official Employment ID</option>
                        </select>
                    </div>
                </div>

                <div className="mt-md" style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start'
                }}>
                    <ShieldCheck size={20} className="text-accent" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p className="text-secondary" style={{ fontSize: '0.85rem', margin: 0 }}>
                        As a witness, you act as the trust layer for the platform, cryptographically signing assessments.
                        No file upload is needed right now; your identity will be verified later.
                    </p>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary mt-md"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Verifying...
                        </>
                    ) : (
                        'Complete Registration'
                    )}
                </button>
            </form>
        </div>
    );
}
