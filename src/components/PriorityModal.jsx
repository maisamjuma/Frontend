// PriorityModal.jsx
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './PriorityModal.css';
import TaskService from "../Services/TaskService.js";

const PriorityModal = ({onClose,task, onSave}) => {
    const [selectedPriority, setSelectedPriority] = useState('');

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);
    };

    const handleSaveClick = async () => {
        try {
            // Update the task with the new priority
            await TaskService.updateTask(task.taskId, { priority: selectedPriority });
            onSave(selectedPriority); // Notify the parent component
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating task priority:', error);
            alert('Failed to update the task priority. Please try again.');
        }
    };


    return (
        <div className="priority-modal-overlay" onClick={onClose}>
            <div className="priority-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="priorityheader">Select Priority</h2>
                <div className="priority-options">
                    <button
                        className={`priority-option ${selectedPriority === 'medium' ? 'selected' : ''}`}
                        onClick={() => handlePriorityChange('medium')}
                    >
                        Medium
                    </button>
                    <button
                        className={`priority-option ${selectedPriority === 'high' ? 'selected' : ''}`}
                        onClick={() => handlePriorityChange('high')}
                    >
                        High
                    </button>
                    <button
                        className={`priority-option ${selectedPriority === 'low' ? 'selected' : ''}`}
                        onClick={() => handlePriorityChange('low')}
                    >
                        Low
                    </button>
                </div>
                <button className="save-button" onClick={handleSaveClick}>
                    Save
                </button>
            </div>
        </div>
    );
};

PriorityModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        taskDescription: PropTypes.string.isRequired,
    }),
};

export default PriorityModal;
