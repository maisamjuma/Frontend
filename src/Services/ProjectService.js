import axios from 'axios';

// const PROJECTS_API_BASE_URL = "http://10.10.30.77:8080/api/projects";
const PROJECTS_API_BASE_URL = "http://localhost:8080/api/projects";

class ProjectService {

    // Fetch all projects
    async getAllProjects() {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(PROJECTS_API_BASE_URL, {
                headers: {
                    'X-Auth-Token': token
                }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    // Fetch a project by its ID
    getProjectById(projectId) {
        const token = localStorage.getItem("token");

        return axios.get(`${PROJECTS_API_BASE_URL}/${projectId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create a new project
    async createProject(project) {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(PROJECTS_API_BASE_URL, project, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': token
                }
            });

            // Return the full response
            return response.data;
        } catch (error) {
            console.error('Error creating project', error);
            throw error;
        }
    }

    // Update an existing project by its ID
    updateProject(projectId, updatedProject) {
        const token = localStorage.getItem("token");

        return axios.put(`${PROJECTS_API_BASE_URL}/${projectId}`, updatedProject, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Delete a project by its ID
    deleteProject(projectId) {
        const token = localStorage.getItem("token");

        return axios.delete(`${PROJECTS_API_BASE_URL}/${projectId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }
}

export default new ProjectService();
