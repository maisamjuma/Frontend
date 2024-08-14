import './AddProjectModal.css'; // Create a CSS file for modal styles
import React, {useState} from 'react';
// import {useNavigate} from 'react-router-dom';
import ProjectService from '../../services/ProjectService.js';
import PropTypes from "prop-types";



const AddProjectModal = ({isVisible, onClose, onAddProject}) => {
    // const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    // useEffect(() => {
    //     ProjectService.getProjectById().then((res) => {
    //         let project = res.data;
    //         setName(project.name);
    //         setDescription(project.description);
    //     });
    // }, []);

    const handleAddProject = (e) => {
        e.preventDefault();

        onAddProject(name, description);

        if (name.trim() && description.trim()) {
            const project = {
                name,
                description,
            };

            console.log('project => ' + JSON.stringify(project));

            ProjectService.createProject(JSON.stringify(project)).then(() => {
                setSuccessMessage('Project added successfully!');
                // setName("");
                // setDescription("");
            }).catch(error => {
                console.error('There was an error adding the project!', error);
            });

            setName('');
            setDescription('');
            onClose(); // Close the modal after adding the project

        }


    };

    // const cancel = () => {
    //     navigate('/projects');
    // };

    const getTitle = () => {
        return <h3 className="text-center">Add Project</h3>;
    };

    return (
        isVisible && (
            <div className="modal-overlay">
                <br/>
                <div className="modal-content">
                    {/*<h2>Add New Project</h2>*/}


                    {getTitle()}

                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <form>
                        <div className="form-group">
                            <label> Name: </label>
                            <input
                                placeholder="Project Name"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label> Description: </label>
                            <textarea
                                placeholder="Project Description"
                                name="description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <h1></h1>
                        <button className="btn btn-success" onClick={handleAddProject}>Save</button>
                        <button className="btn btn-danger" onClick={onClose}
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
    onAddProject: PropTypes.func.isRequired
};

export default AddProjectModal;
