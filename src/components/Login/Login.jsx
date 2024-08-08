// src/components/Login.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.module.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Call the onLogin function to handle login
        onLogin();
    };


        return (
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Login</h2>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
