import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from '../../axiosConfig';
import { useParams } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [stats, setStats] = useState({ totalMeals: 0, customerServe: 0 });
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

    useEffect(() => {
        // Fetch food partner profile
        axios.get(`https://tomato-bc76.vercel.app/api/foodpartner/${id}`)
            .then(response => {
                setProfile(response.data.foodPartner);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });

        // Fetch food partner's videos
        axios.get(`https://tomato-bc76.vercel.app/api/food/partner/${id}`, {
            withCredentials: true
        })
            .then(response => {
                if (response.data.foods) {
                    setVideos(response.data.foods);
                    // Calculate stats (mock calculation)
                    setStats({
                        totalMeals: response.data.foods.length * 10,
                        customerServe: response.data.foods.length * 350
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    }, [id]);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    <div className="profile-avatar"></div>
                </div>
                <div className="profile-info">
                    <div className="business-name">{profile?.name || 'Business Name'}</div>
                    <div className="business-address">{profile?.address || 'Address'}</div>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-item">
                    <div className="stat-label">total meals</div>
                    <div className="stat-value">{stats.totalMeals}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">customer serve</div>
                    <div className="stat-value">{stats.customerServe >= 1000 ? `${(stats.customerServe / 1000).toFixed(0)}K` : stats.customerServe}</div>
                </div>
            </div>

            <div className="profile-divider" />

            <div className="video-grid">
                {videos.map((food, idx) => (
                    <div 
                        className="video-item" 
                        key={idx}
                        onClick={() => {
                            setSelectedVideoIndex(idx);
                            setShowPlayer(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <video src={food.video} />
                        <div className="video-label">video</div>
                    </div>
                ))}
                {videos.length === 0 && [
                    ...Array(9).fill(null).map((_, idx) => (
                        <div className="video-item" key={idx}>
                            <div className="video-placeholder"></div>
                            <div className="video-label">video</div>
                        </div>
                    ))
                ]}
            </div>
            
            {showPlayer && videos.length > 0 && (
                <VideoPlayer
                    videos={videos}
                    initialIndex={selectedVideoIndex}
                    onClose={() => setShowPlayer(false)}
                />
            )}
        </div>
    );
}

export default Profile