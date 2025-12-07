import React, { useRef, useEffect, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videos, initialIndex, onClose, onDelete }) => {
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        // Scroll to initial video
        if (containerRef.current && initialIndex >= 0) {
            const scrollTop = initialIndex * window.innerHeight;
            containerRef.current.scrollTop = scrollTop;
        }
    }, [initialIndex]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const index = Math.round(scrollTop / window.innerHeight);
            setCurrentIndex(index);

            // Play only the current video
            videoRefs.current.forEach((video, idx) => {
                if (video) {
                    if (idx === index) {
                        video.muted = false; // Unmute when playing
                        video.play().catch(() => {
                            // Fallback to muted if needed
                            video.muted = true;
                            video.play();
                        });
                    } else {
                        video.pause();
                    }
                }
            });
        };

        container.addEventListener('scroll', handleScroll);

        // Play first video on mount
        if (videoRefs.current[initialIndex]) {
            const video = videoRefs.current[initialIndex];
            video.muted = false; // Ensure unmuted
            video.play().catch(() => {
                // If autoplay fails (browser policy), mute and try again
                video.muted = true;
                video.play();
            });
        }

        return () => container.removeEventListener('scroll', handleScroll);
    }, [initialIndex]);

    return (
        <div className="video-player-overlay">
            <button className="close-player-btn" onClick={onClose}>×</button>
            {onDelete && (
                <button 
                    className="delete-player-btn" 
                    onClick={() => {
                        if (window.confirm('Delete this video?')) {
                            onDelete(videos[currentIndex]._id);
                        }
                    }}
                >
                    🗑️
                </button>
            )}
            <div className="video-player-container" ref={containerRef}>
                {videos.map((food, idx) => (
                    <div className="video-player-slide" key={idx}>
                        <video
                            ref={el => videoRefs.current[idx] = el}
                            className="video-player-video"
                            src={food.video}
                            loop
                            playsInline
                        />
                        <div className="video-player-info">
                            <h3>{food.name}</h3>
                            <p>{food.description}</p>
                            <p className="video-player-price">₹{food.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayer;
