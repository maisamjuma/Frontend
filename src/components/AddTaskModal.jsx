import React, { useState } from 'react';
import './AddTaskModal.css';
import PriorityModal from './PriorityModal';

// eslint-disable-next-line react/prop-types
const AddTaskModal = ({ isVisible, onClose, onAddTask, onSave }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium'); // Default priority
    const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState('');
    const handleAddTask = () => {
        if (taskName.trim()) {
            const newTask = {
                name: taskName,
                description,
                dueDate,
                priority
            };
            onAddTask(newTask);
            setTaskName('');
            setDescription('');
            setDueDate('');
            setPriority('medium'); // Reset to default
            onClose();
        } else {
            alert('Task name is required.');
        }
    };

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);
    };

    const handlePrioritySave = (selectedPriority) => {
        // Use default priority if none is selected
        const priorityToSave = selectedPriority || 'medium';
        onSave(priorityToSave);
        setPriority(selectedPriority);
        onClose();
    };

    return (
        <>
            {isVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Task</h2>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task name"
                            className="modal-task-input"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="modal-description-textarea"
                        />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="modal-due-date-input"
                        />
                        <div className="priority-options">
                            <button
                                className={`priority-option ${selectedPriority === 'high' ? 'selected' : ''}`}
                                onClick={() => handlePriorityChange('high')}
                            >
                                High
                            </button>
                            <button
                                className={`priority-option ${selectedPriority === 'medium' ? 'selected' : ''}`}
                                onClick={() => handlePriorityChange('medium')}
                            >
                                Medium
                            </button>
                            <button
                                className={`priority-option ${selectedPriority === 'low' ? 'selected' : ''}`}
                                onClick={() => handlePriorityChange('low')}
                            >
                                Low
                            </button>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleAddTask} className="modal-add-button">Add Task</button>
                            <button onClick={onClose} className="modal-cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {isPriorityModalVisible && (
                <PriorityModal
                    onClose={() => setPriorityModalVisible(false)}
                    onSave={handlePrioritySave}
                />
            )}
        </>
    );
};

export default AddTaskModal;
