import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './createFood.css';
import axios from '../../axiosConfig';

const CreateFood = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(import.meta.env.VITE_API_URL + '/api/auth/foodpartner/profile', {
                    withCredentials: true
                });
                // If successful, user is authenticated
            } catch (error) {
                // If error, user is not authenticated - redirect to login
                console.error('Not authenticated:', error);
                navigate('/foodPartner/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoFile || !formData.name || !formData.price) {
            setMessage('Please fill all required fields');
            return;
        }

        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('video', videoFile);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);

        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/food', data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Food item created successfully!');
            // Reset form
            setFormData({ name: '', description: '', price: '' });
            setVideoFile(null);
            setVideoPreview(null);
        } catch (error) {
            setMessage('Error creating food item: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-food-container">
            <h2 className="create-food-title">Create Food Item</h2>

            <form onSubmit={handleSubmit} className="create-food-form">
                <div className="form-group">
                    <label htmlFor="video">Video *</label>
                    <div className="video-upload-area">
                        {videoPreview ? (
                            <video
                                src={videoPreview}
                                controls
                                className="video-preview"
                            />
                        ) : (
                            <div className="video-placeholder">
                                <span>📹 Upload Video</span>
                            </div>
                        )}
                        <input
                            type="file"
                            id="video"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="video-input"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter food name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter food description"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Food Item'}
                </button>
            </form>
        </div>
    );
}

export default CreateFood