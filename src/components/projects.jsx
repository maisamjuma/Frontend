import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './projects.css'; // Make sure to import your CSS file

const Projects = () => {
    const navigate = useNavigate();
    const { projectName } = useParams();
    const { projectDescription } = useParams();

    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`); // Ensure this is correct
    };

    return (
        <div className="projectscon">
            <div>
                <h1>{projectName}</h1>
                <p>{projectDescription}</p>
                <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
            </div>
        </div>
    );
};

export default Projects;
