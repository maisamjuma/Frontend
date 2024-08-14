import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { listUsers } from "../../Services/UserService.js";
import RoleService from '../../Services/RoleService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserShield, faUserTag } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import './ListUser.css';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [newRole, setNewRole] = useState('');
    const navigator = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        listUsers().then((response) => {
            setUsers(response.data);
        }).catch(error => console.log(error));
    }, []);

    function addNewUser() {
        navigator('/main/User');
    }

    function assignTeamLeader() {
        // navigator('/main/Project/CreateProjectComp');
    }

    function updateUser(id) {
        navigator(`/edit-user/${id}`);
    }

    function handleRoleChange(e) {
        setNewRole(e.target.value);
    }

    const handleSaveRole = (e) => {
        e.preventDefault();

        if (newRole.trim()) {
            const role = {
                roleName: newRole
            };

            console.log('Role => ' + JSON.stringify(role));

            RoleService.createRole(role)
                .then(() => {
                    setSuccessMessage('Role added successfully!');
                    setNewRole('');
                    setIsAddingRole(false);
                })
                .catch(error => {
                    console.error('There was an error adding the role!', error);
                });
        } else {
            console.error('Role data is missing or invalid');
        }
    };

    return (
        <div className='listcontainer'>
            {/* Video Element */}
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
                    <FontAwesomeIcon icon={faUserPlus} /> Add User
                </button>
                <button type='button' className='btnAssignTeamLeader' onClick={assignTeamLeader}>
                    <FontAwesomeIcon icon={faUserShield} /> Assign Team Leaders
                </button>

                <button
                    type='button'
                    className='btnAddRole'
                    onClick={() => setIsAddingRole(!isAddingRole)}
                >
                    <FontAwesomeIcon icon={faUserTag} /> {isAddingRole ? 'Cancel' : 'Add new role'}
                </button>
            </div>
            {isAddingRole && (
                <div className='mb-2'>
                    <input
                        type='text'
                        value={newRole}
                        onChange={handleRoleChange}
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
