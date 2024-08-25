import React from 'react';
import PropTypes from 'prop-types';
import './MemberProfile.css'; // Import the CSS file

const MemberProfile = ({ member, onClose }) => {
    // Get the first letter of the username
    const firstLetter = member.username.charAt(0).toUpperCase();

    return (
        <div className="member-profile-overlay">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        <span>{firstLetter}</span>
                    </div>
                    <div className="profile-info">
                        <p className="usernameFont">{member.username}</p>

                    </div>

                </div>
                <div className="profile-actions">
                    <p className="fontColor"><strong>Last Name: </strong> {member.lastName}</p>
                    <p className="fontColor"><strong>Email: </strong> {member.email}</p>
                    <p className="fontColor"><strong>Role: </strong> {member.role}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

MemberProfile.propTypes = {
    member: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default MemberProfile;
