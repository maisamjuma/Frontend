import React, {useState, useEffect} from 'react';
import './AddTaskModal.css';
import Calendar from 'react-calendar';
// Static list of users
const usersList = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Smith'},
    {id: 3, name: 'Alice Johnson'},
    {id: 4, name: 'Bob Brown'}
];

// eslint-disable-next-line react/prop-types
const AddTaskModal = ({isVisible, onClose, onAddTask, status}) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [priority, setPriority] = useState('medium');
    const [assignedUser, setAssignedUser] = useState(''); // State for selected user

    useEffect(() => {
        if (isVisible) {
            setDueDate(new Date());
        }
    }, [isVisible]);

    const handleAddTask = () => {
        if (taskName.trim()) {
            const adjustedDate = new Date(dueDate);
            adjustedDate.setDate(adjustedDate.getDate() + 1);

            const newTask = {
                name: taskName,
                description,
                dueDate: adjustedDate.toISOString().split('T')[0],
                priority,
                // eslint-disable-next-line react/prop-types
                status: status.title, // Use status title
                // eslint-disable-next-line react/prop-types
                assignedUser: status.id === 2 ? assignedUser : '' // Assign user only if status.id is 2
            };
            onAddTask(newTask);
            setTaskName('');
            setDescription('');
            setDueDate(new Date());
            setPriority('medium');
            setAssignedUser(''); // Reset user selection
            onClose();
        } else {
            alert('Task name is required.');
        }
    };

    return (
        <>
            {isVisible && (
                <div className="addtask-modal-overlay">
                    <div className="addtask-modal-content">
                        <h3>
                            Add New Task
                        </h3>
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
                                onChange={(date) => setDueDate(date)}
                                value={dueDate}
                                tileClassName={({date}) =>
                                    dueDate && date.toDateString() === new Date(dueDate).toDateString()
                                        ? 'selected-date'
                                        : null
                                }
                                className="custom-calendar" /* Apply custom class here */
                            />
                        </div>

                        {/* Priority Dropdown */}
                        <div className="priority-options">
                            <p className="paragraph">Priority:</p>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="priority-dropdown"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        {/* Conditionally Render User Dropdown */}
                        {/* eslint-disable-next-line react/prop-types */}
                        {status.id === 2 && (
                            <div className="user-options">
                                <p className="paragraph">Assign To:</p>
                                <select
                                    value={assignedUser}
                                    onChange={(e) => setAssignedUser(e.target.value)}
                                    className="user-dropdown"
                                >
                                    <option value="">Assign to...</option>
                                    {usersList.map(user => (
                                        <option key={user.id} value={user.name}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleAddTask} className="modal-add-button">Add Task</button>
                            <button onClick={onClose} className="modal-cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTaskModal;
