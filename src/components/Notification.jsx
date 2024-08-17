import React, { useState } from 'react';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";
import { Filter } from "./SVGIcons.jsx";

const Notification = ({ loggedInUser, users }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserForFilter, setSelectedUserForFilter] = useState('');

    const handleSendNotification = () => {
        if (selectedUsers.length && message) {
            const newMessage = { from: loggedInUser, to: selectedUsers, message };
            setMessages([newMessage, ...messages]);
            setShowPopup(false);
            resetForm();
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
        user.toLowerCase().includes(searchQuery.toLowerCase())
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
                                placeholder="Search by username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ul className="user-list">
                                {filteredUsers.map(user => (
                                    <li
                                        key={user}
                                        className="user-item"
                                        onClick={() => handleUserFilterClick(user)}
                                    >
                                        {user}
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
                    <h4>Notifications</h4>
                    <div className="message-list">
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
                                <p><strong>From:</strong> {showPopup.from}</p>
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
                                                key={user}
                                                className={`list-group-item ${selectedUsers.includes(user) ? 'selected' : ''}`}
                                                onClick={() => handleUserSelection(user)}
                                            >
                                                {user}
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
                                    <button className="btn btn-secondary" onClick={() => setShowPopup(false)}>Cancel</button>
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
