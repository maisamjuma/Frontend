import axios from 'axios';

// Define the base URL for the API
const COMMENTS_API_BASE_URL = "http://10.10.30.77:8080/api/comments";

class CommentService {

    // Fetch all comments
    getAllComments() {
        const token = localStorage.getItem("token");
        return axios.get(COMMENTS_API_BASE_URL, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Create a new comment
    createComment(comment) {
        const token = localStorage.getItem("token");
        return axios.post(COMMENTS_API_BASE_URL, comment, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }

    // Get comments by Task ID
    getCommentsByTaskId(taskId) {
        const token = localStorage.getItem("token");
        return axios.get(`${COMMENTS_API_BASE_URL}/task/${taskId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Get a specific comment by its ID
    getCommentById(commentId) {
        const token = localStorage.getItem("token");
        return axios.get(`${COMMENTS_API_BASE_URL}/${commentId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Delete a comment by its ID
    deleteComment(commentId) {
        const token = localStorage.getItem("token");
        return axios.delete(`${COMMENTS_API_BASE_URL}/${commentId}`, {
            headers: {
                'X-Auth-Token': token
            }
        });
    }

    // Update a comment by its ID
    updateComment(commentId, updatedComment) {
        const token = localStorage.getItem("token");
        return axios.put(`${COMMENTS_API_BASE_URL}/${commentId}`, updatedComment, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        });
    }
}

export default new CommentService();
