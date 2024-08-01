import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Layout.css';
import dashboardIcon from '../assets/t.png';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';  // Import your Navbar component
import Modal from './Modal';    // Import your Modal component

const Layout = ({ children, onLogout }) => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
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

    const toggleProjects = () => {
        setIsProjectsOpen(!isProjectsOpen);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();  // Prevent the click from affecting parent elements
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action) => {
        if (action === 'Add') {
            setIsModalOpen(true);
        } else if (action === 'Delete') {
            // Handle delete action here
            console.log('Delete action triggered');
        }
        setIsMenuOpen(false);  // Close the menu after selecting an action
    };

    const handleProjectClick = (projectId) => {
        navigate(`/main/${projectId}`);
    };

    const addProject = (projectName) => {
        const newProjectId = `project${projects.length + 1}`; // Generate a new project ID
        setProjects([...projects, { id: newProjectId, name: projectName }]);
    };

    return (
        <div className="layout1">
            <Navbar onLogout={onLogout} />  {/* Pass onLogout to Navbar */}
            <div>

                <div className="sidebar">
                    <ul>
                        <li>
                            <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon"/>
                            <span className="sidebar-text">Dashboard</span>
                        </li>
                        <hr/>
                        <li className="projects-container" onClick={toggleProjects}>
                            <span>Projects</span>
                            <div className="menu-container">
                                <span className="menu-toggle" onClick={toggleMenu}>...</span>
                                {isMenuOpen && (
                                    <ul className="menu-list" onClick={(e) => e.stopPropagation()}>
                                        <li onClick={() => handleMenuAction('Add')}>Add</li>
                                        <li onClick={() => handleMenuAction('Delete')}>Delete</li>
                                    </ul>
                                )}
                            </div>
                        </li>
                        {isProjectsOpen && (
                            <ul className="dropdown-list">
                                {projects.map(project => (
                                    <li key={project.id} onClick={() => handleProjectClick(project.id)}>
                                        {project.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <li>Tasks</li>
                        <li>Teams</li>
                        <li>Settings</li>
                    </ul>
                </div>
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