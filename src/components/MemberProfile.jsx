import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './MemberProfile.css'; // Import the CSS file
import RoleService from "../Services/RoleService.js";

const MemberProfile = ({member, userDetails, onClose, onLogout}) => {
    const [roleName, setRoleName] = useState('Loading role...'); // State to store the role name

    // Find user details for the selected member
    const user = userDetails.find(user => user.userId === member.userId);

    useEffect(() => {
        if (user) {
            // Fetch the role name using the role ID
            const fetchRoleName = async () => {
                try {
                    const response = await RoleService.getRoleById(user.functionalRoleId);
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

    const firstLetter = user.firstName.charAt(0).toUpperCase();

    // const handleLogout = (e) => {
    //     e.preventDefault();
    //     console.log('Logging out...');
    //     if (typeof onLogout === 'function') {
    //         onLogout(); // Call the passed onLogout function
    //     } else {
    //         console.error('onLogout is not a function');
    //     }
    // };

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
                        <button className="secondary-nav-button-X d-flex justify-content-center" onClick={onClose}>X
                        </button>
                    </div>
                </div>
                <div className="profile-actions">
                    <p className="fontColor"><strong>First Name: </strong> {user.firstName}</p>
                    <p className="fontColor"><strong>Email: </strong> {user.email}</p>
                    <p className="fontColor"><strong>Role: </strong> {roleName}</p>
                    <button className="secondary-nav-button d-flex justify-content-center"
                            href="#" onClick={(e) => {
                        e.preventDefault();
                        onLogout();
                    }}>Log Out
                    </button>
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
    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default MemberProfile;
