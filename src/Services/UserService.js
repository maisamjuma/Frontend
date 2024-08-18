import axios from 'axios';

const USERS_API_BASE_URL = 'http://10.10.30.77:8080/api/users';

class UserService {

    // Fetch all users
    getAllUsers() {
        return axios.get(USERS_API_BASE_URL);
    }

    // Create a new user
    createUser(user) {
        return axios.post(USERS_API_BASE_URL, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Fetch a user by its ID
    getUserById(userId) {
        return axios.get(`${USERS_API_BASE_URL}/${userId}`);
    }

    // Update a user by its ID
    updateUser(userId, user) {
        return axios.put(`${USERS_API_BASE_URL}/${userId}`, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Delete a user by its ID
    deleteUser(userId) {
        return axios.delete(`${USERS_API_BASE_URL}/${userId}`);
    }

    // Fetch users by role ID
    getUsersByRoleId(roleId) {
        return axios.get(`${USERS_API_BASE_URL}/roles/${roleId}`);
    }
}

export default new UserService();
