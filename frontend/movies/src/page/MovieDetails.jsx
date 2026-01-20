import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetails.css';
import AddToListModal from '../components/AddToListModal';
import WriteReviewModal from '../components/WriteReviewModal';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // STATE
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Heart State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const token = localStorage.getItem('token');

  // 1. FETCH MOVIE DETAILS & CHECK FAVORITE
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/movie/${id}`);
        const data = await res.json();
        setMovie(data);
        
        // Check if favorite only after movie is loaded
        if (token && data.id) {
            checkFavoriteStatus(data.id);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };
    fetchDetails();
  }, [id, token]);

  // 2. CHECK FAVORITE STATUS
  const checkFavoriteStatus = async (movieId) => {
    try {
        const res = await fetch(`http://127.0.0.1:8000/favorites/check/${movieId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setIsFavorite(data.is_favorite);
    } catch (err) { console.error(err); }
  };

  // 3. TOGGLE FAVORITE
  const toggleFavorite = async () => {
    if (!token) return alert("Login is required to see favorites!");

    setIsFavorite(!isFavorite); // Optimistic Update

    try {
        const res = await fetch('http://127.0.0.1:8000/favorites/toggle', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movie_id: movie.id,
                movie_title: movie.title,
                poster_path: movie.poster_path
            })
        });
        if (!res.ok) setIsFavorite(!isFavorite); // Revert if failed
    } catch (err) {
        setIsFavorite(!isFavorite);
    }
  };

  if (!movie) return <div style={{color:'white', padding:'50px'}}>Loading details...</div>;

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate('/page/dashboard')}>
          Back
      </button>

      {/* Hero Backdrop */}
      <div className="backdrop-header">
        {movie.backdrop_path && (
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
            className="backdrop-img" 
            alt="Backdrop"
          />
        )}
      </div>

      <div className="content-wrapper">
        {/* Left: Poster */}
        <div className="poster-column">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            className="poster-large" 
            alt={movie.title} 
          />
        </div>

        {/* Right: Info */}
        <div className="info-column">
          <div className="movie-headline">
            <h1>{movie.title}</h1>
          </div>
          
          <div className="meta-data">
             <span>{movie.release_date?.split('-')[0]}</span>
             <span>•</span>
             <span>{movie.runtime} min</span>
             <span>•</span>
             <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="action-buttons" style={{margin: '20px 0', display: 'flex', gap: '15px'}}>
                {/* 1. Add to List */}
                <button 
                    className="submit-btn" 
                    style={{padding: '12px 25px', fontSize: '1rem', flex: 1}}
                    onClick={() => setShowListModal(true)}
                >
                    + Add to List
                </button>

                {/* 2. Write Review */}
                <button 
                    className="submit-btn" 
                    style={{
                        padding: '12px 25px', 
                        fontSize: '1rem', 
                        flex: 1, 
                        background: 'linear-gradient(135deg, #3a86ff, #00ddeb)'
                    }}
                    onClick={() => setShowReviewModal(true)}
                >
                    ✎ Write Review
                </button>

                {/* 3. Favorite Button (The Heart) */}
                <button 
                   className="submit-btn" 
                   onClick={toggleFavorite}
                   style={{
                       width: '50px', 
                       fontSize: '1.5rem', 
                       padding: '0',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: isFavorite ? '#ff006e' : '#333',
                       border: isFavorite ? 'none' : '1px solid #555'
                   }}
                >
                   {isFavorite ? '❤️' : '🤍'}
                </button>
          </div>

          {movie.tagline && <div className="tagline">"{movie.tagline}"</div>}

          <p className="overview">{movie.overview}</p>

          <h3>Top Cast</h3>
          <div className="cast-grid">
            {movie.credits?.cast?.slice(0, 6).map(actor => (
              <div key={actor.id} className="actor-card">
                <img 
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : 'https://via.placeholder.com/200'} 
                  className="actor-img" 
                  alt={actor.name}
                />
                <div className="actor-name">{actor.name}</div>
                <div className="character-name">{actor.character}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showListModal && (
        <AddToListModal 
          movie={movie} 
          onClose={() => setShowListModal(false)} 
        />
      )}
      {showReviewModal && (
        <WriteReviewModal 
          movie={movie} 
          onClose={() => setShowReviewModal(false)} 
        />
      )}
    </div>
  );
}