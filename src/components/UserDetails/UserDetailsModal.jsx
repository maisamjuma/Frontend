import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './UserDetailsModal.css'; // Define styles for the modal
import { Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../../Services/authService.js'; // Import the updated AuthService

const UserDetailsModal = ({ isVisible, onClose, userDetails, onLogout }) => {
    const [roleName, setRoleName] = useState('Loading role...'); // State to store the role name
    const [newPassword, setNewPassword] = useState(''); // State to store the new password
    const [showResetForm, setShowResetForm] = useState(false); // State to control visibility of the reset form
    const [loading, setLoading] = useState(false); // State to manage loading indicator
    const modalRef = useRef(null); // Ref to the modal content

    const [storedToken, setStoredToken] = useState(null); // State to store the reset token

    // Capture the resetToken from the URL when the component mounts
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('resetToken');
        if (token) {
            setStoredToken(token);
            localStorage.setItem('resetToken', token); // Store the token in local storage
        }
    }, []); // Runs once on component mount

    useEffect(() => {
        if (userDetails) {
            // Fetch the role name using the role ID
            const fetchRoleName = async () => {
                try {
                    // Replace this with your actual role fetching logic
                    setRoleName('Role name from your logic'); // Mocked for demo purposes
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

    // Function to send the reset password email
    const handleRequestPasswordReset = async () => {
        // Show a confirmation dialog before proceeding
        const userConfirmed = window.confirm('Are you sure you want to reset the password for this user?');
        if (!userConfirmed) return;

        setLoading(true); // Show loading indicator

        try {
            // Make a request to the backend to send a password reset email
            await AuthService.requestPasswordReset(userDetails.email);
            alert('Password reset email sent successfully.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Function to handle the actual password reset after receiving the token
    const handleResetPassword = async () => {
        const storedToken = localStorage.getItem('resetToken');
        console.log("storedToken",storedToken);

        if (!storedToken) {
            alert('Reset token is missing. Please request a password reset again.');
            return;
        }

        setLoading(true); // Show loading indicator

        try {
            // Call AuthService to reset the password with the token and new password
            console.log("storedToken",storedToken);
            await AuthService.resetPassword(storedToken, newPassword);
            alert('Password has been reset successfully.');
            setShowResetForm(false); // Hide the form after successful password reset
            localStorage.removeItem('resetToken'); // Clear the token from local storage
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
        } finally {
            setLoading(false); // Hide loading indicator
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
                    <Button
                        variant="danger"
                        onClick={handleRequestPasswordReset} // Call the function here
                        className="Reset-Email-Btn"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Sending Email...' : 'Send Password Reset Email'}
                    </Button>

                    {!showResetForm && (
                        <Button variant="warning"
                                onClick={() => setShowResetForm(!showResetForm)} className="Reset-Btn">
                            <FontAwesomeIcon icon={faKey} className="Reset-Icon"/> {showResetForm ? 'Confirm Reset' : 'Reset Password'}
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
                                    disabled={loading} // Disable button while loading
                                >
                                    <FontAwesomeIcon icon={faKey} className="Reset-Icon"/> {loading ? 'Processing...' : 'Confirm Reset'}
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
                    {loading && (
                        <div className="loading-overlay">
                            <Spinner animation="border" variant="primary" />
                            <p>Processing...</p>
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
