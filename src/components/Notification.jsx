import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";
import { Filter } from "./SVGIcons.jsx";
import UserService from '../Services/UserService';
import NotificationService from '../Services/NotificationService.js';
import MessageItem from './MessageItem.jsx';

const Notification = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showNewMassagePopup, setShowNewMassagePopup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserForFilter, setSelectedUserForFilter] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLoggedInUser(user);
        }

        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            const fetchNotifications = async () => {
                try {
                    const [sentResponse, receivedResponse] = await Promise.all([
                        NotificationService.getNotificationsBySenderId(loggedInUser.userId),
                        NotificationService.getNotificationsByRecipientId(loggedInUser.userId)
                    ]);

                    // Combine sent and received messages
                    const allMessages = [...sentResponse.data, ...receivedResponse.data];
                    setMessages(allMessages);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
        }
    }, [loggedInUser]);

    const handleSendNotification = async () => {
        if (selectedUsers.length && message && loggedInUser?.userId) {
            try {
                const promises = selectedUsers.map(async (selectedUser) => {
                    const newNotification = {
                        message: message,
                        recipientId: selectedUser,
                        senderId: loggedInUser.userId,
                        isRead: true
                    };

                    const response = await NotificationService.createNotification(newNotification);

                    if (response.status === 200 || response.status === 201) {
                        return response.data;
                    } else {
                        console.error('Unexpected response status:', response.status);
                        return null;
                    }
                });

                const notifications = await Promise.all(promises);
                const successfulNotifications = notifications.filter(n => n !== null);

                if (successfulNotifications.length) {
                    setMessages([...successfulNotifications, ...messages]);
                    setShowNewMassagePopup(false);
                    resetForm();
                }
            } catch (error) {
                console.error('Error sending notification:', error.response?.data || error.message);
            }
        } else {
            console.warn('No users selected or message is empty or loggedInUser is not defined');
        }
    };

    const getRecipientNames = (recipientIds) => {
        if (!Array.isArray(recipientIds)) {
            if (typeof recipientIds === 'string' || typeof recipientIds === 'number') {
                recipientIds = [recipientIds];
            } else {
                return 'Unknown Recipient';
            }
        }

        return recipientIds.map(userId => {
            const recipient = users.find(user => user.userId === userId);
            if (recipient) {
                return `${recipient.email}`;
            } else {
                return 'Unknown Recipient';
            }
        }).join(', ');
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

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        setShowPopup(true);
        setShowNewMassagePopup(false);
    };

    const filteredUsers = users.filter(user =>
        user && user.firstName && user.firstName.toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    const filteredMessages = selectedUserForFilter
        ? messages.filter(msg =>
            msg.senderId === selectedUserForFilter || msg.recipientId.includes(selectedUserForFilter)
        )
        : messages;

    const getSenderName = (senderId) => {
        const sender = users.find(user => user.userId === senderId);
        return sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender';
    };

    return (
        <div>
            {/*<Navbar />*/}
            {/*<nav className="secondary-navbarN">*/}
            {/*    <h4>*/}
            {/*        /!*<i className="fa-solid fa-envelope fa-fw"></i>*!/*/}
            {/*        DevMail*/}
            {/*    </h4>*/}
            {/*    <div*/}
            {/*        className="filterIcon"*/}
            {/*        onMouseEnter={handleFilterIconMouseEnter}*/}
            {/*        onMouseLeave={handleFilterIconMouseLeave}*/}
            {/*    >*/}
            {/*        <Filter />*/}
            {/*        {filterPopupVisible && (*/}
            {/*            <div*/}
            {/*                className="search-popup active"*/}
            {/*                onMouseLeave={handleFilterIconMouseLeave}*/}
            {/*            >*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    placeholder="Search by firstName..."*/}
            {/*                    value={searchQuery}*/}
            {/*                    onChange={(e) => setSearchQuery(e.target.value)}*/}
            {/*                />*/}
            {/*                <ul className="user-list">*/}
            {/*                    {filteredUsers.map(user => (*/}
            {/*                        <li*/}
            {/*                            key={user.userId}*/}
            {/*                            className="user-item"*/}
            {/*                            onClick={() => user && user.userId && handleUserFilterClick(user.userId)}*/}
            {/*                        >*/}
            {/*                            {user && user.firstName ? user.firstName : 'Unknown User'} {user && user.lastName ? user.lastName : 'Unknown User'}*/}
            {/*                        </li>*/}
            {/*                    ))}*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</nav>*/}
            <SideBarForNoti
                users={users}
                loggedInUser={loggedInUser}
                onSendNotification={() => {
                    setSelectedMessage(null);
                    setShowNewMassagePopup(true);
                    setShowPopup(false);
                }}
            />

            <div className="message-list">
                {filteredMessages.map(message => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        users={users}
                        getRecipientNames={getRecipientNames}
                        onClick={() => handleMessageClick(message)}
                    />
                ))}
            </div>

            {showPopup && selectedMessage && (
                <div className="popup-overlay">
                    <div className="popup-content-in-message">
                        {/*<h4 className="popup-content-head4">Message Details</h4>*/}
                        <p className="border-sender"><strong></strong> {getSenderName(selectedMessage.senderId)}</p>
                        <p className="border-recipient"><strong className="to-message">to:</strong> {getRecipientNames(selectedMessage.recipientId)}</p>
                        <p className="border-message"><strong></strong> {selectedMessage.message}</p>
                        <button className="close-button-on-message" onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            {showNewMassagePopup && !selectedMessage && (
                <div className="popup-overlay">
                    <div className="popup-content-new-message">
                        <h4>New Message</h4>
                        <button className="cancelButton" onClick={() => setShowNewMassagePopup(false)}>x</button>
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
                        <div className="d-flex flex-wrap flex-column gap-2 mb-4">
                            <textarea
                                className="messageTA"
                                value={message}
                                placeholder="Message..."
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-row gap-2 mb-4">
                            <button className="saveNotificationBtn" onClick={handleSendNotification}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

Notification.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,  // Adding email prop
    })).isRequired,
    loggedInUser: PropTypes.shape({
        userId: PropTypes.string.isRequired
    }),
    onSendNotification: PropTypes.func.isRequired
};

export default Notification;
