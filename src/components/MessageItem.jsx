// MessageItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './MessageItem.css'; // Ensure this file includes your CSS styles

const MessageItem = ({ message, users, onClick, getRecipientNames }) => {
    const fromUser = users.find(user => user.userId === message.senderId);
    const fromName = fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : 'Unknown Sender';
    const fromInitials = fromUser ? `${fromUser.firstName[0]}${fromUser.lastName[0]}` : 'U';

    // Ensure recipientId is an array
    const recipientIds = Array.isArray(message.recipientId) ? message.recipientId : [message.recipientId];
    const recipientNames = getRecipientNames(recipientIds);

    // Get the initials of the first recipient
    const firstRecipient = users.find(user => user.userId === recipientIds[0]);
    const recipientInitials = firstRecipient ? `${firstRecipient.firstName[0]}${firstRecipient.lastName[0]}` : '';

    return (
        <div className="message-item" onClick={() => onClick(message)}>
            <div className="sender-info">
                <div className="sender-badge">
                    {fromInitials}
                </div>
                <div className="sender-details">
                    <p className="sender-name">{fromName}</p>
                    <p className="message-text">{message.message}</p>
                </div>
                <div className="recipient-info">
                    <div className="recipient-badge">
                        {recipientInitials || 'No Recipients'}
                    </div>

                </div>
            </div>
        </div>
    );
};

MessageItem.propTypes = {
    message: PropTypes.shape({
        senderId: PropTypes.string.isRequired,
        recipientId: PropTypes.arrayOf(PropTypes.string).isRequired,
        message: PropTypes.string.isRequired,
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
    })).isRequired,
    onClick: PropTypes.func.isRequired,
    getRecipientNames: PropTypes.func.isRequired
};

export default MessageItem;
