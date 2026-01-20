import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

export default function LandingPage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalRatings: 0,
    avgRating: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await fetch('http://127.0.0.1:8000/movie');
        const movieData = await movieRes.json();
        const results = movieData.results || movieData;

        setTrendingMovies(results.slice(0, 6));
        setTopRatedMovies(results.slice(6, 12));

        const statsRes = await fetch('http://127.0.0.1:8000/tmdb-stats');
        const statsData = await statsRes.json();

        setStats({
          totalMovies: statsData.total_movies,
          totalRatings: statsData.total_ratings,
          avgRating: (results.reduce((sum, m) => sum + (m.vote_average || 0), 0) / results.length).toFixed(1)
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
          const navigate = useNavigate();

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">CineVerse</div>
        <div className="navbar-links">
          <a href="#trending">Trending</a>
          <a href="#top-rated">Top Rated</a>
          <button className="btn btn-secondary" 
           onClick={() => navigate('/auth/login')}
          style={{padding: '0.5rem 1.5rem', fontSize: '0.9rem'}}>Login</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">CineVerse</h1>
          <p className="hero-subtitle">Discover, Rate & Explore Your Next Favorite Movie</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => scrollToSection('trending')}>
              Explore Movies
            </button>
            <button className="btn btn-secondary"
             onClick={() => navigate('/auth/logup')}
            >Get Started</button>
          </div>
          <div className="hero-stats">
            <div className="stat-badge">
              <h4>{formatNumber(stats.totalMovies)}</h4>
              <p>Movies</p>
            </div>
            <div className="stat-badge">
              <h4>{formatNumber(stats.totalRatings)}+</h4>
              <p>Ratings</p>
            </div>
            <div className="stat-badge">
              <h4>⭐ {stats.avgRating}</h4>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2 className="section-title">Why Choose CineVerse?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>Extensive Database</h3>
            <p>Access 900k+ movies with detailed info, reviews, and ratings from around the world.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Smart Ratings</h3>
            <p>Rate movies and see what 25M+ community members think about your favorites.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Personalized Lists</h3>
            <p>Curate your own watchlists, favorites, and recommendations instantly.</p>
          </div>
        </div>
      </section>

      {/* TRENDING MOVIES */}
      <section id="trending" className="movies-section">
        <div className="section-header">
          <span style={{fontSize: '2rem'}}>🔥</span>
          <h2>Trending Now</h2>
        </div>
        {loading ? (
          <p className="loading-text">Loading movies...</p>
        ) : (
          <div className="movies-carousel">
            {trendingMovies.map(movie => (
              <div key={movie.id} className="carousel-card">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.title}
                  className="carousel-image"
                />
                <div className="carousel-overlay">
                  <h3>{movie.title}</h3>
                  <div className="carousel-rating">⭐ {movie.vote_average?.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TOP RATED MOVIES */}
      <section id="top-rated" className="movies-section">
        <div className="section-header">
          <span style={{fontSize: '2rem'}}>🏆</span>
          <h2>Top Rated</h2>
        </div>
        {loading ? null : (
          <div className="movies-carousel">
            {topRatedMovies.map(movie => (
              <div key={movie.id} className="carousel-card">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.title}
                  className="carousel-image"
                />
                <div className="carousel-overlay">
                  <h3>{movie.title}</h3>
                  <div className="carousel-rating">⭐ {movie.vote_average?.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3>{formatNumber(stats.totalMovies)}</h3>
            <p>Movies in Database</p>
          </div>
          <div className="stat-item">
            <h3>{formatNumber(stats.totalRatings)}+</h3>
            <p>Global Ratings</p>
          </div>
          <div className="stat-item">
            <h3>{stats.avgRating}</h3>
            <p>Average Rating</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Live Updates</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Ready to Start Your Movie Journey?</h2>
        <button className="btn btn-primary" 
        onClick={() => navigate('/auth/logup')}
        style={{marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.1rem'}}>
          Get Started Now
          
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>CineVerse</h4>
            <p>Your ultimate movie discovery platform powered by TMDB</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#trending">Trending Movies</a>
            <a href="#top-rated">Top Rated</a>
            <a href="#features">Features</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CineVerse. All rights reserved. Powered by TMDB API.</p>
        </div>
      </footer>
    </div>
  );
}