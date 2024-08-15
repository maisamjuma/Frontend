import axios from 'axios';

const BOARDS_API_BASE_URL = "http://10.10.30.77:8080/api/boards"; // Adjust the URL to match your API

class BoardService {

    // Fetch all boards
    getAllBoards() {
        return axios.get(BOARDS_API_BASE_URL);
    }

    // Fetch a board by its ID
    getBoardById(boardId) {
        return axios.get(`${BOARDS_API_BASE_URL}/${boardId}`);
    }

    // Fetch boards by project ID
    getBoardsByProject(projectId) {
        return axios.get(`${BOARDS_API_BASE_URL}/projects/${projectId}`);
    }

    // Create a new board
    createBoard(projectId, roleId) {
        // Construct the URL with the roleId
        const url = `${BOARDS_API_BASE_URL}/${roleId}`;

        // Construct the body with only the projectId
        return axios.post(url, {projectId});
    }

    // Update an existing board by its ID
    updateBoard(boardId, updatedBoard) {
        return axios.put(`${BOARDS_API_BASE_URL}/${boardId}`, updatedBoard, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Delete a board by its ID
    deleteBoard(boardId) {
        return axios.delete(`${BOARDS_API_BASE_URL}/${boardId}`);
    }
}

export default new BoardService();
