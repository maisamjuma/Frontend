import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
//import dashboardIcon from '../assets/t.png';
import {useNavigate} from 'react-router-dom';
import AddProjectModal from './Project/AddProjectModal.jsx';
import ProjectService from '../Services/ProjectService';
import {userIsAdmin} from '../utils/authUtils';
import {ArrowDownIcon} from "./SVGIcons.jsx";
import {FaPen} from "react-icons/fa";

import UserDetailsModal from './UserDetails/UserDetailsModal.jsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Import the UserDetailsModal component
import {faMinusSquare, faPlusSquare} from '@fortawesome/free-solid-svg-icons';


const Sidebar = ({onMenuAction, onLogout}) => {
    const [projects, setProjects] = useState([]); // Added state for projects

    const [isProjectsOpen, setIsProjectsOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]); // Added this line
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const userRoleIsAdmin = userIsAdmin(); // Check if the user is an admin
    const [activeProjectId, setActiveProjectId] = useState(null); // Track active (selected) project

    const [userDetails, setUserDetails] = useState(null); // State to store user details
    const [isUserDetailsModalVisible, setIsUserDetailsModalVisible] = useState(false); // State to manage modal visibility

    // Define static project
    const STATIC_PROJECT = {
        id: 'static-project-id', // Use a unique identifier
        name: 'Static Project',
        description: 'A static project that always appears in the sidebar.'
    };

    useEffect(() => {
        // Fetch user details from local storage or API
        const fetchUserDetails = () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('loggedInUser'));
                if (userInfo) {
                    setUserDetails(userInfo);
                } else {
                    console.error("No user info found in local storage!");
                }
            } catch (error) {
                console.error("Error retrieving user info from local storage:", error);
            }
        };

        fetchUserDetails();
        setProjects([STATIC_PROJECT]);
        fetchProjects();

        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                // setIsProjectsOpen(false);
                setIsMenuOpen(false);
                setIsDeleteMode(false);
                setIsAddProjectModalVisible(false);
                setIsUserDetailsModalVisible(false); // Close user details modal
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

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
            setActiveProjectId(project.id);  // Set the clicked project as active
            console.log('china number one ID::', project.id);
            project.projectId = project.id;
            console.log('china number one ID::', project.projectId);

            console.log('china number one description::', project.description);
            navigate(`/main/${project.name}`, {

                state: {
                    projectDescription: project.description,
                    projectId: project.projectId
                }
            });

        }
    };

    const handleCheckboxChange = (e, project) => {
        e.stopPropagation();
        setSelectedProjects(prevSelected =>
            prevSelected.includes(project.id)
                ? prevSelected.filter(id => id !== project.id)
                : [...prevSelected, project.id]
        );
    };

    const handleCloseModal = () => {
        setIsAddProjectModalVisible(false);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            // setIsProjectsOpen(false);
            setIsMenuOpen(false);
            setIsDeleteMode(false);
            setIsAddProjectModalVisible(false);

            setIsUserDetailsModalVisible(false); // Close user details modal

        }
    };

    useEffect(() => {
        setProjects([STATIC_PROJECT]);
        fetchProjects();


        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);


    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await ProjectService.getAllProjects(token);

            const projectsWithIds = response.map(project => ({
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
    // const handleUsersListClick = () => {
    //     navigate('/main/ListUser');
    // };
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

    const handleAddProject = (projectId, projectName, projectDescription) => {
        // const newProject = {id: Date.now().toString(), name: projectName, description: projectDescription};
        const newProject = {id: projectId, name: projectName, description: projectDescription};
        setProjects((projects) => [newProject, ...projects]);
        // Set the newly added project as active
        setActiveProjectId(projectId);
        setIsAddProjectModalVisible(false); // Close the modal
    };

    const handleDashboardClick = () => {
        if (userDetails) {
            setIsUserDetailsModalVisible(true);
        } else {
            console.error("No user info found in local storage!");
        }
    };

    // Define the handleLogout function
    // const handleLogout = () => {
    //     // Clear authentication data from local storage
    //     localStorage.removeItem('token');
    //     // Optionally, you can also clear any other user-related data if needed
    //
    //     // Redirect to the login page
    //     navigate('/login');
    // };

    return (
        <div className="sidebar" ref={sidebarRef}>
            <ul>
                <li onClick={handleDashboardClick}>
                    <div className="icon-text-container">
                        <div className="circle-icon">{userDetails ? userDetails.firstName.charAt(0) : 'U'}</div>
                        <span className="sidebar-text">
                            {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'User'}
                        </span>
                    </div>
                </li>
                <hr/>
                <li className="projects-container" onClick={toggleProjects}>
                    <span className="projectName-arrowDown">
                        <span className="projects-text">Projects</span>
                        <div className={isProjectsOpen && "rotate-180 mt-1"}>
                            <ArrowDownIcon />
                        </div>
                    </span>
                    {userRoleIsAdmin && (
                        <div className="menu-container">
                            <FaPen
                                className="backend-pencil-icon"
                                onClick={toggleMenu}
                            />
                            {/*<span className="menu-toggle" onClick={toggleMenu}>...</span>*/}
                            {isMenuOpen && (
                                <ul className="menu-list" onClick={(e) => e.stopPropagation()}>
                                    <li className="addpro" onClick={() => handleMenuAction('Add')}>
                                        <FontAwesomeIcon icon={faPlusSquare} /> Add Project</li>
                                    <li className="deletepro" onClick={() => handleMenuAction('Delete')}>
                                        <FontAwesomeIcon icon={faMinusSquare} /> Delete Project</li>
                                </ul>
                            )}
                        </div>
                    )}
                </li>
                {isProjectsOpen && (
                    <div className="projects-list-container">
                        <ul className="dropdown-list ">
                            {projects.map((project) => (

                                <li
                                    key={project.id}
                                    onClick={() => handleProjectClick(project)}
                                    className={activeProjectId === project.id ? 'active-project' : ''}
                                >
                                    {isDeleteMode && (
                                        <input
                                            className="mx-3"
                                            type="checkbox"
                                            checked={selectedProjects.includes(project.id)}
                                            onChange={(e) => handleCheckboxChange(e, project)}
                                        />
                                    )}
                                    {project.name}
                                </li>

                            ))}
                            {isDeleteMode && (
                                <button onClick={handleDeleteSelected} disabled={selectedProjects.length === 0}>
                                    Delete Selected Projects
                                </button>
                            )}
                        </ul>
                    </div>
                )}
                <div className="line-above-settings"/>
                {/*{userRoleIsAdmin && (*/}
                {/*    <li className="user-lists" onClick={handleUsersListClick}>Users List</li>*/}
                {/*)}*/}
            </ul>
            <AddProjectModal
                isVisible={isAddProjectModalVisible}
                onClose={handleCloseModal}
                onAddProject={handleAddProject}
            />
            <UserDetailsModal
                isVisible={isUserDetailsModalVisible}
                onClose={() => setIsUserDetailsModalVisible(false)}
                userDetails={userDetails}
                onLogout={onLogout}
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
    onLogout: PropTypes.func.isRequired

};

export default Sidebar;
