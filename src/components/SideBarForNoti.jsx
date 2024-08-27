import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './SideBarForNoti.css';

const SideBarForNoti = ({ users, loggedInUser, onSendNotification }) => {
    return (
        <div className="sidebar">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <button className="btn-primary" onClick={onSendNotification}>
                    New Message
                </button>
                <h4>Users</h4>

            </div>
            <ul className="list-group">
                {users.map(user => (
                    <li
                        key={user.userId} // Ensure this is a unique identifier
                        className={`list-group-item ${user.username === loggedInUser ? 'highlight' : ''}`}
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Define prop types for validation
SideBarForNoti.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
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
