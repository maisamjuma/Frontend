import React, { useEffect, useState } from 'react';
// import { createUser, getUserById } from '../Services/UserService';
import UserService from '../Services/UserService';

import RoleService from "../Services/RoleService";
// import { createUser,checkUserRoles } from '../Services/authService.js'; // Import from FirebaseAuthService
// import { checkUserRoles } from '../firebase/auth.js'; // Import from auth.js (update the path accordingly)
// import { useNavigate } from 'react-router-dom';
// import RoleService from "../Services/RoleService";
import { useNavigate, useParams } from 'react-router-dom';
import './User.css';

const User = () => {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    // const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [functionalRoleId, setFunctionalRoleId] = useState('');
    // const [functionalRoleId, setFunctionalRoleId] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({
        // username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
        // isTeamLeader: '',
    });

    useEffect(() => {
        // Fetch roles from the database
        RoleService.getAllRoles().then(response => {
            // Update the roles state with the fetched data
            setRoles(response.data.map(role => ({
                funcRoleId: role.funcRoleId,
                roleName: role.roleName
            })));
        }).catch(error => {
            console.error("Error fetching roles", error);
        });
    }, []);


    // const handleUsername = (e) => setUsername(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleRole = (e) => setFunctionalRoleId(e.target.value);
    // const handleIsTeamLeader = (e) => setIsTeamLeader(e.target.checked);
    // const handleIsAdmin = (e) => setIsAdmin(e.target.checked);

    const handleIsTeamLeader = (e) => {
        setIsTeamLeader(e.target.checked);
        if (e.target.checked) {
            setIsAdmin(false); // Uncheck isAdmin if isTeamLeader is checked
        }
    };

    const handleIsAdmin = (e) => {
        setIsAdmin(e.target.checked);
        if (e.target.checked) {
            setIsTeamLeader(false); // Uncheck isTeamLeader if isAdmin is checked
        }
    };

    const saveUser = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const user = {
                    email,
                    password,
                    firstName,
                    lastName,
                    functionalRoleId,
                    isTeamLeader,
                    isAdmin
                };
                console.log(" functionalRoleId:", functionalRoleId);


                console.log(" User:", user);

                // Save user details using the register method
                const response = await UserService.register(user);
                // const response = await UserService.register(user);


                // Log the user object and the response data for debugging
                console.log(" User:", user);
                console.log("Response :", response);

                // Navigate to the desired page after successful user creation
                navigate('/main');
            } catch (error) {
                console.error("Error saving user:", error);
            }
        }
    };



    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        // if (!username.trim()) {
        //     errorsCopy.username = 'Username is required';
        //     valid = false;
        // } else {
        //     delete errorsCopy.username;
        // }

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

        if (!functionalRoleId.trim()) {
            errorsCopy.role = 'Role is required';
            valid = false;
        } else {
            delete errorsCopy.role;
        }

        setErrors(errorsCopy);
        return valid;
    };

    return (
        <div className="full-screen-center">
            <div className="card">
                <h2 className="card-header">Add User</h2>
                <div className="card-body">
                    <form onSubmit={saveUser}>
                        <div className="form-row">
                            {/*<div className="form-group mb-2 vertical-group">*/}
                            {/*    <label className='form-label'>Username:</label>*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        placeholder="Enter a Username for The Employee"*/}
                            {/*        name="username"*/}
                            {/*        value={username}*/}
                            {/*        className={`form-control ${errors.username ? 'is-invalid' : ''}`}*/}
                            {/*        onChange={handleUsername}*/}
                            {/*    />*/}
                            {/*    {errors.username && <div className='invalid-feedback'>{errors.username}</div>}*/}
                            {/*</div>*/}
                            <div className="form-group mb-2 vertical-group">
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
                            <div className="form-group mb-2 vertical-group">
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
                        </div>
                        <div className="form-row">
                            <div className="form-group mb-2 horizontal-group">
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
                            <div className="form-group mb-2 horizontal-group">
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
                            <div className="form-group mb-2 horizontal-group">
                                <label className='form-label'>Role:</label>
                                <select
                                    name="role"
                                    value={functionalRoleId}
                                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                    onChange={handleRole}
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.funcRoleId} value={role.funcRoleId}>
                                            {role.roleName}
                                            {/*{role.roleId}*/}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <div className='invalid-feedback'>{errors.role}</div>}
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <div className="checkbox-container">
                                <label className='teamleaderlabel'>Is Team Leader:</label>
                                <input
                                    type="checkbox"
                                    name="isTeamLeader"
                                    checked={isTeamLeader}
                                    onChange={handleIsTeamLeader}
                                />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <div className="checkbox-container">
                                <label className='adminlabel'>Is Admin:</label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={isAdmin}
                                    onChange={handleIsAdmin}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default User;
