import React, { useEffect, useState } from 'react';
// import { createUser, getUserById } from '../Services/UserService';
import UserService from '../Services/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import './User.css';

const User = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            UserService.getUserById(id)
                .then((response) => {
                    const { username, email, password, firstName, lastName, role, isTeamLeader } = response.data;
                    setUsername(username);
                    setEmail(email);
                    setPassword(password);
                    setFirstName(firstName);
                    setLastName(lastName);
                    setRole(role);
                    setIsTeamLeader(isTeamLeader);
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setIsTeamLeader(checked);
        } else {
            switch (name) {
                case 'username':
                    setUsername(value);
                    break;
                case 'email':
                    setEmail(value);
                    break;
                case 'password':
                    setPassword(value);
                    break;
                case 'firstName':
                    setFirstName(value);
                    break;
                case 'lastName':
                    setLastName(value);
                    break;
                case 'role':
                    setRole(value);
                    break;
                default:
                    break;
            }
        }
    };

    const saveUser = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const user = { username, email, password, firstName, lastName, role, isTeamLeader };
            UserService.createUser(user)
                .then((response) => {
                    console.log('User saved:', response.data);
                    navigate('/main/ListUsers'); // Navigate to the user list
                })
                .catch((error) => {
                    console.error('Error saving user:', error);
                });
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = {};

        if (!username.trim()) {
            errorsCopy.username = 'Username is required';
            valid = false;
        }

        if (!email.trim()) {
            errorsCopy.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            errorsCopy.email = 'Email address is invalid';
            valid = false;
        }

        if (!password.trim()) {
            errorsCopy.password = 'Password is required';
            valid = false;
        } else if (password.trim().length < 6) {
            errorsCopy.password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!firstName.trim()) {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        }

        if (!lastName.trim()) {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        }

        if (!role.trim()) {
            errorsCopy.role = 'Role is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const pageTitle = () => {
        return id ? <h2 className="card-header">Update User</h2> : <h2 className="card-header">Add User</h2>;
    };

    return (
        <div className="full-screen-center">
            <div className="card">
                {pageTitle()}
                <div className="card-body">
                    <form onSubmit={saveUser}>
                        <div className="form-group mb-2">
                            <label className="form-label">Username:</label>
                            <input
                                type="text"
                                placeholder="Enter a Username for The Employee"
                                name="username"
                                value={username}
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                placeholder="Enter Employee Email"
                                name="email"
                                value={email}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={password}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">First Name:</label>
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                name="firstName"
                                value={firstName}
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">Last Name:</label>
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                name="lastName"
                                value={lastName}
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className="form-label">Role:</label>
                            <input
                                type="text"
                                placeholder="Enter Role"
                                name="role"
                                value={role}
                                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                            />
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                        </div>
                        <div className="form-check mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isTeamLeader"
                                name="isTeamLeader"
                                checked={isTeamLeader}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="isTeamLeader">Team Leader</label>
                        </div>
                        <button type="submit" className="btn btn-success">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default User;
