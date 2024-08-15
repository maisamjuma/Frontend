import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import TaskModal from './TaskModal';
import './Boards.css';
import {FaPen} from 'react-icons/fa';
// import MoveModal from "./MoveModal.jsx";
import PriorityModal from './PriorityModal';
import AddTaskModal from "./AddTaskModal"; // Import the new component
// import PriorityModal from './PriorityModal';
import MoveModal from "./MoveModal/MoveModal.jsx";
import CalendarModal from "./CalendarModal/CalendarModal.jsx";


const Boards = () => {
    const {projectName, boardId} = useParams(); // Get projectName and boardId from the route parameters
    const [statuses, setStatuses] = useState([]);
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dropdownStatusId, setDropdownStatusId] = useState(null);
    const [highlightedTaskId, setHighlightedTaskId] = useState(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showcalenderModal, setcalendarModal] = useState(false);


    // Load statuses from localStorage or use default values
    useEffect(() => {
        const loadStatuses = () => {
            const savedStatuses = localStorage.getItem(`${projectName}_${boardId}_statuses`);
            const defaultStatuses = [
                {id: 1, title: 'unassigned tasks', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 2, title: 'To Do', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 4, title: 'Ready to Review', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 5, title: 'Reviewing', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 6, title: 'Ready for QA', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 7, title: 'In Progress', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 8, title: 'QA Failed', tasks: [], backgroundColor: '#f9f9f9'},
                {id: 9, title: 'QA Passed', tasks: [], backgroundColor: '#f9f9f9'}
            ];
            const statuses = savedStatuses ? JSON.parse(savedStatuses) : defaultStatuses;

            if (boardId === 'qa') {
                return statuses.filter(status => status.id > 5); // Show only statuses with id > 5
                // eslint-disable-next-line no-dupe-else-if
            } else if (boardId === 'frontend' || boardId === 'backend') {
                return statuses.filter(status => status.id <= 5);
            }
            return statuses; // Show all statuses for other boards
        };

        setStatuses(loadStatuses());
    }, [projectName, boardId]);


    // Save statuses to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`${projectName}_${boardId}_statuses`, JSON.stringify(statuses));
    }, [statuses, projectName, boardId]);

    const handleAddTask = (statusId, task) => {
        if (task.name.trim()) {
            const status = statuses.find(status => status.id === statusId);
            if (status) {
                const newTask = {
                    id: `${projectName}_${boardId}_${statusId}_${status.tasks.length + 1}`,
                    ...task,
                    statusId: statusId,
                    date: task.date || null, // Add date here if needed
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
                setShowAddTaskModal(false);
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
                task.id === taskId ? {...task, name: newName} : task
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
            const adjustedDate = new Date(date);
            adjustedDate.setDate(adjustedDate.getDate() + 1); // Add one day

            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task =>
                    task.id === selectedTask.id ? {...task, dueDate: adjustedDate.toISOString().split('T')[0]} : task
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
                    task.id === selectedTask.id ? {...task, dueDate: null} : task
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
                    tasks: [...status.tasks, {...task, statusId: newStatusId}] // Update statusId here
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
                    task.id === selectedTask.id ? {...task, priority: newPriority} : task
                )
            }));
            setStatuses(updatedStatuses);
            setShowPriorityModal(false);
        }
    };

    const handleClosePriorityModal = () => {
        setShowPriorityModal(false);
    };

    const handleCloseCalenderModal = () => {
        setcalendarModal(false);
    };


    return (
        <div className={`backend-container ${boardId}`}>
            <h1>{boardId.charAt(0).toUpperCase() + boardId.slice(1)}</h1>
            <div className="backend-status-container">
                {statuses.map((status) => (
                    <div key={status.id} className="backend-status-box"
                         style={{backgroundColor: status.backgroundColor}}>
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
                                            <span className="priority-high">High</span>
                                        )}
                                        {task.priority === 'medium' && (
                                            <span className="priority-medium">Medium</span>
                                        )}
                                        {task.priority === 'low' && (
                                            <span className="priority-low">Low</span>
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
                                            <span>{task.name}</span>
                                            {task.dueDate && (
                                                <span className="task-due-date">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
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
                            <button
                                onClick={() => {
                                    setCurrentStatusId(status.id);
                                    setShowAddTaskModal(true);
                                }}
                                className="backend-show-add-task"
                            >
                                + Add Task
                            </button>
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
            {showcalenderModal && (
                <CalendarModal
                    isVisible={showcalenderModal}
                    onClose={handleCloseCalenderModal}
                    onSavePriority={handleSaveDate}
                    onRemoveDate={handleRemoveDate}/>
            )}
            {showAddTaskModal && (
                <AddTaskModal
                    isVisible={showAddTaskModal}
                    onClose={() => setShowAddTaskModal(false)}
                    onAddTask={(task) => handleAddTask(currentStatusId, task)}
                    status={statuses.find(status => status.id === currentStatusId)} // Pass the correct status object
                />

            )}

        </div>
    );
};

export default Boards;
