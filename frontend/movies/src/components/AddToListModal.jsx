import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './modal.css';

export default function AddToListModal({ movie, onClose }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 1. NEW STATE FOR SUCCESS MESSAGE
  const [successMsg, setSuccessMsg] = useState(''); 

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn("User not logged in.");
      onClose();
      return;
    }
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
      
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth/login');
        return;
      }

      const data = await res.json();
      setLists(Array.isArray(data) ? data : []);
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
        setNewListName('');
        fetchLists(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMovie = async (listId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/lists/${listId}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path
        })
      });

      if (res.ok) {
        // 2. SHOW SUCCESS DIV INSTEAD OF ALERT
        setSuccessMsg("✅ Movie added successfully!");

        // 3. WAIT 1.5 SECONDS, THEN CLOSE
        setTimeout(() => {
            onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-btn" onClick={onClose}>×</button>
        <div className="modal-header"><h2>Add to List</h2></div>

        {/* 4. SHOW SUCCESS MESSAGE IF EXISTS */}
        {successMsg ? (
            <div className="success-toast">
                {successMsg}
            </div>
        ) : (
            // OTHERWISE SHOW THE FORM
            loading ? <p>Loading...</p> : (
            <>
                <div className="lists-container">
                {lists.map(list => (
                    <button key={list.id} className="list-item-btn" onClick={() => handleAddMovie(list.id)}>
                    <span>{list.name}</span>
                    <span style={{color: '#888'}}>{list.items_count || 0} items</span>
                    </button>
                ))}
                {lists.length === 0 && <p style={{color:'#666', textAlign:'center'}}>No lists found.</p>}
                </div>

                <div className="create-section">
                <input 
                    type="text" className="create-input" 
                    placeholder="New List Name" 
                    value={newListName} onChange={(e) => setNewListName(e.target.value)} 
                />
                <button className="create-btn" onClick={handleCreateList}>Create</button>
                </div>
            </>
            )
        )}
      </div>
    </div>
  );
}