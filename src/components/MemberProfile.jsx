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
                    const response = await RoleService.getRoleById(user.functionalRoleId); // Correct field
                    setRoleName(response.data.roleName);
                } catch (error) {
                    console.error(`Error fetching role for roleId: ${user.functionalRoleId}`, error); // Corrected error log
                    setRoleName('Unknown Role');
                }
            };
            fetchRoleName();
        }
    }, [user]);

    if (!user) {
        return <div>Loading...</div>; // Handle loading state or display an error
    }

    const firstLetter = user.firstName.charAt(0).toUpperCase();

    return (
        <div className="member-profile-overlay">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        <span>{firstLetter}</span>
                    </div>
                    <div className="profile-info">
                        <h2 className="usernameFont">{user.firstName} {user.lastName}</h2>
                    </div>
                    <div>
                        <button className="secondary-nav-button-X d-flex justify-content-center" onClick={onClose}>
                            X
                        </button>
                    </div>
                </div>
                <div className="profile-actions">
                    <p className="fontColor"><strong>Email: </strong> {user.email}</p>
                    <p className="fontColor"><strong>Role: </strong> {roleName}</p>
                    <p className="fontColor"><strong>Is Team Leader: </strong> {user.isTeamLeader ? 'Yes' : 'No'}</p> {/* Conditional display */}
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
            functionalRoleId: PropTypes.number.isRequired, // Correct field name for fetching role
            isTeamLeader: PropTypes.bool.isRequired, // Ensure this is present in the data
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MemberProfile;
