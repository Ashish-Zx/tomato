import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

function FoodPartnerRegister() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        contactName: '',
        agreeTerms: false,
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { name, email, password, contactName, phone, address } = formData

        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/foodpartner/register', {
                name,
                email,
                password,
                contactName,
                phone,
                address
            }, { withCredentials: true });
            
            console.log(`Partner ${email} registered successfully`)
            
            // Store token in localStorage if provided
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            
            navigate('/foodPartner/dashboard')
        } catch (err) {
            console.error('Registration failed', err)
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
            alert(errorMessage)
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-header-type">Partner</span>
                        <h1>Register Restaurant</h1>
                        <p>Join our network and start growing your business</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Restaurant Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Your restaurant name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactName">Contact Person Name</label>
                            <input
                                type="text"
                                id="contactName"
                                name="contactName"
                                className="form-input"
                                placeholder="Owner or manager name"
                                value={formData.contactName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="owner@restaurant.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Restaurant Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-input"
                                placeholder="Street address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter a strong password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreeTerms">
                                I agree to the <a href="#" className="auth-footer-link">Partner Terms</a> and{' '}
                                <a href="#" className="auth-footer-link">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full-width">
                            Register Restaurant
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary btn-full-width"
                        onClick={() => navigate('/user/register')}
                    >
                        Switch to Customer Registration
                    </button>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already registered?{' '}
                            <a href="/foodPartner/login" className="auth-footer-link">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodPartnerRegister
