import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {listUsers} from "../../Services/UserService.js";

const ListUser = () => {
    const [users, setUsers] = useState([]);
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

    return (
        <div className='listcontainer'>
            <h2 className='text-bg-dark'>List of Users</h2>
            <button type='button' className='btn btn-secondary mb-2' onClick={addNewUser}>Add User</button>
            <button type='button' className='btn btn-secondary mb-2'>Assign Team Leaders</button>
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
                                <button type='button' className='btn btn-info mb-2' onClick={() => updateUser(user.userId)}>Update</button>
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
