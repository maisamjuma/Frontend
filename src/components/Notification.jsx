// Notification.jsx
import React, {useState, useEffect} from 'react';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";
import {Filter} from "./SVGIcons.jsx";
import UserService from '../Services/UserService';
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
        // const storedUser = localStorage.getItem('loggedInUser');
        // if (storedUser) {
        //     const user = JSON.parse(storedUser);
        //     console.log("user from the localStorage: ", user);
        //     setLoggedInUser(storedUser);
        //
        // }

        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers(); // Fetch users from the database
                console.log("setUsers(response.data): ", response.data);
                setUsers(response.data); // Update state with fetched users
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
    }, []);

    // const handleSendNotification = async () => {
    //     if (selectedUsers.length && message) {
    //         try {
    //             const newNotification = {
    //                 message: message,
    //                 userId: loggedInUser.userId,
    //                 to: selectedUsers,
    //                 isRead: false
    //             };
    //             console.log(loggedInUser);
    //             const response = await NotificationService.createNotification(newNotification);
    //
    //             if (response.status === 200) {
    //                 setMessages([response.data, ...messages]);
    //                 setShowPopup(false);
    //                 resetForm();
    //             } else {
    //                 console.error('Unexpected response status:', response.status);
    //             }
    //         } catch (error) {
    //             console.error('Error sending notification:', error.response?.data || error.message);
    //         }
    //     } else {
    //         console.warn('No users selected or message is empty');
    //     }
    // };

    const handleSendNotification = async () => {
        if (selectedUsers.length && message && loggedInUser?.userId) {
            try {
                const promises = selectedUsers.map(async (recipientId) => {
                    const newNotification = {
                        message: message,
                        recipientId: recipientId,
                        senderId: loggedInUser.userId,
                        isRead: false
                    };
                    console.log("Sending notification:", newNotification);
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
                    setShowPopup(false);
                    resetForm();
                }
            } catch (error) {
                console.error('Error sending notification:', error.response?.data || error.message);
            }
        } else {
            console.warn('No users selected or message is empty or loggedInUser is not defined');
        }
    };



    // const getRecipientNames = (recipientIds = []) => {
    //     if (!Array.isArray(recipientIds)) {
    //         console.error('Invalid recipientIds:', recipientIds);
    //         return 'Unknown Recipient';
    //     }
    //
    //     return recipientIds.map(userId => {
    //         const recipient = users.find(user => user.userId === userId);
    //         return recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown Recipient';
    //     }).join(', ');
    // };


    const getRecipientNames = (recipientIds = []) => {
        if (!Array.isArray(recipientIds)) {
            console.error('Invalid recipientIds:', recipientIds);
            return 'Unknown Recipient';
        }

        return recipientIds.map(userId => {
            const recipient = users.find(user => user.userId === userId);
            return recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown Recipient';
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
            <div className="d-flex">
                <SideBarForNoti
                    users={users}
                    loggedInUser={loggedInUser}
                    onSendNotification={() => setShowPopup(true)}
                />
                <div className="main-contentN">

                    <div className="message-list border-2 d-flex flex-row g-5">
                        {filteredMessages.map((msg, index) => {
                            console.log('Message:', msg); // Log the entire message object
                            const fromUser = users.find(user => user.userId === msg.userId);
                            const fromName = fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : 'Unknown Sender';
                            const recipientNames = getRecipientNames(msg.to);

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
                                <p className="border-1"><strong>From:</strong> {showPopup.from}</p>
                                <p><strong>To:</strong> {(showPopup.to || []).join(', ')}</p>
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
                                    <button className="saveNotificationBtn" onClick={handleSendNotification}>Send</button>
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

export default Notification;
