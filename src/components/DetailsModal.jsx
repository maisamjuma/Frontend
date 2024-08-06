import React from 'react';
import PropTypes from 'prop-types';
import './DetailsModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faTimes } from '@fortawesome/free-solid-svg-icons';



const DetailsModal = ({ task, onClose }) => {
    if (!task) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('details-modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="details-modal-overlay" onClick={handleOverlayClick}>
            <div className="details-modal-content">
                <div className="details-modal-header">
                    <div className="details-modal-title">
                        <FontAwesomeIcon icon={faTasks} className="details-icon" />
                        <h2>{task.name}</h2>
                    </div>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
                </div>
                <p className="task-status">In Status: {task.statusName}</p> {/* Use statusName */}
                {task.date && (
                    <p className="task-date">Date: {task.date instanceof Date ? task.date.toDateString() : "Invalid Date"}</p>
                )}
            </div>
        </div>
    );
};

DetailsModal.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        statusName: PropTypes.string.isRequired, // Ensure statusName is required
        date: PropTypes.instanceOf(Date),
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default DetailsModal;


