import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faArrowsAlt, faTrash, faClipboard } from '@fortawesome/free-solid-svg-icons';
import MoveModal from './MoveModal/MoveModal.jsx';
import CalendarModal from './CalendarModal/CalendarModal.jsx';
import DetailsModal from './DetailsModal/DetailsModal.jsx';
const TaskModal = ({ task, onClose, onDelete, boards, statuses, onSaveDate, onRemoveDate }) => {
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    if (!task) return null;

    // Debugging
    console.log('Statuses:', statuses);
    console.log('Task Status ID:', task.statusId);

    // Find the status name
    const status = statuses.find(status => status.id === Number(task.statusId)); // Ensure comparison is correct
    console.log('Status:', status); // Debugging
    const statusName = status ? status.name : 'Unknown Status';

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

    return (
        <div className="task-modal-overlay" onClick={handleOverlayClick}>
            <div className="task-modal-content">
                <div className="task-modal-actions">
                    <button onClick={() => setIsDetailsModalOpen(true)}>
                        <FontAwesomeIcon icon={faClipboard}/> Show Details
                    </button>
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
                    task={{ ...task, statusName }} // Pass the task object with the status name
                />
            )}
        </div>
    );
};


TaskModal.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        statusId: PropTypes.number, // Remove .isRequired if statusId might be undefined
        date: PropTypes.instanceOf(Date),
    }),
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    boards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    onSaveDate: PropTypes.func.isRequired,
    onRemoveDate: PropTypes.func.isRequired,
};


export default TaskModal;
