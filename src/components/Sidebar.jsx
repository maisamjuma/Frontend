import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
//import dashboardIcon from '../assets/t.png';
import {useNavigate} from 'react-router-dom';
import AddProjectModal from './Project/AddProjectModal.jsx';
import ProjectService from '../services/ProjectService.js';  // Adjust the import path as necessary
// import { deleteProject } from '../Services/ProjectService'; // Import the deleteProject function

import {ArrowDownIcon} from "./SVGIcons.jsx";


const Sidebar = ({onMenuAction}) => {
    const [projects, setProjects] = useState([]); // Added state for projects

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
            setIsProjectsOpen(true);

            // setIsMenuOpen(true);
            setIsDeleteMode(!isDeleteMode); // Toggle delete mode
        }
        setIsMenuOpen(false);
    };

    const handleProjectClick = (project) => {
        if (!isDeleteMode) {
            navigate(`/main/${project.name}`, {
                state: {projectDescription: project.description}
            });
        }
    };


    const handleCheckboxChange = (e,project) => {
        e.stopPropagation();
        setSelectedProjects(prevSelected =>
            prevSelected.includes(project.id)
                ? prevSelected.filter(id => id !== project.id)
                : [...prevSelected, project.id]
        );
    };




    const handleCloseModal = () => {
        setIsAddProjectModalVisible(true);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsProjectsOpen(false);
            setIsMenuOpen(false);
            setIsDeleteMode(false);
            setIsAddProjectModalVisible(false);

        }
    };

    useEffect(() => {
        fetchProjects();


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);


    const fetchProjects = async () => {
        try {
            const response = await ProjectService.getAllProjects();

            const projectsWithIds = response.data.map(project => ({
                ...project,
                id: project.projectId  // Assuming `id` is the correct field from the database
            }));


            // setProjects(response.data);  // Assuming the response contains the project data in a `data` field
            setProjects(projectsWithIds);  // Assuming the response contains the project data in a `data` field


        } catch (error) {
            console.error("There was an error fetching the projects!", error);
        }
    };

//////////////////////Delete/////////////////////////////////////////////////
//     const handleDeleteProjects = () => {
//         if (selectedProjects.length > 0) {
//             const updatedProjects = projects.filter(
//                 (project) => !selectedProjects.includes(project.id)
//             );
//             setProjects(updatedProjects); // Update the projects list to remove the selected ones
//             setSelectedProjects([]); // Clear selection
//             setIsDeleteMode(false); // Exit delete mode
//             onMenuAction('Delete', selectedProjects); // Notify the parent component of the deletion
//         }
//     };
    const handleDeleteSelected = async () => {
        if (selectedProjects.length === 0) return;

        const projectsToDelete = Array.from(selectedProjects);

        try {
            // const response = await ProjectService.getAllProjects();

            // await Promise.all(projectsToDelete.map(id => deleteProject(id)));
            // await Promise.all(projectsToDelete.map(id => ProjectService.deleteProject(id)));
            // Remove deleted projects from state
            // setProjects(projects.filter(project => !projectsToDelete.includes(project.id)));
            // setSelectedProjects(new Set()); // Clear selection

            await Promise.all(projectsToDelete.map(id => ProjectService.deleteProject(id)));
            setProjects(projects.filter(project => !projectsToDelete.includes(project.id)));

            onMenuAction('Delete', selectedProjects); // Notify the parent component of the deletion
            setSelectedProjects([]); // Clear selection
        } catch (error) {
            console.error('Error deleting projects:', error);
        }

    };

    // const handleDelete = async (projectId) => {
    //     try {
    //         await deleteProject(projectId);
    //         // Remove project from state
    //         setProjects(projects.filter(project => project.id !== projectId));
    //     } catch (error) {
    //         console.error('Error deleting project:', error);
    //     }
    // };
//////////////////////Delete/////////////////////////////////////////////////

    const handleAddProject = (projectName, projectDescription) => {
        // const newProject = {id: Date.now().toString(), name: projectName, description: projectDescription};
        const newProject = {id: Date.now().toString(), name: projectName, description: projectDescription};


        setProjects([...projects, newProject]);
    };


    return (
        <div className="sidebar" ref={sidebarRef}>
            <ul>
                <li>
                    <div className="icon-text-container">
                        <div className="circle-icon">D</div>
                        <span className="sidebar-text">Dashboard</span>
                    </div>
                </li>
                <hr/>
                <li className="projects-container" onClick={toggleProjects}>
                    <span className="d-flex gap-2">Projects
                        <div className={isProjectsOpen && "rotate-180 mt-1"}>
                            <ArrowDownIcon/>
                        </div>
                    </span>
                    <div className="menu-container">
                        <span className="menu-toggle " onClick={toggleMenu}>...</span>
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
                            <li key={project.projectId} onClick={() => handleProjectClick(project)}>
                                {isDeleteMode && (

                                    <input
                                        type="checkbox"
                                        checked={selectedProjects.includes(project.id)}
                                        onChange={(e) => handleCheckboxChange(e,project)}
                                    />
                                )}
                                {project.name}

                            </li>
                        ))}
                        {isDeleteMode && (
                            <button onClick={handleDeleteSelected} disabled={selectedProjects.length === 0}>Delete Selected Projects</button>
                        )}
                    </ul>
                )}
                <div className="line-above-settings"/>
                {/* Line above Settings */}
                <li>Settings</li>
            </ul>
            <AddProjectModal
                isVisible={isAddProjectModalVisible}
                onClose={handleCloseModal}
                onAddProject={handleAddProject} // Pass the handler function to the modal
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
