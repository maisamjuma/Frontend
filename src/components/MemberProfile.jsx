import React from 'react';
import PropTypes from 'prop-types';
import './MemberProfile.css'; // Import the CSS file

const MemberProfile = ({ member,userDetails, onClose }) => {
    console.log("profile : ",member)

    // Find user details for the selected member
    const user = userDetails.find(user => user.userId === member.userId);
    console.log("Selected user:", user);
    if (!user) {
        return <div>Loading...</div>; // Handle loading state or display an error
    }
    return (
        <div className="member-profile-overlay">
            <div className="member-profile">
                <h3>Member Profile</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

MemberProfile.propTypes = {
    member: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    }).isRequired,
    userDetails: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            role: PropTypes.number.isRequired,
        })
    ).isRequired,

    onClose: PropTypes.func.isRequired
};

export default MemberProfile;
