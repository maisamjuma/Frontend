import React, { useState, useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './Workspace.css';
import Boards from './Boards';
import Navbar from "./Navbar/Navbar.jsx";
import PropTypes from 'prop-types';
import RoleService from '../Services/RoleService';
import BoardService from '../Services/BoardService';
import { userIsAdmin, userIsTeamLeader } from '../utils/authUtils'; // Import the utility functions

const Workspace = ({ isVisible , onLogout}) => {
    const [roles, setRoles] = useState([]);
    const [selected_roleId, setSelected_roleId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projectDescription, setProjectDescription] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isboardsDropdownOpen, setIsboardsDropdownOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [dropdownBoards, setDropdownBoards] = useState([]);

    const secondaryNavRef = useRef(null);
    const dropdownRef = useRef(null);
    const boardsDropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const canAddBoard = () => {
        return userIsAdmin() || userIsTeamLeader();
    };

    useEffect(() => {
        if (location.state) {
            const { projectId, projectDescription, projectMembers, defaultBoard } = location.state;
            setProjectId(projectId);
            setProjectDescription(projectDescription);
            setProjectMembers(projectMembers);

            console.log("Default Board:", defaultBoard);

            if (defaultBoard) {
                BoardService.getBoardById(defaultBoard.boardId).then((response) => {
                    const board = response.data;
                    console.log("Fetched Default Board:", board);
                    if (board) {
                        setSelectedBoard(board);
                        // Navigate to the board's URL
                        navigate(`/main/workspace/${projectId}/${board.boardId}/${board.name}`);
                    }
                }).catch(error => {
                    console.error("Error fetching board by ID:", error);
                });
            }
        }
    }, [location.state, navigate]);

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
                funcRoleId: role.funcRoleId,
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
                console.log(boardsWithIds);
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

    const handleBoardClick = (board) => {
        console.log("handleBoardClick board", board);
        setSelectedBoard(board);
    };

    const handleAddClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleShowClick = () => {
        setIsboardsDropdownOpen(!isboardsDropdownOpen);
    };

    const handleAddBoard = async () => {
        if (!projectId || !selected_roleId) return;
        console.log("!projectId || !selected_roleId", projectId, selected_roleId);

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
            console.log("new board", newBoard);
            await BoardService.createBoard(projectId, selected_roleId);
            setBoards([...boards, newBoard]);

            setSelected_roleId(null);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleDeleteBoard = async (boardId) => {
        try {
            await BoardService.deleteBoard(boardId);
            setBoards(boards.filter((board) => board.boardId !== boardId));
        } catch (error) {
            console.error('Error deleting board:', error);
            // Optionally handle errors, e.g., show a notification to the user
        }
    };

    const isBoardSelected = (board) => {
        return selectedBoard && selectedBoard.boardId === board.boardId;
    };

    return (
        <div className="layout">
            {/*<Navbar onLogout={() => {}} />*/}
            <div className="navbar">
                <Navbar onLogout={onLogout}/> {/* Pass onLogout to Navbar */}
            </div>
            <nav className="secondary-navbar">
                <ul className="secondary-nav" ref={secondaryNavRef}>
                    {boards.slice(0, 5).map((board) => (
                        <li key={board.boardId} className="secondary-nav-item">
                            <div className="board-container">
                                <Link
                                    className="secnav-link"
                                    to={`/main/workspace/${projectId}/${board.boardId}/${board.name}`}
                                    style={{
                                        color: isBoardSelected(board) ? 'darksalmon' : 'black',
                                        fontWeight: isBoardSelected(board) ? 'bold' : 'normal'
                                    }}
                                    onClick={() => handleBoardClick(board)}
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
                                                to={`/main/workspace/${projectId}/${board.boardId}/${board.name}`}
                                                style={{
                                                    color: isBoardSelected(board) ? 'darksalmon' : 'black',
                                                    fontWeight: isBoardSelected(board) ? 'bold' : 'normal'
                                                }}
                                                onClick={() => handleBoardClick(board)}
                                            >
                                                {board.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {canAddBoard() && (
                        <button onClick={handleAddClick} className="add-board-button">+</button>
                    )}

                    {isDropdownOpen && (
                        <div className={`dropdownaddboard ${isVisible ? 'visible' : ''}`} ref={dropdownRef}>
                            <p>Add Board</p>
                            <select
                                className="dropDownInAddBoard"
                                value={selected_roleId}
                                onChange={handleRoleChange}
                            >
                                <option value="">Select Role</option>
                                {roles.map(role => (
                                    <option key={role.funcRoleId} value={role.funcRoleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAddBoard}>Add</button>
                        </div>
                    )}
                </ul>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route
                        path="/:boardId/:name"
                        element={
                            <Boards
                                projectId={projectId}
                                projectDescription={projectDescription}
                                projectMembers={projectMembers}
                                setProjectId={setProjectId}
                                setProjectDescription={setProjectDescription}
                                setProjectMembers={setProjectMembers}
                                board={selectedBoard}
                                onLogout={onLogout}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,  // Add prop type for onLogout
};

export default Workspace;
