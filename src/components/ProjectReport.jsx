// src/components/ProjectReport.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ProjectReport.css';
import BoardService from "../Services/BoardService.js"; // Create this CSS file for styling

const ProjectReport = () => {
    const location = useLocation();
    const { projectId, projectDescription } = location.state || {};
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await BoardService.getBoardsByProject(projectId);
                if (Array.isArray(response.data)) {
                    setBoards(response.data);
                } else {
                    console.error('Invalid data format for boards');
                }
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, [projectId]);

    return (
        <div className="report-page">
            <h1>Project Report</h1>
            <div className="report-content">
                <h2>{projectDescription}</h2>
                <table className="report-table">
                    <thead>
                    <tr>
                        <th>Board ID</th>
                        <th>Board Name</th>
                        <th>Status</th>
                        <th>Tasks</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boards && boards.length > 0 ? (
                        boards.map((board) => (
                            <tr key={board.boardId}>
                                <td>{board.boardId}</td>
                                <td>{board.name}</td>
                                <td>
                                    {board.statuses && board.statuses.length > 0 ? (
                                        board.statuses.map((status) => (
                                            <div key={status.statusId}>
                                                {status.title}
                                                <ul>
                                                    {status.tasks && status.tasks.length > 0 ? (
                                                        status.tasks.map((task) => (
                                                            <li key={task.taskId}>{task.taskName}</li>
                                                        ))
                                                    ) : (
                                                        <li>No tasks</li>
                                                    )}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No statuses</div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No boards available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectReport;
