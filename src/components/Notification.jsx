import React, { useState } from 'react';
import Navbar from "./Navbar/Navbar.jsx";
import './Notification.css';
import SideBarForNoti from "./SideBarForNoti.jsx";

const Notification = ({ loggedInUser, users }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSendNotification = () => {
        if (selectedUsers.length && message && title) {
            const newMessage = { from: loggedInUser, to: selectedUsers, title, message };
            setMessages([newMessage, ...messages]);
            setShowPopup(false);
            setMessage('');
            setTitle('');
            setSelectedUsers([]);
        }
    };

    const handleUserSelection = (user) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(user)
                ? prevSelectedUsers.filter(u => u !== user)
                : [...prevSelectedUsers, user]
        );
    };

    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <SideBarForNoti
                    users={users}
                    loggedInUser={loggedInUser}
                    onSendNotification={() => setShowPopup(true)}
                />
                <div className="main-content">
                    <h4>Notifications</h4>
                    <div className="message-list">
                        {messages.map((msg, index) => (
                            <div key={index} className="message-item" onClick={() => setShowPopup(msg)}>
                                <strong>Title:</strong> {msg.title}<br />
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
                                <p><strong>Title:</strong> {showPopup.title}</p>
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
                                    <label>Title</label>
                                    <input
                                        className="form-control"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
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
