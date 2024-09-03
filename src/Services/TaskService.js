import axios from 'axios';

// const TASKS_API_BASE_URL = "http://10.10.30.77:8080/api/tasks";
const TASKS_API_BASE_URL = "http://10.10.30.77:8080/api/tasks";

class TaskService {

    // Fetch a task by its ID
    getTaskById(taskId) {
        const token = localStorage.getItem("token");
        return axios.get(`${TASKS_API_BASE_URL}/${taskId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Delete a task by its ID
    deleteTask(taskId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${TASKS_API_BASE_URL}/${taskId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Update a task by its ID
    updateTask(taskId, updatedTaskData) {
        const token = localStorage.getItem("token");
        return axios.put(`${TASKS_API_BASE_URL}/${taskId}`, updatedTaskData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Fetch all tasks
    getAllTasks() {
        const token = localStorage.getItem("token");
        return axios.get(TASKS_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch all tasks of a specific project by Project ID
    getTasksByProjectId(projectId) {
        const token = localStorage.getItem("token");
        return axios.get(`${TASKS_API_BASE_URL}/project/${projectId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch all tasks of a specific user by AddUser ID
    getTasksByUserId(userId) {
        return axios.get(`${TASKS_API_BASE_URL}/user/${userId}`);
    }

    // Create a new task and assign it to a user and a project
    createTask(task) {
        const token = localStorage.getItem("token");

        return axios.post(TASKS_API_BASE_URL, task, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }
}

export default new TaskService();
