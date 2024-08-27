// src/components/Login.jsx
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import UserService from "../../Services/UserService.js";

const Login = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [username, setUsername] = useState('');
    const [error, setError] = useState('')

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     // Call the onLogin function to handle login
    //     onLogin();
    // };

    const handleLogin =  async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(password,email)
            // console.log("userData userData:",userData)
            if (userData.token) {
                localStorage.setItem('token', userData.token)
                localStorage.setItem('role', userData.role)
                // navigate('/profile')
                onLogin();//the line that navigates to the main page
            }else{
                setError(userData.message)
            }

        } catch (error) {
            console.log(error)
            setError(error.message)
            setTimeout(()=>{
                setError('');
            }, 5000);
        }
    }

    return (
        <div className="login-container">
            {/*<h2>Login</h2>*/}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">

                <h2>Login</h2>
                {/*<h2>username</h2>*/}
                {/*<label>*/}
                {/*    username:*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        value={username}*/}
                {/*        onChange={(e) => setUsername(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*</label>*/}
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
