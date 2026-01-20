import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../logup.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token and email from URL
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [formData, setFormData] = useState({
    email: emailParam || '',
    password: '',
    password_confirmation: '',
    token: token
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password Reset Successfully!");
        navigate('/auth/login');
      } else {
        alert("Error: " + (data.message || "Failed"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logup-container">
      <div className="logup-card" style={{height:'auto'}}>
        <div className="logup-header">
          <h1>New Password</h1>
          <p>Create a strong password</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email (Hidden or ReadOnly) */}
          <div className="form-group full-width">
            <label>Email</label>
            <input type="email" className="form-input" value={formData.email} readOnly />
          </div>

          <div className="form-group full-width">
            <label>New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div className="form-group full-width">
            <label>Confirm Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}