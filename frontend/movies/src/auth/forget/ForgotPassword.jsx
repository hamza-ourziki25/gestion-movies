import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../logup.css'; // Reusing your existing styles

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("✅ " + data.message);
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
      <div className="logup-card" style={{height: 'auto', padding: '40px'}}>
        <button className="close-btn" onClick={() => navigate('/auth/login')}>✕</button>
        
        <div className="logup-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a link</p>
        </div>

        {message && <div className="success-message" style={{marginBottom:'20px'}}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Link'}
          </button>
        </form>
      </div>
    </div>
  );
}