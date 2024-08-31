import React, {useEffect, useState, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import UserService from "../Services/UserService.js";
import RoleService from '../Services/RoleService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus, faUserShield, faUserTag} from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';
import {userIsAdmin} from '../utils/authUtils'; // Import the utility function

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [isAssigning, setIsAssigningTeamLeader] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [newTeamLeader, setNewTeamLeader] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // New state for isAdmin checkbox
    const [successMessage, setSuccessMessage] = useState('');
    const navigator = useNavigate();

    const userRoleIsAdmin = userIsAdmin(); // Check if the user is an admin
    // Refs for scrolling
    const assignContentRef = useRef(null);
    const roleContentRef = useRef(null);

    useEffect(() => {
        UserService.getAllUsers().then((response) => {
            setUsers(response.data);
        }).catch(error => console.log(error));
    }, []);

    function addNewUser() {
        navigator('/main/User');
    }

    function handleRoleChange(e) {
        setSelectedRole(e.target.value);
    }

    function handleTeamLeaderChange(e) {
        setNewTeamLeader(e.target.value);
    }

    function handleIsAdminChange(e) {
        setIsAdmin(e.target.checked); // Handle checkbox change
    }

    const handleSaveTeamLeader = () => {
        console.log('Assigning team leader...');
        console.log('Selected Role:', selectedRole);
        console.log('Selected Member:', newTeamLeader);
        console.log('Is Admin:', isAdmin); // Log isAdmin value
        // Implement your save logic here, e.g., making an API call to assign the role to the user.
    };

    const handleSaveRole = (e) => {
        e.preventDefault();

        if (newRole.trim()) {
            const role = {
                roleName: newRole
            };

            RoleService.createRole(role)
                .then(() => {
                    setSuccessMessage('Role added successfully!');
                    setNewRole('');
                    // Optionally close the role addition form
                })
                .catch(error => {
                    console.error('There was an error adding the role!', error);
                });
        } else {
            console.error('Role data is missing or invalid');
        }
    };

    const handleToggleAddRole = () => {
        if (!isAddingRole) {
            // Clear success message when opening the add role form
            setSuccessMessage('');
        }
        setIsAddingRole(!isAddingRole);
        if (!isAddingRole && roleContentRef.current) {
            roleContentRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleToggleAssignTeamLeader = () => {
        if (isAssigning) {
            setNewTeamLeader('');
            setSelectedRole('');
            setIsAdmin(false); // Reset the isAdmin checkbox when canceling
            // Optionally clear any relevant success message if needed
        }
        setIsAssigningTeamLeader(!isAssigning);
        if (!isAssigning && assignContentRef.current) {
            assignContentRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    return (
        <div className="forScroll">
            <div className='listcontainer'>
                <div className='video-container mb-3 d-flex align-items-center'>
                    <video width="20%" height="10%" autoPlay loop muted>
                        <source src="/videos/H.mp4" type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                    <div className='devtrack-text ms-3'>
                        <span className="dev fw-bold"
                              style={{fontSize: '24px'}}>Your one-stop platform for seamless </span>
                        <span className="track fw-bold" style={{fontSize: '24px'}}> team collaboration and project management.</span>
                    </div>
                </div>
                {userRoleIsAdmin && (

                    <div className="home-button-container">

                        <button type='button' className='btnAddUser' onClick={addNewUser}>
                            <FontAwesomeIcon icon={faUserPlus}/> Add User
                        </button>
                        <button
                            type='button'
                            className='btnAssignTeamLeader'
                            onClick={handleToggleAssignTeamLeader}
                        >
                            <FontAwesomeIcon icon={faUserShield}/>
                            {isAssigning ? 'Cancel' : 'Assign Team Leaders'}
                        </button>
                        {isAssigning && (
                            <div className='Assigncontent' ref={assignContentRef}>
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    className='form-control mb-2'
                                >
                                    <option value="">Select Role</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="QA">QA</option>
                                </select>

                                <select
                                    value={newTeamLeader}
                                    onChange={handleTeamLeaderChange}
                                    className='form-control mb-2'
                                >
                                    <option value="">Select Member</option>
                                    {users.map(user => (
                                        <option key={user.userId} value={user.userId}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>

                                <div className="form-check mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isAdminCheck"
                                        checked={isAdmin}
                                        onChange={handleIsAdminChange}
                                    />
                                    <label className="form-check-label" htmlFor="isAdminCheck">
                                        Is Admin
                                    </label>
                                </div>

                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={handleSaveTeamLeader}
                                >
                                    Save Team Leader
                                </button>
                            </div>
                        )}
                        <button
                            type='button'
                            className='btnAddRole'
                            onClick={handleToggleAddRole}
                        >
                            <FontAwesomeIcon icon={faUserTag}/> {isAddingRole ? 'Cancel' : 'Add new role'}
                        </button>
                    </div>
                )}
                {isAddingRole && (
                    <div className='rolecontent' ref={roleContentRef}>
                        <input
                            type='text'
                            value={newRole}
                            onChange={e => setNewRole(e.target.value)}
                            placeholder='Enter new role'
                            className='form-control mb-2'
                        />
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={handleSaveRole}
                        >
                            Save Role
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default HomePage;
