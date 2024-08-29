import React, {useState, useEffect} from 'react';
// import { useParams} from 'react-router-dom';
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
import ChangeMemberModal from "./ChangeMemberModal.jsx";
import TaskService from "../Services/TaskService.js";
// import BoardService from "../Services/BoardService.js";
//import members from "./Member/Members.jsx";
//import members from "./Member/Members.jsx";
//import TaskService from '../Services/TaskService';


const Boards = ({ board, projectId, projectDescription, projectMembers, setProjectId, setProjectDescription, setProjectMembers }) => {
    // const { board} = useParams(); // Get boardName from the route parameters
    // const [boardName, setBoardName] = useState(null);
    // const { boardId, name } = board;
    const boardId = board?.boardId || 'No ID';
    const name = board?.name || 'No Name';

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
    const [showchangememberModal, setshowchangememberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [taskId, setTaskId] = useState(null);
    console.log(projectMembers)
    console.log("boardId ccccccccccccccccccccc",boardId)
    console.log("name ccccccccccccccccccc",name)





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

        if(destinationStatusId === 1 && sourceStatusId >= 2){
            alert("You cannot move tasks from a higher status back to the unassigned tasks.");
            return;
        }

        if(sourceStatusId === 1 && destinationStatusId >= 3){
            alert("You can only move tasks from an unassigned status to ToDo status");
            return;
        }

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


    // Function to load or reset statuses
    const loadStatuses = () => {
        const savedStatuses = localStorage.getItem(`${projectId}_${boardId}_${name}_statuses`);
        const defaultStatuses = [
            { id: 1, title: 'Unassigned Tasks', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 2, title: 'To Do', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 4, title: 'Ready to Review', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 5, title: 'Reviewing', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 6, title: 'Ready for QA', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 7, title: 'In Progress', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 8, title: 'QA Failed', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 9, title: 'QA Passed', tasks: [], backgroundColor: '#f9f9f9' }
        ];

        let statuses = savedStatuses ? JSON.parse(savedStatuses) : defaultStatuses;

        // Filter statuses based on board name
        if (name === 'QA') {
            statuses = statuses.filter(status => status.id > 5);
        } else if (name === 'Backend' || name === 'Frontend') {
            statuses = statuses.filter(status => status.id <= 5);
        }

        return statuses;
    };

    // Initial load of statuses
    useEffect(() => {
        if (name) {
            console.log(`Loading statuses for {projectId: ${projectId}, boardId: ${boardId}, name: '${name}'}`);
            setStatuses(loadStatuses());
        }
    }, [projectId, boardId, name]);

    // Reset statuses in localStorage
    const resetStatuses = () => {
        console.log(`Resetting statuses for {projectId: ${projectId}, boardId: ${boardId}, name: '${name}'}`);
        localStorage.removeItem(`${projectId}_${boardId}_${name}_statuses`);
        setStatuses(loadStatuses());
    };

    // Save statuses to localStorage whenever they change
    useEffect(() => {
        if (statuses.length > 0) {
            console.log(`Saving statuses to key: ${projectId}_${boardId}_${name}_statuses`);
            localStorage.setItem(`${projectId}_${boardId}_${name}_statuses`, JSON.stringify(statuses));
        }
    }, [statuses, projectId, boardId, name]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const response = await TaskService.getTasksByProjectId(projectId);
                const tasks = response.data;

                // Filter tasks by boardId before mapping them to statuses
                const filteredTasks = tasks.filter(task => task.boardId === boardId);

                // Retrieve statuses or use defaults
                const storedStatuses = loadStatuses();

                // Map tasks to their corresponding statuses
                const updatedStatuses = storedStatuses.map(status => {
                    const tasksForStatus = filteredTasks.filter(task => task.status === status.title);
                    return {
                        ...status,
                        tasks: tasksForStatus
                    };
                });

                setStatuses(updatedStatuses);
            } catch (error) {
                console.error("Error loading tasks:", error);
            }
        };

        loadTasks();
    }, [projectId, boardId, name]);


    const handleAddTask = async (statusId, task) => {
        if (task.name.trim()) {
            const status = statuses.find(status => status.id === statusId);
            if (status) {
                const newTask = {
                    projectId: projectId,
                    taskName: task.name,
                    boardId:boardId,
                    taskDescription: task.description || '',
                    status: status.title, // Use status.title as a string
                    priority: task.priority ? task.priority.toUpperCase() : 'MEDIUM', // Convert priority to uppercase
                    date: task.dueDate || null, // Assuming this is not needed for creation
                    assignedToUserId: task.assignedUserId || null, // Change to assignedToUserId
                    assignedUserLetter: task.assignedUserLetter || null, // Handle optional fields
                };

                console.log("received task:", newTask);

                try {
                    const response = await TaskService.createTask(newTask);
                    const createdTask = response.data;
                    const newTaskId = createdTask.taskId; // Use taskId from the response

                    console.log("Created task:", createdTask);
                    console.log("new Task ID:", newTaskId);

                    setTaskId(newTaskId);

                    const updatedStatuses = statuses.map(status => {
                        if (status.id === statusId) {
                            return {
                                ...status,
                                tasks: [...status.tasks, createdTask]
                            };
                        }
                        return status;
                    });

                    console.log("Updated statuses:", updatedStatuses);
                    setStatuses(updatedStatuses);
                    setShowAddTaskModal(false);
                } catch (error) {
                    if (error.response) {
                        console.error("Error creating task:", error.response.data);
                        alert(`Error creating task: ${error.response.data.error || 'An unknown error occurred'}`);
                    } else if (error.request) {
                        console.error("Error creating task: No response received");
                        alert("No response received from the server. Please try again.");
                    } else {
                        console.error("Error creating task:", error.message);
                        alert("An error occurred while creating the task. Please try again.");
                    }
                }
            }
        } else {
            alert("Task name cannot be empty.");
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

    const handleChangeMember = (memberId,memberUsername) => {
        console.log("Board memberId:",memberId)
        console.log("Board memberUsername:",memberUsername)

        if (selectedTask) {
            console.log("selectedTask: ",selectedTask)

            const member = projectMembers.find(member => member.userId === memberId);
            // console.log("member :",member)
            if (member) {
                // Extract the first letter of the member's name and convert to uppercase
                // const initial = member.username.charAt(0).toUpperCase();
                const initial = memberUsername.charAt(0).toUpperCase();
                setSelectedMember(initial);

                // Update statuses with the new member ID for the selected task

                const updatedStatuses = statuses.map(status => ({
                    ...status,
                    tasks: status.tasks.map(task =>
                        // task.id === selectedTask.id ? { ...task,memberInitials: task.assignedToUserId } : task
                        task.id === selectedTask.id ? { ...task,assignedUserLetter: initial,assignedToUserId: memberId} : task
                    )
                }));
                setStatuses(updatedStatuses);
            }
            else {
                console.log('Member not found');
            }
            setshowchangememberModal(false);
        } else {
            console.log('No task selected');
        }
    };


    const handleBlur = async (statusId, taskId, newName) => {

        console.log("statusId",statusId)
        console.log("taskId",taskId)
        console.log("newName",taskId)
        try {
            // Find the task you want to update
            const taskToUpdate = statuses
                .find(status => status.id === statusId)
                .tasks.find(task => task.id === taskId);

            // Create an updated task object
            const updatedTask = {
                ...taskToUpdate,
                taskName: newName
            };

            // Update the task on the server
            await TaskService.updateTask(taskId,updatedTask);

            // Update the state locally
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task =>
                    task.id === taskId ? updatedTask : task
                )
            }));

            setStatuses(updatedStatuses);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        } finally {
            // Clear the editing state
            setEditingTaskId(null);
        }
    };


    // const handleChangeColor = (statusId, color) => {
    //     const updatedStatuses = statuses.map(status => {
    //         if (status.id === statusId) {
    //             return {
    //                 ...status,
    //                 backgroundColor: color
    //             };
    //         }
    //         return status;
    //     });
    //     setStatuses(updatedStatuses);
    //     setDropdownStatusId(null);
    // };

    const handlePencilClick = (task) => {
        const statusId = parseInt(taskId.split('_')[2], 10);
        const status = statuses.find(status => status.id === statusId);
        setSelectedTask({
            ...task,
            statusName: status ? status.title : 'Unknown Status'
        });
        setHighlightedTaskId(taskId);
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
                    taskId === selectedTask.id ? {...task, priority: newPriority} : task
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
            <div className={` ${boardId}`}>
                <div><h1>{name}</h1></div>
                <button onClick={resetStatuses}>Reset Statuses</button>
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
                                                        {/*<div className="backend-dropdown-separator"/>*/}
                                                        {/*<div className="backend-dropdown-color-picker">*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#a729ca'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#a729ca')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#1148cc'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#1148cc')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#ffcccc'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#ffcccc')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#ccffcc'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#ccffcc')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#c3a838'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#c3a838')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#6ab54d'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#6ab54d')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#ccccff'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#ccccff')}/>*/}
                                                        {/*    <div className="backend-color-box"*/}
                                                        {/*         style={{backgroundColor: '#ffffcc'}}*/}
                                                        {/*         onClick={() => handleChangeColor(status.id, '#ffffcc')}/>*/}
                                                        {/*</div>*/}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="backend-tasks-container">
                                                {status.tasks.map((task, taskIndex) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                                        {(provided) => (
                                                            <div
                                                                className={`backend-task-box ${highlightedTaskId === taskId ? 'highlighted' : ''}`}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                                onDoubleClick={() => handleDoubleClick(taskId)}
                                                            >
                                                                <div className="topTop">
                                                                    <div className="topClass">
                                                                        <div
                                                                            className="task-priority-display priority-${task.priority}">
                                                                            {task.priority === 'HIGH' && (
                                                                                <span
                                                                                    className="priority-high">High</span>
                                                                            )}
                                                                            {task.priority === 'MEDIUM' && (
                                                                                <span
                                                                                    className="priority-medium">Medium</span>
                                                                            )}
                                                                            {task.priority === 'LOW' && (
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
                                                                    {editingTaskId === taskId ? (
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={task.taskName}
                                                                            onBlur={(e) => handleBlur(status.id, taskId, e.target.value)}
                                                                            className="backend-task-input"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <div className="nameCss">
                                                                                <span>{task.taskName}</span>
                                                                            </div>
                                                                            <div className="dateWithName">
                                                                                <div className="dateCss">
                                                                                    {task.date && (
                                                                                        <span className="task-due-date">
                                                                                            Due date: {new Date(task.date).toLocaleDateString()}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {(status.id >= 2) && (
                                                                                    <div className="nameCircle">
                                                                                        {task.assignedToUserId && (
                                                                                            <span
                                                                                                className="taskMember">
                                                                                            {/*{task.memberInitials} /!* we need it for the old tasks*!/*/}
                                                                                                {task.assignedUserLetter}{/* we need it for add user*/}
                                                                                        </span>
                                                                                        )}
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
                        selectedMember={selectedMember}
                        onDelete={handleDeleteTask}
                        task={selectedTask}
                        onClose={handleCloseModal}
                        boards={statuses}
                        statuses={statuses}
                        onSaveDate={handleSaveDate}
                        onSaveMember={handleChangeMember}
                        onRemoveDate={handleRemoveDate}
                        onSavePriority={handleSavePriority}
                        members={projectMembers}
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
                {
                    showcalenderModal && (
                        <CalendarModal
                            isVisible={showcalenderModal}
                            onClose={handleCloseCalenderModal}
                            onSavePriority={handleSaveDate}
                            onRemoveDate={handleRemoveDate}/>
                    )
                }
                {showAddTaskModal && (

                    <AddTaskModal

                        isVisible={showAddTaskModal}
                        onClose={() => setShowAddTaskModal(false)}
                        onAddTask={(task) => handleAddTask(currentStatusId, task)}
                        status={statuses.find(status => status.id === currentStatusId)} // Pass the correct status object

                        projectId={projectId}
                        projectDescription={projectDescription}
                        projectMembers={projectMembers} // Add this line
                        setProjectId={setProjectId}
                        setProjectDescription={setProjectDescription}
                        setProjectMembers={setProjectMembers}
                        boardId={boardId} // Pass the boardId as a prop
                    />

                )}
                {showchangememberModal && (
                    <ChangeMemberModal
                        isVisible={showchangememberModal}
                        onClose={() => setshowchangememberModal(false)}
                        onSave={handleChangeMember}
                        projectId={projectId}
                        projectDescription={projectDescription}
                        projectMembers={projectMembers} // Add this line
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
]).isRequired,
    projectDescription: PropTypes.string,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
})),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired,
    memberId: PropTypes.string, // Added if you are using memberId
    board: PropTypes.shape({
        boardId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired, // Ensure board prop is defined and required
};

export default Boards;
