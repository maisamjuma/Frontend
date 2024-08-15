import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Modal.css'; // Add styling for the modal

const Modal = ({isOpen, onClose, addProject}) => {
    const [projectName, setProjectName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addProject(projectName); // Call the function passed from Layout
        onClose(); // Close the modal after submission
    };

    if (!isOpen) return null; // Render nothing if modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Project</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Project Name:
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Add Project</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired, // Add prop type for addProject function
};

export default Modal;
