// PriorityModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PriorityModal.css';

const PriorityModal = ({ onClose, onSave }) => {
    const [selectedPriority, setSelectedPriority] = useState('');

    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);
    };

    const handleSaveClick = () => {
        if (selectedPriority) {
            onSave(selectedPriority); // Call onSave with the selected priority
            onClose(); // Close the modal after saving
        } else {
            alert('Please select a priority.'); // Optional: Notify user if no priority is selected
        }
    };

    return (
        <div className="priority-modal-overlay" onClick={onClose}>
            <div className="priority-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Select Priority</h2>
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
};

export default PriorityModal;
