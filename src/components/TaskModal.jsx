import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUser,
    faCalendar,
    faTrash,
    faClipboard,
    faArrowUp,
    faTag
} from '@fortawesome/free-solid-svg-icons';
import PriorityModal from './PriorityModal';
//import MoveModal from "./MoveModal/MoveModal.jsx";
import CalendarModal from "./CalendarModal/CalendarModal.jsx";
import DetailsModal from "./DetailsModal/DetailsModal.jsx";
import LabelModal from "./LabelModal.jsx";
import ChangeMemberModal from './ChangeMemberModal';
import TaskService from "../Services/TaskService.js";
import { userIsAdmin, userIsTeamLeader } from '../utils/authUtils'; // Import the utility functions

// eslint-disable-next-line react/prop-types
const TaskModal = ({
                       selectedMember,
                       task,
                       onClose,
                       onDelete,
                       statuses,
                       labels = [],
                       onSaveMember,
                       onSaveDate,
                       onRemoveDate,
                       onSavePriority,
                       onSaveLabels,
                       projectId,
                        boardId,
                       projectDescription,
                       projectMembers,
                       setProjectId,
                       setProjectDescription,
                       setProjectMembers
                   }) => {
    //const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [isChangeMemberModalOpen, setIsChangeMemberModalOpen] = useState(false);
    // const userRoleIsAdmin = userIsAdmin(); // Check if the user is an admin
    // const userRoleIsTeamLeader = userIsTeamLeader(); // Check if the user is an admin
    console.log("projectId:", projectId, "projectDescription:", projectDescription, "projectMembers:", projectMembers);
    console.log("hhghg", selectedMember)
    // eslint-disable-next-line react/prop-types
    console.log("is task in taskmodal ? ", task)
    console.log("is task in boardid ? ", boardId)

// Get the logged-in user from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("user from the localStorage: ", user);
    }
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

    // Check if the logged-in user is assigned to the task
    const isAssignedToTask = loggedInUser && loggedInUser.userId === task.assignedToUserId;

    if (!task) return null;

    // const status = statuses.find(status => status.id === task.statusId) || {};
    // const statusName = status.title || 'Unknown Status';

    // Function to determine background color based on the first label
    const getTaskBackgroundColor = () => {
        if (!task.labels || !Array.isArray(task.labels)) return 'transparent';
        const label = labels.find(label => task.labels.includes(label.id));
        return label ? label.color : 'transparent';
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('task-modal-overlay')) onClose();
    };

    const handleDeleteClick = async () => {
        if (!isAssignedToTask) {
            // If the user is not assigned to the task, show an alert and do not proceed
            alert('You are not assigned to this task and cannot delete it.');
            return; // Prevent the deletion process
        }

        // Proceed with the deletion if the user is assigned
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await TaskService.deleteTask(task.taskId); // Call the service method
                onDelete(task.taskId); // Notify the parent component to remove the task
                onClose(); // Close the modal
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete the task. Please try again.');
            }
        }
    };



    // const handleSaveMember = (memberId) => {
    //     console.log('Selected member ID:', memberId);
    //     // Handle the logic to save the selected member
    //     // For example, update the task with the new member ID
    //     // updateTaskMember(task.id, memberId);
    // };
