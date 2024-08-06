import React, { useEffect, useState } from 'react';
import { createUser, getUser } from "../Services/UserService";
import { useNavigate, useParams } from "react-router-dom";

const User = () => {
    const navigator = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getUser(id).then((response) => {
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setRole(response.data.role);
                setIsTeamLeader(response.data.isTeamLeader);
                setCreatedAt(response.data.createdAt);
                setUpdatedAt(response.data.updatedAt);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [id]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
        isTeamLeader: '',
        createdAt: '',
        updatedAt: '',
    });

    const handleUsername = (e) => setUsername(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleRole = (e) => setRole(e.target.value);
    const handleIsTeamLeader = (e) => setIsTeamLeader(e.target.checked);

    const saveUser = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const user = { username, email, password, firstName, lastName, role, isTeamLeader, createdAt, updatedAt };
            console.log(user);
            createUser(user).then((response) => {
                console.log(response.data);
                navigator('/main/ListUsers'); // Update the path to where you want to navigate
            });
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!username.trim()) {
            errorsCopy.username = 'Username is required';
            valid = false;
        } else {
            delete errorsCopy.username;
        }

        if (!email.trim()) {
            errorsCopy.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            errorsCopy.email = 'Email address is invalid';
            valid = false;
        } else {
            delete errorsCopy.email;
        }

        if (!password.trim()) {
            errorsCopy.password = 'Password is required';
            valid = false;
        } else if (password.trim().length < 6) {
            errorsCopy.password = 'Password must be at least 6 characters';
            valid = false;
        } else {
            delete errorsCopy.password;
        }

        if (!firstName.trim()) {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        } else {
            delete errorsCopy.firstName;
        }

        if (!lastName.trim()) {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        } else {
            delete errorsCopy.lastName;
        }

        if (!role.trim()) {
            errorsCopy.role = 'Role is required';
            valid = false;
        } else {
            delete errorsCopy.role;
        }

        if (!createdAt.trim()) {
            errorsCopy.createdAt = 'Creation date is required';
            valid = false;
        } else {
            delete errorsCopy.createdAt;
        }

        if (!updatedAt.trim()) {
            errorsCopy.updatedAt = 'Update date is required';
            valid = false;
        } else {
            delete errorsCopy.updatedAt;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const pageTitle = () => {
        return id ? (
            <h2 className="card-header text-center">Update User</h2>
        ) : (
            <h2 className="card-header text-center">Add User</h2>
        );
    };

    return (
        <div className="container">
            <br /><br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    {pageTitle()}
                    <div className="card-body">
                        <form onSubmit={saveUser}>
                            <div className="form-group mb-2">
                                <label className='form-label'>Username:</label>
                                <input
                                    type="text"
                                    placeholder="Enter a Username for The Employee"
                                    name="username"
                                    value={username}
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    onChange={handleUsername}
                                />
                                {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Email:</label>
                                <input
                                    type="email"
                                    placeholder="Enter Employee Email"
                                    name="email"
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={handleEmail}
                                />
                                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Password:</label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    value={password}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    onChange={handlePassword}
                                />
                                {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>First Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    name="firstName"
                                    value={firstName}
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={handleFirstName}
                                />
                                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Last Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    value={lastName}
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={handleLastName}
                                />
                                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Role:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Role"
                                    name="role"
                                    value={role}
                                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                    onChange={handleRole}
                                />
                                {errors.role && <div className='invalid-feedback'>{errors.role}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Is Admin:</label>
                                <input
                                    type="checkbox"
                                    name="isTeamLeader"
                                    checked={isTeamLeader}
                                    className={`form-check-input ${errors.isTeamLeader ? 'is-invalid' : ''}`}
                                    onChange={handleIsTeamLeader}
                                />
                                {errors.isTeamLeader && <div className='invalid-feedback'>{errors.isTeamLeader}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Created At:</label>
                                <input
                                    type="datetime-local"
                                    name="createdAt"
                                    value={createdAt}
                                    className={`form-control ${errors.createdAt ? 'is-invalid' : ''}`}
                                    onChange={(e) => setCreatedAt(e.target.value)}
                                />
                                {errors.createdAt && <div className='invalid-feedback'>{errors.createdAt}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className='form-label'>Updated At:</label>
                                <input
                                    type="datetime-local"
                                    name="updatedAt"
                                    value={updatedAt}
                                    className={`form-control ${errors.updatedAt ? 'is-invalid' : ''}`}
                                    onChange={(e) => setUpdatedAt(e.target.value)}
                                />
                                {errors.updatedAt && <div className='invalid-feedback'>{errors.updatedAt}</div>}
                            </div>
                            <button type="submit" className="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;
