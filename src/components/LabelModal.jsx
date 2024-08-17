import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LabelModal.css'; // Create a CSS file for styling
// labelsData.js
export const labelsData = [
    { id: '1', name: 'Important', color: '#FF6F61' },
    { id: '2', name: 'Urgent', color: '#6B5B95' },
    { id: '3', name: 'On Hold', color: '#88B04B' },
    { id: '4', name: 'Completed', color: '#F7CAC9' },
];

const LabelModal = ({ onClose, labels, selectedLabels, onSave }) => {
    const [currentLabels, setCurrentLabels] = useState(selectedLabels);

    const handleLabelClick = (label) => {
        setCurrentLabels(prevLabels =>
            prevLabels.includes(label.id)
                ? prevLabels.filter(id => id !== label.id)
                : [...prevLabels, label.id]
        );
    };

    const handleSave = () => {
        onSave(currentLabels);
        onClose();
    };

    return (
        <div className="label-modal-overlay" onClick={e => e.target.classList.contains('label-modal-overlay') && onClose()}>
            <div className="label-modal-content">
                <h3>Select Labels</h3>
                <div className="label-list">
                    {labels.map(label => (
                        <div
                            key={label.id}
                            className={`label-item ${currentLabels.includes(label.id) ? 'selected' : ''}`}
                            onClick={() => handleLabelClick(label)}
                            style={{ backgroundColor: label.color }}
                        >
                            {label.name}
                        </div>
                    ))}
                </div>
                <button onClick={handleSave}>Save Labels</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

LabelModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string, // Optional: for label color
    })).isRequired,
    selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default LabelModal;
