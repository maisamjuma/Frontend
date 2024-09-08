import React from 'react';
import PropTypes from 'prop-types';
import './MessageItem.css'; // Ensure this file includes your CSS styles

const MessageItem = ({ message, users, onClick, getRecipientNames }) => {
    const fromUser = users.find(user => user.userId === message.senderId);
    const fromName = fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : 'Unknown Sender';
    const fromInitials = fromUser ? `${fromUser.firstName[0].toUpperCase()}${fromUser.lastName[0].toUpperCase()}` : 'U';

    // Ensure recipientId is an array
    const recipientIds = Array.isArray(message.recipientId) ? message.recipientId : [message.recipientId];
    const recipientNames = getRecipientNames(recipientIds);

    // Get the initials of the first recipient
    const firstRecipient = users.find(user => user.userId === recipientIds[0]);
    const recipientInitials = firstRecipient ? `${firstRecipient.firstName[0]}${firstRecipient.lastName[0]}` : '';

    // Format the createdAt date (day, month, year, hour, minute)
    const formattedDate = new Date(message.createdAt).toLocaleString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    });

    return (
        <div className="message-item" onClick={() => onClick(message)}>
            <div className="sender-info">
                <div className="sender-badge">
                    {fromInitials}
                </div>
                <div className="sender-details">
                    <p className="sender-name">{fromName}</p>
                </div>
                <div className="message-details-on-info">
                    <p className="message-text">{message.message}</p>
                </div>
                <div className="recipient-info">
                    <p className="message-date">{formattedDate}</p> {/* Display the formatted createdAt date */}
                    {/*<div className="recipient-badge">*/}
                    {/*    {recipientInitials || 'No Recipients'}*/}
                    {/*</div>*/}
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
        createdAt: PropTypes.string.isRequired, // Ensure createdAt is required
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
