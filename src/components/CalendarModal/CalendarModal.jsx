import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import './CalendarModal.css';
import TaskService from "../../Services/TaskService.js";

const CalendarModal = ({onClose, onSave,task, onRemoveDate}) => {
    // const [dueDate, setSelectedDate] = useState(null);
    const [dueDate, setSelectedDate] = useState(task.dueDate ? new Date(task.dueDate) : null);

// Get the logged-in user from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("user from the localStorage: ", user);
    }
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

    // Check if the logged-in user is assigned to the task
    const isAssignedToTask = loggedInUser && loggedInUser.userId === task.assignedToUserId;

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const handleSave = async () => {
        if (!isAssignedToTask) {
            // If the user is not assigned to the task, show an alert and do not proceed
            alert('You are not assigned to this task and cannot change the dueDate.');
            return; // Prevent the deletion process
        }
        console.log("task?",task)
        console.log("selected : ", dueDate)
        try {
            // Create the updated task object with the new priority
            const updatedTask = {
                ...task, // Spread the existing task details
                dueDate: dueDate, // Update the priority with the selected value
            };

            // Call the TaskService to update the task with the new priority
            await TaskService.updateTask(task.taskId, updatedTask);

            // Alert the user that the priority was updated successfully
            // alert('Task priority updated successfully!');
            onSave(dueDate);
            // Close the modal after saving
            onClose();
        } catch (error) {
            // Handle any errors that occur during the update
            console.error('Error updating task priority:', error);
            alert('There was an error updating the task priority. Please try again.');
        }
    };
    // const handleSave = () => {
    //     if (dueDate) {
    //         // Convert date to ISO string in UTC format
    //         const utcDate = new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()));
    //         onSave(utcDate); // Pass UTC date to parent
    //         onClose(); // Close modal after saving
    //     }
    // };

    const handleRemove = async () => {
        if (!isAssignedToTask) {
            // If the user is not assigned to the task, show an alert and do not proceed
            alert('You are not assigned to this task and cannot delete the dueDate.');
            return; // Prevent the deletion process
        }
        try {
            // Create the updated task object with dueDate set to null
            const updatedTask = {
                ...task,
                dueDate: null
            };

            // Call the TaskService to update the task with dueDate set to null
            await TaskService.updateTask(task.taskId, updatedTask);

            // Notify parent to remove date
            onRemoveDate();
            // Close the modal after removing
            onClose();
        } catch (error) {
            // Handle any errors that occur during the update
            console.error('Error removing task date:', error);
            alert('There was an error removing the task date. Please try again.');
        }
    };

    return (
        <div className="calendar-modal-overlay"
             onClick={(e) => e.target.classList.contains('calendar-modal-overlay') && onClose()}>
            <div className="calendar-modal-content">
                <h4 className="dates">Dates</h4>
                <Calendar
                    onChange={handleDateChange}
                    value={dueDate}
                    tileClassName={({ date }) =>
                        dueDate && date.toISOString() === new Date(dueDate).toISOString() ? 'selected-date' : null
                    }
                />
                <div className="calendar-modal-actions">
                    <button onClick={handleSave} className="calendar-modal-save-button">Save</button>
                    <button onClick={handleRemove} className="calendar-modal-remove-button">Remove Date</button>
                    <button onClick={onClose} className="calendar-modal-cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

CalendarModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        dueDate: PropTypes.instanceOf(Date),
        taskDescription: PropTypes.string.isRequired,
        assignedToUserId: PropTypes.string, // Added if you are using memberId
    }),
    onRemoveDate: PropTypes.func.isRequired
};

export default CalendarModal;
