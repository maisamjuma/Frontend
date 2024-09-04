import React, {useEffect, useState} from 'react';
import TaskModal from './TaskModal';
import './Boards.css';
import {FaPen} from 'react-icons/fa';
import PriorityModal from './PriorityModal';
import AddTaskModal from "./AddTaskModal";
import CalendarModal from "./CalendarModal/CalendarModal.jsx";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import PropTypes from "prop-types";
import ChangeMemberModal from "./ChangeMemberModal.jsx";
import TaskService from "../Services/TaskService.js";
import UserService from "../Services/UserService.js";
import BoardService from "../Services/BoardService.js";

const Boards = ({
                    board,
                    projectId,
                    projectDescription,
                    projectMembers,
                    setProjectId,
                    setProjectDescription,
                    setProjectMembers
                }) => {

    const boardId = board?.boardId || 'No ID';
    const name = board?.name || 'No Name';

    const [statuses, setStatuses] = useState([]);
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dropdownStatusId, setDropdownStatusId] = useState(null);
    const [highlightedTaskId, setHighlightedTaskId] = useState(null);
    const [showPriorityModal, setShowPriorityModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showCalenderModal, setCalenderModal] = useState(false);
    const [showChangeMemberModal, setShowChangeMemberModal] = useState(false);
    const [comingFromChangeMember, setComingFromChangeMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState('');
    const [taskId, setTaskId] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0);


    const onDragEnd = async (result) => {
        console.log("result", result);
        const {source, destination, draggableId} = result;

        // Check if the task was dropped outside any droppable area
        if (!destination) {
            return;
        }

        const sourceStatusId = parseInt(source.droppableId, 10);
        const destinationStatusId = parseInt(destination.droppableId, 10);
        const draggableTaskId = parseInt(draggableId, 10);  // Convert draggableId to integer

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
                        ...status, tasks: reorderedTasks
                    };
                }
                return status;
            });

            setStatuses(updatedStatuses);
            return;
        }

        // Handle moving tasks between different statuses
        const task = sourceStatus.tasks.find(task => task.taskId === draggableTaskId);

        if (!task) {
            console.error(`Task with ID ${draggableTaskId} not found`);
            return;
        }

        const updatedSourceTasks = Array.from(sourceStatus.tasks);
        updatedSourceTasks.splice(source.index, 1);

        const updatedDestinationTasks = Array.from(destinationStatus.tasks);
        updatedDestinationTasks.splice(destination.index, 0, task);

        if (destinationStatusId === 1 && sourceStatusId >= 2) {
            alert("You cannot move tasks from a higher status back to the unassigned tasks.");
            return;
        }

        const updatedStatuses = statuses.map(status => {
            if (status.id === sourceStatusId) {
                return {
                    ...status, tasks: updatedSourceTasks,
                };
            } else if (status.id === destinationStatusId) {
                return {
                    ...status, tasks: updatedDestinationTasks,
                };
            }
            return status;
        });

        setStatuses(updatedStatuses);

        // Update task status in the database
        try {
            const statusTitle = destinationStatus.title; // Get status title
            await TaskService.updateTask(task.taskId, {...task, status: statusTitle});
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('There was an error updating the task status. Please try again.');
        }
    };

    // Function to load or reset statuses
    const loadStatuses = () => {
        const savedStatuses = localStorage.getItem(`${projectId}_${boardId}_${name}_statuses`);
        const defaultStatuses = [{id: 1, title: 'Unassigned Tasks', tasks: [], backgroundColor: '#f9f9f9'}, {
            id: 2,
            title: 'To Do',
            tasks: [],
            backgroundColor: '#f9f9f9'
        }, {id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9'}, {
            id: 4,
            title: 'Ready to Review',
            tasks: [],
            backgroundColor: '#f9f9f9'
        }, {id: 5, title: 'Reviewing', tasks: [], backgroundColor: '#f9f9f9'}, {
            id: 6,
            title: 'Ready for QA',
            tasks: [],
            backgroundColor: '#f9f9f9'
        }, {id: 7, title: 'In Progress', tasks: [], backgroundColor: '#f9f9f9'}, {
            id: 8,
            title: 'QA Failed',
            tasks: [],
            backgroundColor: '#f9f9f9'
        }, {id: 9, title: 'QA Passed', tasks: [], backgroundColor: '#f9f9f9'}];

        let statuses = savedStatuses ? JSON.parse(savedStatuses) : defaultStatuses;

        // Filter statuses based on board name
        console.log("name",name);
        if (name === "QA") {
             console.log("loading QA statuses")
            statuses = statuses.filter(status => status.id > 5);
        } else if (name === 'Backend' || name === 'Frontend') {
            statuses = statuses.filter(status => status.id <= 5);
        }

        // Ensure priority field exists in each task

        return statuses;
    };

    useEffect(() => {
        if (!comingFromChangeMember) {
            const loadStatusesAndTasks = async () => {
                if (!name) return;

                console.log(`Loading statuses for {boardId: ${boardId}, name: '${name}'}`);

                // Load statuses
                const loadedStatuses = loadStatuses();
                setStatuses(loadedStatuses);

                try {
                    // Fetch tasks by board ID
                    const response = await TaskService.getTasksByBoardId(boardId);
                    const tasks = response.data;

                    // Fetch user details for each task and add assignedUserLetter
                    const updatedTasks = await Promise.all(tasks.map(async task => {
                        if (task.assignedToUserId) {
                            try {
                                const userResponse = await UserService.getUserById(task.assignedToUserId);
                                const user = userResponse.data;
                                const assignedUserLetter = user.firstName.charAt(0).toUpperCase();
                                return {...task, assignedUserLetter};
                            } catch (userError) {
                                console.error(`Error fetching user info for userId ${task.assignedToUserId}:`, userError);
                                return task; // Return the task as is if there's an error fetching user info
                            }
                        } else {
                            return task; // If no assigned user, return task as is
                        }
                    }));

                    // Update statuses with tasks
                    const updatedStatuses = loadedStatuses.map(status => {
                        const tasksForStatus = updatedTasks.filter(task => task.status === status.title);
                        return {
                            ...status, tasks: tasksForStatus
                        };
                    });

                    setStatuses(updatedStatuses);
                } catch (error) {
                    console.error('Error loading tasks:', error);
                }
            };
            loadStatusesAndTasks();
        }
    }, [boardId, name, showPriorityModal, selectedTask, refreshKey]);

    // Call this function when moving a task
    const refreshBoard = () => {
        setRefreshKey(prev => prev + 1); // Increment to trigger useEffect
    };

    useEffect(() => {
        if (statuses.length > 0) {
            console.log(`Saving statuses to key: ${projectId}_${boardId}_${name}_statuses`);
            localStorage.setItem(`${projectId}_${boardId}_${name}_statuses`, JSON.stringify(statuses));
        }
    }, [statuses, projectId, boardId, name]);

    const handleAddTask = async (statusId, task) => {
        try {
            // Fetch the user details if the task has an assigned user
            if (task.assignedToUserId) {
                try {
                    const userResponse = await UserService.getUserById(task.assignedToUserId);
                    const user = userResponse.data;
                    const assignedUserLetter = user.firstName.charAt(0).toUpperCase();
                    task = {...task, assignedUserLetter};
                } catch (userError) {
                    console.error(`Error fetching user info for userId ${task.assignedToUserId}:`, userError);
                    // Proceed without the assignedUserLetter if there's an error
                }
            }

            // Update statuses with the new task
            const updatedStatuses = statuses.map(status => {
                if (status.id === statusId) {
                    return {
                        ...status, tasks: [...status.tasks, task]
                    };
                }
                return status;
            });

            setStatuses(updatedStatuses);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = (taskId) => {
        console.log("is task id ?", taskId)
        if (taskId) {
            const updatedStatuses = statuses.map(status => ({
                ...status, tasks: status.tasks.filter(task => task.id !== taskId)
            }));
            setStatuses(updatedStatuses);
        } else console.error("task id not found")
    };

    const handleDoubleClick = (taskId) => {
        setEditingTaskId(taskId);
    };

    const handleChangeMember = (memberId, memberUsername) => {
        setComingFromChangeMember(true);
        if (selectedTask) {
            console.log('selectedTask :', selectedTask);
            const member = projectMembers.find(member => member.userId === memberId);
            console.log("member :", member)
            console.log("selectedTask :", selectedTask)
            if (member) {
                const initial = memberUsername.charAt(0).toUpperCase();
                console.log('initial', initial)
                setSelectedMember(initial);

                const updatedStatuses = statuses.map(status => ({
                    ...status, tasks: status.tasks.map(task => task.taskId === selectedTask.taskId ? {
                        ...task, assignedUserLetter: initial, assignedToUserId: memberId
                    } : task)
                }));
                setStatuses(updatedStatuses);
            } else {
                console.log('Member not found');
            }
            setShowChangeMemberModal(false);
        } else {
            console.log('No task selected');
        }
    };

    const handleBlur = async (statusId, taskId, newName) => {
        console.log("statusId", statusId);
        console.log("taskId", taskId); // Ensure this is not null
        console.log("newName", newName);

        if (!taskId) {
            console.error("Task ID is undefined");
            alert("Task ID is not available. Please try again.");
            return;
        }

        try {
            const status = statuses.find(status => status.id === statusId);
            if (!status) {
                console.error("Status not found");
                alert("Status not found. Please try again.");
                return;
            }

            const taskToUpdate = status.tasks.find(task => task.taskId === taskId);
            if (!taskToUpdate) {
                console.error("Task not found");
                alert("Task not found. Please try again.");
                return;
            }

            const updatedTask = {...taskToUpdate, taskName: newName};

            await TaskService.updateTask(taskId, updatedTask);

            const updatedStatuses = statuses.map(status => ({
                ...status, tasks: status.tasks.map(task => task.taskId === taskId ? updatedTask : task)
            }));

            setStatuses(updatedStatuses);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("There was an error updating the task. Please try again.");
        } finally {
            setEditingTaskId(null);
        }
    };

    const handlePencilClick = (task) => {
        console.log("task id:", task.taskId);
        console.log("task name:", task.taskName);

        // Assuming `taskId` is now just a direct ID rather than needing to be split
        const statusId = parseInt(task.taskId, 10); // Use taskId directly
        console.log('statusId:', statusId);
        const status = statuses.find(status => status.id === statusId);
        setSelectedTask({
            ...task, statusName: status ? status.title : 'Unknown Status'
        });

        setHighlightedTaskId(task.taskId); // Use taskId directly
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setHighlightedTaskId(null);
    };

    const handleSaveDate = (date) => {
        if (selectedTask) {
            const adjustedDate = new Date(date);

            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task => task.id === selectedTask.id ? {
                    ...task,
                    dueDate: adjustedDate.toISOString().split('T')[0]
                } : task)
            }));
            setStatuses(updatedStatuses);
            handleCloseModal();
        }
    };

    const handleRemoveDate = () => {
        if (selectedTask) {
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task => task.id === selectedTask.id ? {...task, dueDate: null} : task)
            }));
            setStatuses(updatedStatuses);
            handleCloseModal();
        }
    };

    const handleDeleteStatus = (statusId) => {
        const updatedStatuses = statuses.filter(status => status.id !== statusId);
        setStatuses(updatedStatuses);
    };

    const handleSavePriority = (newPriority) => {
        setComingFromChangeMember(false);

        if (taskId) {
            const updatedStatuses = statuses.map(status => ({
                ...status,
                tasks: status.tasks.map(task => task.taskId === taskId ? {...task, priority: newPriority} : task)
            }));
            setStatuses(updatedStatuses);
            setShowPriorityModal(false);
        }
    };

    const handleClosePriorityModal = () => {
        setShowPriorityModal(false);
    };

    const handleCloseCalenderModal = () => {
        setCalenderModal(false);
    };

    const moveTaskToQA = async (task) => {
        try {
            // Fetch boards for the project
            const boardsResponse = await BoardService.getBoardsByProject(projectId);
            const boards = boardsResponse.data;

            // Find the QA board
            const qaBoard = boards.find(board => board.name === 'QA');
            if (!qaBoard) {
                console.error('QA board not found');
                return;
            }

            const qaBoardId = qaBoard.boardId;

            // Prepare the updated task
            const updatedTask = {
                ...task,
                status: 'Ready for QA',
                boardId: qaBoardId
            };

            // Remove fields that are not compatible with the updateTask endpoint
            delete updatedTask.assignedUserLetter;
            delete updatedTask.createdAt;

            // Update the task on the server
            const updateTaskResponse = await TaskService.updateTask(task.taskId, updatedTask);
            console.log('Task updated:', updateTaskResponse);

            // Update the local state
            const updatedStatuses = statuses.map(status => {
                if (status.boardId === task.boardId) {
                    // Remove the task from the current board's status
                    return {
                        ...status,
                        tasks: status.tasks.filter(currentTask => currentTask.taskId !== task.taskId)
                    };
                } else if (status.boardId === qaBoardId) {
                    // Add the task to the QA board's status
                    return {
                        ...status,
                        tasks: [...status.tasks, updatedTask]
                    };
                }
                return status;
            });

            setStatuses(updatedStatuses);
            refreshBoard();
        } catch (error) {
            console.error('Error moving task:', error);
            alert('There was an error moving the task. Please try again.');
        }
    };

    return (<DragDropContext onDragEnd={onDragEnd}>
            <div className="boardAllStatuses">
                <div>
                    <h1>{board.name}</h1>
                </div>
                <Droppable droppableId="all-statuses" direction="horizontal">
                    {(provided) => (<div
                        className="backend-status-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {statuses.map((status) => (<div key={status.id} className="backend-status-box-wrapper">
                            <Droppable droppableId={status.id.toString()} type="TASK">
                                {(provided) => (<div
                                    className="backend-status-box"
                                    style={{backgroundColor: status.backgroundColor}}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className="backend-status-header">
                                                <span className="backend-status-title">
                                                    {status.title}
                                                </span>
                                        <span
                                            className="backend-status-menu"
                                            onClick={() => setDropdownStatusId(dropdownStatusId === status.id ? null : status.id)}
                                        >
                                                    ...
                                                </span>
                                        {dropdownStatusId === status.id && (
                                            <div className="backend-dropdown-menu">
                                                <div
                                                    className="backend-dropdown-item"
                                                    onClick={() => handleDeleteStatus(status.id)}
                                                >
                                                    Delete Status
                                                </div>
                                            </div>)}
                                    </div>
                                    <div
                                        className="backend-tasks-container"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {status.tasks.map((task, taskIndex) => (<Draggable
                                            key={task.taskId}
                                            draggableId={task.taskId.toString()}
                                            index={taskIndex}
                                        >
                                            {(provided) => (<div
                                                className={`backend-task-box ${highlightedTaskId === task.taskId ? 'highlighted' : ''}`}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                onDoubleClick={() => handleDoubleClick(task.taskId)}
                                            >
                                                <div className="topTop">
                                                    <div className="topClass">
                                                        <div
                                                            className={`task-priority-display priority-${task.priority}`}
                                                        >
                                                            {task.priority === 'high' && (<span
                                                                className="priority-high">High</span>)}
                                                            {task.priority === 'medium' && (<span
                                                                className="priority-medium">Medium</span>)}
                                                            {task.priority === 'low' && (<span
                                                                className="priority-low">Low</span>)}
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
                                                    {editingTaskId === task.taskId ? (<input
                                                        type="text"
                                                        defaultValue={task.taskName}
                                                        onBlur={(e) => handleBlur(status.id, task.taskId, e.target.value)}
                                                        className="backend-task-input"
                                                    />) : (<>
                                                        <div className="nameCss">
                                                            <span>{task.taskName}</span>
                                                        </div>
                                                        <div className="dateWithName">
                                                            <div className="dateCss">
                                                                {task.date && (<span
                                                                    className="task-due-date">
                                                                                            Due date: {new Date(task.date).toLocaleDateString()}
                                                                                        </span>)}
                                                            </div>
                                                            {(status.id >= 2) && (
                                                                <div className="nameCircle">
                                                                    {task.assignedToUserId && (
                                                                        <span
                                                                            className="taskMember">
                                                                                                {task.assignedUserLetter}
                                                                                            </span>)}
                                                                </div>)}
                                                        </div>
                                                    </>)}
                                                </div>
                                                {status.id === 5 && (<button
                                                    onClick={() => moveTaskToQA(task)}
                                                    className="move-to-qa-button"
                                                >
                                                    Move to QA
                                                </button>)}
                                            </div>)}
                                        </Draggable>))}
                                        {provided.placeholder}
                                    </div>
                                    {(status.id === 1 || status.id === 2) && (<button
                                        onClick={() => {
                                            setCurrentStatusId(status.id);
                                            setShowAddTaskModal(true);
                                        }}
                                        className="backend-show-add-task"
                                    >
                                        + Add Task
                                    </button>)}
                                    {/*{status.id === 5 && (*/}
                                    {/*    <button*/}
                                    {/*        onClick={() => moveTasksToQA()}*/}
                                    {/*        className="move-to-qa-button"*/}
                                    {/*    >*/}
                                    {/*        Move to QA*/}
                                    {/*    </button>*/}
                                    {/*)}*/}
                                </div>)}
                            </Droppable>
                        </div>))}
                        {provided.placeholder}
                    </div>)}
                </Droppable>
                {selectedTask && (<TaskModal
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
                />)}
                {showPriorityModal && (<PriorityModal
                    isVisible={showPriorityModal}
                    onClose={handleClosePriorityModal}
                    onSavePriority={handleSavePriority}
                />)}
                {showCalenderModal && (<CalendarModal
                    isVisible={showCalenderModal}
                    onClose={handleCloseCalenderModal}
                    onSavePriority={handleSaveDate}
                    onRemoveDate={handleRemoveDate}/>)}
                {showAddTaskModal && (

                    <AddTaskModal
                        isVisible={showAddTaskModal}
                        onClose={() => setShowAddTaskModal(false)}
                        onAddTask={(taskId, projectId, taskName, taskDescription, boardId, status, priority, assignedToUserId) => {
                            handleAddTask(currentStatusId, {
                                taskId,
                                projectId,
                                taskName,
                                taskDescription,
                                boardId,
                                status,
                                priority,
                                assignedToUserId
                            });
                        }}
                        status={statuses.find(status => status.id === currentStatusId)}
                        projectId={projectId}
                        projectMembers={projectMembers}
                        boardId={boardId}
                    />

                )}
                {showChangeMemberModal && (<ChangeMemberModal
                        isVisible={showChangeMemberModal}
                        onClose={() => setShowChangeMemberModal(false)}
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
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string,]).isRequired,
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
        boardId: PropTypes.number.isRequired, name: PropTypes.string.isRequired
    }).isRequired, // Ensure board prop is defined and required
};

export default Boards;