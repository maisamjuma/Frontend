import React from 'react';
import { useNavigate } from 'react-router-dom';

const Project1 = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/main/workspace'); // Ensure the path matches the defined route
    };

    return (
        <div>
            <h1>Project 1</h1>
            <p>This is the content of Project 1.</p>
            <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
        </div>
    );
};

export default Project1;
