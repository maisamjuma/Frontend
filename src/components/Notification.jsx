// Notification.jsx
import React, {useState, useEffect} from 'react';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";
import {Filter} from "./SVGIcons.jsx";
import UserService from '../Services/UserService'; // Import your UserService
import NotificationService from '../Services/NotificationService.js';

const Notification = () => {

        const [loggedInUser, setLoggedInUser] = useState(null);
        const [showPopup, setShowPopup] = useState(false);
        const [selectedUsers, setSelectedUsers] = useState([]);
        const [message, setMessage] = useState('');
        const [messages, setMessages] = useState([]);
        const [filterPopupVisible, setFilterPopupVisible] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedUserForFilter, setSelectedUserForFilter] = useState('');
        const [users, setUsers] = useState([]);

        useEffect(() => {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log("user from the localStorage: ", user);
                setLoggedInUser(user); // Set as the parsed user object
            }

            const fetchUsers = async () => {
                try {
                    const response = await UserService.getAllUsers();
                    console.log("setUsers(response.data): ", response.data);
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            const fetchNotifications = async () => {
                if (loggedInUser) {
                    try {
                        const response = await NotificationService.getNotificationsByUserId(loggedInUser.userId);
                        setMessages(response.data);
                    } catch (error) {
                        console.error('Error fetching notifications:', error);
                    }
                }
            };

            fetchUsers();
            fetchNotifications();
        }, [loggedInUser]);

        const handleSendNotification = async () => {
            if (selectedUsers.length && message) {
                try {
                    const notifications = await Promise.all(
                        selectedUsers.map(async (userId) => {
                            const newNotification = {
                                message: message,
                                userId: loggedInUser.userId, // The sender's userId
                                to: selectedUsers, // Array of recipient userIds
                                isRead: true
                            };
                            console.log(newNotification);

                            const response = await NotificationService.createNotification(newNotification);
                            return response.data;
                        })
                    );

                    setMessages([...notifications, ...messages]);
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
            setFilterPopupVisible(false);
        };

        const filteredUsers = users.filter(user =>
            user && user.firstName && user.firstName.toLowerCase().includes((searchQuery || '').toLowerCase())
        );

        const filteredMessages = selectedUserForFilter
            ? messages.filter(msg =>
                msg.userId === selectedUserForFilter || (msg.to && msg.to.includes(selectedUserForFilter))
            )
            : messages;

        return (
            <div>
                <Navbar/>
                <nav className="secondary-navbarN">
                    <h4>Notifications</h4>
                    <div
                        className="filterIcon"
                        onMouseEnter={handleFilterIconMouseEnter}
                        onMouseLeave={handleFilterIconMouseLeave}
                    >
                        <Filter/>
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
                                            key={user.userId}
                                            className="user-item"
                                            onClick={() => user && user.userId && handleUserFilterClick(user.userId)}
                                        >
                                            {user.firstName} {user.lastName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="d-flex">
                    <SideBarForNoti
                        users={users}
                        loggedInUser={loggedInUser}
                        onSendNotification={() => setShowPopup(true)}
                    />
                    <div className="main-contentN">
                        <div className="message-list border-2 d-flex flex-row g-5">
                            {filteredMessages.map((msg, index) => {
                                const fromUser = users.find(user => user.userId === msg.userId);
                                const fromName = fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : 'Unknown Sender';

                                const recipientNames = Array.isArray(msg.to)
                                    ? msg.to.map(userId => {
                                        const recipient = users.find(user => user.userId === userId);
                                        return recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown Recipient';
                                    }).join(', ')
                                    : 'Unknown Recipient';

                                return (
                                    <div key={index} className="message-item" onClick={() => setShowPopup(msg)}>
                                        <strong>From:</strong> {fromName}<br/>
                                        <strong>To:</strong> {recipientNames}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            {typeof showPopup === 'object' ? (
                                <>
                                    <h4>Message Details</h4>
                                    <p className="border-1">
                                        <strong>From:</strong> {users.find(user => user.userId === showPopup.userId)?.firstName} {users.find(user => user.userId === showPopup.userId)?.lastName}
                                    </p>
                                    <p>
                                        <strong>To:</strong> {Array.isArray(showPopup.to) ? showPopup.to.map(userId => users.find(user => user.userId === userId)?.firstName + ' ' + users.find(user => user.userId === userId)?.lastName).join(', ') : 'Unknown Recipient'}
                                    </p>
                                    <p><strong>Message:</strong> {showPopup.message}</p>
                                    <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4>New Message</h4>
                                    <div className="form-group">
                                        <label>Recipients</label>
                                        <ul className="user-selection">
                                            {users.map(user => (
                                                <li
                                                    key={user.userId}
                                                    className={`list-group-item ${selectedUsers.includes(user.userId) ? 'selected' : ''}`}
                                                    onClick={() => handleUserSelection(user.userId)}
                                                >
                                                    {user.firstName} {user.lastName}
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
                                        <button className="saveNotificationBtn" onClick={handleSendNotification}>Send
                                        </button>
                                        <button className="cancelButton" onClick={() => setShowPopup(false)}>Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default Notification;

