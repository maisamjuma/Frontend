import axios from 'axios';

// const USERS_API_BASE_URL = 'http://10.10.30.77:8080/api/users';
const USERS_API_BASE_URL = 'http://localhost:8080/api/users';
const BASE_URL = 'http://localhost:8080';

class UserService {

    // Fetch all users
    getAllUsers() {
        const token = localStorage.getItem("token");
        return axios.get(USERS_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create a new user
    createUser(user) {
        const token = localStorage.getItem("token");
        return axios.post(USERS_API_BASE_URL, user, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Fetch a user by its ID
    getUserById(userId) {
        const token = localStorage.getItem("token");
        return axios.get(`${USERS_API_BASE_URL}/${userId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Update a user by its ID
    updateUser(userId, user) {
        const token = localStorage.getItem("token");
        return axios.put(`${USERS_API_BASE_URL}/${userId}`, user, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Delete a user by its ID
    deleteUser(userId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${USERS_API_BASE_URL}/${userId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch users by role ID
    getUsersByRoleId(roleId) {
        const token = localStorage.getItem("token");
        return axios.get(`${USERS_API_BASE_URL}/roles/${roleId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }
//////////////////////////////////////////////////////////////////////spring security:
    // User login
    async login(password, email) {
        try {
            const response = await axios.post(`${BASE_URL}/auth`, { password, email });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Register a new user
    static async register(userData) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Get all users
    static async getAllUsers() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${BASE_URL}/users`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Get your profile
    static async getYourProfile() {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${BASE_URL}/adminuser/get-profile`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Fetch a user by ID (admin only)
    static async getUserById(userId) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${BASE_URL}/admin/get-users/${userId}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Delete a user by ID (admin only)
    static async deleteUser(userId) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${BASE_URL}/admin/delete/${userId}`, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Update a user by ID (admin only)
    static async updateUser(userId, userData) {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${BASE_URL}/admin/update/${userId}`, userData, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    /** AUTHENTICATION CHECKER **/

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default new UserService();
