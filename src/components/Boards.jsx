import React, {useState, useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import TaskModal from './TaskModal';
import './Boards.css';
import {FaPen} from 'react-icons/fa';
// import MoveModal from "./MoveModal.jsx";
import PriorityModal from './PriorityModal';
import AddTaskModal from "./AddTaskModal"; // Import the new component
// import PriorityModal from './PriorityModal';
import MoveModal from "./MoveModal/MoveModal.jsx";
import CalendarModal from "./CalendarModal/CalendarModal.jsx";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import PropTypes from "prop-types";
import members from "./Member/Members.jsx";


const Boards = ({ projectId, projectDescription, projectMembers, setProjectId, setProjectDescription, setProjectMembers }) => {
    const {projectName, boardId, name} = useParams(); // Get boardName from the route parameters
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

    console.log("projectId:",projectId,"projectDescription:",projectDescription,"projectMembers:",projectMembers);

    // const location = useLocation();
    // const [projectId, setProjectId] = useState(null);
    // const [projectDescription, setProjectDescription] = useState(null);
    // const [projectMembers, setProjectMembers] = useState([]); // State for project members
    // useEffect(() => {
    //     console.log("chinaaaaa","memberes:");
    //
    //     if (location.state) {
    //         const { projectId, projectDescription,projectMembers } = location.state;
    //         setProjectId(projectId);
    //         setProjectDescription(projectDescription); // Make sure this is correctly set
    //         setProjectMembers(projectMembers); // Set project members here
    //         console.log("chinaaaaa",projectId,projectDescription,"memberes:",projectMembers);
    //     }
    // }, [location.state]);

    // console.log("Project Description:", projectDescription);
    // console.log("Project ID:", projectId);
    // console.log("Project Members:", projectMembers);

    // Load statuses from localStorage or use default values
    useEffect(() => {
        const loadStatuses = () => {
            const savedStatuses = localStorage.getItem(`${projectName}_${boardId}_${name}_statuses`);
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

            if (name === 'QA') {
                return statuses.filter(status => status.id > 5); // Show only statuses with id > 5
                // eslint-disable-next-line no-dupe-else-if
            } else if (name === 'Backend' || name === 'Frontend') {
                return statuses.filter(status => status.id <= 5);
            }
            return statuses; // Show all statuses for other boards
        };

        setStatuses(loadStatuses());
    }, [projectName, boardId, name]);

    const onDragEnd = (result) => {
        const {source, destination} = result;

        // Check if the task was dropped outside any droppable area
        if (!destination) {
            return;
        }

        const sourceStatusId = parseInt(source.droppableId, 10);
        const destinationStatusId = parseInt(destination.droppableId, 10);

        // Check if the task was dropped in the same place
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Find source and destination status objects
        const sourceStatus = statuses.find(status => status.id === sourceStatusId);
        const destinationStatus = statuses.find(status => status.id === destinationStatusId);

        if (!sourceStatus || !destinationStatus) {
            return;
        }

        // Handle reordering within the same status
        if (sourceStatusId === destinationStatusId) {
            const reorderedTasks = Array.from(sourceStatus.tasks);
            const [movedTask] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, movedTask);

            const updatedStatuses = statuses.map(status => {
                if (status.id === sourceStatusId) {
                    return {
                        ...status,
                        tasks: reorderedTasks
                    };
                }
                return status;
            });

            setStatuses(updatedStatuses);
            return;
        }

        // Handle moving tasks between different statuses
        const task = sourceStatus.tasks[source.index];

        const updatedSourceTasks = Array.from(sourceStatus.tasks);
        updatedSourceTasks.splice(source.index, 1);

        const updatedDestinationTasks = Array.from(destinationStatus.tasks);
        updatedDestinationTasks.splice(destination.index, 0, task);

        const updatedStatuses = statuses.map(status => {
            if (status.id === sourceStatusId) {
                return {
                    ...status,
                    tasks: updatedSourceTasks,
                };
            } else if (status.id === destinationStatusId) {
                return {
                    ...status,
                    tasks: updatedDestinationTasks,
                };
            }
            return status;
        });

        setStatuses(updatedStatuses);
    };


    // Save statuses to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(`${projectName}_${boardId}_${name}_statuses`, JSON.stringify(statuses));
    }, [statuses, projectName, boardId, name]);

    const handleAddTask = (statusId, task) => {
        if (task.name.trim()) {
            const status = statuses.find(status => status.id === statusId);
            if (status) {
                const newTask = {
                    id: `${projectName}_${boardId}_${name}_${statusId}_${status.tasks.length + 1}`,
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
            //adjustedDate.setDate(adjustedDate.getDate()); // Add one day

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
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`backend-container ${boardId}`}>
                <h1>{name}</h1>
                <Droppable droppableId="all-statuses" direction="horizontal">
                    {(provided) => (
                        <div
                            className="backend-status-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {statuses.map((status) => (
                                <Droppable key={status.id} droppableId={status.id.toString()} type="TASK">
                                    {(provided) => (
                                        <div
                                            className="backend-status-box"
                                            style={{backgroundColor: status.backgroundColor}}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <div className="backend-status-header">
                                                <span className="backend-status-title">
                                                    {status.title}
                                                </span>
                                                <span className="backend-status-menu"
                                                      onClick={() => setDropdownStatusId(dropdownStatusId === status.id ? null : status.id)}>...</span>
                                                {dropdownStatusId === status.id && (
                                                    <div className="backend-dropdown-menu">
                                                        <div className="backend-dropdown-item"
                                                             onClick={() => handleDeleteStatus(status.id)}>Delete Status
                                                        </div>
                                                        <div className="backend-dropdown-separator"/>
                                                        <div className="backend-dropdown-color-picker">
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#a729ca'}}
                                                                 onClick={() => handleChangeColor(status.id, '#a729ca')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#1148cc'}}
                                                                 onClick={() => handleChangeColor(status.id, '#1148cc')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#ffcccc'}}
                                                                 onClick={() => handleChangeColor(status.id, '#ffcccc')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#ccffcc'}}
                                                                 onClick={() => handleChangeColor(status.id, '#ccffcc')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#c3a838'}}
                                                                 onClick={() => handleChangeColor(status.id, '#c3a838')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#6ab54d'}}
                                                                 onClick={() => handleChangeColor(status.id, '#6ab54d')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#ccccff'}}
                                                                 onClick={() => handleChangeColor(status.id, '#ccccff')}/>
                                                            <div className="backend-color-box"
                                                                 style={{backgroundColor: '#ffffcc'}}
                                                                 onClick={() => handleChangeColor(status.id, '#ffffcc')}/>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="backend-tasks-container">
                                                {status.tasks.map((task, taskIndex) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                                        {(provided) => (
                                                            <div
                                                                className={`backend-task-box ${highlightedTaskId === task.id ? 'highlighted' : ''}`}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                                onDoubleClick={() => handleDoubleClick(task.id)}
                                                            >
                                                                <div className="topTop">
                                                                    <div className="topClass">
                                                                        <div
                                                                            className="task-priority-display priority-${task.priority}">
                                                                            {task.priority === 'high' && (
                                                                                <span
                                                                                    className="priority-high">High</span>
                                                                            )}
                                                                            {task.priority === 'medium' && (
                                                                                <span
                                                                                    className="priority-medium">Medium</span>
                                                                            )}
                                                                            {task.priority === 'low' && (
                                                                                <span
                                                                                    className="priority-low">Low</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="topClass2">
                                                                        <FaPen
                                                                            className="backend-pencil-icon"
                                                                            onClick={() => handlePencilClick(task)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="MiddleClass">
                                                                    {editingTaskId === task.id ? (
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={task.name}
                                                                            onBlur={(e) => handleBlur(status.id, task.id, e.target.value)}
                                                                            className="backend-task-input"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <div className="nameCss">
                                                                                <span>{task.name}</span>
                                                                            </div>
                                                                            <div className="dateWithName">
                                                                                <div className="dateCss">
                                                                                    {task.dueDate && (
                                                                                        <span className="task-due-date">
                                                                                            Due date: {new Date(task.dueDate).toLocaleDateString()}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {(status.id >= 2) && (
                                                                                    <div className="nameCircle">
                                                                                        {task.name.charAt(0).toUpperCase()}{/*neeeeeeeeeeeeeeeeed changeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee*/}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
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
                                    )}
                                </Droppable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
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


                        projectId={projectId}
                        projectDescription={projectDescription}
                        projectMembers={projectMembers}
                        setProjectId={setProjectId}
                        setProjectDescription={setProjectDescription}
                        setProjectMembers={setProjectMembers}
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

                        projectId={projectId}
                        projectDescription={projectDescription}
                        projectMembers={projectMembers}
                        setProjectId={setProjectId}
                        setProjectDescription={setProjectDescription}
                        setProjectMembers={setProjectMembers}
                    />

                )}

            </div>
        </DragDropContext>



    );

};
Boards.propTypes = {

projectId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
]),
    projectDescription: PropTypes.string,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired, // or PropTypes.string if ids are strings
    username: PropTypes.string.isRequired,
})),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired,

};
export default Boards;
