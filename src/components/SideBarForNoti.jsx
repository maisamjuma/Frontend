// SideBarForNoti.jsx
import React from 'react';
import './SideBarForNoti.css';

const SideBarForNoti = ({ users, loggedInUser, onSendNotification }) => {
    return (
        <div className="sidebar">
            <div className="d-flex flex-row">
                <h4>Users</h4>
                <button className="btn btn-primary mt-0 p-0 " onClick={onSendNotification}>
                    New Message
                </button>
            </div>
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

        </div>
    );
};

export default SideBarForNoti;
