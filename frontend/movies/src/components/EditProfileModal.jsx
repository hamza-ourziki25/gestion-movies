import { useState } from 'react';
import './modal.css';
import './style.css';


export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || '',
    password: '',
    avatar: user.avatar || '',
    banner: user.banner || ''
  });
  
  const [loading, setLoading] = useState(false);
  
  // 1. NEW STATE FOR SUCCESS MESSAGE
  const [successMsg, setSuccessMsg] = useState(''); 

  const defaultAvatar = "linear-gradient(45deg, #222, #444)";
  const defaultBanner = "linear-gradient(to right, #1a1a1a, #2a2a2a)";

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, [fieldName]: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg(''); // Clear previous messages
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8000/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onUpdate(data.user);
        
        // 2. SHOW SUCCESS DIV INSTEAD OF ALERT
        setSuccessMsg("✅ Profile Updated Successfully!");

        // 3. WAIT 1.5 SECONDS, THEN CLOSE
        setTimeout(() => {
            onClose();
        }, 1500);

      } else {
        alert("Error: " + (data.message || "Failed update"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = (imgSrc, defaultBg) => {
    return imgSrc ? { backgroundImage: `url(${imgSrc})` } : { background: defaultBg };
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="modal-header"><h2>Edit Profile</h2></div>

        {/* 4. RENDER SUCCESS MESSAGE IF IT EXISTS */}
        {successMsg && (
            <div className="success-toast">
                {successMsg}
            </div>
        )}

        {/* Hide the form content when success message shows (Optional, looks cleaner) */}
        {!successMsg && (
            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                
                {/* AVATAR */}
                <div className="avatar-upload-container">
                    <label className="avatar-preview-box" style={getBackgroundStyle(formData.avatar, defaultAvatar)}>
                        <input type="file" accept="image/*" className="hidden-input" onChange={(e) => handleImageUpload(e, 'avatar')} />
                        <div className="upload-overlay"><span className="upload-icon">📷</span><span className="upload-text">Change</span></div>
                    </label>
                </div>

                {/* USERNAME */}
                <div>
                    <label style={{color:'#888', fontSize:'0.9rem'}}>Username</label>
                    <input className="create-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>

                {/* BIO */}
                <div>
                    <label style={{color:'#888', fontSize:'0.9rem'}}>About Me (Bio)</label>
                    <textarea 
                        className="create-input" 
                        rows="2"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        style={{
                            resize: 'vertical', 
                            fontFamily: 'inherit',
                            minHeight: '60px',
                            maxHeight: '150px'
                        }}
                    />
                </div>

                {/* BANNER */}
                <div className="banner-upload-container">
                    <label style={{color:'#888', fontSize:'0.9rem', marginBottom:'5px', display:'block'}}>Banner Image</label>
                    <label className="banner-preview-box" style={getBackgroundStyle(formData.banner, defaultBanner)}>
                        <input type="file" accept="image/*" className="hidden-input" onChange={(e) => handleImageUpload(e, 'banner')} />
                        <div className="upload-overlay" style={{ opacity: formData.banner ? undefined : 1 }}>
                            <span className="upload-icon">🖼️</span><span className="upload-text">{formData.banner ? "Change Banner" : "Upload Header"}</span>
                        </div>
                    </label>
                </div>

                {/* PASSWORD */}
                <div>
                    <label style={{color:'#888', fontSize:'0.9rem'}}>New Password (Optional)</label>
                    <input type="password" className="create-input" placeholder="Leave empty to keep current" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <button className="create-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}