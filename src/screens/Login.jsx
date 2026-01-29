import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Default credentials as requested
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid administrator credentials. Please check your username and password.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card fade-in">
                <div className="login-header">
                    <div className="company-logo">
                        <img src={logo} alt="Shree Kalpdeep Logo" className="logo-image" />
                    </div>
                    <h3>Courier management system</h3>
                    <p>Internal Administrator Access Only</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-field">
                        <label htmlFor="username">Administrator Username</label>
                        <div className="input-wrapper">
                            <User size={18} className="field-icon" />
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError('');
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label htmlFor="password">Administrator Password</label>
                        <div className={`input-wrapper ${error ? 'error' : ''}`}>
                            <Lock size={18} className="field-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <div className="login-footer">
                        <div className="security-tag">
                            <ShieldCheck size={16} />
                            <span>Secure Encrypted Session</span>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        Login to Dashboard
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-bottom-text">
                    <p>© 2026 DTDC Express Ltd. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
