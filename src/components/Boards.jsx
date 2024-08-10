import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskModal from './TaskModal';
import './Boards.css';
import { FaPen} from 'react-icons/fa';
import PriorityModal from './PriorityModal';
import MoveModal from "./MoveModal/MoveModal.jsx"; // Import the new component

const Boards = () => {
    const { projectName, boardId } = useParams(); // Get projectName and boardId from the route parameters

    const [statuses, setStatuses] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dropdownStatusId, setDropdownStatusId] = useState(null);
    const [highlightedTaskId, setHighlightedTaskId] = useState(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);

    // Load statuses from localStorage or use default values
    useEffect(() => {
        const loadStatuses = () => {
            const savedStatuses = localStorage.getItem(`${projectName}_${boardId}_statuses`);
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
    }, [projectName, boardId]);

    // Save statuses to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`${projectName}_${boardId}_statuses`, JSON.stringify(statuses));
    }, [statuses, projectName, boardId]);

    const handleAddTask = (statusId) => {
        if (newTaskName.trim()) {
            const status = statuses.find(status => status.id === statusId);
            if (status) {
                const newTask = {
                    id: `${projectName}_${boardId}_${statusId}_${status.tasks.length + 1}`,
                    name: newTaskName,
                    date: null,
                    statusId: statusId,
                    priority: 'medium' // Set default priority
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
        const statusId = parseInt(task.id.split('_')[2], 10);
        const status = statuses.find(status => status.id === statusId);
        setSelectedTask({
            ...task,
            statusName: status ? status.title : 'Unknown Status'
        });
        setHighlightedTaskId(task.id);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setHighlightedTaskId(null);
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
            handleCloseModal();
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
            handleCloseModal();
        }
    };

    const handleDeleteStatus = (statusId) => {
        const updatedStatuses = statuses.filter(status => status.id !== statusId);
        setStatuses(updatedStatuses);
    };

    const handleMoveTask = (task, newStatusId) => {
        console.log('Moving task:', task, 'to status:', newStatusId);

        const updatedStatuses = statuses.map(status => {
            if (status.id === newStatusId) {
                return {
                    ...status,
                    tasks: [...status.tasks, task]
                };
            } else if (status.tasks.some(t => t.id === task.id)) {
                return {
                    ...status,
                    tasks: status.tasks.filter(t => t.id !== task.id)
                };
            }
            return status;
        });

        console.log('Updated statuses:', updatedStatuses);
        setStatuses(updatedStatuses);
    };

    const handleSavePriority = (newPriority) => {
        if (selectedTask) {
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, priority: newPriority } : task
                )
            }));
            setStatuses(updatedStatuses);
            setShowPriorityModal(false);
        }
    };

    const handleClosePriorityModal = () => {
        setShowPriorityModal(false);
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
                                    <div className="task-priority-display priority-${task.priority}">
                                        {/* Display priority name and icon */}
                                        {task.priority === 'high' && (
                                            <>

                                                <span className="priority-high">High</span>
                                            </>
                                        )}
                                        {task.priority === 'medium' && (
                                            <>

                                                <span className="priority-medium">Medium</span>
                                            </>
                                        )}
                                        {task.priority === 'low' && (
                                            <>

                                                <span className="priority-low">Low</span>
                                            </>
                                        )}
                                    </div>
                                    {editingTaskId === task.id ? (
                                        <input
                                            type="text"
                                            defaultValue={task.name}
                                            onBlur={(e) => handleBlur(status.id, task.id, e.target.value)}
                                            className="backend-task-input"
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
                                    + Add Task
                                </button>
                            )
                        )}
                    </div>
                ))}
            </div>
            {selectedTask && (
                <TaskModal
                    onDelete={handleDeleteTask}
                    task={selectedTask}
                    onClose={handleCloseModal}
                    boards={statuses}
                    statuses={statuses}
                    onSaveDate={handleSaveDate}
                    onRemoveDate={handleRemoveDate}
                    onSavePriority={handleSavePriority}
                />
            )}
            {showMoveModal && selectedTask && (
                <MoveModal
                    task={selectedTask}
                    statuses={statuses}
                    onClose={() => setShowMoveModal(false)}
                    onMove={(task, newStatusId) => {
                        handleMoveTask(task, newStatusId);
                        setShowMoveModal(false);
                    }}
                />
            )}
            {showPriorityModal && (
                <PriorityModal
                    isVisible={showPriorityModal}
                    onClose={handleClosePriorityModal}
                    onSavePriority={handleSavePriority}
                />
            )}
        </div>
    );
};

export default Boards;
