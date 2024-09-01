// utils/authUtils.js

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
