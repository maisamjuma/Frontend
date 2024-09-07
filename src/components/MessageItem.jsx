import PropTypes from 'prop-types'; // Import PropTypes

const MessageItem = ({ message, users, onClick, getRecipientNames }) => {
    const fromUser = users.find(user => user.userId === message.senderId);
    const fromName = fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : 'Unknown Sender';

    // Ensure recipientId is an array
    const recipientIds = Array.isArray(message.recipientId) ? message.recipientId : [message.recipientId];
    const recipientNames = getRecipientNames(recipientIds);

    return (
        <div className="message-item" onClick={() => onClick(message)}>
            <strong>From:</strong> {fromName}<br />
            <strong>To:</strong> {recipientNames}
        </div>
    );
};


// Define prop types for MessageItem
MessageItem.propTypes = {
    message: PropTypes.shape({
        senderId: PropTypes.string.isRequired,
        recipientId: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
    })).isRequired,
    onClick: PropTypes.func.isRequired,
    getRecipientNames: PropTypes.func.isRequired
};

export default MessageItem; // Export the functional component
