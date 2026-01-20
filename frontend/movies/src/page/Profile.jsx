import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import './dashboard.css';
import './Profile.css';
import ProfileSkeleton from '../components/skeleton';

export default function Profile() {
  const navigate = useNavigate();
  
  // STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // DATA HOLDING
  const [allLists, setAllLists] = useState([]); 
  const [favorites, setFavorites] = useState([]); 
  
  // NEW: WATCH TIME STATE
  const [watchTime, setWatchTime] = useState("0h 0m");

  // TABS STATE
  const [activeTab, setActiveTab] = useState('Profile'); 

  // STATS
  const [stats, setStats] = useState({ reviews: 0, lists: 0, ratings: 0 });
  const [chartData, setChartData] = useState([0,0,0,0,0]); 
  
  const [showEditModal, setShowEditModal] = useState(false);

  const defaultBanner = "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc05475qg9s.jpg";
  const defaultAvatar = "linear-gradient(45deg, #ff006e, #3a86ff)";

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token) {
        navigate('/auth/login');
        return;
    }
    
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    if (parsedUser) setUser(parsedUser);
    
    fetchProfileData(token, parsedUser);
  }, []);

  const fetchProfileData = async (token, currentUser) => {
    try {
        // 1. FETCH ALL LISTS
        const listRes = await fetch('http://127.0.0.1:8000/my-lists', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();
        if (Array.isArray(listData)) setAllLists(listData);

        // 2. FETCH FAVORITES
        const favRes = await fetch('http://127.0.0.1:8000/my-favorites', {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const favData = await favRes.json();
        if (Array.isArray(favData)) setFavorites(favData);

        // 3. FETCH REVIEWS (Filtered by User)
        const reviewRes = await fetch('http://127.0.0.1:8000/reviews', {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const reviewData = await reviewRes.json();
        const allReviews = reviewData.data || reviewData;
        
        let myReviews = [];
        if (Array.isArray(allReviews) && currentUser) {
             myReviews = allReviews.filter(r => r.user_id === currentUser.id);
        }
        
        // 4. FETCH WATCH TIME (NEW!)
        const timeRes = await fetch('http://127.0.0.1:8000/user/watch-time', {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const timeData = await timeRes.json();
        if (timeData.formatted) setWatchTime(timeData.formatted);

        // 5. CALCULATE CHART
        const starCounts = [0, 0, 0, 0, 0];
        myReviews.forEach(r => {
            if(r.rating >= 1 && r.rating <= 5) starCounts[r.rating - 1]++;
        });
        setChartData(starCounts);

        // 6. UPDATE STATS
        setStats({
            reviews: myReviews.length,
            lists: Array.isArray(listData) ? listData.length : 0,
            ratings: myReviews.length 
        });
        
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

  const getTabContent = () => {
    if (activeTab === 'Profile') return null;

    // FAVORITES TAB
    if (activeTab === 'Favorites') {
        if (favorites.length === 0) {
            return (
                <div style={{textAlign:'center', padding:'40px', color:'#666'}}>
                    <h3>No favorites yet</h3>
                    <p>Click the ❤️ button on any movie details page.</p>
                </div>
            );
        }
        return (
            <div className="lists-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap:'20px'}}>
                {favorites.map(item => (
                    <div key={item.id} className="fav-card" onClick={() => navigate(`/movie/${item.movie_id}`)} style={{width:'100%'}}>
                        <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.movie_title} className="fav-poster" style={{height:'225px', width:'100%'}}/>
                        <div style={{marginTop:'8px', fontSize:'0.9rem', color:'#ccc', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.movie_title}</div>
                    </div>
                ))}
            </div>
        );
    }

    // LISTS TABS
    const targetList = allLists.find(l => l.name.toLowerCase() === activeTab.toLowerCase());

    if (!targetList || !targetList.items || targetList.items.length === 0) {
        return (
            <div style={{textAlign:'center', padding:'40px', color:'#666'}}>
                <h3>No movies in "{activeTab}"</h3>
                <p>You haven't created a list named "{activeTab}" or it's empty.</p>
                <button 
                    onClick={() => navigate('/page/Mylists')}
                    style={{marginTop:'15px', padding:'10px 20px', background:'#333', border:'1px solid #555', color:'white', borderRadius:'8px', cursor:'pointer'}}
                >
                    Manage Lists
                </button>
            </div>
        );
    }

    return (
        <div className="lists-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap:'20px'}}>
            {targetList.items.map(item => (
                <div key={item.id} className="fav-card" onClick={() => navigate(`/movie/${item.movie_id}`)} style={{width:'100%'}}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.movie_title} className="fav-poster" style={{height:'225px', width:'100%'}}/>
                    <div style={{marginTop:'8px', fontSize:'0.9rem', color:'#ccc', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.movie_title}</div>
                </div>
            ))}
        </div>
    );
  };

  const maxRatingCount = Math.max(...chartData, 1);

  return (
    <div className="dashboard-container">
      
      <aside className="sidebar">
        <div className="brand">CineVerse</div>
        <nav className="nav-links">
          <div className="nav-item" onClick={() => navigate('/page/dashboard')}><span className="nav-icon">🏠</span> Home</div>
          <div className="nav-item" onClick={() => navigate('/page/Trending')}><span className="nav-icon">🔥</span> Trending</div>
          <div className="nav-item" onClick={() => navigate('/page/Reviews')}><span className="nav-icon">📝</span> Reviews</div>
          <div className="nav-item" onClick={() => navigate('/page/Mylists')}><span className="nav-icon">📋</span> Lists</div>
          <div className="nav-item" onClick={handleLogout}><span className="nav-icon">🚪</span> Logout</div>
        </nav>
      </aside>

      <main className="main-content" style={{padding: 0, position: 'relative'}}>
        {loading ? (
            <ProfileSkeleton />
        ) : (
            <>
            <div className="profile-banner" style={{backgroundImage: `url(${user?.banner || defaultBanner})`}}></div>

            <button 
                onClick={() => setShowEditModal(true)}
                style={{
                    position:'absolute', top: '240px', right: '40px',
                    background:'rgba(0,0,0,0.6)', border:'1px solid white', color:'white',
                    padding:'8px 15px', borderRadius:'20px', cursor:'pointer', backdropFilter:'blur(5px)', zIndex: 50
                }}
            >
                ⚙️ Edit Profile
            </button>

            <div className="profile-content">
                <div className="profile-header-section">
                    <div className="user-identity">
                        <div className="profile-avatar-xl" style={{background: user?.avatar ? `url(${user.avatar}) center/cover` : defaultAvatar}}></div>
                        <div className="user-text">
                            <h1>{user ? user.username : 'User'}</h1>
                            <p>Joined {user ? new Date(user.created_at).toLocaleDateString() : ''}</p>
                        </div>
                    </div>
                    
                    {/* --- UPDATED STATS ROW --- */}
                    <div className="profile-stats-row">
                        <div className="stat-item"><span className="stat-val">{stats.reviews}</span><span className="stat-lbl">Reviews</span></div>
                        <div className="stat-item"><span className="stat-val">{stats.lists}</span><span className="stat-lbl">Lists</span></div>
                        
                        {/* WATCH TIME (Green) */}
                        <div className="stat-item">
                            <span className="stat-val" style={{color: '#00b894'}}>{watchTime}</span>
                            <span className="stat-lbl">Watched</span>
                        </div>

                        <div className="stat-item"><span className="stat-val">{stats.ratings}</span><span className="stat-lbl">Ratings</span></div>
                    </div>
                </div>

                <div className="profile-nav-tabs">
                    {['Profile', 'Favorites', 'Watching', 'Watched', 'Watchlist'].map(tab => (
                        <div 
                            key={tab}
                            className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                    <div className="tab-link" onClick={() => navigate('/page/Mylists')}>Lists</div>
                    <div className="tab-link" onClick={() => navigate('/page/Reviews')}>Reviews</div>
                </div>

                {activeTab === 'Profile' ? (
                    <div className="profile-grid-layout">
                        <div className="left-col-section">
                            <h3>About Me</h3>
                            <p className="bio-text">
                                {user?.bio || "No bio yet. Click Edit Profile to add one!"}
                            </p>
                            
                            <h3>Ratings Distribution</h3>
                            {stats.ratings > 0 ? (
                                <div style={{marginTop: '20px'}}>
                                    <div style={{display: 'flex', alignItems: 'flex-end', height: '100px', gap: '6px'}}>
                                        {chartData.map((count, index) => {
                                            const heightPerc = (count / maxRatingCount) * 100;
                                            return (
                                                <div key={index} style={{flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                    <div style={{fontSize: '0.7rem', color: '#fff', marginBottom: '6px', opacity: count > 0 ? 1 : 0}}>{count}</div>
                                                    <div style={{width: '100%', height: `${heightPerc}%`, minHeight: count > 0 ? '4px' : '0', background: '#3a86ff', borderRadius: '3px 3px 0 0', transition: 'height 0.4s ease', opacity: count > 0 ? 1 : 0.1}}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div style={{display: 'flex', marginTop: '8px', gap: '6px'}}>
                                        {chartData.map((_, index) => (
                                            <div key={index} style={{flex: 1, textAlign: 'center', fontSize: '0.75rem', color: '#666'}}>{index + 1}</div>
                                        ))}
                                    </div>
                                </div>
                            ) : <p style={{color:'#666', fontSize:'0.9rem'}}>No ratings yet.</p>}
                        </div>

                        <div className="right-col-section">
                            <div className="section-heading" style={{borderColor:'#3a86ff'}}>Recent Activity</div>
                            <p style={{color:'#666'}}>Coming soon...</p>
                        </div>
                    </div>
                ) : (
                    <div style={{minHeight: '400px', animation: 'fadeIn 0.3s ease'}}>
                        <h2 style={{marginBottom: '20px', textTransform:'capitalize'}}>{activeTab}</h2>
                        {getTabContent()}
                    </div>
                )}
            </div>
        </>
        )}

        {showEditModal && user && (
            <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onUpdate={(updatedUser) => setUser(updatedUser)} />
        )}
      </main>
    </div>
  );
}