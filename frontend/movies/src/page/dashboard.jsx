import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Add State for Search
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 2. CHECK AUTH
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
        // navigate('/auth/login'); // Uncomment when ready
    } else {
        setUser(JSON.parse(savedUser));
    }

    // 3. FETCH POPULAR MOVIES ON LOAD (Not Search)
    const fetchPopularMovies = async () => {
      try {
        // Use the /movies endpoint for the initial feed
        const response = await fetch('http://127.0.0.1:8000/movie');
        const data = await response.json();
        setMovies(data.results || data); 
        setLoading(false);
      } catch (error) {
        console.error("Error loading movies:", error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  // 4. NEW: Handle Search when pressing Enter
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() === "") return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/search?query=${searchQuery}`);
        const data = await response.json();
        setMovies(data.results || []); 
        setLoading(false);
      } catch (error) {
        console.error("Search failed:", error);
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  return (
    <div className="dashboard-container">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand">CineVerse</div>
        
        <nav className="nav-links">
          <div className="nav-item" onClick={() => navigate('/page/dashboard')}>
            <span className="nav-icon">🏠</span> Home
          </div>
         <div className="nav-item" onClick={() => navigate('/page/trending')}>
            <span className="nav-icon">🔥</span> Trending
          </div>
          <div className="nav-item">
            <span className="nav-icon"
            onClick={() => navigate('/page/Reviews')}
            >📝</span> Reviews
          </div>
          <div className="nav-item" onClick={() => navigate('/page/MyLists')}>
   <span className="nav-icon">📋</span> Lists
</div>
          <div className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Logout
          </div>
        </nav>

        {/* Make the whole div clickable */}
        <div 
          className="user-mini-profile" 
          onClick={() => navigate('/page/Profile')} 
          style={{cursor: 'pointer'}} // <--- Add this
        >
          {/* --- FIX: SHOW REAL AVATAR HERE --- */}
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

      {/* MAIN FEED */}
      <main className="main-content">
      
        <header className="header-section">
          <div>
            <h1>Hello, {user ? user.full_name : 'Movie Lover'} 👋</h1>
            <p style={{color: '#888'}}>Here's what's happening in the world of cinema.</p>
          </div>
          
          {/* 5. CONNECTED SEARCH INPUT */}
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </header>

        <section>
          <div className="section-title">
            {searchQuery ? `Results for "${searchQuery}"` : "Popular This Week"}
          </div>
          
          {loading ? (
            <p>Loading your feed...</p>
          ) : (
            <div className="movie-grid">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)} // 6. CLICK TO GO TO DETAILS
                >
                  <img 
                    src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : movie.backdrop_path 
                            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
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
              
              {movies.length === 0 && !loading && (
                 <p style={{color: '#666'}}>No movies found. Try searching for something else.</p>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="section-title">New from Friends</div>
          <div style={{
              background: '#161616', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid #222'
          }}>
            <p style={{marginBottom: '10px'}}>
                <strong>Sarah</strong> watched <strong>Interstellar</strong>
            </p>
            <p style={{color: '#888', fontStyle: 'italic'}}>
                "This movie completely changed my perspective on time. Zimmer's score is a masterpiece."
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}