import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserService.js';
import './ListUser.css';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                // Transform the response data to use correct field names
                const transformedUsers = response.data.map(user => ({
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    functionalRoleId: user.functionalRoleId, // Updated to match the API response
                    isTeamLeader: user.isTeamLeader,
                    createdAt: new Date(user.createdAt).toLocaleString(), // Formatting date
                    updatedAt: new Date(user.updatedAt).toLocaleString()  // Formatting date
                }));
                setUsers(transformedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const updateUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    return (
        <div>
            <h2 className='text-bg-dark'>List of Users</h2>
            <div className="user-table-container">
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>User Id</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role ID</th>
                        <th>Is Team Leader?</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.functionalRoleId}</td>
                            <td>{user.isTeamLeader ? 'Yes' : 'No'}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.updatedAt}</td>
                            <td>
                                <button
                                    type='button'
                                    className='btn btn-info mb-2'
                                    onClick={() => updateUser(user.userId)}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListUser;