// Determine if the Change Member button should be visible
    const canChangeMembers = userIsAdmin() || userIsTeamLeader();
    return (
        <div className="task-modal-overlay" onClick={handleOverlayClick}>
            <div className="task-modal-content" style={{backgroundColor: getTaskBackgroundColor()}}>
                <div className="task-modal-actions">
                    <button onClick={() => setIsDetailsModalOpen(true)}>
                        <FontAwesomeIcon icon={faClipboard}/> Show Details
                    </button>
                    <button onClick={() => setIsPriorityModalOpen(true)}>
                        <FontAwesomeIcon icon={faArrowUp}/> Edit Priority
                    </button>
                    {canChangeMembers && (
                        <button onClick={() => setIsChangeMemberModalOpen(true)}>
                            <FontAwesomeIcon icon={faUser} /> Change Member
                        </button>
                    )}
                    <button onClick={() => setIsCalendarModalOpen(true)}>
                        <FontAwesomeIcon icon={faCalendar}/> Edit Due Date
                    </button>
                    {/*<button onClick={() => setIsMoveModalOpen(true)}>*/}
                    {/*    <FontAwesomeIcon icon={faArrowsAlt}/> Move*/}
                    {/*</button>*/}
                    <button onClick={() => setIsLabelModalOpen(true)}>
                        <FontAwesomeIcon icon={faTag}/> Edit Labels
                    </button>

                        <button onClick={handleDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>

                </div>
                {/*<div className="task-status">*/}
                {/*    Status: {task.status}*/}
                {/*</div>*/}
                {task.dueDate && (
                    <div className="task-date">
                        {new Date(task.dueDate).toISOString()}
                    </div>
                )}
            </div>
            {/*{isMoveModalOpen && (*/}
            {/*    <MoveModal*/}
            {/*        onClose={() => setIsMoveModalOpen(false)}*/}
            {/*        boardId={boardId}*/}
            {/*        statuses={statuses}*/}
            {/*        task={{...task}}*/}
            {/*        projectId={projectId}*/}
            {/*        projectDescription={projectDescription}*/}
            {/*        projectMembers={projectMembers}*/}
            {/*        setProjectId={setProjectId}*/}
            {/*        setProjectDescription={setProjectDescription}*/}
            {/*        setProjectMembers={setProjectMembers}*/}
            {/*        />*/}
            {/*)}*/}
            {isCalendarModalOpen && (
                <CalendarModal
                    onClose={() => setIsCalendarModalOpen(false)}
                    onSave={onSaveDate}
                    task={{...task}}
                    onRemoveDate={() => {
                        onRemoveDate();
                        onClose();
                    }}
                />
            )}
            {isDetailsModalOpen && (
                <DetailsModal
                    onClose={() => setIsDetailsModalOpen(false)}
                    task={{...task}}
                />
            )}
            {isPriorityModalOpen && (
                <PriorityModal
                    onClose={() => setIsPriorityModalOpen(false)}
                    onSave={onSavePriority}
                    task={{...task}}
                />
            )}
            {isLabelModalOpen && (
                <LabelModal
                    onClose={() => setIsLabelModalOpen(false)}
                    labels={labels}
                    selectedLabels={task.labels || []}
                    onSave={onSaveLabels}
                />
            )}
            {isChangeMemberModalOpen && (
                <ChangeMemberModal
                    onClose={() => setIsChangeMemberModalOpen(false)}
                    onSave={onSaveMember} // Pass the function to handle saving the member
                    task={{...task}}
                    projectId={projectId}
                    boardId={boardId}
                    projectDescription={projectDescription}
                    projectMembers={projectMembers}
                    setProjectId={setProjectId}
                    setProjectDescription={setProjectDescription}
                    setProjectMembers={setProjectMembers}
                />
            )}


        </div>


    );
};
TaskModal.propTypes = {
    selectedMember: PropTypes.string, // Assuming selectedMember is a string or use the correct type
    task: PropTypes.shape({
        taskName: PropTypes.string.isRequired,
        taskId: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        taskDescription: PropTypes.string.isRequired,
        dueDate: PropTypes.instanceOf(Date),
        priority: PropTypes.string.isRequired,
        labels: PropTypes.arrayOf(PropTypes.string),
        assignedToUserId: PropTypes.string, // Added if you are using memberId
    }),
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    boards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    })).isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
    })).isRequired,
    onSaveDate: PropTypes.func.isRequired,
    onSaveMember: PropTypes.func.isRequired,
    onRemoveDate: PropTypes.func.isRequired,
    onSavePriority: PropTypes.func.isRequired,
    boardId: PropTypes.number.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    })).isRequired,
};


export default TaskModal;
