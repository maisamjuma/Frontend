import React, { useState, useEffect } from 'react';
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
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [boards, setBoards] = useState([]);
    const [visibleBoardsCount, setVisibleBoardsCount] = useState(7); // Number of boards to show initially

    const { projectName } = useParams();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { projectId, projectDescription } = location.state;
            setProjectId(projectId);
            setProjectDescription(projectDescription);
        }
    }, [location.state]);
        console.log(projectDescription);
    useEffect(() => {
        fetchRoles();
        if (projectId) {
            fetchBoards();
        }
    }, [isVisible, projectId]);

    const fetchRoles = async () => {
        try {
            const response = await RoleService.getAllRoles();
            if (!Array.isArray(response.data)) {
                throw new Error('Response data is not an array');
            }
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

    const handleRoleChange = (e) => {
        setSelected_roleId(e.target.value);
    };

    const handleBoardClick = (boardId) => {
        setSelectedBoard(boardId);
    };

    const handleAddClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleAddBoard = async () => {
        if (!projectId || !selected_roleId) return;
        try {
            const response = await RoleService.getRoleById(selected_roleId);
            const role = response.data;
            if (!role) {
                console.error('Role not found for the selected role ID:', selected_roleId);
                return;
            }
            const newBoard = {
                boardId: selected_roleId,
                name: role.roleName || 'New Board'
            };
            await BoardService.createBoard(projectId, selected_roleId);
            setBoards(prevBoards => [...prevBoards, newBoard]);
            setSelected_roleId(null);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleShowMore = () => {
        setVisibleBoardsCount(prevCount => prevCount + 5); // Adjust the number of boards to show more
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleDeleteBoard = (boardId) => {
        setBoards(boards.filter(board => board.boardId !== boardId));
    };

    const visibleBoards = boards.slice(0, visibleBoardsCount);
    const isShowMoreButtonVisible = boards.length > visibleBoardsCount;

    return (
        <div className="layout">
            <Navbar onLogout={() => { }} />
            <nav className="secondary-navbar">
                <ul className="secondary-nav">
                    {visibleBoards.map((board) => (
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
                    {isShowMoreButtonVisible && (
                        <button onClick={handleShowMore} className="show-more-button">Show More</button>
                    )}
                    <button onClick={handleAddClick} className="add-board-button">+</button>
                    {isDropdownOpen && (
                        <div className={`dropdownaddboard ${isVisible ? 'visible' : ''}`}>
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
        </div>
    );
};

Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired,
};

export default Workspace;
