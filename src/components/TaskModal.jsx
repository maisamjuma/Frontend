// TaskModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faCalendar,
    faArrowsAlt,
    faTrash,
    faClipboard
} from '@fortawesome/free-solid-svg-icons';
import PriorityModal from './PriorityModal';
import MoveModal from "./MoveModal/MoveModal.jsx";
import CalendarModal from "./CalendarModal/CalendarModal.jsx";
import DetailsModal from "./DetailsModal/DetailsModal.jsx"; // Import your new PriorityModal

const TaskModal = ({ task, onClose, onDelete, boards, statuses, onSaveDate, onRemoveDate, onSavePriority }) => {
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);


    if (!task) return null;

    const statusId = task.statusId; // Use task.statusId directly
    const status = statuses.find(status => status.id === statusId);
    const statusName = status ? status.title : 'Unknown Status';

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('task-modal-overlay')) {
            onClose();
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete(task.id);
            onClose();
        }
    };

    const handlePrioritySelect = (priority) => {
        onSavePriority(priority);
        setIsPriorityModalOpen(false);
    };

    return (
        <div className="task-modal-overlay" onClick={handleOverlayClick}>
            <div className="task-modal-content">
                <div className="task-modal-actions">
                    <button onClick={() => setIsDetailsModalOpen(true)}>
                        <FontAwesomeIcon icon={faClipboard}/> Show Details
                    </button>
                    <button onClick={() => setIsPriorityModalOpen(true)}>Edit Priority</button>
                    <button>
                        <FontAwesomeIcon icon={faUser}/> Change Member
                    </button>
                    <button onClick={() => setIsCalendarModalOpen(true)}>
                        <FontAwesomeIcon icon={faCalendar}/> Edit Dates
                    </button>
                    <button onClick={() => setIsMoveModalOpen(true)}>
                        <FontAwesomeIcon icon={faArrowsAlt}/> Move
                    </button>
                    <button onClick={handleDeleteClick}>
                        <FontAwesomeIcon icon={faTrash}/> Delete
                    </button>
                </div>
                <div className="task-status">
                    Status: {statusName}
                </div>
                {task.date && (
                    <div className="task-date">
                        {task.date instanceof Date ? task.date.toDateString() : "Invalid Date"}
                    </div>
                )}
            </div>
            {isMoveModalOpen && (
                <MoveModal
                    onClose={() => setIsMoveModalOpen(false)}
                    boards={boards}
                    statuses={statuses}
                    task={task}
                />
            )}
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
                    task={{ ...task, statusName }}
                />
            )}
            {isPriorityModalOpen && (
                <PriorityModal
                    onClose={() => setIsPriorityModalOpen(false)}
                    onSave={handlePrioritySelect}
                />
            )}
        </div>
    );
};

TaskModal.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        statusId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        date: PropTypes.instanceOf(Date),
        priority: PropTypes.string,
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
    onSaveDate: PropTypes.func.isRequired,
    onRemoveDate: PropTypes.func.isRequired,
    onSavePriority: PropTypes.func.isRequired,
};

export default TaskModal;
