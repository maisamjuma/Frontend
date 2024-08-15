import axios from 'axios';

const PROJECTS_API_BASE_URL = "http://10.10.30.77:8080/api/projects";

class ProjectService {

    // Fetch all projects
    getAllProjects() {
        return axios.get(PROJECTS_API_BASE_URL);
    }

    // Fetch a project by its ID
    getProjectById(projectId) {
        return axios.get(`${PROJECTS_API_BASE_URL}/${projectId}`);
    }

    // // Create a new project
    // createProject(project) {
    //     return axios.post(PROJECTS_API_BASE_URL, project, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    // }

    async createProject(project) {
        try {
            const response = await axios.post(PROJECTS_API_BASE_URL, project, {
                headers: {
                    'Content-Type': 'application/json'
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
        return axios.put(`${PROJECTS_API_BASE_URL}/${projectId}`, updatedProject, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Delete a project by its ID
    deleteProject(projectId) {
        return axios.delete(`${PROJECTS_API_BASE_URL}/${projectId}`);
    }
}

export default new ProjectService();
