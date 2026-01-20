import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import './Reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    if (!token) {
        navigate('/auth/login');
        return;
    }

    fetchReviews();
  }, [token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/reviews', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      // Pagination returns data inside .data
      setReviews(data.data || []); 
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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
          {/* Active */}
          <div className="nav-item active">
            <span className="nav-icon">📝</span> Reviews
          </div>
          <div className="nav-item" onClick={() => navigate('/page/MyLists')}>
            <span className="nav-icon">📋</span> Lists
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </div>
        </nav>
                <div 
          className="user-mini-profile" 
          onClick={() => navigate('/page/Profile')} 
          style={{cursor: 'pointer'}} // <--- Add this
        >
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
                <h1>Recent Reviews 📝</h1>
                <p style={{color: '#888'}}>See what your friends are watching.</p>
            </div>
        </header>

        {loading ? <p>Loading feed...</p> : (
            <div className="reviews-feed">
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to write one!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <img 
                                src={`https://image.tmdb.org/t/p/w200${review.poster_path}`} 
                                alt={review.movie_title}
                                className="review-poster"
                                onClick={() => navigate(`/movie/${review.movie_id}`)}
                                style={{cursor: 'pointer'}}
                            />
                            <div className="review-content">
                                <div className="review-header">
                                    <div>
                                        <span className="reviewer-name">{review.user.username}</span>
                                        <span className="movie-name">watched <strong>{review.movie_title}</strong></span>
                                    </div>
                                    <div className="star-rating">
                                        {"★".repeat(review.rating)}
                                        <span style={{color:'#444'}}>{"★".repeat(5 - review.rating)}</span>
                                    </div>
                                </div>
                                <div className="review-text">
                                    "{review.content}"
                                </div>
                                <div style={{fontSize:'0.8rem', color:'#666', marginTop:'10px'}}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </main>
    </div>
  );
}