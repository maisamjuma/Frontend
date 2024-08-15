import React, {useState, useEffect} from 'react';
import {useParams, Link, Route, Routes, useLocation} from 'react-router-dom';
import './Workspace.css';
import Boards from './Boards';
import Navbar from "./Navbar/Navbar.jsx";

import PropTypes from 'prop-types';  // Import PropTypes

import RoleService from '../Services/RoleService';  // Import RoleService to fetch roles
import BoardService from '../Services/BoardService';
// import ProjectService from "../Services/ProjectService.js";  // Adjust import path as necessary

const Workspace = ({isVisible, onClose}) => {

    const [roles, setRoles] = useState([]);
    const [selected_roleId, setSelected_roleId] = useState(null);
    const [projectId, setProjectId] = useState(null); // Assuming you have a way to set the projectId
    const [projectDescription, setProjectDescription] = useState(null); // Assuming you have a way to set the projectId

    const {projectName} = useParams();
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [newBoardName, setNewBoardName] = useState('');
    const [boards, setBoards] = useState([
        {id: 'backend', name: 'Backend'},
        {id: 'frontend', name: 'Frontend'},
        {id: 'qa', name: 'QA'},
    ]);

    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const {projectId, projectDescription} = location.state;
            setProjectId(projectId);
            setProjectDescription(projectDescription);
        }
        fetchRoles();
    }, [location.state]);


    // const { projectId, projectDescription } = location.state || {};

    console.log('Project ID:', projectId);
    console.log('Project Description:', projectDescription);


    useEffect(() => {
        if (isVisible) {
            fetchRoles();
        }
    }, [isVisible]);

    const fetchRoles = async () => {
        try {
            const response = await RoleService.getAllRoles();
            const rolesWithIds = response.data.map(role => ({
                ...role,
                id: role.roleId,  // Assuming `id` is the correct field from the database

                roleName: role.roleName  // Use roleName as `roleName`
            }));


            setRoles(rolesWithIds);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };


    const handleRoleChange = (e) => {
        setSelected_roleId(e.target.value);
    };


    const handleBoardClick = (boardId) => {
        setSelectedBoard(boardId);
    };

    const handleAddClick = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    // const handleAddBoard = () => {
    //     if (newBoardName.trim() !== '') {
    //         const newBoardId = newBoardName.toLowerCase().replace(/\s+/g, '-'); // Generate a unique ID for the new board
    //         setBoards([...boards, { id: newBoardId, name: newBoardName }]); // Add the new board
    //         setNewBoardName(''); // Clear the input field
    //         setIsDropdownOpen(false); // Close the dropdown after adding the board
    //     }
    // };


    const handleAddBoard = () => {
        if (!projectId || !selected_roleId) return;

        BoardService.createBoard(projectId, selected_roleId)
            .then(() => {
                // Notify parent component about the new board
                // onAddBoard({projectId, roleId: selectedRole});
                const ourRole = roles.find(role => role.roleId === selected_roleId);

                const newBoard = {
                    // id: selectedRole, // Use the role ID as the board ID
                    // name: roles.find(role => role.id === selectedRole)?.roleName || 'New Board'
                    // name: roles.find(role => role.id === selected_roleId)?.roleName || 'New Board'
                    // name: roles.find().roleName
                    //name: means board name
                    name: ourRole ? ourRole.roleName : 'New Board'
                    // name: selected_roleId || 'New Board'
                };

                setBoards([...boards, newBoard]);

                setSelected_roleId(null);
                // setProjectId(null);
                setIsDropdownOpen(false);
                onClose();
            })
            .catch(error => {
                // setIsDropdownOpen(false);

                console.error('Error creating board:', error);
            });
    };


    const handleDeleteBoard = (boardId) => {
        setBoards(boards.filter((board) => board.id !== boardId)); // Remove the board
    };

    return (
        <div className="layout">
            <Navbar onLogout={() => {
            }}/>
            <nav className="secondary-navbar">
                <ul className="secondary-nav">
                    {boards.map((board) => (
                        <li key={board.id} className="secondary-nav-item">
                            <div className="board-container">
                                <Link
                                    className="secnav-link"
                                    to={`/main/workspace/${projectName}/${board.id}`}
                                    style={{
                                        color: selectedBoard === board.id ? 'darksalmon' : 'black',
                                        fontWeight: selectedBoard === board.id ? "bold" : "normal"
                                    }}
                                    onClick={() => handleBoardClick(board.id)}
                                >
                                    {board.name}
                                </Link>
                                <button
                                    className="delete-board-button"
                                    onClick={() => handleDeleteBoard(board.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                    <button onClick={handleAddClick} className="add-board-button">+</button>
                    {isDropdownOpen && (
                        <div className={`
                        dropdownaddboard ${isVisible ? 'visible' : ''}
                        `}>


                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    value={newBoardName}*/}
                            {/*    onChange={(e) => setNewBoardName(e.target.value)}*/}
                            {/*    placeholder="Enter board name"*/}
                            {/*/>*/}
                            {/*<button onClick={handleAddBoard}>Add</button>*/}

                            {/*<div className={`modal ${isVisible ? 'visible' : ''}`}>*/}
                            <h2>Add Board</h2>
                            <select value={selected_roleId} onChange={handleRoleChange}>

                                <option value="">Select Role</option>

                                {roles.map(role => (

                                    <option key={role.id} value={role.id}>
                                        {role.roleName}
                                    </option>

                                ))}

                            </select>
                            <button onClick={handleAddBoard}>Add</button>
                            <button onClick={onClose}>Cancel</button>
                            {/*</div>*/}

                        </div>
                    )}
                </ul>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route path="/:boardId" element={<Boards/>}/>
                </Routes>
            </div>
        </div>
    );
};
// Add PropTypes validation
Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // onAddBoard: PropTypes.func.isRequired,
};
export default Workspace;
