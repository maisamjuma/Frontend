import axios from 'axios';

const ROLES_API_BASE_URL = "http://10.10.30.77:8080/api/roles";
// const ROLES_API_BASE_URL = "http://localhost:8080/api/roles";

class RoleService {

    // Fetch all roles
    getAllRoles() {
        const token = localStorage.getItem("token");

        return axios.get(ROLES_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch a role by its ID
    getRoleById(roleId) {
        const token = localStorage.getItem("token");

        return axios.get(`${ROLES_API_BASE_URL}/${roleId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create a new role
    createRole(role) {
        const token = localStorage.getItem("token");

        return axios.post(ROLES_API_BASE_URL, role, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Delete a role by its ID
    deleteRole(roleId) {
        const token = localStorage.getItem("token");

        return axios.delete(`${ROLES_API_BASE_URL}/${roleId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }
}

export default new RoleService();
