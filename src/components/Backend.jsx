import React, { useState } from 'react';
import './Backend.css';

const Backend = () => {
    // Initial predefined statuses
    const [statuses, setStatuses] = useState([
        { id: 1, title: 'To Do' },
        { id: 2, title: 'Doing' },
        { id: 3, title: 'Ready to Review' },
        { id: 4, title: 'Reviewing' }
    ]);
    const [isAdding, setIsAdding] = useState(false); // State to toggle input field visibility
    const [newStatusName, setNewStatusName] = useState(''); // State for the input field

    const handleInputChange = (e) => {
        setNewStatusName(e.target.value); // Update state with the input value
    };

    const handleAddStatus = () => {
        if (newStatusName.trim()) {
            const newStatus = {
                id: statuses.length + 1,
                title: newStatusName
            };
            setStatuses([...statuses, newStatus]);
            setNewStatusName(''); // Clear the input field after adding
            setIsAdding(false); // Hide the input field after adding
        }
    };

    return (
        <div className="container">
            <h1>Backend</h1>
            <div className="status-container">
                {statuses.map((status) => (
                    <div key={status.id} className="status-box">
                        {status.title}
                    </div>
                ))}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="add-status-button"
                    >
                        + Add New Status
                    </button>
                ) : (
                    <div className="add-status-form">
                        <input
                            type="text"
                            value={newStatusName}
                            onChange={handleInputChange}
                            placeholder="Enter status name"
                            className="status-input"
                        />
                        <div className="add-status-actions">
                            <button onClick={handleAddStatus} className="add-status-button">
                                Submit
                            </button>
                            <button onClick={() => setIsAdding(false)} className="cancel-button">
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
