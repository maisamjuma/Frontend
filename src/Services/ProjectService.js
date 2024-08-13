import axios from 'axios';

const PROJECTS_API_BASE_URL = "http://10.10.30.77:8080/api/projects";

class ProjectService {

    getProject(){
        return axios.get(PROJECTS_API_BASE_URL);
    }

    // createProject(project){
    //     return axios.post(PROJECTS_API_BASE_URL,project );
    // }

    createProject = (project) => {
        return axios.post(PROJECTS_API_BASE_URL, project, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    getProjectById(projectId){
        return axios.get(PROJECTS_API_BASE_URL + '/' + projectId);
    }

    updateProject(project, projectId){
        return axios.put(PROJECTS_API_BASE_URL + '/' + projectId, project);
    }

    deleteProject(projectId){
        return axios.delete(PROJECTS_API_BASE_URL + '/' + projectId);
    }
}

export default new ProjectService();