import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../shared/Toast';
import { Loader2 } from 'lucide-react';

export default function CoachForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    academyName: '',
    district: '',
    primarySports: '',
    certificationLevel: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.academyName || !formData.district || !formData.primarySports || !formData.certificationLevel) {
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

      toast.success('Coach Profile created successfully');
      navigate('/');
    } catch (err) {
      console.error('[CoachForm] Error saving profile:', err);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-scale-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="text-center mb-lg">
        <h2 className="heading-2 text-gradient mb-sm">Coach Registration</h2>
        <p className="text-secondary">Complete your profile to build your academy dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-col gap-md">
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="form-input"
            placeholder="E.g., John Doe"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="academyName">Academy / School / Organization Name</label>
          <input
            id="academyName"
            name="academyName"
            type="text"
            className="form-input"
            placeholder="E.g., Elite Sports Academy"
            value={formData.academyName}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="district">District of Operation</label>
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
              {/* Add more common districts as needed */}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="certificationLevel">Coach Certification Level</label>
            <select
              id="certificationLevel"
              name="certificationLevel"
              className="form-select"
              value={formData.certificationLevel}
              onChange={handleChange}
            >
              <option value="">Select Certification...</option>
              <option value="None">None</option>
              <option value="NIS Diploma">NIS Diploma</option>
              <option value="State Level">State Level</option>
              <option value="National Level">National Level</option>
              <option value="Independent">Independent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="primarySports">Primary Sports Handled</label>
          <input
            id="primarySports"
            name="primarySports"
            type="text"
            className="form-input"
            placeholder="E.g., Athletics, Football (Comma separated)"
            value={formData.primarySports}
            onChange={handleChange}
          />
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
              Saving Profile...
            </>
          ) : (
            'Complete Profile'
          )}
        </button>
      </form>
    </div>
  );
}
