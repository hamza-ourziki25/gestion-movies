import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logup.css';
import { countriesList } from './countries';

export default function Logup() {
  const navigate = useNavigate();
  
  // 1. State for Data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '', 
    password: '',
    age: '',
    country: '',
    city: ''
  });

  // 2. State for UI
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(''); // <--- NEW STATE

  // 3. Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // 4. Validation Logic
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const nameRegex = /^[a-zA-Z\s ]+$/;
    if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = "Name must contain only letters.";
      isValid = false;
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Username must be letters and numbers only.";
      isValid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (!formData.email.includes('@gmail.com')) {
      newErrors.email = "Please enter a valid email (@gmail.com).";
      isValid = false;
    }
    
    if (!formData.age || parseInt(formData.age) < 18) {
      newErrors.age = "You must be 18+ to register.";
      isValid = false;
    }
    
    if (!formData.country) {
      newErrors.country = "Please select your country.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 5. Submit to Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMsg(''); // Clear previous messages

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // --- NEW SUCCESS LOGIC ---
        setSuccessMsg("✅ Registration Successful! Redirecting...");
        
        // Wait 1.5 seconds so user sees the message, then redirect
        setTimeout(() => {
            navigate('/auth/login');
        }, 1500);

      } else {
        alert("Error: " + (data.message || "Registration failed"));
      }

    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="logup-container">
      <div className="logup-card">
        <button className="close-btn" onClick={() => navigate('/')}>✕</button>

        <div className="logup-header">
          <h1>Create Account</h1>
          <p>Join the CineVerse community</p>
        </div>

        {/* SHOW SUCCESS MESSAGE HERE */}
        {successMsg && (
            <div className="success-message">
                {successMsg}
            </div>
        )}

        {/* HIDE FORM IF SUCCESS (Optional cleanliness) */}
        {!successMsg && (
            <form className="logup-form" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-group full-width">
                <label>Full Name</label>
                <input 
                type="text" name="fullName" 
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                placeholder="Letters only"
                value={formData.fullName} onChange={handleChange} required 
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            {/* Username */}
            <div className="form-group">
                <label>Username</label>
                <input 
                type="text" name="username" 
                className={`form-input ${errors.username ? 'input-error' : ''}`}
                placeholder="Letters & numbers"
                value={formData.username} onChange={handleChange} required 
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
                <label>Phone Number</label>
                <input 
                type="text" name="phone" 
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder="10 digits"
                value={formData.phone} onChange={handleChange} required 
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Email */}
            <div className="form-group full-width">
                <label>Email Address</label>
                <input 
                type="email" name="email" className="form-input" 
                placeholder="john@gmail.com"
                value={formData.email} onChange={handleChange} required 
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group full-width">
                <label>Password</label>
                <input 
                type="password" name="password" 
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Min 8 chars"
                value={formData.password} onChange={handleChange} required 
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {/* Location */}
            <div className="form-group">
                <label>Country</label>
                <select 
                name="country" 
                className={`form-input ${errors.country ? 'input-error' : ''}`}
                value={formData.country} onChange={handleChange} required
                >
                <option value="" disabled>Select Country</option>
                {countriesList.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
                </select>
                {errors.country && <span className="error-text">{errors.country}</span>}
            </div>

            <div className="form-group">
                <label>City</label>
                <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} />
            </div>

            {/* Age */}
            <div className="form-group full-width">
                <label>Age</label>
                <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} />
                {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Get Started Now'}
            </button>

            <div className="login-footer">
                <p>Already have an account? 
                <button type="button" className="link-btn" onClick={() => navigate('/auth/login')}>
                    Sign In
                </button>
                </p>
            </div>
            </form>
        )}
      </div>
    </div>
  );
}