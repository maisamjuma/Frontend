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
    const [editingIndex, setEditingIndex] = useState(null); // State to track the index of the comment being edited
    const [taskStatus, setTaskStatus] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (task && task.taskId) {
            TaskService.getTaskById(task.taskId)
                .then(response => {
                    setTaskDetails(response.data);
                    setTaskStatus(response.data.status); // Ensure status is updated
                    // Initialize descriptionData and commentsData if needed
                    const taskData = response.data;
                    setDescriptionData(taskData.tableData.map(row => ({ Description: row.Description })));
                    setCommentsData(taskData.tableData.map(row => ({ Comments: row.Comments, CommentedBy: { firstName: 'Unknown', lastName: '' } })));
                })
                .catch(error => {
                    console.error("Error fetching task details:", error);
                });
        }
    }, [task?.taskId, forceUpdate]);

    useEffect(() => {
        if (task && task.taskId) {
            CommentService.getCommentsByTaskId(task.taskId)
                .then(async response => {
                    const comments = response.data;
                    const formattedComments = await Promise.all(comments.map(async (comment) => {
                        try {
                            const userResponse = await UserService.getUserById(comment.commentedBy);
                            return {
                                Comments: comment.comment,
                                CommentedBy: userResponse.data,
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

    useEffect(() => {
        if (task) {
            setForceUpdate(prev => !prev); // Trigger update when task changes
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
        setEditingIndex(rowIndex); // Set the editing index when a comment is being edited
    };

    const handleAddCommentsRow = () => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCommentsData([...commentsData, {
                Comments: '',
                CommentedBy: { firstName: user.firstName, lastName: user.lastName }
            }]);
            setEditingIndex(commentsData.length); // Set the new comment as the one being edited
        }
    };

    const handleSaveDescription = async () => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("User from localStorage: ", user);

            try {
                // Check if the logged-in user is assigned to the task
                if (user.userId === task.assignedToUserId) {
                    const updatedTask = {
                        ...task,
                        taskDescription: descriptionData[0].Description,
                        tableData: descriptionData.map((desc, index) => ({
                            ...desc,
                            Comments: commentsData[index]?.Comments || '',
                        })),
                        status: taskStatus, // Update the status here
                    };

                    await TaskService.updateTask(task.taskId, updatedTask);

                    onClose(); // Close the modal after saving
                } else {
                    alert('You are not authorized to update this task.');
                }
            } catch (error) {
                console.error("Error updating task:", error);
                alert("There was an error updating the task. Please try again.");
            }
        } else {
            alert('User information is not available. Please log in again.');
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
                    commentedBy: user.userId,
                };

                await CommentService.createComment(commentData);

                const updatedComments = [...commentsData];
                updatedComments[rowIndex] = { ...updatedComments[rowIndex], Comments: commentText }; // Update the existing comment
                setCommentsData(updatedComments);
                setEditingIndex(null); // Clear the editing index once the comment is saved

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
                <p className="task-status">In Status: {taskStatus}</p>
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
                    <button className="save-description-btn" onClick={handleSaveDescription}>
                        Save Description
                    </button>
                </div>
                <div className="detailstitle">
                    <FontAwesomeIcon icon={faTasks} className="details-icon" />
                    <p className="task-comment">Comments:</p>
                </div>
                <div className="table-container-comment">
                    {commentsData.map((row, rowIndex) => (
                        <div key={rowIndex} className="comment-row">
                            <div className="comment-header">
                                <span className="comment-circle">
                                    {row.CommentedBy.firstName.charAt(0)}
                                </span>
                                <span className="member-name-comment">
                                    {row.CommentedBy.firstName} {row.CommentedBy.lastName}
                                </span>
                            </div>
                            <div className="comment-content">
                                {editingIndex === rowIndex ? (
                                    <>
                                        <textarea
                                            className="textarea-comment"
                                            value={row.Comments}
                                            onChange={(e) => handleCommentsChange(e, rowIndex)}
                                            rows="10"
                                        />
                                        <button
                                            className="save-comment-btn"
                                            onClick={() => handleSaveComment(row.Comments, rowIndex)}
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <span className="comment-text">
                                        {row.Comments}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="table-controls-comment">
                    <button className="addcomment" onClick={handleAddCommentsRow}>
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

DetailsModal.propTypes = {
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        assignedToUserId: PropTypes.string.isRequired,
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
