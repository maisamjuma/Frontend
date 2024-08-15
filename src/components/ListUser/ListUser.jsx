import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {listUsers} from "../../Services/UserService.js";
import RoleService from '../../Services/RoleService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus, faUserShield, faUserTag} from '@fortawesome/free-solid-svg-icons';
import './ListUser.css';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [isAssigning, setIsAssigningTeamLeader] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [newTeamLeader, setNewTeamLeader] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigator = useNavigate();

    useEffect(() => {
        listUsers().then((response) => {
            setUsers(response.data);
        }).catch(error => console.log(error));
    }, []);

    function addNewUser() {
        navigator('/main/User');
    }

    function updateUser(id) {
        navigator(`/edit-user/${id}`);
    }

    function handleRoleChange(e) {
        setSelectedRole(e.target.value);
    }

    function handleTeamLeaderChange(e) {
        setNewTeamLeader(e.target.value);
    }

    const handleSaveTeamLeader = () => {
        console.log('Assigning team leader...');
        console.log('Selected Role:', selectedRole);
        console.log('Selected Member:', newTeamLeader);
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
    };

    const handleToggleAssignTeamLeader = () => {
        if (isAssigning) {
            setNewTeamLeader('');
            setSelectedRole('');
            // Optionally clear any relevant success message if needed
        }
        setIsAssigningTeamLeader(!isAssigning);
    };

    return (
        <div className='listcontainer'>
            <div className='video-container mb-3 d-flex align-items-center'>
                <video width="25%" height="10%" autoPlay loop muted>
                    <source src="/videos/H.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
                <div className='devtrack-text ms-3'>
                    <span className="dev fw-bold" style={{fontSize: '24px'}}>Your one-stop platform for seamless </span>
                    <span className="track fw-bold" style={{fontSize: '24px'}}> team collaboration and project management.</span>
                </div>
            </div>
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
                    <div className='Assigncontent'>
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
            {isAddingRole && (
                <div className='rolecontent'>
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
            <h2 className='text-bg-dark'>List of Users</h2>

            <table className="table table-striped table-bordered">
                <thead>
                <tr>
                    <th>User Id</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Is Team Leader?</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.userId}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.password}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.role}</td>
                        <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                        <td>{user.createdAt}</td>
                        <td>{user.updatedAt}</td>
                        <td>
                            <button type='button' className='btn btn-info mb-2'
                                    onClick={() => updateUser(user.userId)}>Update
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
