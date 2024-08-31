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
        const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(savedProjects);
    }, []);

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const handleProjectClick = (projectId) => {
        navigate(`/main/${projectId}`);
    };

    const addProject = (projectName) => {
        setProjects([...projects, { name: projectName, id: Date.now() }]); // Added id for unique key
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
        <div className="layout-container">
            {/* Navbar */}
            <div className="navbar">
                <Navbar onLogout={onLogout} /> {/* Pass onLogout to Navbar */}
            </div>

            {/* Content Row */}
            <div className="content-row">
                {/* Sidebar */}
                <div className="sidebar">
                    <Sidebar
                        projects={projects}
                        onProjectClick={handleProjectClick}
                        onAddProject={addProject}
                        onMenuAction={handleMenuAction}
                    />
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {children}
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} addProject={addProject} />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onLogout: PropTypes.func.isRequired,  // Add prop type for onLogout
};

export default Layout;
