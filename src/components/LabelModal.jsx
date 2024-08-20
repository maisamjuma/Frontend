import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './LabelModal.css';

const LabelModal = ({ onClose, labels, selectedLabels, onSave }) => {
    const [currentLabels, setCurrentLabels] = useState(selectedLabels);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLabel, setEditingLabel] = useState(null);

    const handleLabelClick = (label) => {
        setCurrentLabels((prevLabels) =>
            prevLabels.includes(label.id)
                ? prevLabels.filter((id) => id !== label.id)
                : [...prevLabels, label.id]
        );
    };

    const handleSave = () => {
        onSave(currentLabels);
        onClose();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLabels = labels.filter((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditLabel = (label) => {
        setEditingLabel(label);
    };

    const handleLabelChange = (e) => {
        setEditingLabel({ ...editingLabel, name: e.target.value });
    };

    const handleColorChange = (color) => {
        setEditingLabel({ ...editingLabel, color });
    };

    const handleSaveEdit = () => {
        // Implement label save logic here, updating the labels list
        setEditingLabel(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="label-modal-overlay" onClick={handleOverlayClick}>
            <div className="label-modal-content" onClick={(e) => e.stopPropagation()}>
                {!editingLabel ? (
                    <>
                        <input
                            type="text"
                            placeholder="Search labels..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="label-search"
                        />
                        <div className="label-list">
                            {filteredLabels.map((label) => (
                                <div key={label.id} className="label-item-container">
                                    <input
                                        type="checkbox"
                                        checked={currentLabels.includes(label.id)}
                                        onChange={() => handleLabelClick(label)}
                                    />
                                    <div
                                        className="label-item"
                                        style={{ backgroundColor: label.color }}
                                        onClick={() => handleLabelClick(label)}
                                    >
                                        {label.name}
                                    </div>
                                    <button className="edit-button" onClick={() => handleEditLabel(label)}>✏️</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSave}>Save Labels</button>
                        <button onClick={onClose}>Cancel</button>
                        <button onClick={() => setEditingLabel({ id: null, name: '', color: '#000000' })}>Create a new label</button>
                    </>
                ) : (
                    <div className="edit-label-container">
                        <h3>Edit label</h3>
                        <input
                            type="text"
                            value={editingLabel.name}
                            onChange={handleLabelChange}
                            placeholder="Label title"
                        />
                        <div className="color-picker">
                            {['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9'].map((color) => (
                                <div
                                    key={color}
                                    className={`color-swatch ${editingLabel.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(color)}
                                />
                            ))}
                        </div>
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingLabel(null)}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

LabelModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            color: PropTypes.string,
        })
    ).isRequired,
    selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default LabelModal;
