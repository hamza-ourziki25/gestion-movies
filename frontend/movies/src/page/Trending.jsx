import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Reuse existing styles

export default function Trending() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Check Auth
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token) {
       navigate('/auth/login');
       return;
    }
    
    if (savedUser) setUser(JSON.parse(savedUser));

    // 2. Fetch Trending Movies
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      // Reusing your existing endpoint that fetches TMDB Trending/Week
      const res = await fetch('http://127.0.0.1:8000/movie'); 
      const data = await res.json();
      setMovies(data.results || data);
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
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">CineVerse</div>
        
        <nav className="nav-links">
          <div className="nav-item" onClick={() => navigate('/page/dashboard')}>
            <span className="nav-icon">🏠</span> Home
          </div>
          
          {/* ACTIVE CLASS IS HERE NOW */}
          <div className="nav-item" onClick={() => navigate('/page/trending')}>
            <span className="nav-icon">🔥</span> Trending
          </div>

          <div className="nav-item" onClick={() => navigate('/page/reviews')}>
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

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header-section">
            <div>
                <h1>Trending Now 🔥</h1>
                <p style={{color: '#888'}}>The most popular movies this week across the world.</p>
            </div>
        </header>

        {loading ? <p>Loading...</p> : (
            <div className="movie-grid">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img 
                    src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    } 
                    alt={movie.title} 
                    className="poster-img"
                  />
                  <span className="rating-badge">{movie.vote_average?.toFixed(1)}</span>
                  <div className="movie-info">
                    <div className="movie-title">{movie.title}</div>
                  </div>
                </div>
              ))}
            </div>
        )}
      </main>
    </div>
  );
}