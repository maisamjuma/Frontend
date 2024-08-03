import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import './Sidebar.css';
import dashboardIcon from '../assets/t.png'; // Update path if needed

const Sidebar = ({ projects, onProjectClick, onAddProject, onMenuAction }) => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isAddProjectVisible, setIsAddProjectVisible] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const toggleProjects = () => {
        setIsProjectsOpen(!isProjectsOpen);
    };

    const toggleMenu = (e) => {
        e.stopPropagation(); // Prevent click from affecting parent elements
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (action) => {
        if (action === 'Add') {
            setIsAddProjectVisible(true);  // Show the add project form
        } else if (action === 'Delete') {
            if (selectedProject) {
                onMenuAction('Delete', selectedProject);
                setSelectedProject(null);  // Clear selected project
            }
        }
        setIsMenuOpen(false); // Close the menu after selecting an action
    };

    const handleAddProject = () => {
        if (newProjectName.trim()) {
            onAddProject(newProjectName);
            setNewProjectName('');
            setIsAddProjectVisible(false);  // Hide the form after adding the project
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        onProjectClick(project.id);
    };

    return (
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
                            <li key={project.id} onClick={() => handleProjectClick(project)}>
                                {project.name}
                            </li>
                        ))}
                        {isAddProjectVisible && (
                            <li>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="New project name"
                                />
                                <button onClick={handleAddProject}>Add Project</button>
                            </li>
                        )}
                    </ul>
                )}
                <li>Tasks</li>
                <li>Teams</li>
                <li>Settings</li>
            </ul>
        </div>
    );
};

// Define prop types
Sidebar.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    onProjectClick: PropTypes.func.isRequired,
    onAddProject: PropTypes.func.isRequired,
    onMenuAction: PropTypes.func.isRequired
};

export default Sidebar;
