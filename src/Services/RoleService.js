import axios from 'axios';

const ROLES_API_BASE_URL = "http://10.10.30.77:8080/api/roles";

class RoleService {

    // Fetch all roles
    getAllRoles() {
        return axios.get(ROLES_API_BASE_URL);
    }

    // Fetch a role by its ID
    getRoleById(roleId) {
        return axios.get(`${ROLES_API_BASE_URL}/${roleId}`);
    }

    // Create a new role
    createRole(role) {
        return axios.post(ROLES_API_BASE_URL, role, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Delete a role by its ID
    deleteRole(roleId) {
        return axios.delete(`${ROLES_API_BASE_URL}/${roleId}`);
    }
}

export default new RoleService();
