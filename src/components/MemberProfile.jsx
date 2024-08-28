import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './MemberProfile.css'; // Import the CSS file
import RoleService from "../Services/RoleService.js";

const MemberProfile = ({ member, userDetails, onClose }) => {
    const [roleName, setRoleName] = useState('Loading role...'); // State to store the role name

    // Find user details for the selected member
    const user = userDetails.find(user => user.userId === member.userId);

    useEffect(() => {
        if (user) {
            // Fetch the role name using the role ID
            const fetchRoleName = async () => {
                try {
                    const response = await RoleService.getRoleById(user.role);
                    setRoleName(response.data.roleName);
                } catch (error) {
                    console.error(`Error fetching role for roleId: ${user.role}`, error);
                    setRoleName('Unknown Role');
                }
            };

            fetchRoleName();
        }
    }, [user]);

    if (!user) {
        return <div>Loading...</div>; // Handle loading state or display an error
    }

    const firstLetter = user.username.charAt(0).toUpperCase();

    return (
        <div className="member-profile-overlay">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        <span>{firstLetter}</span>
                    </div>
                    <div className="profile-info">
                        <h2 className="usernameFont">{user.username}</h2>
                    </div>
                </div>
                <div className="profile-actions">
                    <p className="fontColor"><strong>Last Name: </strong> {user.lastName}</p>
                    <p className="fontColor"><strong>Email: </strong> {user.email}</p>
                    <p className="fontColor"><strong>Role: </strong> {roleName}</p>
                    <button className="secondary-nav-button d-flex justify-content-center" onClick={onClose}>Close</button>
                </div>
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
