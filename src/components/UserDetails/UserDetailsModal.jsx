import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './UserDetailsModal.css'; // Define styles for the modal
import { Button } from 'react-bootstrap';

import RoleService from "../../Services/RoleService.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons';

const UserDetailsModal = ({ isVisible, onClose, userDetails, onLogout }) => {
    const [roleName, setRoleName] = useState('Loading role...'); // State to store the role name

    useEffect(() => {
        if (userDetails) {
            // Fetch the role name using the role ID
            const fetchRoleName = async () => {
                try {
                    const response = await RoleService.getRoleById(userDetails.functionalRoleId);
                    setRoleName(response.data.roleName);
                } catch (error) {
                    console.error(`Error fetching role for roleId: ${userDetails.functionalRoleId}`, error);
                    setRoleName('Unknown Role');
                }
            };
            fetchRoleName();
        }
    }, [userDetails]);

    const handleResetPassword = () => {
        // Implement your password reset logic here
        // For example, open a modal or redirect to a password reset page
        alert('Password reset functionality is not yet implemented.');
    };

    if (!isVisible) return null;

    if (!userDetails) {
        return (
            <div className="user-details-modal">
                <div className="modal-content">
                    <span className="close-button" onClick={onClose}>&times;</span>
                    <h2>User Details</h2>
                    <p>Loading user details...</p>
                </div>
            </div>
        );
    }

    const firstLetter = userDetails.firstName.charAt(0).toUpperCase();

    return (
        <div className="user-details-modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <div className="profile-header">
                    <div className="profile-picture">
                        <span>{firstLetter}</span>
                    </div>
                    <div className="profile-info">
                        <h2>{userDetails.firstName} {userDetails.lastName}</h2>
                    </div>
                </div>
                <div className="profile-actions">
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Role:</strong> {roleName}</p>
                </div>
                <div className="action-buttons">
                    <Button variant="warning" onClick={handleResetPassword}>
                        <FontAwesomeIcon icon={faKey} /> Reset Password
                    </Button>
                    <Button variant="primary" onClick={onLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

UserDetailsModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userDetails: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        functionalRoleId: PropTypes.number.isRequired,
    }),
    onLogout: PropTypes.func.isRequired
};

export default UserDetailsModal;
