import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddProjectModal.css'; // Create a CSS file for modal styles

const AddProjectModal = ({ isVisible, onClose, onAddProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    const handleAddProject = () => {
        if (newProjectName.trim() && newProjectDescription.trim()) {
            onAddProject(newProjectName, newProjectDescription);
            setNewProjectName('');
            setNewProjectDescription('');
            onClose(); // Close the modal after adding the project
        }
    };

    return (
        isVisible && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Add New Project</h2>
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="New project name"
                    />
                    <textarea
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        placeholder="Project description"
                    />
                    <button onClick={handleAddProject}>Add Project</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        )
    );
};

AddProjectModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddProject: PropTypes.func.isRequired
};

export default AddProjectModal;
