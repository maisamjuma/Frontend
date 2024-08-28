import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import Calendar from 'react-calendar';
import PropTypes from "prop-types";
import UserService from "../Services/UserService.js";
import boards from "./Boards.jsx";
//import TaskService from "../Services/TaskService.js";
//import Boards from "./Boards.jsx";

const AddTaskModal = ({ isVisible, onClose, onAddTask, status, projectId, projectDescription, projectMembers, setProjectId, setProjectDescription, setProjectMembers }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('medium');
    const [assignedUserLetter, setAssignedUserLetter] = useState(''); // Local state for selected user
    const [assignedUserId, setAssignedUserId] = useState(''); // Local state for selected user
    const [userDetails,setuserDetails]= useState('');

    console.log(projectId)

    console.log("helllllll", projectMembers)
    useEffect(() => {
        if (isVisible) {
            setDueDate(new Date());
        }
    }, [isVisible]);


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsArray = await Promise.all(
                    projectMembers.map(async (member) => {
                        const response = await UserService.getUserById(member.userId);
                        return response.data;
                    })
                );
                setuserDetails(userDetailsArray);
                console.log(userDetailsArray)
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (projectMembers.length > 0) {
            fetchUserDetails();
        }
    }, [projectMembers]);


    const handleAddTask = async () => {
        console.log("taskName:", taskName);
        if (taskName.trim()) {
            try {
                const newTask = {
                    projectId: projectId,
                    name: taskName,
                    description,
                    boardId:boards.boardId,
                    status: status.title,
                    priority,
                    dueDate: dueDate.toISOString().split('T')[0],
                    assignedUserLetter: assignedUserLetter || null, // Handle optional fields
                    assignedUserId: assignedUserId || null // Handle optional fields
                };

                console.log("Sending task:", newTask); // Log the task object to inspect its structure



                // Pass the created task (including its ID) back to the parent
                onAddTask(newTask);

                // Reset form fields
                setTaskName('');
                setDescription('');
                setDueDate(new Date());
                setPriority('MEDIUM');
                setAssignedUserLetter('');
                setAssignedUserId('');
                onClose();
            } catch (error) {
                console.error('Error adding task:', error);
                alert('Failed to add task. Please try again.');
                // Log detailed error response
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                }
            }
        } else {
            alert('Task name is required.');
        }
    };


    return (
        <>
            {isVisible && (
                <div className="addtask-modal-overlay">
                    <div className="addtask-modal-content">
                        <h3>Add New Task</h3>
                        <div className="task-info">
                            <input
                                type="text"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                placeholder="Enter task name"
                                className="modal-task-input"
                            />
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="modal-description-textarea"
                        />
                        {/* Date Picker */}
                        <div className="date-options">
                            <p className="paragraph">Due date:</p>
                            <Calendar
                                onChange={(date) => setDueDate(date)}
                                value={dueDate}
                                tileClassName={({ date }) =>
                                    dueDate && date.toDateString() === new Date(dueDate).toDateString()
                                        ? 'selected-date'
                                        : null
                                }
                                className="custom-calendar" /* Apply custom class here */
                            />
                        </div>

                        {/* Priority Dropdown */}
                        <div className="priority-options">
                            <p className="paragraph">Priority:</p>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="priority-dropdown"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        {/* Conditionally Render User Dropdown */}
                        {status.id === 2 && (
                            <div className="user-options">
                                <p className="paragraph">Assign To:</p>
                                <select
                                    value={assignedUserLetter}
                                    onChange={(e) => {
                                        const selectedUsername = e.target.value;
                                        const selectedUser = userDetails.find(user => user.username.charAt(0).toUpperCase() === selectedUsername);
                                        if (selectedUser) {
                                            setAssignedUserId(selectedUser.userId);
                                        }
                                        setAssignedUserLetter(selectedUsername);
                                    }}
                                    className="user-dropdown"
                                >
                                    <option value="">Select a user</option>
                                    {userDetails.length > 0 ? (
                                        userDetails.map(user => (
                                            <option
                                                key={user.userId}
                                                value={user.username.charAt(0).toUpperCase()}
                                            >
                                                {user.username} {user.lastName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No members found</option>
                                    )}
                                </select>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleAddTask} className="modal-add-button">Add Task</button>
                            <button onClick={onClose} className="modal-cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
AddTaskModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddTask: PropTypes.func.isRequired,
    status: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired,

    projectId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    projectDescription: PropTypes.string.isRequired,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired
};

export default AddTaskModal;
