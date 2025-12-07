import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import './Dashboard.css';
import VideoPlayer from './VideoPlayer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch partner profile
                const profileRes = await axios.get('http://localhost:8000/api/auth/foodpartner/profile', {
                    withCredentials: true
                });
                setPartner(profileRes.data.foodPartner);

                // Fetch partner's food items (use 'id' not '_id')
                const foodsRes = await axios.get(`http://localhost:8000/api/food/partner/${profileRes.data.foodPartner.id}`, {
                    withCredentials: true
                });
                setFoods(foodsRes.data.foods || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                // If unauthorized, redirect to login after showing message
                if (error.response?.status === 401) {
                    alert('Session expired. Please log in again.');
                    navigate('/foodPartner/login');
                } else {
                    alert('Error loading dashboard. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        
        // Small delay to ensure cookie is set
        setTimeout(fetchData, 100);
    }, [navigate]);

    const handleDelete = async (foodId, e) => {
        e.stopPropagation(); // Prevent opening video player when deleting
        
        if (!window.confirm('Are you sure you want to delete this food item?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/food/${foodId}`, {
                withCredentials: true
            });
            
            // Remove from local state
            setFoods(foods.filter(food => food._id !== foodId));
            alert('Food item deleted successfully!');
        } catch (error) {
            console.error('Error deleting food:', error);
            alert('Failed to delete food item. Please try again.');
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="partner-info">
                    <h1>Welcome, {partner?.name}!</h1>
                    <p className="partner-email">{partner?.email}</p>
                </div>
                <button className="logout-btn" onClick={() => {
                    localStorage.removeItem('token');
                    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    navigate('/foodPartner/login');
                }}>
                    Logout
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-value">{foods.length}</div>
                    <div className="stat-label">Total Items</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{foods.length * 10}</div>
                    <div className="stat-label">Total Views</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{foods.length * 350}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
            </div>

            <div className="dashboard-actions">
                <button className="btn btn-primary btn-upload" onClick={() => navigate('/foodPartner/create-food')}>
                    + Upload New Food Item
                </button>
                <button className="btn btn-secondary" onClick={() => navigate(`/foodPartner/profile/${partner?.id}`)}>
                    View Public Profile
                </button>
            </div>

            <div className="dashboard-content">
                <h2>Your Food Items</h2>
                {foods.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't uploaded any food items yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/foodPartner/create-food')}>
                            Upload Your First Item
                        </button>
                    </div>
                ) : (
                    <div className="food-grid">
                        {foods.map((food, idx) => (
                            <div className="food-card" key={food._id} onClick={() => {
                                setSelectedVideoIndex(idx);
                                setShowPlayer(true);
                            }}>
                                <button 
                                    className="delete-food-btn" 
                                    onClick={(e) => handleDelete(food._id, e)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                                <video src={food.video} className="food-video" />
                                <div className="food-info">
                                    <h3>{food.name}</h3>
                                    <p className="food-description">{food.description}</p>
                                    <p className="food-price">₹{food.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {showPlayer && (
                <VideoPlayer
                    videos={foods}
                    initialIndex={selectedVideoIndex}
                    onClose={() => setShowPlayer(false)}
                    onDelete={async (foodId) => {
                        await handleDelete(foodId, { stopPropagation: () => {} });
                        setShowPlayer(false);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
