import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Route, Routes, useLocation } from 'react-router-dom';
import './Workspace.css';
import Boards from './Boards';
import Navbar from "./Navbar/Navbar.jsx";
import PropTypes from 'prop-types';
import RoleService from '../Services/RoleService';
import BoardService from '../Services/BoardService';

const Workspace = ({ isVisible }) => {
    const [roles, setRoles] = useState([]);
    const [selected_roleId, setSelected_roleId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projectDescription, setProjectDescription] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);

    const { projectName } = useParams();
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isboardsDropdownOpen, setIsboardsDropdownOpen] = useState(false);
    const [boards, setBoards] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [dropdownBoards, setDropdownBoards] = useState([]);

    const secondaryNavRef = useRef(null);
    const dropdownRef = useRef(null);
    const boardsDropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { projectId, projectDescription, projectMembers } = location.state;
            setProjectId(projectId);
            setProjectDescription(projectDescription);
            setProjectMembers(projectMembers);
            console.log("Project ID:", projectId, "Description:", projectDescription, "Members:", projectMembers);
        }
    }, [location.state]);

    useEffect(() => {
        fetchRoles();
        if (projectId) {
            fetchBoards();
        }
    }, [isVisible, projectId]);

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleClickOutsideBoardsDropdown = (event) => {
            if (boardsDropdownRef.current && !boardsDropdownRef.current.contains(event.target)) {
                setIsboardsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideDropdown);
        document.addEventListener('mousedown', handleClickOutsideBoardsDropdown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
            document.removeEventListener('mousedown', handleClickOutsideBoardsDropdown);
        };
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await RoleService.getAllRoles();
            const rolesWithIds = response.data.map(role => ({
                id: role.roleId,
                roleName: role.roleName
            }));
            setRoles(rolesWithIds);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchBoards = async () => {

        try {
            const response = await BoardService.getBoardsByProject(projectId);
            if (response.data && Array.isArray(response.data)) {
                const boardsWithIds = response.data.map(board => ({
                    boardId: board.boardId,
                    name: board.name
                }));
                setBoards(boardsWithIds);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching boards:', error);
        }
    };

    useEffect(() => {
        if (boards.length > 5) {
            setShowMore(true);
            setDropdownBoards(boards.slice(5));
        } else {
            setShowMore(false);
            setDropdownBoards([]);
        }
    }, [boards]);

    const handleRoleChange = (e) => {
        setSelected_roleId(e.target.value);
    };

    const handleBoardClick = (boardId) => {
        setSelectedBoard(boardId);
    };

    const handleAddClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleShowClick = () => {
        setIsboardsDropdownOpen(!isboardsDropdownOpen);
    };

    const handleAddBoard = async () => {
        if (!projectId || !selected_roleId) return;

        try {
            // Fetch the role details by ID
            const response = await RoleService.getRoleById(selected_roleId);
            const role = response.data;

            if (!role) {
                console.error('Role not found for the selected role ID:', selected_roleId);
                return;
            }

            const newBoard = {
                boardId: selected_roleId,
                name: role.roleName || 'New Board',
            };

            await BoardService.createBoard(projectId, selected_roleId);
            setBoards([...boards, newBoard]);

            setSelected_roleId(null);

            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleDeleteBoard = (boardId) => {
        setBoards(boards.filter((board) => board.boardId !== boardId));
    };

    return (
        <div className="layout">
            <Navbar onLogout={() => { }} />
            <nav className="secondary-navbar">
                <ul className="secondary-nav">
                    {boards.slice(0, 5).map((board) => (
                        <li key={board.boardId} className="secondary-nav-item">
                            <div className="board-container">
                                <Link
                                    className="secnav-link"
                                    to={`/main/workspace/${projectName}/${board.boardId}/${board.name}`}
                                    style={{
                                        color: selectedBoard === board.boardId ? 'darksalmon' : 'black',
                                        fontWeight: selectedBoard === board.boardId ? "bold" : "normal"
                                    }}
                                    onClick={() => handleBoardClick(board.boardId)}
                                >
                                    {board.name}
                                </Link>
                                <button
                                    className="delete-board-button"
                                    onClick={() => handleDeleteBoard(board.boardId)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}

                    {showMore && (
                        <div className="more-boards-dropdown" ref={boardsDropdownRef}>
                            <button onClick={handleShowClick} className="show-more-button"> &#x25BC; </button>
                            {isboardsDropdownOpen && (
                                <ul className="dropdown-content">
                                    {dropdownBoards.map((board) => (
                                        <li key={board.boardId} className="secondary-nav-item">
                                            <Link
                                                className="secnav-link"
                                                to={`/main/workspace/${projectName}/${board.boardId}/${board.name}`}
                                                style={{
                                                    color: selectedBoard === board.boardId ? 'darksalmon' : 'black',
                                                    fontWeight: selectedBoard === board.boardId ? "bold" : "normal"
                                                }}
                                                onClick={() => handleBoardClick(board.boardId)}
                                            >
                                                {board.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <button onClick={handleAddClick} className="add-board-button">+</button>
                    {isDropdownOpen && (
                        <div className={`dropdownaddboard ${isVisible ? 'visible' : ''}`} ref={dropdownRef}>
                            <p>Add Board</p>
                            <select value={selected_roleId} onChange={handleRoleChange}>
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAddBoard}>Add</button>
                            <button onClick={handleCloseDropdown}>Cancel</button>
                        </div>
                    )}
                </ul>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route path="/:boardId/:name" element={<Boards />} />
                </Routes>
            </div>
            {selectedBoard && (
                <Boards
                    projectId={projectId}
                    projectDescription={projectDescription}
                    projectMembers={projectMembers}
                    setProjectId={setProjectId}
                    setProjectDescription={setProjectDescription}
                    setProjectMembers={setProjectMembers}
                />
            )}
        </div>
    );
};

Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default Workspace;
