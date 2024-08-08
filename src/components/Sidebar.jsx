import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import dashboardIcon from '../assets/t.png';
import { useNavigate } from 'react-router-dom';
import AddProjectModal from './AddProjectModal';

const Sidebar = ({ projects, onAddProject, onMenuAction }) => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]); // Added this line
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    const toggleProjects = () => {
        setIsProjectsOpen(!isProjectsOpen);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action) => {
        if (action === 'Add') {
            setIsAddProjectModalVisible(true);
        } else if (action === 'Delete') {
            setIsDeleteMode(true);
        }
        setIsMenuOpen(false);
    };

    const handleProjectClick = (project) => {
        if (!isDeleteMode) {
            navigate(`/main/${project.name}`);
        }
    };

    const handleCheckboxChange = (project) => {
            setSelectedProjects(prevSelected =>
                prevSelected.includes(project.id)
                    ? prevSelected.filter(id => id !== project.id)
                    : [...prevSelected, project.id]
            );
            onMenuAction('Delete', [project.id]); // Directly delete the project after confirming

    };

    const handleCloseModal = () => {
        setIsAddProjectModalVisible(false);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsProjectsOpen(false);
            setIsMenuOpen(false);
            setIsDeleteMode(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="sidebar" ref={sidebarRef}>
            <ul>
                <li>
                    <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
                    <span className="sidebar-text">Dashboard</span>
                </li>
                <hr />
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
                        {projects.map((project) => (
                            <li key={project.id} onClick={() => handleProjectClick(project)}>
                                {isDeleteMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedProjects.includes(project.id)}
                                        onChange={() => handleCheckboxChange(project)}
                                    />
                                )}
                                {project.name}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="line-above-settings" /> {/* Line above Settings */}
                <li>Settings</li>
            </ul>
            <AddProjectModal
                isVisible={isAddProjectModalVisible}
                onClose={handleCloseModal}
                onAddProject={onAddProject}
            />
        </div>
    );
};

Sidebar.propTypes = {
    projects: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onAddProject: PropTypes.func.isRequired,
    onMenuAction: PropTypes.func.isRequired,
};

export default Sidebar;
