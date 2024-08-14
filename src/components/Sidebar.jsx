import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import dashboardIcon from '../assets/t.png';
import { useNavigate } from 'react-router-dom';
import AddProjectModal from './AddProjectModal';
import { ArrowDownIcon } from "./SVGIcons.jsx";

const Sidebar = ({ onProjectDelete }) => {
    const [projects, setProjects] = useState([]);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [confirmDeleteProject, setConfirmDeleteProject] = useState(null);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load projects from localStorage
        const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(storedProjects);
    }, []);

    const toggleProjects = () => {
        setIsProjectsOpen(!isProjectsOpen);
    };

    const toggleMenu = (projectId, e) => {
        e.stopPropagation();
        setOpenMenus(prevOpenMenus => ({
            ...prevOpenMenus,
            [projectId]: !prevOpenMenus[projectId],
        }));
    };

    const handleProjectClick = (project) => {
        if (!isDeleteMode) {
            navigate(`/main/${project.name}`, {
                state: { projectDescription: project.description }
            });
        }
    };

    const handleCheckboxChange = (project) => {
        setSelectedProjects(prevSelected =>
            prevSelected.includes(project.id)
                ? prevSelected.filter(id => id !== project.id)
                : [...prevSelected, project.id]
        );
    };

    const handleDeleteProject = (projectId) => {
        setConfirmDeleteProject(projectId);
    };

    const confirmDelete = () => {
        onProjectDelete(confirmDeleteProject);
        setConfirmDeleteProject(null);
    };

    const cancelDelete = () => {
        setConfirmDeleteProject(null);
    };

    const handleCloseModal = () => {
        setIsAddProjectModalVisible(false);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsProjectsOpen(false);
            setOpenMenus({});
            setIsDeleteMode(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddProject = (projectName, projectDescription) => {
        const newProject = { id: Date.now().toString(), name: projectName, description: projectDescription };
        setProjects(prevProjects => {
            const updatedProjects = [...prevProjects, newProject];
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            return updatedProjects;
        });
    };

    const handleDeleteProjects = () => {
        const updatedProjects = projects.filter(project => !selectedProjects.includes(project.id));
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        setSelectedProjects([]);
    };

    return (
        <div className="sidebar" ref={sidebarRef}>
            <ul>
                <li>
                    <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
                    <span className="sidebar-text">Dashboard</span>
                </li>
                <hr />
                <li className="projects-container" onClick={toggleProjects}>
                    <span className="d-flex gap-2 rot">
                        Projects
                        <div className={isProjectsOpen ? "rotate-180 mt-1" : "mt-1"}>
                            <ArrowDownIcon />
                        </div>
                    </span>
                    <div className="menu-container">
                        <span className="menu-toggle" onClick={(e) => toggleMenu('projects', e)}>...</span>
                        {openMenus['projects'] && (
                            <ul className="menu-list" onClick={(e) => e.stopPropagation()}>
                                <li onClick={() => setIsAddProjectModalVisible(true)}>Add</li>
                                <li onClick={() => setIsDeleteMode(!isDeleteMode)}>Delete</li>
                            </ul>
                        )}
                    </div>
                </li>
                {isProjectsOpen && (
                    <ul className="dropdown-list">
                        {projects.map(project => (
                            <li className="d-flex flex-row gap-5 align-items-center" key={project.id}>
                                {isDeleteMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedProjects.includes(project.id)}
                                        onChange={() => handleCheckboxChange(project)}
                                    />
                                )}
                                <span onClick={() => handleProjectClick(project)}>
                                    {project.name}
                                </span>

                            </li>
                        ))}
                        {isDeleteMode && (
                            <button onClick={handleDeleteProjects}>Delete Selected Projects</button>
                        )}
                    </ul>
                )}
                <div className="line-above-settings" />
                <li>Settings</li>
            </ul>
            <AddProjectModal
                isVisible={isAddProjectModalVisible}
                onClose={handleCloseModal}
                onAddProject={handleAddProject}
            />

        </div>
    );
};

Sidebar.propTypes = {
    onProjectDelete: PropTypes.func.isRequired,
};

export default Sidebar;
