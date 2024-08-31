// Notification.jsx
import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import PropTypes from 'prop-types'; // Import PropTypes
import SideBarForNoti from "./SideBarForNoti.jsx";
import { Filter } from "./SVGIcons.jsx";
import UserService from '../Services/UserService'; // Import your UserService
import NotificationService from '../Services/NotificationService.js';

const Notification = ({ loggedInUser }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserForFilter, setSelectedUserForFilter] = useState('');
    const [users, setUsers] = useState([]); // State to store fetched users

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers(); // Fetch users from the database
                setUsers(response.data); // Update state with fetched users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await NotificationService.getNotificationsByUserId(loggedInUser.userId);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchUsers();
        fetchNotifications();
    }, [loggedInUser]);

    const handleSendNotification = async () => {
        if (selectedUsers.length && message) {
            const newNotification = { from: loggedInUser, to: selectedUsers, message };
            try {
                await NotificationService.createNotification(newNotification);
                setMessages([newNotification, ...messages]);
                setShowPopup(false);
                resetForm();
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }
    };

    const resetForm = () => {
        setMessage('');
        setSelectedUsers([]);
    };

    const handleUserSelection = (user) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(user)
                ? prevSelectedUsers.filter(u => u !== user)
                : [...prevSelectedUsers, user]
        );
    };

    const handleFilterIconMouseEnter = () => setFilterPopupVisible(true);
    const handleFilterIconMouseLeave = () => setFilterPopupVisible(false);

    const handleUserFilterClick = (user) => {
        setSelectedUserForFilter(user);
        setFilterPopupVisible(false); // Hide filter popup after selection
    };

    const filteredUsers = users.filter(user =>
        user && user.firstName && user.firstName.toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    // Filter messages based on the selected user
    const filteredMessages = selectedUserForFilter
        ? messages.filter(msg =>
            msg.from === selectedUserForFilter || msg.to.includes(selectedUserForFilter)
        )
        : messages;

    return (
        <div>
            <Navbar />
            <nav className="secondary-navbarN">
                <h4>Notifications</h4>
                <div
                    className="filterIcon"
                    onMouseEnter={handleFilterIconMouseEnter}
                    onMouseLeave={handleFilterIconMouseLeave}
                >
                    <Filter />
                    {filterPopupVisible && (
                        <div
                            className="search-popup active"
                            onMouseLeave={handleFilterIconMouseLeave}
                        >
                            <input
                                type="text"
                                placeholder="Search by firstName..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ul className="user-list">
                                {filteredUsers.map(user => (
                                    <li
                                        key={user.userId} // Ensure this is a unique identifier
                                        className="user-item"
                                        onClick={() => user && user.userId && handleUserFilterClick(user.userId)}
                                    >
                                        {user && user.firstName ? user.firstName : 'Unknown User'} {/* Assuming 'firstName' is the property */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
            <div className="d-flex">
                <SideBarForNoti
                    users={users} // Pass users to SideBarForNoti
                    loggedInUser={loggedInUser}
                    onSendNotification={() => setShowPopup(true)}
                />
                <div className="main-contentN">
                    <div className="message-list border-2 d-flex flex-row g-5">
                        {filteredMessages.map((msg, index) => (
                            <div key={index} className="message-item" onClick={() => setShowPopup(msg)}>
                                <strong>From:</strong> {msg.from}<br />
                                <strong>To:</strong> {msg.to.join(', ')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        {typeof showPopup === 'object' ? (
                            <>
                                <h4>Message Details</h4>
                                <p className="border-1"><strong>From:</strong> {showPopup.from}</p>
                                <p><strong>To:</strong> {showPopup.to.join(', ')}</p>
                                <p><strong>Message:</strong> {showPopup.message}</p>
                                <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
                            </>
                        ) : (
                            <>
                                <h4>New Message</h4>
                                <div className="form-group">
                                    <label>Recipients</label>
                                    <ul className="user-selection">
                                        {users.map(user => (
                                            <li
                                                key={user.userId} // Ensure this is a unique identifier
                                                className={`list-group-item ${selectedUsers.includes(user.userId) ? 'selected' : ''}`}
                                                onClick={() => handleUserSelection(user.userId)} // Use firstname for selection
                                            >
                                                {user.firstName} {user.lastName}{/* Display firstName */}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="form-group mt-2">
                                    <label>Message</label>
                                    <textarea
                                        className="form-control"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                    />
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <button className="btn btn-primary" onClick={handleSendNotification}>Send</button>
                                    <button className="cancelButton" onClick={() => setShowPopup(false)}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
// Define prop types for validation
Notification.propTypes = {
    loggedInUser: PropTypes.shape({
        userId: PropTypes.string.isRequired,
    }).isRequired,
};

export default Notification;
