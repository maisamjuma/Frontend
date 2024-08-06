// TaskModal.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faArrowsAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import MoveModal from './MoveModal'; // Import the MoveModal component
import CalendarModal from './CalendarModal'; // Import the CalendarModal component

const TaskModal = ({ task, onClose, onDelete, boards, statuses, onSaveDate, onRemoveDate }) => {
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    if (!task) return null;

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
                    <button>
                        <FontAwesomeIcon icon={faUser} /> Change Member
                    </button>
                    <button onClick={() => setIsCalendarModalOpen(true)}>
                        <FontAwesomeIcon icon={faCalendar} /> Edit Dates
                    </button>
                    <button onClick={() => setIsMoveModalOpen(true)}>
                        <FontAwesomeIcon icon={faArrowsAlt} /> Move
                    </button>
                    <button onClick={handleDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
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
        </div>
    );
};

// Define prop types
TaskModal.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        statusId: PropTypes.number.isRequired,
        date: PropTypes.instanceOf(Date), // Add this line if date is used
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
    onRemoveDate: PropTypes.func.isRequired, // Add this prop type
};

export default TaskModal;
