import { useState } from 'react';
import './modal.css'; // Reusing the modal styles we already have

export default function WriteReviewModal({ movie, onClose }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    if (!token) {
        alert("You must be logged in!");
        return;
    }

    setIsSubmitting(true);

    try {
      // POST to the route we created earlier
      const res = await fetch('http://127.0.0.1:8000/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path,
          rating: rating,
          content: content
        })
      });

      if (res.ok) {
        alert("Review published! ,successfully");
        onClose();
      } else {
        const data = await res.json();
        alert("Failed: " + (data.message || "Unknown Error"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{textAlign: 'left'}}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Review {movie.title}</h2>
        </div>

        {/* STAR RATING SELECTOR */}
        <div style={{marginBottom: '20px', textAlign: 'center'}}>
          <p style={{marginBottom: '5px', color: '#888'}}>Rate this movie</p>
          <div style={{fontSize: '2rem', cursor: 'pointer'}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                onClick={() => setRating(star)}
                style={{color: star <= rating ? '#ffbe0b' : '#333', transition: '0.2s'}}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* REVIEW TEXT */}
        <div style={{marginBottom: '20px'}}>
            <textarea 
                className="create-input" // Reusing input style
                rows="4"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{resize: 'none', height: '100px'}}
            />
        </div>

        <button 
            className="create-btn" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            style={{background: isSubmitting ? '#555' : '#3a86ff'}}
        >
            {isSubmitting ? 'Posting...' : 'Post Review'}
        </button>

      </div>
    </div>
  );
}