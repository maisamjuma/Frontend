import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './SideBarForNoti.css';
import {userIsAdmin, userIsTeamLeader} from '../utils/authUtils'; // Import the utility functions
// import UserService from '../Services/UserService';
import RoleService from "../Services/RoleService.js"; // Assuming you have a service to fetch roles

const SideBarForNoti = ({users, loggedInUser, onSendNotification}) => {
    // Check if the logged-in user is an admin or team leader
    const isAdmin = userIsAdmin(loggedInUser);
    const isTeamLeader = userIsTeamLeader(loggedInUser);

    const [loggedInUserRole, setLoggedInUserRole] = useState(null);
    const [userRoles, setUserRoles] = useState({}); // To store fetched roles for all users

    // Fetch role name by functionalRoleId for a user
    const fetchRoleName = async (roleId) => {
        try {
            const response = await RoleService.getRoleById(roleId);
            console.log("response.data.roleName", response.data.roleName)
            return response.data.roleName; // Assuming the API returns the roleName field

        } catch (error) {
            console.error(`Error fetching role for roleId: ${roleId}`, error);
            return 'Unknown Role';
        }
    };

    useEffect(() => {
        // Fetch the role of the logged-in user
        const fetchLoggedInUserRole = async () => {
            if (loggedInUser?.functionalRoleId) {
                const roleName = await fetchRoleName(loggedInUser.functionalRoleId);
                console.log("loggedInUser", roleName)
                setLoggedInUserRole(roleName);
            }
        };

        // Fetch the roles of all users
        const fetchAllUserRoles = async () => {
            const roles = {};
            const rolePromises = users.map(async (user) => {
                console.log("role id", user.functionalRoleId)
                const roleName = await fetchRoleName(user.functionalRoleId);
                console.log("user", roleName)
                roles[user.userId] = roleName; // Store role name with userId as key
            });

            await Promise.all(rolePromises);
            setUserRoles(roles); // Set the fetched roles in state
        };

        fetchLoggedInUserRole();
        fetchAllUserRoles();
    }, [loggedInUser, users]);

    // Filter users who have the same role as the logged-in user
    const usersWithMatchingRole = users.filter(user => {
        return userRoles[user.userId] === loggedInUserRole;
    });

    return (
        <div className="sidebar">
            {/* Conditionally render 'New Message' button */}
            <div className="d-flex flex-column align-items-center justify-content-center">
                <button className="btn-primary" onClick={onSendNotification}>
                    New Message
                </button>
                <h4>Users</h4>
            </div>

            {/* Conditionally render users based on roles */}
            {(!isAdmin && !isTeamLeader) && (
                <ul className="list-group">
                    {usersWithMatchingRole.map(user => (
                        <li
                            key={user.userId}
                            className={`list-group-item ${user.email === loggedInUser.email ? 'highlight' : ''}`}
                        >
                            {user.firstName} {user.lastName}
                        </li>
                    ))}
                </ul>
            )}

            {/* Render all users if the logged-in user is an admin or team leader */}
            {(isAdmin || isTeamLeader) && (
                <ul className="list-group">
                    {users.map(user => (
                        <li
                            key={user.userId}
                            className={`list-group-item ${user.email === loggedInUser.email ? 'highlight' : ''}`}
                        >
                            {user.firstName} {user.lastName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Define prop types for validation
SideBarForNoti.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            email: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            functionalRoleId: PropTypes.number.isRequired, // Assuming functionalRoleId is a number
        })
    ).isRequired,
    loggedInUser: PropTypes.shape({
        email: PropTypes.string.isRequired,
        functionalRoleId: PropTypes.number.isRequired, // Assuming functionalRoleId is a number
    }).isRequired,
    onSendNotification: PropTypes.func.isRequired,
};

export default SideBarForNoti;
