import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; 
import './mylists.css';   

export default function MyLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (!token) {
        navigate('/auth/login');
        return;
    }

    if (savedUser) setUser(JSON.parse(savedUser));
    fetchLists();
  }, [token]);

  const fetchLists = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/my-lists', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) setLists(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name: newListName })
      });

      if (res.ok) {
        setNewListName("");      
        setShowCreateModal(false); 
        fetchLists();            
      } else {
        alert("Failed to create list");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW DELETE FUNCTION ---
  const handleDeleteList = async (e, listId) => {
    e.preventDefault();  // <--- STOPS THE BROWSER FROM NAVIGATING (The Fix)
    e.stopPropagation(); // Stops the click from opening the list details
    
    if (!window.confirm("Are you sure? This will delete the list and all movies inside it.")) {
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:8000/lists/${listId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            // Remove from UI immediately
            setLists(lists.filter(l => l.id !== listId));
        } else {
            alert("Failed to delete list");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  return (
    <div className="dashboard-container">
      
      <aside className="sidebar">
        <div className="brand">CineVerse</div>
        
        <nav className="nav-links">
          <div className="nav-item" onClick={() => navigate('/page/dashboard')}>
            <span className="nav-icon">🏠</span> Home
          </div>
          <div className="nav-item" onClick={() => navigate('/page/Trending')}>
            <span className="nav-icon">🔥</span> Trending
          </div>
          <div className="nav-item" onClick={() => navigate('/page/Reviews')}>
            <span className="nav-icon">📝</span> Reviews
          </div>
          <div className="nav-item active" onClick={() => navigate('/page/MyLists')}>
            <span className="nav-icon">📋</span> Lists
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </div>
        </nav>

        <div className="user-mini-profile" onClick={() => navigate('/page/Profile')} style={{cursor: 'pointer'}}>
          <div 
            className="avatar"
            style={{
               background: user?.avatar 
                 ? `url(${user.avatar}) center/cover no-repeat` 
                 : 'linear-gradient(45deg, #ff006e, #3a86ff)' // Default Fallback
            }}
          ></div>

          <div className="user-info">
            <h4>{user ? user.username : 'Guest User'}</h4>
            <span style={{color: '#ff006e'}}>View Profile</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header-section">
            <div>
                <h1>Your Lists 📋</h1>
                <p style={{color: '#888'}}>Collections you've curated</p>
            </div>
        </header>

        {loading ? <p>Loading lists...</p> : (
            <div className="lists-grid">
            
            {/* CREATE NEW LIST CARD */}
            <div 
                className="list-card" 
                style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'280px', border:'2px dashed #333'}}
                onClick={() => setShowCreateModal(true)}
            >
                <div style={{textAlign:'center', color:'#555'}}>
                    <span style={{fontSize:'3rem'}}>+</span>
                    <p>Create New List</p>
                </div>
            </div>

            {/* RENDER LISTS */}
            {lists.map(list => (
                <div key={list.id} className="list-card">
                
                {/* --- DELETE BUTTON --- */}
                <button 
      type="button" // <--- CRITICAL: Prevents accidental form submissions
      className="delete-list-btn" 
      onClick={(e) => handleDeleteList(e, list.id)}
      title="Delete List"
  >
      🗑️
  </button>
                <div className="list-preview">
                    {list.items && list.items.length > 0 ? (
                    list.items.slice(0, 4).map((item) => (
                        <img 
                        key={item.id}
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.movie_title}
                        className="preview-poster"
                        />
                    ))
                    ) : (
                    <div className="empty-preview">No movies yet</div>
                    )}
                </div>

                <div className="list-info">
                    <div className="list-name">{list.name}</div>
                    <div className="list-meta">
                    <span>{list.items_count} movies</span>
                    <span>Public</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* POPUP MODAL */}
        {showCreateModal && (
            <div className="create-popup-overlay">
            <div className="create-popup">
                <h3>Create a New List</h3>
                
                <input 
                type="text" 
                className="popup-input"
                placeholder="List Name (e.g. Best Sci-Fi)"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
                />

                <div className="popup-actions">
                <button className="popup-btn btn-cancel" onClick={() => setShowCreateModal(false)}>
                    Cancel
                </button>
                <button className="popup-btn btn-confirm" onClick={handleCreateList}>
                    Create
                </button>
                </div>
            </div>
            </div>
        )}

      </main>
    </div>
  );
}