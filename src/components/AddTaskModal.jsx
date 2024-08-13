import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';
import PriorityModal from './PriorityModal';
import CalendarModal from './CalendarModal/CalendarModal.jsx';
import Calendar from "react-calendar";

// eslint-disable-next-line react/prop-types
const AddTaskModal = ({ isVisible, onClose, onAddTask }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date()); // Initialize as Date object
    const [priority, setPriority] = useState('medium'); // Default priority
    const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
    const [isDateModalVisible, setDateModalVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Set default due date to today
            setDueDate(new Date()); // Set as Date object
        }
    }, [isVisible]);

    const handleAddTask = () => {
        if (taskName.trim()) {
            const adjustedDate = new Date(dueDate);
            adjustedDate.setDate(adjustedDate.getDate() + 1); // Add one day

            const newTask = {
                name: taskName,
                description,
                dueDate: adjustedDate.toISOString().split('T')[0], // Adjusted date
                priority
            };
            onAddTask(newTask); // Pass newTask with the adjusted dueDate
            setTaskName('');
            setDescription('');
            setDueDate(new Date());
            setPriority('medium'); // Reset to default
            onClose();
        } else {
            alert('Task name is required.');
        }
    };



    const handlePriorityChange = (selectedPriority) => {
        setPriority(selectedPriority);
    };

    const handleDateChange = (selectedDate) => {
        setDueDate(selectedDate); // Ensure selectedDate is a Date object
    };

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
        setDueDate(new Date()); // Reset to today if date is removed
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
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="modal-description-textarea"
                        />

                        {/* Date Picker */}
                        <div className="date-options">
                            <Calendar
                                onChange={handleDateChange}
                                value={dueDate}
                                tileClassName={({ date }) =>
                                    dueDate && date.toDateString() === new Date(dueDate).toDateString() ? 'selected-date' : null
                                }
                            />
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
