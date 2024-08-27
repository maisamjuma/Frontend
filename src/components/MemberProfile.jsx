import React from 'react';
import PropTypes from 'prop-types';
import './MemberProfile.css'; // Import the CSS file

const MemberProfile = ({ member, onClose }) => {
    return (
        <div className="member-profile-overlay">
            <div className="member-profile">
                <h3>Member Profile</h3>
                <p><strong>Username:</strong> {member.username}</p>
                <p><strong>Email:</strong> {member.email}</p>
                <p><strong>First Name:</strong> {member.firstName}</p>
                <p><strong>Last Name:</strong> {member.lastName}</p>
                <p><strong>Role:</strong> {member.role}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

MemberProfile.propTypes = {
    member: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default MemberProfile;
