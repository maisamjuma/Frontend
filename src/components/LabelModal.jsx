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
    const [showEditLabelModal, setShowEditLabelModal] = useState(false);

    // Function to handle opening the Edit Label Modal
    const handleCreateLabel = () => {
        setShowEditLabelModal(true);
    };

    // Function to handle closing the Edit Label Modal
    const closeEditLabelModal = () => {
        setShowEditLabelModal(false);
    };
    const handleSaveNewLabel = (newLabel) => {
        // Logic to save the new label
        console.log('New label saved:', newLabel);
        closeEditLabelModal();
    };
    return (
        <div className="label-modal-overlay" onClick={handleOverlayClick}>
            <div className="label-modal" onClick={(e) => e.stopPropagation()}>
                {!editingLabel ? (
                    <>
                            <div className="label-modal-header">
                                <span>Labels</span>
                                <button className="close-button">×</button>
                            </div>
                            <div className="label-search">
                                <input type="text" placeholder="Search labels..."/>
                            </div>
                            <div className="labels-list">
                                <div className="label-item">
                                    <input type="checkbox" id="backend"/>
                                    <label htmlFor="backend" className="label-color backend">Backend</label>
                                    <button className="edit-button">✎</button>
                                </div>
                                <div className="label-item">
                                    <input type="checkbox" id="frontend" checked/>
                                    <label htmlFor="frontend" className="label-color frontend">Frontend</label>
                                    <button className="edit-button">✎</button>
                                </div>
                                <div className="label-item">
                                    <input type="checkbox" id="label-3"/>
                                    <label htmlFor="label-3" className="label-color label-3">Label 3</label>
                                    <button className="edit-button">✎</button>
                                </div>
                                <div className="label-item">
                                    <input type="checkbox" id="label-4"/>
                                    <label htmlFor="label-4" className="label-color label-4">Label 4</label>
                                    <button className="edit-button">✎</button>
                                </div>
                                <div className="label-item">
                                    <input type="checkbox" id="label-5"/>
                                    <label htmlFor="label-5" className="label-color label-5">Label 5</label>
                                    <button className="edit-button">✎</button>
                                </div>
                            </div>
                            <div className="label-actions">
                                <button className="create-label">Create a new label</button>
                                <button className="colorblind-mode">Enable colorblind friendly mode</button>
                            </div>



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
                                    style={{backgroundColor: color}}
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
