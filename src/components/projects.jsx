import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './projects.css'; // Make sure to import your CSS file

import { useLocation } from 'react-router-dom';

const Projects = () => {
    const navigate = useNavigate();
    const { projectName } = useParams();
    const location = useLocation();
    const { projectDescription } = location.state || {}; // Get the description from state


    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`, {
            state: { projectDescription }
        });
    };

    return (
        <div className="projectscon">
            <div>
                <h1>{projectName}</h1>
                <p>{projectDescription}</p> {/* Display project description */}
                <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
            </div>
        </div>
    );
};

export default Projects;
