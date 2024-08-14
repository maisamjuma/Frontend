import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {listUsers} from "../../Services/UserService.js";
import RoleService from '../../Services/RoleService';

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

    // function handleSaveRole() {
    //     // Here you would typically make an API call to save the new role
    //     console.log('New Role:', newRole);
    //
    //     // Reset state and hide the input
    //     setNewRole('');
    //     setIsAddingRole(false);
    // }

    // function handleSaveRole() {
    //     // Ensure newRole is not empty before making the API call
    //     if (!newRole) {
    //         console.error('Role data is missing');
    //         return;
    //     }
    //
    //     // Call the createRole method from RoleService
    //     RoleService.createRole(newRole)
    //         .then(response => {
    //             // Handle success
    //             console.log('Role created successfully:', response.data);
    //
    //             // Reset state and hide the input
    //             setNewRole(''); // Assuming newRole is a string, adjust if it's an object
    //             setIsAddingRole(false);
    //         })
    //         .catch(error => {
    //             // Handle error
    //             console.error('Error creating role:', error);
    //         });
    // }

    const handleSaveRole = (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (newRole.trim()) { // Check if newRole is not empty
            const role = {
                // Assuming newRole is an object with properties
                roleName: newRole // Adjust this if newRole has a different structure
            };

            console.log('Role => ' + JSON.stringify(role));

            RoleService.createRole(role)
                .then(() => {
                    // Handle success
                    setSuccessMessage('Role added successfully!');
                    // Reset state
                    setNewRole('');
                    setIsAddingRole(true);
                })
                .catch(error => {
                    // Handle error
                    console.error('There was an error adding the role!', error);
                });
        } else {
            console.error('Role data is missing or invalid');
        }
    };

    return (
        <div className='listcontainer'>
            <h2 className='text-bg-dark'>List of Users</h2>
            <button type='button' className='btn btn-secondary mb-2' onClick={addNewUser}>Add User</button>
            <button type='button' className='btn btn-secondary mb-2' onClick={assignTeamLeader}>Assign Team Leaders
            </button>

            <button
                type='button'
                className='btn btn-secondary mb-2'
                onClick={() => setIsAddingRole(!isAddingRole)}
            >
                {isAddingRole ? 'Cancel' : 'Add new role'}
            </button>

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
                {
                    users.map(user => (
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
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
