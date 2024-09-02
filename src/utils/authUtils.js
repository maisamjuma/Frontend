// utils/authUtils.js
import UserService from '../Services/UserService.js'; // Adjust the import path as needed

export const userIsAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        return decodedToken.role === 'ADMIN';
    } catch (error) {
        console.error("Error decoding token", error);
        return false;
    }
};

export const userIsTeamLeader = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        return decodedToken.role === 'TEAM_LEADER';
    } catch (error) {
        console.error("Error decoding token", error);
        return false;
    }
};

// New method to get user info by email (sub) from token
export const getUserInfoFromToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        const userEmail = decodedToken.sub; // Get the email (sub) from the token

        // Use the email to get the user info
        const response = await UserService.getUserByName(userEmail);
        const userData = response.data;

        // Save the user data to local storage
        localStorage.setItem('user', JSON.stringify(userData));
        // console.log("getUserInfoFromToken (the signed in user):", userData)

        return userData; // Return the user info
    } catch (error) {
        console.error("Error decoding token or fetching user info", error);
        return null;
    }
};
