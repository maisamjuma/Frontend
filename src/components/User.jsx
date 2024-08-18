import React, { useEffect, useState } from 'react';
import UserService from "../Services/UserService";
import RoleService from "../Services/RoleService";
import { useNavigate, useParams } from "react-router-dom";
import "./User.css";

const User = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
        isTeamLeader: '',
    });

    useEffect(() => {
        // Fetch roles from the database
        RoleService.getAllRoles().then(response => {
            setRoles(response.data);
        }).catch(error => {
            console.error("Error fetching roles", error);
        });

        // If an ID is present, fetch the user details
        if (id) {
            UserService.getUserById(id).then(response => {
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setRole(response.data.role);
                setIsTeamLeader(response.data.isTeamLeader);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [id]);

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
            const user = { username, email, password, firstName, lastName, role, isTeamLeader };
            console.log(user);
            UserService.createUser(user).then((response) => {
                console.log(response.data);
                navigate('/main'); // Update the path to where you want to navigate
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

        setErrors(errorsCopy);
        return valid;
    };

    const pageTitle = () => {
        return id ? (
            <h2 className="card-header">Update User</h2>
        ) : (
            <h2 className="card-header">Add User</h2>
        );
    };

    return (
        <div className="full-screen-center">
            <div className="card">
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
                            <select
                                name="role"
                                value={role}
                                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                onChange={handleRole}
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <div className='invalid-feedback'>{errors.role}</div>}
                        </div>
                        <div className="form-group mb-2">
                            <label className='form-label'>Is Team Leader:</label>
                            <input
                                type="checkbox"
                                name="isTeamLeader"
                                checked={isTeamLeader}
                                onChange={handleIsTeamLeader}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default User;
