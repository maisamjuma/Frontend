import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import './PasswordResetConfirmationPage.css'; // Add styling if needed

const PasswordResetConfirmationPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token'); // Extract the token if needed

    useEffect(() => {
        if (resetToken) {
            // Store the token in local storage
            console.log("resetTokenresetTokenresetToken",resetToken);
            localStorage.setItem('resetToken', resetToken);
        }
    }, [resetToken]);

    return (
        <div className="password-reset-confirmation-page">
            <h2>Password Reset Confirmed</h2>
            <p>Your password has been successfully reset. You can now return to the website and log in with your new password.</p>
            <Button href="/login" variant="primary">Go to Login</Button>
        </div>
    );
};

export default PasswordResetConfirmationPage;
