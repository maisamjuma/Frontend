// Notification.jsx
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";
import {Filter} from "./SVGIcons.jsx";
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
    const [selectedMessage, setSelectedMessage] = useState(null); // New state for selected message
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("User from localStorage:", user);
            setLoggedInUser(user); // Set the user object
        }

        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                console.log("Fetched users:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Fetch users from the database
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers(); // Fetch users from the database
                console.log("setUsers(response.data): ", response.data);
                setUsers(response.data); // Update state with fetched users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Fetch notifications by senderId
        const fetchNotifications = async () => {
            if (loggedInUser) {
                try {
                    const response = await NotificationService.getNotificationsBySenderId(loggedInUser.userId); // Use senderId
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
        if (selectedUsers.length && message && loggedInUser?.userId) {
            try {
                const promises = selectedUsers.map(async (selectedUser) => {
                    const newNotification = {
                        message: message,
                        recipientId: selectedUser, // Send the notification to each recipient one by one
                        senderId: loggedInUser.userId,
                        isRead: true
                    };
                    console.log("Sending notification:", newNotification);

                    // Make the backend request for each user
                    const response = await NotificationService.createNotification(newNotification);

                    if (response.status === 200 || response.status === 201) {
                        return {
                            ...response.data,  // Returned data from backend
                            recipientId: selectedUser  // Ensure the correct recipient is displayed
                        };
                    } else {
                        console.error('Unexpected response status:', response.status);
                        return null;
                    }
                });

                // Wait for all the notifications to be created
                const notifications = await Promise.all(promises);

                // Filter out any failed notifications
                const successfulNotifications = notifications.filter(n => n !== null);

                // Add these new notifications to the messages array in state
                if (successfulNotifications.length) {
                    setMessages(prevMessages => [...successfulNotifications, ...prevMessages]);
                    setShowNewMassagePopup(false); // Close the popup after sending
                    resetForm(); // Reset the form after sending the notifications
                }
            } catch (error) {
                console.error('Error sending notification:', error.response?.data || error.message);
            }
        } else {
            console.warn('No users selected or message is empty or loggedInUser is not defined');
        }
    };


    const getRecipientNames = (recipientIds) => {
        // Ensure recipientIds is an array
        if (!Array.isArray(recipientIds)) {
            // If it's a single ID, convert it to an array
            if (typeof recipientIds === 'string' || typeof recipientIds === 'number') {
                recipientIds = [recipientIds];
            } else {
                console.error('Invalid recipientIds:', recipientIds);
                return 'Unknown Recipient';
            }
        }

        // Map over recipientIds to get names
        return recipientIds.map(userId => {
            const recipient = users.find(user => user.userId === userId);
            if (recipient) {
                return `${recipient.firstName} ${recipient.lastName}`;
            } else {
                console.error('Recipient not found for userId:', userId);
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
        setFilterPopupVisible(false); // Hide filter popup after selection
    };

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        setShowPopup(true);  // Open the message details popup
        setShowNewMassagePopup(false);  // Close the new message popup
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

    // Get the name of the sender
    const getSenderName = (senderId) => {
        const sender = users.find(user => user.userId === senderId);
        return sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender';
    };

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
                                        key={user.userId} // Ensure this is a unique identifier
                                        className="user-item"
                                        onClick={() => user && user.userId && handleUserFilterClick(user.userId)}
                                    >
                                        {user && user.firstName ? user.firstName : 'Unknown User'} {user && user.lastName ? user.lastName : 'Unknown User'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
            <SideBarForNoti
                users={users}
                loggedInUser={loggedInUser}
                onSendNotification={() => {
                    setSelectedMessage(null);  // Reset selected message
                    setShowNewMassagePopup(true);  // Open the new message popup
                    setShowPopup(false);  // Close the message details popup
                }}
            />


            <div className="message-list">
                        {filteredMessages.map(message => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                users={users}
                                getRecipientNames={getRecipientNames} // Pass as prop
                                onClick={() => handleMessageClick(message)} // Update onClick handler
                            />
                        ))}
                    </div>



            {showPopup && selectedMessage && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4 className="popup-content-head4">Message Details</h4>
                        <p className="border-1"><strong>From:</strong> {getSenderName(selectedMessage.senderId)}</p> {/* Updated */}
                        <p><strong>To:</strong> {getRecipientNames(selectedMessage.recipientId)}</p> {/* Updated */}
                        <p><strong>Message:</strong> {selectedMessage.message}</p>
                        <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            {showNewMassagePopup && !selectedMessage && (
                <div className="popup-overlay">
                    <div className="popup-content-new-message">
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
                        <div className="d-flex flex-wrap flex-column gap-2 mb-4">
                            <label>Message</label>
                            <textarea
                                className="messageTA"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-row gap-2 mb-4">
                            <button className="cancelButton" onClick={() => setShowNewMassagePopup(false)}>Close</button>
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
    })).isRequired,
    loggedInUser: PropTypes.shape({
        userId: PropTypes.string.isRequired
    }),
    onSendNotification: PropTypes.func.isRequired
};
export default Notification;