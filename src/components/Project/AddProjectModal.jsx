import './AddProjectModal.css'; // Create a CSS file for modal styles
import React, {useState, useRef, useEffect} from 'react';
import ProjectService from '../../Services/ProjectService.js';
import BoardService from '../../Services/BoardService.js';
import PropTypes from "prop-types";

const AddProjectModal = ({isVisible, onClose, onAddProject}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Added for error handling

    const modalRef = useRef(null);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    // const handleAddProject = (e) => {
    //     e.preventDefault();
    //
    //     onAddProject(name, description);
    //
    //     if (name.trim() && description.trim()) {
    //         const project = {
    //             name,
    //             description,
    //         };
    //
    //         ProjectService.createProject(JSON.stringify(project)).then(() => {
    //             setSuccessMessage('Project added successfully!');
    //         }).catch(error => {
    //             console.error('There was an error adding the project!', error);
    //         });
    //
    //         setName('');
    //         setDescription('');
    //         // onClose(); // Remove this line to prevent modal from closing on Save
    //     }
    // };

    const handleAddProject = async (e) => {
        e.preventDefault();


        if (name.trim() && description.trim()) {
            const project = {
                name,
                description,
            };

            try {
                const response = await ProjectService.createProject(project);
                const { projectId } = response; // Assuming projectId is in the response

                // Notify the parent component of the new project
                onAddProject(projectId, name, description);

                // Add default boards for the new project
                await BoardService.addDefaultBoards(projectId);

                setSuccessMessage('Project and default boards added successfully!');
                setName('');
                setDescription('');
                setErrorMessage(''); // Clear any previous error message
            } catch (error) {
                console.error('There was an error adding the project or default boards!', error);
                setErrorMessage('Failed to add project or default boards. Please try again.');
            }
        } else {
            setErrorMessage('Please fill in all fields.');
        }
    };


    const getTitle = () => {
        return <h3 className="text-center">Add Project</h3>;
    };

    return (
        isVisible && (
            <div className="modal-overlay">
                <div className="modal-content" ref={modalRef}>
                    {getTitle()}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                placeholder="Project Name"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                placeholder="Project Description"
                                name="description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button type="button" className="btn btn-success" onClick={handleAddProject}>Save</button>
                        <button type="button" className="btn btn-danger" onClick={onClose}
                                style={{marginLeft: "10px"}}>Cancel
                        </button>
                    </form>
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
