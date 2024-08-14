import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Layout.css';
import Navbar from '../Navbar/Navbar.jsx';  // Import your Navbar component
import Modal from '../Modal/Modal.jsx';    // Import your Modal component
import Sidebar from '../Sidebar.jsx'; // Import the new Sidebar component
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

const Layout = ({ children, onLogout }) => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = true; // Replace with actual auth check
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Load projects from local storage when the component mounts
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(savedProjects);
    }, []);

    useEffect(() => {
        // Save projects to local storage whenever the projects state changes
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const handleProjectClick = (projectId) => {
        navigate(`/main/${projectId}`);
    };

    const addProject = (projectName) => {
        const newProjectId = `project${projects.length + 1}`; // Generate a new project ID
        setProjects([...projects, { id: newProjectId, name: projectName }]);
    };

    const handleMenuAction = (action, selectedProjects) => {
        if (action === 'Add') {
            setIsModalOpen(true);
        } else if (action === 'Delete' && selectedProjects && selectedProjects.length > 0) {
            selectedProjects.forEach(projectId => {
                const project = projects.find(p => p.id === projectId);
                if (window.confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
                    setProjects(prevProjects =>
                        prevProjects.filter(p => p.id !== projectId)
                    );
                }
            });
        }
    };

    return (
        <div className="layout1">
            <Navbar onLogout={onLogout} />  {/* Pass onLogout to Navbar */}
            <div className="main">
                <Sidebar
                    projects={projects}
                    onProjectClick={handleProjectClick}
                    onAddProject={addProject}
                    onMenuAction={handleMenuAction}
                />
                <div className="main-content">
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
            {/* Render the Modal component */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addProject={addProject}/>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onLogout: PropTypes.func.isRequired,  // Add prop type for onLogout
};

export default Layout;
