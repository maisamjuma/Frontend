import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DetailsModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTasks, faTimes } from '@fortawesome/free-solid-svg-icons';
import TaskService from '../../services/TaskService';
import CommentService from "../../Services/CommentService.js";
import UserService from "../../Services/UserService.js";

const DetailsModal = ({ task, onClose }) => {
    const initialTableData = (task && task.tableData && Array.isArray(task.tableData) && task.tableData.length > 0)
        ? task.tableData
        : [{ Description: task.taskDescription || "", Comments: "" }];

    const [descriptionData, setDescriptionData] = useState(initialTableData.map(row => ({ Description: row.Description })));
    const [commentsData, setCommentsData] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    useEffect(() => {
        if (task && task.taskId) {
            // Fetch task comments
            CommentService.getCommentsByTaskId(task.taskId)
                .then(async response => {
                    const comments = response.data;
                    // Fetch user details for each comment
                    const formattedComments = await Promise.all(comments.map(async (comment) => {
                        try {
                            const userResponse = await UserService.getUserById(comment.commentedBy);
                            return {
                                Comments: comment.comment,
                                CommentedBy: userResponse.data, // Assuming user data contains firstName and lastName
                            };
                        } catch (error) {
                            console.error(`Error fetching user ${comment.commentedBy}:`, error);
                            return {
                                Comments: comment.comment,
                                CommentedBy: { firstName: 'Unknown', lastName: '' },
                            };
                        }
                    }));
                    setCommentsData(formattedComments);
                })
                .catch(error => {
                    console.error("Error fetching comments:", error);
                });
        }
    }, [task]);

    if (!task) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('details-modal-overlay')) {
            onClose();
        }
    };

    const handleDescriptionChange = (e, rowIndex) => {
        const updatedData = [...descriptionData];
        updatedData[rowIndex].Description = e.target.value;
        setDescriptionData(updatedData);
    };

    const handleCommentsChange = (e, rowIndex) => {
        const updatedData = [...commentsData];
        updatedData[rowIndex].Comments = e.target.value;
        setCommentsData(updatedData);
    };

    const handleAddCommentsRow = () => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
        setCommentsData([...commentsData, { Comments: '', CommentedBy:
                { firstName: user.firstName, lastName: user.lastName } }]);}
    };

    const handleSaveDescription = async () => {
        try {
            const updatedTask = {
                ...task,
                taskDescription: descriptionData[0].Description,
                tableData: descriptionData.map((desc, index) => ({
                    ...desc,
                    Comments: commentsData[index]?.Comments || '',
                })),
            };

            await TaskService.updateTask(task.taskId, updatedTask);

            alert('Task description updated successfully!');
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        }
    };

    const handleSaveComment = async (commentText, rowIndex) => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);

                const commentData = {
                    taskId: task.taskId,
                    comment: commentText,
                    commentedBy: user.userId, // Adjust based on the actual structure of your user object
                };

                await CommentService.createComment(commentData);

                alert('Comment saved successfully!');
                const updatedComments = [...commentsData];
                updatedComments[rowIndex].Comments = commentText;
                setCommentsData(updatedComments);
            } else {
                alert('User information is not available. Please log in again.');
            }
        } catch (error) {
            console.error("Error saving comment:", error);
            alert("There was an error saving the comment. Please try again.");
        }
    };

    return (
        <div className="details-modal-overlay" onClick={handleOverlayClick}>
            <div className="details-modal-content">
                <div className="details-modal-header">
                    <div className="details-modal-title">
                        <FontAwesomeIcon icon={faListAlt} className="details-icon" />
                        <h2>{task.taskName}</h2>
                    </div>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
                </div>
                <p className="task-status">In Status: {task.status}</p>
                <div className="detailstitle">
                    <FontAwesomeIcon icon={faTasks} className="details-icon" />
                    <p className="task-description">Description:</p>
                </div>
                <div className="table-container">
                    {descriptionData.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">
                            <table className="task-details-table">
                                <tbody>
                                <tr>
                                    <td>
                                            <textarea
                                                className="textarea"
                                                value={row.Description}
                                                onChange={(e) => handleDescriptionChange(e, rowIndex)}
                                                rows="10"
                                            />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
                <div className="table-controls">
                    <button className="save-description-btn" onClick={handleSaveDescription}>Save Description</button>
                </div>
                <div className="detailstitle">
                    <FontAwesomeIcon icon={faTasks} className="details-icon" />
                    <p className="task-comment">Comments:</p>
                </div>
                <div className="table-container-comment">
                    {commentsData.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">

                            <table className="task-details-table-comment">
                                <thead>
                                <tr>
                                    <th className="comment-header">
                            <span className="member-name-comment">
                                {row.CommentedBy.firstName} {row.CommentedBy.lastName}
                            </span>
                                        <button
                                            className="save-comment-btn"
                                            onClick={() => handleSaveComment(row.Comments, rowIndex)}
                                        >
                                            Save Comment
                                        </button>
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr>
                                    <td>
                                            <textarea
                                                className="textarea-comment"
                                                value={row.Comments}
                                                onChange={(e) => handleCommentsChange(e, rowIndex)}
                                                rows="10"
                                            />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            {/*<button*/}
                            {/*    className="save-comment-btn"*/}
                            {/*    onClick={() => handleSaveComment(row.Comments, rowIndex)}*/}
                            {/*>*/}
                            {/*    Save Comment*/}
                            {/*</button>*/}
                        </div>
                    ))}
                </div>
                <div className="table-controls-comment">
                    <button className="addcomment" onClick={handleAddCommentsRow}>Add Comment</button>
                </div>
            </div>
        </div>
    );
};

DetailsModal.propTypes = {
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        taskDescription: PropTypes.string.isRequired,
        tableData: PropTypes.arrayOf(PropTypes.shape({
            Description: PropTypes.string,
            Comments: PropTypes.string
        })),
    }),
    onClose: PropTypes.func.isRequired,
};

export default DetailsModal;
