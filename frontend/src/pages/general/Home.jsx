
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

const demoVideos = [
    {
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Big Buck Bunny is a short computer-animated comedy film. Visit our store for more info and offers!'
    },
    {
        url: 'https://www.w3schools.com/html/movie.mp4',
        description: 'The Bear video showcases nature and wildlife. Check out the store for exclusive deals!'
    },
    {
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: 'Explore our delicious menu with amazing food items and exclusive store offers!'
    }
];

function Home() {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const [videos, setVideos] = useState(demoVideos);
    const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
    const [likedVideos, setLikedVideos] = useState({});
    const [savedVideos, setSavedVideos] = useState({});
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/user/login');
    };

    const handleLike = async (foodId, e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(`http://localhost:8000/api/user/like/${foodId}`, {}, {
                withCredentials: true
            });
            setLikedVideos(prev => ({
                ...prev,
                [foodId]: response.data.isLiked
            }));
        } catch (error) {
            console.error('Error liking food:', error);
        }
    };

    const handleSave = async (foodId, e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(`http://localhost:8000/api/user/save/${foodId}`, {}, {
                withCredentials: true
            });
            setSavedVideos(prev => ({
                ...prev,
                [foodId]: response.data.isSaved
            }));
        } catch (error) {
            console.error('Error saving food:', error);
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        
        // Immediately update all videos
        videoRefs.current.forEach((video, idx) => {
            if (video) {
                video.muted = newMutedState;
                video.volume = 1.0; // Ensure full volume
                console.log(`Video ${idx}: muted=${video.muted}, volume=${video.volume}`);
            }
        });
        
        console.log(`🔊 Videos ${newMutedState ? 'muted' : 'UNMUTED - Check if you hear sound!'}`);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const index = Math.round(scrollTop / window.innerHeight);

            // Prevent overscroll at the top
            if (scrollTop < 0) {
                container.scrollTop = 0;
            }

            // Play only the current video
            videoRefs.current.forEach((video, idx) => {
                if (video) {
                    if (idx === index) {
                        video.muted = isMuted;
                        video.play().catch(err => {
                            // Autoplay blocked, ensure muted
                            console.log('Autoplay prevented, playing muted');
                            video.muted = true;
                            video.play().catch(() => {});
                        });
                    } else {
                        video.pause();
                    }
                }
            });
        };

        container.addEventListener('scroll', handleScroll);

        // Play first video on mount
        if (videoRefs.current[0]) {
            const firstVideo = videoRefs.current[0];
            firstVideo.muted = true; // Start muted for autoplay
            firstVideo.play().catch(() => {});
        }

        return () => container.removeEventListener('scroll', handleScroll);
    }, [isMuted]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/food', {
            withCredentials: true
        })
            .then(response => {
                if (response.data.foods && response.data.foods.length > 0) {
                    const formattedVideos = response.data.foods.map(food => ({
                        _id: food._id,  // Add this for like/save buttons
                        url: food.video,
                        description: food.description || food.name,
                        foodId: food._id,
                        partnerId: food.foodpartner
                    }));
                    setVideos(formattedVideos);
                }
            })
            .catch(error => {
                console.error('Error fetching foods:', error);
            });
    }, []);

    return (
        <div className="reels-container" ref={containerRef}>
            <button className="home-logout-btn" onClick={handleLogout} title="Logout">
                ⎋
            </button>
            {videos.map((video, idx) => (
                <div className="reel" key={idx}>
                    <video
                        ref={el => videoRefs.current[idx] = el}
                        className="reel-video"
                        src={video.url}
                        loop
                        muted={isMuted}
                        playsInline
                    />
                    <div className="reel-overlay">
                        <div className="reel-description">
                            {video.description}
                        </div>
                        {video.partnerId && (
                            <button className="visit-store-btn" onClick={() => navigate(`/foodPartner/profile/${video.partnerId}`)}>Visit Store</button>
                        )}
                    </div>
                    
                    {/* TikTok-style action buttons - Only for real food items */}
                    {video._id && (
                        <div className="reel-actions">
                            <button 
                                className={`action-btn like-btn ${likedVideos[video._id] ? 'active' : ''}`}
                                onClick={(e) => handleLike(video._id, e)}
                                title="Like"
                            >
                                <span className="action-icon">{likedVideos[video._id] ? '❤️' : '🤍'}</span>
                                <span className="action-label">Like</span>
                            </button>
                            
                            <button 
                                className={`action-btn save-btn ${savedVideos[video._id] ? 'active' : ''}`}
                                onClick={(e) => handleSave(video._id, e)}
                                title="Save"
                            >
                                <span className="action-icon">{savedVideos[video._id] ? '🔖' : '📑'}</span>
                                <span className="action-label">Save</span>
                            </button>
                            
                            <button 
                                className="action-btn profile-btn"
                                onClick={() => navigate('/user/profile')}
                                title="Profile"
                            >
                                <span className="action-icon">👤</span>
                                <span className="action-label">Profile</span>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Home;