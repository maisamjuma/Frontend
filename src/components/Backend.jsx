import React, { useState, useEffect } from 'react';
import './Backend.css';
import { FaPen } from 'react-icons/fa';
import TaskModal from './TaskModal';

const generateUniqueTaskId = (statusId, taskId) => `${statusId}_${taskId}`;

const Backend = () => {
    const initialStatuses = [
        { id: 1, title: 'unassigned tasks', tasks: [], backgroundColor: '#f9f9f9' },
        { id: 2, title: 'To Do', tasks: [], backgroundColor: '#f9f9f9' },
        { id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9' },
        { id: 4, title: 'Ready to Review', tasks: [], backgroundColor: '#f9f9f9' }
    ];

    const loadStatuses = () => {
        const savedStatuses = localStorage.getItem('statuses');
        return savedStatuses ? JSON.parse(savedStatuses) : initialStatuses;
    };

    const [statuses, setStatuses] = useState(loadStatuses());
    const [newTaskName, setNewTaskName] = useState('');
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newStatusName, setNewStatusName] = useState('');
    const [dropdownStatusId, setDropdownStatusId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null); // Track the selected task for the modal
    const [highlightedTaskId, setHighlightedTaskId] = useState(null); // Track the highlighted task
    const [editingTaskId, setEditingTaskId] = useState(null); // Track the editing task

    useEffect(() => {
        localStorage.setItem('statuses', JSON.stringify(statuses));
    }, [statuses]);

    const handleInputChange = (e) => {
        setNewStatusName(e.target.value);
    };

    const handleAddStatus = () => {
        if (newStatusName.trim()) {
            const newStatus = {
                id: statuses.length + 1,
                title: newStatusName,
                tasks: [],
                backgroundColor: '#f9f9f9'
            };
            setStatuses([...statuses, newStatus]);
            setNewStatusName('');
            setIsAdding(false);
        }
    };

    const handleAddTask = (statusId) => {
        if (newTaskName.trim()) {
            const status = statuses.find(status => status.id === statusId);
            const newTask = {
                id: generateUniqueTaskId(statusId, status.tasks.length + 1),
                name: newTaskName,
                date: null, // Initialize date as null
                statusId: statusId // Include statusId
            };
            const updatedStatuses = statuses.map(status => {
                if (status.id === statusId) {
                    return {
                        ...status,
                        tasks: [...status.tasks, newTask]
                    };
                }
                return status;
            });
            setStatuses(updatedStatuses);
            setNewTaskName('');
            setCurrentStatusId(null);
        }
    };

    const handleDeleteStatus = (statusId) => {
        const updatedStatuses = statuses.filter(status => status.id !== statusId);
        setStatuses(updatedStatuses);
    };

    const handleDeleteTask = (taskId) => {
        const updatedStatuses = statuses.map(status => ({
            ...status,
            tasks: status.tasks.filter(task => task.id !== taskId)
        }));
        setStatuses(updatedStatuses);
    };

    const handleChangeColor = (statusId, color) => {
        const updatedStatuses = statuses.map(status => {
            if (status.id === statusId) {
                return {
                    ...status,
                    backgroundColor: color
                };
            }
            return status;
        });
        setStatuses(updatedStatuses);
        setDropdownStatusId(null);
    };
    const handlePencilClick = (task) => {
        const status = statuses.find(status => status.id === task.statusId); // Ensure statusId is used
        setSelectedTask({
            ...task,
            statusName: status ? status.title : 'Unknown Status' // Set statusName
        });
        setHighlightedTaskId(task.id);
    };


    const handleCloseModal = () => {
        setSelectedTask(null); // Clear the selected task
        setHighlightedTaskId(null); // Remove highlighting from the task
    };

    const handleSaveDate = (date) => {
        if (selectedTask) {
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, date: date instanceof Date ? date : new Date(date) } : task
                )
            }));
            setStatuses(updatedStatuses);
            handleCloseModal(); // Close the modal after saving
        }
    };

    const handleRemoveDate = () => {
        if (selectedTask) {
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, date: null } : task
                )
            }));
            setStatuses(updatedStatuses);
            handleCloseModal(); // Close the modal after removing the date
        }
    };

    const handleReset = () => {
        setStatuses(initialStatuses);
        localStorage.removeItem('statuses'); // Clear saved statuses from local storage
    };

    const handleDoubleClick = (taskId) => {
        setEditingTaskId(taskId);
    };

    const handleBlur = (statusId, taskId, newName) => {
        const updatedStatuses = statuses.map(status => ({
            ...status,
            tasks: status.tasks.map(task =>
                task.id === taskId ? { ...task, name: newName } : task
            )
        }));
        setStatuses(updatedStatuses);
        setEditingTaskId(null);
    };

    return (
        <div className="backend-container">
            <h1>Backend</h1>
            <button onClick={handleReset} className="backend-reset-button">
                Reset All Tasks
            </button>
            <div className="backend-status-container">
                {statuses.map((status) => (
                    <div key={status.id} className="backend-status-box"
                         style={{ backgroundColor: status.backgroundColor }}>
                        <div className="backend-status-header">
                            <span className="backend-status-title">{status.title}</span>
                            <span className="backend-status-menu"
                                  onClick={() => setDropdownStatusId(dropdownStatusId === status.id ? null : status.id)}>...</span>
                            {dropdownStatusId === status.id && (
                                <div className="backend-dropdown-menu">
                                    <div className="backend-dropdown-item"
                                         onClick={() => handleDeleteStatus(status.id)}>Delete Status
                                    </div>
                                    <div className="backend-dropdown-separator"/>
                                    <div className="backend-dropdown-color-picker">
                                        <div className="backend-color-box" style={{backgroundColor: '#a729ca'}}
                                             onClick={() => handleChangeColor(status.id, '#a729ca')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#1148cc'}}
                                             onClick={() => handleChangeColor(status.id, '#1148cc')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#ffcccc'}}
                                             onClick={() => handleChangeColor(status.id, '#ffcccc')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#ccffcc'}}
                                             onClick={() => handleChangeColor(status.id, '#ccffcc')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#c3a838'}}
                                             onClick={() => handleChangeColor(status.id, '#c3a838')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#6ab54d'}}
                                             onClick={() => handleChangeColor(status.id, '#6ab54d')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#ccccff'}}
                                             onClick={() => handleChangeColor(status.id, '#ccccff')}/>
                                        <div className="backend-color-box" style={{backgroundColor: '#ffffcc'}}
                                             onClick={() => handleChangeColor(status.id, '#ffffcc')}/>
                                    </div>


                                </div>
                            )}
                        </div>
                        <div className="backend-tasks-container">
                            {status.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`backend-task-box ${highlightedTaskId === task.id ? 'highlighted' : ''}`}
                                    onDoubleClick={() => handleDoubleClick(task.id)}
                                >
                                    {editingTaskId === task.id ? (
                                        <input
                                            type="text"
                                            defaultValue={task.name}
                                            onBlur={(e) => handleBlur(status.id, task.id, e.target.value)}
                                            autoFocus
                                            className="backend-task-edit-input" /* Use a specific class for the input */
                                        />
                                    ) : (
                                        <>
                                            {task.name}
                                            {task.date && (
                                                <div className="task-date">
                                                    {task.date instanceof Date ? task.date.toDateString() : "Invalid Date"}
                                                </div>
                                            )}
                                            <FaPen
                                                className="backend-pencil-icon"
                                                onClick={() => handlePencilClick(task)}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}

                        </div>
                        {(status.id === 1 || status.id === 2) && (
                            currentStatusId === status.id ? (
                                <div className="backend-add-task-form">
                                    <input
                                        type="text"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                        placeholder="Enter task name"
                                        className="backend-task-input"
                                    />
                                    <div className="backend-add-status-actions">
                                        <button
                                            onClick={() => handleAddTask(status.id)}
                                            className="backend-add-task-button"
                                        >
                                        Add Task
                                        </button>
                                        <button
                                            onClick={() => setCurrentStatusId(null)}
                                            className="backend-cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setCurrentStatusId(status.id)}
                                    className="backend-show-add-task"
                                >
                                    + Add Task
                                </button>
                            )
                        )}
                    </div>
                ))}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="backend-add-status-button"
                    >
                        + Add New Status
                    </button>
                ) : (
                    <div className="backend-add-status-form">
                        <input
                            type="text"
                            value={newStatusName}
                            onChange={handleInputChange}
                            placeholder="Enter status name"
                            className="backend-status-input"
                        />
                        <div className="backend-add-status-actions">
                            <button onClick={handleAddStatus} className="backend-add-status-button">
                                Submit
                            </button>
                            <button onClick={() => setIsAdding(false)} className="backend-cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Render the TaskModal component */}
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={handleCloseModal}
                    onDelete={handleDeleteTask}
                    boards={statuses}
                    statuses={statuses}
                    onSaveDate={handleSaveDate}
                    onRemoveDate={handleRemoveDate}
                />
            )}
        </div>
    );
};

export default Backend;
