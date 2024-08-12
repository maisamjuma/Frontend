import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import PriorityModal from './PriorityModal';
import CalendarModal from './CalendarModal/CalendarModal.jsx';

// eslint-disable-next-line react/prop-types
const AddTaskModal = ({ isVisible, onClose, onAddTask }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium'); // Default priority
    const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
    const [isDateModalVisible, setDateModalVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Set default due date to today
            const today = new Date().toISOString().split('T')[0];
            setDueDate(today);
        }
    }, [isVisible]);

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

    const handlePriorityChange = (selectedPriority) => {
        setPriority(selectedPriority);
    };

    // const handleDateChange = (selectedDate) => {
    //     setDueDate(selectedDate);
    // };

    const handlePrioritySave = (selectedPriority) => {
        const priorityToSave = selectedPriority || 'medium';
        setPriority(priorityToSave);
        setPriorityModalVisible(false);
    };

    const handleDateSave = (selectedDate) => {
        setDueDate(selectedDate);
        setDateModalVisible(false);
    };

    const handleDateRemove = () => {
        setDueDate('');
        setDateModalVisible(false);
    };

    return (
        <>
            {isVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Task</h2>
                        <div className="task-info">
                            <input
                                type="text"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                placeholder="Enter task name"
                                className="modal-task-input"
                            />
                            {/* Display the due date next to the task name */}
                            <span className="task-due-date">
                                Due Date: {new Date(dueDate).toLocaleDateString()}
                            </span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="modal-description-textarea"
                        />

                        {/* Date Picker */}
                        <div className="date-options">
                            <button onClick={() => setDateModalVisible(true)} className="date-picker-button">
                                {dueDate ? new Date(dueDate).toLocaleDateString() : 'Select Date'}
                            </button>
                        </div>

                        {/* Priority Dropdown */}
                        <div className="priority-options">
                            <select
                                value={priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                                className="priority-dropdown"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
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
            {isDateModalVisible && (
                <CalendarModal
                    onClose={() => setDateModalVisible(false)}
                    onSave={handleDateSave}
                    onRemoveDate={handleDateRemove}
                />
            )}
        </>
    );
};

export default AddTaskModal;
