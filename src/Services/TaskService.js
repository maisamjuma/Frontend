import axios from 'axios';

const TASKS_API_BASE_URL = "http://10.10.30.77:8080/api/tasks"; // Replace with your actual API base URL

class TaskService {

    // Fetch a task by its ID
    getTaskById(taskId) {
        return axios.get(`${TASKS_API_BASE_URL}/${taskId}`);
    }

    // Delete a task by its ID
    deleteTask(taskId) {
        return axios.delete(`${TASKS_API_BASE_URL}/${taskId}`);
    }

    // Update a task by its ID
    updateTask(taskId, updatedTaskData) {
        return axios.put(`${TASKS_API_BASE_URL}/${taskId}`, updatedTaskData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Fetch all tasks
    getAllTasks() {
        return axios.get(TASKS_API_BASE_URL);
    }

    // Fetch all tasks of a specific project by Project ID
    getTasksByProjectId(projectId) {
        return axios.get(`${TASKS_API_BASE_URL}/project/${projectId}`);
    }

    // Fetch all tasks of a specific user by User ID
    getTasksByUserId(userId) {
        return axios.get(`${TASKS_API_BASE_URL}/user/${userId}`);
    }

    // Create a new task and assign it to a user and a project
    createTask(task) {
        return axios.post(TASKS_API_BASE_URL, task, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default new TaskService();
