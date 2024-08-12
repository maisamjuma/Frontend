import React from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import './projects.css';
import Navbar from "./Navbar/Navbar.jsx";
import Member from "./Member/Member.jsx"; // Make sure to import your CSS file

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
        <>
            <nav className="secondary-navbar">
                <ul className="secondary-nav">
                    <li>
                        <button className="secondary-nav-button">Project Members</button>
                    </li>
                </ul>
            </nav>
            <div className="projectscon">
                <div className="flex-row">
                    <figure className="projectImg">
                        <img src="/icons.png" alt="Project Logo" />
                    </figure>
                    <h1>{projectName}</h1>
                </div>
                <p>{projectDescription}</p> {/* Display project description */}
                <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
            </div>
        </>
    );
};

export default Projects;
