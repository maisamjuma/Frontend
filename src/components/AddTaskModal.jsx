import React, { useState } from 'react';
import './AddTaskModal.css';

// eslint-disable-next-line react/prop-types
const AddTaskModal = ({ isVisible, onClose, onAddTask }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

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
    const handlePriorityClick = () => {
        // Function to open PriorityModal and set priority
        const handlePrioritySave = (selectedPriority) => {
            setPriority(selectedPriority);
        };

        // Open the PriorityModal
        // Implement your modal opening logic here, e.g., set a state to show the PriorityModal
    };
    return (
        isVisible && (
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
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="modal-priority-select"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <div className="modal-actions">
                        <button onClick={handleAddTask} className="modal-add-button">Add Task</button>
                        <button onClick={onClose} className="modal-cancel-button">Cancel</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddTaskModal;
