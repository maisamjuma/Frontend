// SideBarForNoti.jsx
import React from 'react';
import './SideBarForNoti.css';

const SideBarForNoti = ({ users, loggedInUser, onSendNotification }) => {
    return (
        <div className="sidebar">
            <h4>Users</h4>
            <ul className="list-group">
                {users.map(user => (
                    <li
                        key={user}
                        className={`list-group-item ${user === loggedInUser ? 'highlight' : ''}`}
                    >
                        {user}
                    </li>
                ))}
            </ul>
            <button className="btn btn-primary mt-3" onClick={onSendNotification}>
                New Message
            </button>
        </div>
    );
};

export default SideBarForNoti;
