import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserService.js';
import RoleService from "../../Services/RoleService.js";
import './ListUser.css';
import { Container } from "react-bootstrap";
import { Row } from "antd";

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                const usersData = response.data;

                const roleResponse = await RoleService.getAllRoles();
                const rolesData = roleResponse.data;
                const roleMap = rolesData.reduce((acc, role) => {
                    acc[role.funcRoleId] = role.roleName;
                    return acc;
                }, {});

                const transformedUsers = usersData.map(user => {
                    const createdAt = new Date(user.createdAt);
                    const updatedAt = new Date(user.updatedAt);

                    return {
                        userId: user.userId,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        functionalRoleId: user.functionalRoleId,
                        roleName: roleMap[user.functionalRoleId] || 'Unknown Role',
                        isTeamLeader: user.isTeamLeader,
                        createdAt: `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        updatedAt: `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    };
                });

                setUsers(transformedUsers);
            } catch (error) {
                console.error('Error fetching users or roles:', error);
            }
        };
        fetchUsers();
    }, []);

    const updateUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Employee Directory</h2>
            <Row>
                {users.map(user => (
                    <div key={user.userId} className="col-md-6 col-lg-4 mb-4">
                        <div className="card user-card p-3 shadow-sm">
                            <h3 className="card-title text-primary mb-2">
                                {user.firstName} {user.lastName}
                            </h3>
                            <h5 className="card-subtitle mb-3 text-muted">
                                {user.roleName}
                            </h5>
                            <p className="card-text"><strong>Email:</strong> {user.email}</p>
                            <p className="card-text"><strong>Team Leader:</strong> {user.isTeamLeader ? 'Yes' : 'No'}</p>
                            <p className="card-text"><strong>Joined:</strong> {user.createdAt}</p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button
                                    type='button'
                                    className='btn btn-info'
                                    onClick={() => updateUser(user.userId)}
                                >
                                    Update
                                </button>
                                <small className="text-muted"><em>Last Updated: {user.updatedAt}</em></small>
                            </div>
                        </div>
                    </div>
                ))}
            </Row>
        </Container>
    );
};

export default ListUser;
