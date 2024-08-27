import axios from 'axios';

const MEMBERS_API_BASE_URL = 'http://10.10.30.77:8080/api/project-members';

class ProjectMemberService {

    // Get Project Member by projectMemberId
    getProjectMemberById(projectMemberId) {
        return axios.get(`${MEMBERS_API_BASE_URL}/${projectMemberId}`);
    }

    // Delete a Member from a specific Project by projectMemberId
    deleteMemberFromProject(projectMemberId,projectId) {
        return axios.delete(`${MEMBERS_API_BASE_URL}/project/${projectId}/member/${projectMemberId}`);
    }

    // Delete a Member from all projects by userId hhhh
    deleteMemberFromAllProjects(userId) {
        return axios.delete(`${MEMBERS_API_BASE_URL}/user/${userId}`);
    }

    // Update info of a Project Member by projectMemberId
    updateProjectMember(projectMemberId, memberData) {
        return axios.put(`${MEMBERS_API_BASE_URL}/${projectMemberId}`, memberData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Get All Members of all projects
    getAllProjectMembers() {
        return axios.get(MEMBERS_API_BASE_URL);
    }

    // Get all Members of a specific project by projectId
    getProjectMembersByProjectId(projectId) {
        return axios.get(`${MEMBERS_API_BASE_URL}/project/${projectId}`);
    }

    // Add Member to a project
    addMemberToProject(memberData) {
        return axios.post(MEMBERS_API_BASE_URL, memberData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default new ProjectMemberService();
