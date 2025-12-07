import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'
function FoodPartnerLogin() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
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
        const { email, password } = formData
        try {
            const response = await axios.post(
                'http://localhost:8000/api/auth/foodpartner/login',
                { email, password },
                { withCredentials: true }
            )
            console.log(`Partner ${email} logged in successfully`)
            
            // Store token in localStorage if provided
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            
            navigate('/foodPartner/dashboard')
        } catch (err) {
            console.error('Login failed', err)
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.'
            alert(errorMessage) // Show error to user
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-header-type">Partner</span>
                        <h1>Partner Login</h1>
                        <p>Access your restaurant dashboard and manage your business</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password">Password</label>
                                <a href="#" className="auth-footer-link" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-checkbox">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full-width">
                            Sign In to Dashboard
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary btn-full-width"
                        onClick={() => navigate('/user/login')}
                    >
                        Switch to Customer Login
                    </button>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have a restaurant account?{' '}
                            <a href="/foodPartner/register" className="auth-footer-link">
                                Register Now
                            </a>
                        </p>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 'var(--line-height-relaxed)' }}>
                        <p>For support contact: <strong>partner@zomato.com</strong></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodPartnerLogin
