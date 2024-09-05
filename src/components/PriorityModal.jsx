// PriorityModal.jsx
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './PriorityModal.css';
import TaskService from "../Services/TaskService.js";

const PriorityModal = ({onClose, task, onSave}) => {
    const [selectedPriority, setSelectedPriority] = useState('');

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);
    };

    const handleSaveClick = async () => {
        console.log("selected : ", selectedPriority)
        try {
            // Create the updated task object with the new priority
            const updatedTask = {
                ...task, // Spread the existing task details
                priority: selectedPriority, // Update the priority with the selected value
            };

            // Call the TaskService to update the task with the new priority
            await TaskService.updateTask(task.taskId, updatedTask);

            // Alert the user that the priority was updated successfully
            // alert('Task priority updated successfully!');
            onSave(selectedPriority);
            // Close the modal after saving
            onClose();
        } catch (error) {
            // Handle any errors that occur during the update
            console.error('Error updating task priority:', error);
            alert('There was an error updating the task priority. Please try again.');
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
