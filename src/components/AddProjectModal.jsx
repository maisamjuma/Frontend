import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddProjectModal.css';

const AddProjectModal = ({ isVisible, onClose, onAddProject }) => {
    const [newProjectName, setNewProjectName] = useState('');

    const handleAddProject = async () => {
        if (newProjectName.trim()) {
            try {
                const response = await fetch('/api/projects', {  // Adjust the URL to match your backend's endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newProjectName }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add project');
                }

                const result = await response.json();

                onAddProject(result); // Assuming onAddProject updates the UI with the new project

                setNewProjectName('');
                onClose(); // Close the modal after adding the project

            } catch (error) {
                console.error('Error adding project:', error);
                // Optionally, you could add error handling to display an error message in the UI
            }
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
    onAddProject: PropTypes.func.isRequired,
};

export default AddProjectModal;
