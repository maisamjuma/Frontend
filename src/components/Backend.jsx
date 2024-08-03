import React, { useState, useEffect } from 'react';
import './Backend.css';

const Backend = () => {
    const loadStatuses = () => {
        const savedStatuses = localStorage.getItem('statuses');
        return savedStatuses ? JSON.parse(savedStatuses) : [
            { id: 1, title: 'unassigned tasks', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 2, title: 'To Do', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 3, title: 'Doing', tasks: [], backgroundColor: '#f9f9f9' },
            { id: 4, title: 'Ready to Review', tasks: [], backgroundColor: '#f9f9f9' }

        ];
    };

    const [statuses, setStatuses] = useState(loadStatuses());
    const [newTaskName, setNewTaskName] = useState('');
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newStatusName, setNewStatusName] = useState('');
    const [dropdownStatusId, setDropdownStatusId] = useState(null);

    useEffect(() => {
        localStorage.setItem('statuses', JSON.stringify(statuses));
    }, [statuses]);

    const handleInputChange = (e) => {
        setNewStatusName(e.target.value);
    };

    const handleAddStatus = () => {
        if (newStatusName.trim()) {
            const newStatus = {
                id: statuses.length + 1,
                title: newStatusName,
                tasks: [],
                backgroundColor: '#f9f9f9'
            };
            setStatuses([...statuses, newStatus]);
            setNewStatusName('');
            setIsAdding(false);
        }
    };

    const handleAddTask = (statusId) => {
        if (newTaskName.trim()) {
            const updatedStatuses = statuses.map(status => {
                if (status.id === statusId) {
                    return {
                        ...status,
                        tasks: [...status.tasks, newTaskName]
                    };
                }
                return status;
            });
            setStatuses(updatedStatuses);
            setNewTaskName('');
            setCurrentStatusId(null);
        }
    };

    const handleDeleteStatus = (statusId) => {
        const updatedStatuses = statuses.filter(status => status.id !== statusId);
        setStatuses(updatedStatuses);
    };

    const handleChangeColor = (statusId, color) => {
        const updatedStatuses = statuses.map(status => {
            if (status.id === statusId) {
                return {
                    ...status,
                    backgroundColor: color
                };
            }
            return status;
        });
        setStatuses(updatedStatuses);
        setDropdownStatusId(null);
    };

    return (
        <div className="backend-container">
            <h1>Backend</h1>
            <div className="backend-status-container">
                {statuses.map((status, index) => (
                    <div key={status.id} className="backend-status-box" style={{ backgroundColor: status.backgroundColor }}>
                        <div className="backend-status-header">
                            <span className="backend-status-title">{status.title}</span>
                            <span className="backend-status-menu" onClick={() => setDropdownStatusId(dropdownStatusId === status.id ? null : status.id)}>...</span>
                            {dropdownStatusId === status.id && (
                                <div className="backend-dropdown-menu">
                                    <div className="backend-dropdown-item" onClick={() => handleDeleteStatus(status.id)}>Delete Status</div>
                                    <div className="backend-dropdown-item" onClick={() => handleChangeColor(status.id, '#ffcccc')}>Red</div>
                                    <div className="backend-dropdown-item" onClick={() => handleChangeColor(status.id, '#ccffcc')}>Green</div>
                                    <div className="backend-dropdown-item" onClick={() => handleChangeColor(status.id, '#ccccff')}>Blue</div>
                                    <div className="backend-dropdown-item" onClick={() => handleChangeColor(status.id, '#ffffcc')}>Yellow</div>
                                </div>
                            )}
                        </div>
                        <div className="backend-tasks-container">
                            {status.tasks.map((task, index) => (
                                <div key={index} className="backend-task-box">
                                    {task}
                                </div>
                            ))}
                        </div>
                        {(index === 0 || index === 1) && (
                            currentStatusId === status.id ? (
                                <div className="backend-add-task-form">
                                    <input
                                        type="text"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                        placeholder="Enter task name"
                                        className="backend-task-input"
                                    />
                                    <div className="backend-add-status-actions">
                                        <button
                                            onClick={() => handleAddTask(status.id)}
                                            className="backend-add-task-button"
                                        >
                                            Add Task
                                        </button>
                                        <button
                                            onClick={() => setCurrentStatusId(null)}
                                            className="backend-cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setCurrentStatusId(status.id)}
                                    className="backend-show-add-task"
                                >
                                    + Add Task
                                </button>
                            )
                        )}
                    </div>
                ))}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="backend-add-status-button"
                    >
                        + Add New Status
                    </button>
                ) : (
                    <div className="backend-add-status-form">
                        <input
                            type="text"
                            value={newStatusName}
                            onChange={handleInputChange}
                            placeholder="Enter status name"
                            className="backend-status-input"
                        />
                        <div className="backend-add-status-actions">
                            <button onClick={handleAddStatus} className="backend-add-status-button">
                                Submit
                            </button>
                            <button onClick={() => setIsAdding(false)} className="backend-cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Backend;
