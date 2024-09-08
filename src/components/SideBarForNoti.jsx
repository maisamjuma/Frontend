import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './SideBarForNoti.css';
import { userIsAdmin, userIsTeamLeader } from '../utils/authUtils'; // Import the utility functions

const SideBarForNoti = ({ users, loggedInUser, onSendNotification }) => {
    // Check user roles
    const isAdmin = userIsAdmin(loggedInUser);
    const isTeamLeader = userIsTeamLeader(loggedInUser);

    return (
        <div className="sidebar">
            {/* Conditionally render 'New Message' button */}
            {(isAdmin || isTeamLeader) && (
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <button className="btn-primary" onClick={onSendNotification}>
                        New Message
                    </button>
                    <h4>Users</h4>
                </div>
            )}

            {/* Conditionally render the user list */}
            {(isAdmin || isTeamLeader) && (
                <ul className="list-group">
                    {users.map(user => (
                        <li
                            key={user.userId} // Ensure this is a unique identifier
                            className={`list-group-item ${user.email === loggedInUser ? 'highlight' : ''}`}
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
            role: PropTypes.number.isRequired,
        })
    ).isRequired,
    loggedInUser: PropTypes.string.isRequired,
    onSendNotification: PropTypes.func.isRequired
};

export default SideBarForNoti;
