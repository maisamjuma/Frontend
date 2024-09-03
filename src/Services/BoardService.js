import axios from 'axios';

// const BOARDS_API_BASE_URL = "http://10.10.30.77:8080/api/boards"; // Adjust the URL to match your API
const BOARDS_API_BASE_URL = "http://10.10.30.77:8080/api/boards"; // Adjust the URL to match your API

class BoardService {

    // Fetch all boards
    getAllBoards() {
        const token = localStorage.getItem("token");
        return axios.get(BOARDS_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch a board by its ID
    getBoardById(boardId) {
        const token = localStorage.getItem("token");
        return axios.get(`${BOARDS_API_BASE_URL}/${boardId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Fetch boards by project ID
    getBoardsByProject(projectId) {
        const token = localStorage.getItem("token");
        return axios.get(`${BOARDS_API_BASE_URL}/projects/${projectId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create a new board
    createBoard(projectId, roleId) {
        const token = localStorage.getItem("token");
        const url = `${BOARDS_API_BASE_URL}/${roleId}`;
        return axios.post(url, {projectId}, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Update an existing board by its ID
    updateBoard(boardId, updatedBoard) {
        const token = localStorage.getItem("token");
        return axios.put(`${BOARDS_API_BASE_URL}/${boardId}`, updatedBoard, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Delete a board by its ID
    deleteBoard(boardId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${BOARDS_API_BASE_URL}/${boardId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Add default boards to a project
    addDefaultBoards(projectId) {
        const token = localStorage.getItem("token");
        const url = `${BOARDS_API_BASE_URL}/projects/${projectId}/default`;
        return axios.post(url, null, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }
}

export default new BoardService();
