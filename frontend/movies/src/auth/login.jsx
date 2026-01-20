import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // SAVE TOKEN & USER (Critical Step)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to Dashboard
        navigate('/page/dashboard');
      } else {
        setError(data.message || "Invalid email or password.");
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="close-btn" onClick={() => navigate('/')}>✕</button>

        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          
          {error && (
            <div style={{
              background: 'rgba(255, 46, 99, 0.1)', 
              border: '1px solid #ff2e63', 
              color: '#ff2e63', 
              padding: '10px', 
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-actions">
            <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
              <input type="checkbox" /> Remember me
            </label>
            <button
            onClick={() => navigate('/auth/forgot-password')}
            className="forgot-link">Forgot Password?</button>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>

        </form>

        <div className="login-footer">
          <p>Don't have an account? 
            <button className="link-btn" onClick={() => navigate('/auth/logup')}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}