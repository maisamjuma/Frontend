import axios from 'axios';

const MEMBERS_API_BASE_URL = 'http://10.10.30.77:8080/api/project-members';
// const MEMBERS_API_BASE_URL = 'http://localhost:8080/api/project-members';

class ProjectMemberService {

    // Get Project Member by projectMemberId
    getProjectMemberById(projectMemberId) {
        const token = localStorage.getItem("token");
        return axios.get(`${MEMBERS_API_BASE_URL}/${projectMemberId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Delete a Member from a specific Project by projectMemberId
    deleteMemberFromProject(projectMemberId, projectId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${MEMBERS_API_BASE_URL}/project/${projectId}/member/${projectMemberId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Delete a Member from all projects by userId hhhh
    deleteMemberFromAllProjects(userId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${MEMBERS_API_BASE_URL}/user/${userId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Update info of a Project Member by projectMemberId
    updateProjectMember(projectMemberId, memberData) {
        const token = localStorage.getItem("token");
        return axios.put(`${MEMBERS_API_BASE_URL}/${projectMemberId}`, memberData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Get All Members of all projects
    getAllProjectMembers() {
        return axios.get(MEMBERS_API_BASE_URL);
    }

    // Get all Members of a specific project by projectId
    getProjectMembersByProjectId(projectId) {
        const token = localStorage.getItem("token");

        return axios.get(`${MEMBERS_API_BASE_URL}/project/${projectId}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Add Member to a project
    addMemberToProject(memberData) {
        const token = localStorage.getItem("token");

        return axios.post(MEMBERS_API_BASE_URL, memberData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }
}

export default new ProjectMemberService();
