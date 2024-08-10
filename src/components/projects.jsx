import React from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import './projects.css';
import Navbar from "./Navbar/Navbar.jsx";
import Member from "./Member/Member.jsx"; // Make sure to import your CSS file

const Projects = () => {
    const navigate = useNavigate();
    const { projectName } = useParams();

    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`); // Ensure this is correct
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
                <p>This is the content of <strong>{projectName}.</strong> </p>
                <button onClick={handleButtonClick}>Go to Workspace</button>
            </div>
        </>
    );
};

export default Projects;
