import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskModal from './TaskModal';
import './Boards.css';
import { FaPen } from 'react-icons/fa';
import MoveModal from "./MoveModal.jsx";
//const generateUniqueTaskId = (statusId, taskId) => `${statusId}_${taskId}`;

const Boards = () => {
    const { boardId } = useParams(); // Get the current board ID from the route parameters

    const [statuses, setStatuses] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dropdownStatusId, setDropdownStatusId] = useState(null);
   const [highlightedTaskId, setHighlightedTaskId] = useState(null); // Track the highlighted task
    const [showMoveModal, setShowMoveModal] = useState(false); // Track the visibility of MoveModal

    useEffect(() => {
        // Load board-specific statuses from local storage or initialize with default
        const loadStatuses = () => {
            const savedStatuses = localStorage.getItem(`${boardId}_statuses`);
            return savedStatuses ? JSON.parse(savedStatuses) : [
                { id: 1, title: 'unassigned tasks', tasks: [], backgroundColor: '#f9f9f9' },
                { id: 2, title: 'To Do', tasks: [], backgroundColor: '#f9f9f9' },
                { id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9' },
                { id: 4, title: 'Ready to Review', tasks: [], backgroundColor: '#f9f9f9' },
                { id: 5, title: 'Reviewing', tasks: [], backgroundColor: '#f9f9f9' },
                { id: 6, title: 'Complete', tasks: [], backgroundColor: '#f9f9f9' }
            ];
        };

        setStatuses(loadStatuses());
    }, [boardId]);
    useEffect(() => {
        console.log('Loading statuses for boardId:', boardId); // Log boardId
        const loadStatuses = () => {
            const savedStatuses = localStorage.getItem(`${boardId}_statuses`);
            return savedStatuses ? JSON.parse(savedStatuses) : [];
        };

        const statuses = loadStatuses();
        console.log('Loaded statuses:', statuses); // Log statuses
        setStatuses(statuses);
    }, [boardId]);


    useEffect(() => {
        // Save statuses to local storage when they change
        localStorage.setItem(`${boardId}_statuses`, JSON.stringify(statuses));
    }, [statuses, boardId]);
    useEffect(() => {
        console.log('Saving statuses for boardId:', boardId); // Log boardId
        localStorage.setItem(`${boardId}_statuses`, JSON.stringify(statuses));
        console.log('Statuses saved:', statuses); // Log statuses
    }, [statuses, boardId]);

    const handleAddTask = (statusId) => {
        if (newTaskName.trim()) {
            const status = statuses.find(status => status.id === statusId);
            if (status) {
                const newTask = {
                    id: `${statusId}_${status.tasks.length + 1}`,
                    name: newTaskName,
                    date: null,
                    statusId: statusId
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
        }
    };

    const handleDeleteTask = (taskId) => {
        const updatedStatuses = statuses.map(status => ({
            ...status,
            tasks: status.tasks.filter(task => task.id !== taskId)
        }));
        setStatuses(updatedStatuses);
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
        console.log('Clicked Task:', task);
        const statusId = parseInt(task.id.split('_')[0], 10); // Extract statusId from task id
        const status = statuses.find(status => status.id === statusId);
        console.log('Found Status:', status);
        setSelectedTask({
            ...task,
            statusName: status ? status.title : 'Unknown Status'
        });
        setHighlightedTaskId(task.id);
    };
    const handleCloseModal = () => {
        console.log('Closing Modal. Selected Task:', selectedTask);
        setSelectedTask(null); // Clear the selected task
        setHighlightedTaskId(null); // Remove highlighting from the task
    };
    const handleSaveDate = (date) => {
        console.log('Saving Date:', date, 'for Task:', selectedTask);
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
    const handleDeleteStatus = (statusId) => {
        const updatedStatuses = statuses.filter(status => status.id !== statusId);
        setStatuses(updatedStatuses);
    };
    const handleMoveTask = (task, newStatusId) => {
        const updatedStatuses = statuses.map(status => {
            if (status.id === newStatusId) {
                return {
                    ...status,
                    tasks: [...status.tasks, task]
                };
            } else {
                return {
                    ...status,
                    tasks: status.tasks.filter(t => t.id !== task.id)
                };
            }
        });
        setStatuses(updatedStatuses);
    };

    return (
        <div className={`backend-container ${boardId}`}>
            <h1>{boardId.charAt(0).toUpperCase() + boardId.slice(1)}</h1>
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
                                            className="backend-task-edit-input"
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
                                <button onClick={() => setCurrentStatusId(status.id)}
                                        className="backend-show-add-task"
                                >
                                    + Add Task</button>
                            )
                        )}
                    </div>
                ))}
            </div>
            {selectedTask && (
                <TaskModal
                   // onClose={() => setSelectedTask(null)}
                    onDelete={handleDeleteTask}
                    task={selectedTask}
                    onClose={handleCloseModal}
                    boards={statuses}
                    statuses={statuses}
                    onSaveDate={handleSaveDate}
                    onRemoveDate={handleRemoveDate}
                />
            )}
            {showMoveModal && selectedTask && (
                <MoveModal
                    task={selectedTask}
                    statuses={statuses}
                    onClose={() => setShowMoveModal(false)}
                    onMove={(task, newStatusId) => {
                        handleMoveTask(task, boardId, newStatusId);
                        setShowMoveModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Boards;
