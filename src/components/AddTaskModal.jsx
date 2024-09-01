import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import UserService from '../Services/UserService.js';
import TaskService from '../Services/TaskService.js';

const AddTaskModal = ({
                          isVisible,
                          onClose,
                          onAddTask,
                          status,
                          projectId,
                          projectMembers,
                          boardId
                      }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('medium');
    const [assignedToUserId, setAssignedUserId] = useState('');
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        if (isVisible) {
            setDueDate(new Date());
            fetchUserDetails();
        }
    }, [isVisible]);

    const fetchUserDetails = async () => {
        try {
            const userDetailsArray = await Promise.all(
                projectMembers.map(async (member) => {
                    const response = await UserService.getUserById(member.userId);
                    return response.data;
                })
            );
            setUserDetails(userDetailsArray);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleAddTask = async () => {
        if (taskName.trim()) {
            try {
                const newTask = {
                    projectId,
                    taskName,
                    boardId,
                    taskDescription: taskDescription,
                    status: status.title,
                    priority,
                    dueDate: dueDate.toISOString(), // Use ISO format
                    assignedToUserId: assignedToUserId || null
                };

                const response = await TaskService.createTask(newTask);
                const { taskId } = response.data; // Access response data
                console.log('Task created:', response.data);
                console.log("task id :", taskId);

                onAddTask(taskId, projectId, taskName, taskDescription, boardId, status, priority, assignedToUserId);

                // Reset form fields
                setTaskName('');
                setTaskDescription('');
                setDueDate(new Date());
                setPriority('medium');
                setAssignedUserId('');
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
                            onChange={(date) => setDueDate(date)}
                            value={dueDate}
                            tileClassName={({ date }) =>
                                dueDate && date.toDateString() === new Date(dueDate).toDateString()
                                    ? 'selected-date'
                                    : null
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
                    {status.id === 2 && (
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
    projectId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })).isRequired,
    boardId: PropTypes.number.isRequired,
};

export default AddTaskModal;
