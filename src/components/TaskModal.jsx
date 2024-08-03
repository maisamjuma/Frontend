import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faArrowsAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import MoveModal from './MoveModal'; // Import the MoveModal component

const TaskModal = ({ task, onClose, boards, statuses }) => {
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    if (!task) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('task-modal-overlay')) {
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
                    <button>
                        <FontAwesomeIcon icon={faCalendar} /> Edit Dates
                    </button>
                    <button onClick={() => setIsMoveModalOpen(true)}>
                        <FontAwesomeIcon icon={faArrowsAlt} /> Move
                    </button>
                    <button>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>
            </div>
            {isMoveModalOpen && (
                <MoveModal
                    onClose={() => setIsMoveModalOpen(false)}
                    boards={boards}
                    statuses={statuses}
                    task={task} // Ensure the task prop is passed here
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
    }),
    onClose: PropTypes.func.isRequired,
    boards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
};

export default TaskModal;
