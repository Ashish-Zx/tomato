import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

function UserLogin() {
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
            await axios.post(
                'http://localhost:8000/api/auth/user/login',
                { email, password },
                { withCredentials: true }
            )
            console.log(`User ${email} logged in successfully`)
            navigate('/')
        } catch (err) {
            console.error('Login failed', err)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-header-type">Customer</span>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="john@example.com"
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
                            Sign In
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary btn-full-width"
                        onClick={() => navigate('/foodPartner/login')}
                    >
                        Switch to Partner Login
                    </button>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <a href="/user/register" className="auth-footer-link">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLogin
