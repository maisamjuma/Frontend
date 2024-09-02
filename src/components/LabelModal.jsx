import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './LabelModal.css';

const LabelModal = ({onClose, labels, selectedLabels, onSave}) => {
    const [currentLabels, setCurrentLabels] = useState(selectedLabels);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLabel, setEditingLabel] = useState(null);
    const [showCreateLabelForm, setShowCreateLabelForm] = useState(false);
    const [newLabel, setNewLabel] = useState({name: '', color: '#FF6F61'}); // Default color

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


    const filteredLabels = labels.filter((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateLabel = () => {
        setShowCreateLabelForm(true);
    };

    const handleCancelCreateLabel = () => {
        setShowCreateLabelForm(false);
        setNewLabel({name: '', color: '#FF6F61'}); // Reset form
    };

    const handleNewLabelChange = (e) => {
        setNewLabel({...newLabel, name: e.target.value});
    };

    const handleNewLabelColorChange = (color) => {
        setNewLabel({...newLabel, color});
    };

    const handleSaveNewLabel = () => {
        if (newLabel.name.trim()) {
            const newLabelWithId = {...newLabel, id: `label-${Date.now()}`}; // Generate a unique ID
            labels.push(newLabelWithId); // Update labels list
            setCurrentLabels([...currentLabels, newLabelWithId.id]); // Select the new label
            handleCancelCreateLabel(); // Close the form
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="label-modal-overlay" onClick={handleOverlayClick}>
            <div className="label-modal" onClick={(e) => e.stopPropagation()}>
                {showCreateLabelForm ? (
                    <div className="edit-label-container">
                        <h3>Create New Label</h3>
                        <input
                            type="text"
                            placeholder="Label title"
                            value={newLabel.name}
                            onChange={handleNewLabelChange}
                        />
                        <div className="color-picker">
                            {['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#f2d53c', '#2d545e', '#ffa8B6', '#c2edda', '#51e2f5', '#edf756', '#ffb766', '#a28089', '#8458B3', '#ff1d58', '#59ce8f', '#f75990', '#12343b', '#feb300', '#f9c5bd', '#7c677f', '#39a0ca', '#ff414e', '#9bc400', '#eb1736'].map((color) => (
                                <div
                                    key={color}
                                    className={`color-swatch ${newLabel.color === color ? 'selected' : ''}`}
                                    style={{backgroundColor: color}}
                                    onClick={() => handleNewLabelColorChange(color)}
                                />
                            ))}
                        </div>
                        <div className="create-label-actions">
                            <button onClick={handleSaveNewLabel}>Save</button>
                            <button onClick={handleCancelCreateLabel}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="label-modal-header">
                            <span>Labels</span>
                            <button className="close-button" onClick={onClose}>×</button>
                        </div>

                        <div className="labels-list">
                            {filteredLabels.map((label) => (
                                <div className="label-item" key={label.id}>
                                    <input
                                        type="checkbox"
                                        id={label.id}
                                        checked={currentLabels.includes(label.id)}
                                        onChange={() => handleLabelClick(label)}
                                    />
                                    <label htmlFor={label.id} className="label-color"
                                           style={{backgroundColor: label.color}}>
                                        {label.name}
                                    </label>
                                    <button className="edit-button">✎</button>
                                </div>
                            ))}
                        </div>
                        <div className="label-actions">
                            <button className="create-label" onClick={handleCreateLabel}>
                                Create a new label
                            </button>
                        </div>
                        <div className="label-save-actions">
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </>
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
