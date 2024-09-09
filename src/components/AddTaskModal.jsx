import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import UserService from '../Services/UserService.js';
import TaskService from '../Services/TaskService.js';
import BoardService from '../Services/BoardService.js';
import RoleService from '../Services/RoleService.js';
import {userIsAdmin, userIsTeamLeader} from '../utils/authUtils';
const AddTaskModal = ({
                          isVisible,
                          onClose,
                          onAddTask,
                          status,
                          projectId,
                          projectMembers,
                          boardId
                      }) => {
    // State declarations
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('medium');
    const [assignedToUserId, setAssignedUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [boardName, setBoardName] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const userRoleIsAdmin = userIsAdmin(); // Check if the user is an admin
    const userRoleIsTeamLeader = userIsTeamLeader(); // Check if the user is an admin
    const [storedUser, setStoredUser] = useState(null); // State to store the logged-in user



    // Fetch the logged-in user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setStoredUser(user);
            console.log("User from localStorage:", user);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (isVisible && boardId) {
                try {
                    // Clear userDetails before fetching new ones
                    setUserDetails([]);

                    // Fetch the board name and set role filter
                    const boardResponse = await BoardService.getBoardById(boardId);
                    const boardName = boardResponse.data.name;
                    setBoardName(boardName);
                    setRoleFilter(boardName);

                    // Fetch user details and roles
                    const userDetailsArray = await Promise.all(
                        projectMembers.map(async (member) => {
                            const userResponse = await UserService.getUserById(member.userId);
                            const userData = userResponse.data;

                            if (userData.functionalRoleId) {
                                const roleResponse = await RoleService.getRoleById(userData.functionalRoleId);
                                userData.roleName = roleResponse.data.roleName;
                            }

                            return userData;
                        })
                    );

                    // Filter users based on updated roleFilter
                    const filteredUsers = userDetailsArray.filter(user =>
                        user.roleName === boardName
                    );

                    setUserDetails(filteredUsers);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [isVisible, boardId, projectMembers, boardName]);


    // Handle adding task
    const handleAddTask = async () => {
        if (taskName.trim()) {
            try {
                // Determine the user to assign the task to
                const assignedUser = userRoleIsAdmin || userRoleIsTeamLeader ? assignedToUserId : storedUser?.userId;
                let assignedUserLetter = "";
                // If the status title is not "unassigned", proceed with assigning a user
                if (status.title.toLowerCase() !== 'unassigned tasks') {
                    // If no user is assigned, show an error and prevent task creation
                    if (!assignedUser) {
                        alert('Task must be assigned to a user.');
                        return;
                    }
                }

                // Add one day to the dueDate
                const updatedDueDate = new Date(dueDate);
                updatedDueDate.setDate(updatedDueDate.getDate() + 1);

                const newTask = {
                    projectId,
                    taskName,
                    boardId,
                    taskDescription,
                    status: status.title,
                    priority,
                    dueDate: updatedDueDate.toISOString(),
                    assignedToUserId: assignedUser || null,
                    // assignedUserLetter:assignedUserLetter// Use the assigned user ID
                };
                console.log('the Date is : ', dueDate.toDateString());
                console.log("Task to sent ",newTask);
                const response = await TaskService.createTask(newTask);
                const { taskId } = response.data;
                console.log("Task added ",response.data);

                onAddTask(taskId, projectId, taskName, taskDescription, boardId, status, priority,updatedDueDate, assignedToUserId,assignedUserLetter);
                setTaskName('');
                setTaskDescription('');
                setDueDate(new Date());
                setPriority('medium');
                setAssignedUserId('');
                // refreshBoard();
                onClose();
            } catch (error) {
                console.error('Error adding task:', error);
                alert('Failed to add task. Please try again.');
            }
        } else {
            alert('Task name is required.');
        }
    };

    return (
        isVisible && (
            <div className="addtask-modal-overlay">
                <div className="addtask-modal-content">
                    <h3 className="add-new-task-h3">Add New Task</h3>
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
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Enter task description"
                        className="modal-description-textarea"
                    />
                    <div className="date-options">
                        <p className="paragraph">Due date:</p>
                        <Calendar
                            value={dueDate}
                            onChange={(date) => setDueDate(date)}  // Directly receive the date value here
                            tileClassName={({ date }) =>
                                dueDate && date.toISOString() === new Date(dueDate).toISOString() ? 'selected-date' : null
                            }
                            className="custom-calendar"
                        />

                    </div>
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

                    {status.id === 2 && (userRoleIsAdmin || userRoleIsTeamLeader) && (
                        <div className="user-options">
                            <p className="paragraph">Assign To:</p>
                            <select
                                value={assignedToUserId}
                                onChange={(e) => setAssignedUserId(e.target.value)}
                                className="user-dropdown"
                            >
                                <option value="">Select a user</option>
                                {userDetails.length > 0 ? (
                                    userDetails.map(user => (
                                        <option
                                            key={user.userId}
                                            value={user.userId}
                                        >
                                            {user.firstName} {user.lastName} - {user.roleName}
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
        )
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
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })).isRequired,
    boardId: PropTypes.number.isRequired,
};

export default AddTaskModal;
