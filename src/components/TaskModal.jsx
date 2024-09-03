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
    console.log("projectId:", projectId, "projectDescription:", projectDescription, "projectMembers:", projectMembers);
    console.log("hhghg", selectedMember)
    // eslint-disable-next-line react/prop-types
    console.log("is task in taskmodal ? ", task)


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
                    <button onClick={() => setIsChangeMemberModalOpen(true)}>
                        <FontAwesomeIcon icon={faUser}/> Change Member
                    </button>
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
                        <FontAwesomeIcon icon={faTrash}/> Delete
                    </button>
                </div>
                {/*<div className="task-status">*/}
                {/*    Status: {task.status}*/}
                {/*</div>*/}
                {task.date && (
                    <div className="task-date">
                        {new Date(task.date).toDateString()}
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
        date: PropTypes.instanceOf(Date),
        priority: PropTypes.string.isRequired,
        labels: PropTypes.arrayOf(PropTypes.string),
        memberId: PropTypes.string, // Added if you are using memberId
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
    members: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    })).isRequired,
};


export default TaskModal;
