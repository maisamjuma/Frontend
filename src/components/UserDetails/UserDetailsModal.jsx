import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import './UserDetailsModal.css'; // Define styles for the modal
import {Button, Form} from 'react-bootstrap';

import RoleService from "../../Services/RoleService.js";
import UserService from "../../Services/UserService.js";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faKey} from '@fortawesome/free-solid-svg-icons';

const UserDetailsModal = ({isVisible, onClose, userDetails, onLogout}) => {
    const [roleName, setRoleName] = useState('Loading role...'); // State to store the role name
    const [newPassword, setNewPassword] = useState(''); // State to store the new password
    const [showResetForm, setShowResetForm] = useState(false); // State to control visibility of the reset form
    const modalRef = useRef(null); // Ref to the modal content

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    const handleResetPassword = async () => {
        // Show a confirmation dialog before proceeding
        const userConfirmed = window.confirm('Are you sure you want to reset the password for this user?');
        if (!userConfirmed) return;

        try {
            await UserService.updateUser(userDetails.userId, {password: newPassword});
            alert('Password reset successfully.');
            setNewPassword('');
            setShowResetForm(false); // Hide the form after successful reset
        } catch (error) {
            console.error('Error resetting password:', error);
            setShowResetForm(false); // Hide the form after successful reset
            setNewPassword('');
            alert('Failed to reset password. Please try again.');
        }
    };

    if (!isVisible) return null;

    if (!userDetails) {
        return (
            <div className="user-details-modal">
                <div className="modal-content" ref={modalRef}>
                    <h2>User Details</h2>
                    <p>Loading user details...</p>
                </div>
            </div>
        );
    }

    const firstLetter = userDetails.firstName.charAt(0).toUpperCase();

    return (
        <div className="user-details-modal">
            <div className="modal-content" ref={modalRef}>
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
                    {!showResetForm && (
                        <Button variant="warning"
                                onClick={() => setShowResetForm(!showResetForm)} className="Reset-Btn">
                            <FontAwesomeIcon icon={faKey}
                                             className="Reset-Icon"/> {showResetForm ? 'Confirm Reset' : 'Reset Password'}
                        </Button>
                    )}
                    {showResetForm && (
                        <div className="password-field-group">
                            <Form.Group controlId="newPassword">
                                <Form.Label className="new-passwordL">New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="custom-password-field"
                                />
                            </Form.Group>
                            <div className="password-buttons">
                                <Button
                                    variant="warning"
                                    onClick={handleResetPassword}
                                    className="Reset-Btn"
                                >
                                    <FontAwesomeIcon icon={faKey}
                                                     className="Reset-Icon"/> {showResetForm ? 'Confirm Reset' : 'Reset Password'}
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => {
                                        setShowResetForm(!showResetForm);
                                        setNewPassword('');
                                    }}
                                    className="Reset-Btn"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    <Button variant="primary" onClick={onLogout} className="LogOut-Btn">
                        <FontAwesomeIcon icon={faSignOutAlt} className="LogOut-Icon"/> Log Out
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
