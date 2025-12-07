import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import './UserProfile.css';
import VideoPlayer from '../food-partner/VideoPlayer';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [savedFoods, setSavedFoods] = useState([]);
    const [likedFoods, setLikedFoods] = useState([]);
    const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'liked'
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', email: '' });
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const [profileRes, savedRes, likedRes] = await Promise.all([
                axios.get(import.meta.env.VITE_API_URL + '/api/user/profile', { withCredentials: true }),
                axios.get(import.meta.env.VITE_API_URL + '/api/user/saved', { withCredentials: true }),
                axios.get(import.meta.env.VITE_API_URL + '/api/user/liked', { withCredentials: true })
            ]);

            setUser(profileRes.data.user);
            setEditForm({ 
                fullName: profileRes.data.user.fullName, 
                email: profileRes.data.user.email 
            });
            setSavedFoods(savedRes.data.foods || []);
            setLikedFoods(likedRes.data.foods || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/user/login');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(import.meta.env.VITE_API_URL + '/api/user/profile', editForm, {
                withCredentials: true
            });
            setUser(prev => ({ ...prev, ...editForm }));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/user/login');
    };

    if (loading) {
        return <div className="user-profile-loading">Loading...</div>;
    }

    const currentVideos = activeTab === 'saved' ? savedFoods : likedFoods;

    return (
        <div className="user-profile-container">
            {/* Header */}
            <div className="user-profile-header">
                <button className="back-btn" onClick={() => navigate('/home')}>
                    ← Back to Feed
                </button>
                <h1>My Profile</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Profile Info */}
            <div className="profile-info-section">
                <div className="profile-avatar">
                    <span className="avatar-icon">👤</span>
                </div>
                
                {!isEditing ? (
                    <div className="profile-details">
                        <h2>{user?.fullName}</h2>
                        <p className="user-email">{user?.email}</p>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-value">{user?.likedCount || 0}</span>
                                <span className="stat-label">Liked</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{user?.savedCount || 0}</span>
                                <span className="stat-label">Saved</span>
                            </div>
                        </div>
                        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                        <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Full Name"
                            required
                        />
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Email"
                            required
                        />
                        <div className="edit-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button 
                    className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    🔖 Saved ({savedFoods.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                >
                    ❤️ Liked ({likedFoods.length})
                </button>
            </div>

            {/* Videos Grid */}
            <div className="profile-videos-grid">
                {currentVideos.length === 0 ? (
                    <div className="empty-state">
                        <p>No {activeTab} videos yet</p>
                        <button className="browse-btn" onClick={() => navigate('/home')}>
                            Browse Food
                        </button>
                    </div>
                ) : (
                    currentVideos.map((food, idx) => (
                        <div 
                            className="video-grid-item" 
                            key={food._id}
                            onClick={() => {
                                setSelectedVideoIndex(idx);
                                setShowPlayer(true);
                            }}
                        >
                            <video src={food.video} />
                            <div className="video-overlay">
                                <h4>{food.name}</h4>
                                <p>₹{food.price}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showPlayer && currentVideos.length > 0 && (
                <VideoPlayer
                    videos={currentVideos}
                    initialIndex={selectedVideoIndex}
                    onClose={() => setShowPlayer(false)}
                />
            )}
        </div>
    );
};

export default UserProfile;
