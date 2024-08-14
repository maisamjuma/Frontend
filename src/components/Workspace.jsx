import React, { useState } from 'react';
import { useParams, Link, Route, Routes } from 'react-router-dom';
import './Workspace.css';
import Boards from './Boards';
import Navbar from "./Navbar/Navbar.jsx";



const Workspace = () => {
    const { projectName } = useParams();
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [boards, setBoards] = useState([
        { id: 'backend', name: 'Backend' },
        { id: 'frontend', name: 'Frontend' },
        { id: 'qa', name: 'QA' },
    ]);

    const handleBoardClick = (boardId) => {
        setSelectedBoard(boardId);
    };

    const handleAddClick = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    const handleAddBoard = () => {
        if (newBoardName.trim() !== '') {
            const newBoardId = newBoardName.toLowerCase().replace(/\s+/g, '-'); // Generate a unique ID for the new board
            setBoards([...boards, { id: newBoardId, name: newBoardName }]); // Add the new board
            setNewBoardName(''); // Clear the input field
            setIsDropdownOpen(false); // Close the dropdown after adding the board
        }
    };

    const handleDeleteBoard = (boardId) => {
        setBoards(boards.filter((board) => board.id !== boardId)); // Remove the board
    };

    return (
        <div className="layout">
            <Navbar onLogout={() => {}} />
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
                        <div className="dropdownaddboard">
                            <input
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder="Enter board name"
                            />
                            <button onClick={handleAddBoard}>Add</button>
                        </div>
                    )}
                </ul>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route path="/:boardId" element={<Boards />} />
                </Routes>
            </div>
        </div>
    );
};

export default Workspace;
