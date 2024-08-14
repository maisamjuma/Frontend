import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './projects.css';
// Import your default icon
import defaultProjectIcon from '../assets/projectIcon.png'; // Adjust the path to your PNG file

const Projects = () => {
    const [image, setImage] = useState(defaultProjectIcon); // State for the image source
    const navigate = useNavigate();
    const { projectName } = useParams();
    const location = useLocation();
    const { projectDescription } = location.state || {}; // Get the description from state

    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`, {
            state: { projectDescription }
        });
    };

    const handleImageClick = () => {
        document.getElementById('fileInput').click(); // Trigger the file input click
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Update the image state
            };
            reader.readAsDataURL(file); // Convert the file to a base64 URL
        }
    };

    const handleDeleteClick = () => {
        setImage(defaultProjectIcon); // Reset the image to the initial icon
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
                    <figure className="projectIcon">
                        <img
                            src={image}
                            alt="Project Icon"
                            width={100}
                            height={100}
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }} // Change cursor to pointer
                        />
                        {/* Conditionally render the delete button */}
                        {image !== defaultProjectIcon && (
                            <button
                                className="delete-image-button"
                                onClick={handleDeleteClick}
                            >
                                &times; {/* × character for delete */}
                            </button>
                        )}
                    </figure>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }} // Hide the file input
                        accept="image/*" // Accept only image files
                        onChange={handleFileChange}
                    />
                    <h1>{projectName}</h1>
                </div>
                <p>{projectDescription}</p> {/* Display project description */}
                <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
            </div>
        </>
    );
};

export default Projects;
