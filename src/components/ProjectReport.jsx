import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './ProjectReport.css';
import BoardService from "../Services/BoardService.js";
import TaskService from "../Services/TaskService.js";
import UserService from "../Services/UserService.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ProjectReport = () => {
    const location = useLocation();
    const { projectId, projectName } = location.state || {};
    const [boards, setBoards] = useState([]);
    const [tasksByBoard, setTasksByBoard] = useState({});
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch boards
                const boardsResponse = await BoardService.getBoardsByProject(projectId);
                if (Array.isArray(boardsResponse.data)) {
                    setBoards(boardsResponse.data);

                    // Fetch tasks after fetching boards
                    const tasksResponse = await TaskService.getTasksByProjectId(projectId);
                    if (Array.isArray(tasksResponse.data)) {
                        const tasksMap = tasksResponse.data.reduce((acc, task) => {
                            if (!acc[task.boardId]) {
                                acc[task.boardId] = [];
                            }
                            acc[task.boardId].push(task);
                            return acc;
                        }, {});
                        setTasksByBoard(tasksMap);

                        // Fetch users
                        const userIds = [...new Set(tasksResponse.data
                            .map(task => task.assignedToUserId)
                            .filter(userId => userId != null))]; // Filter out null and undefined user IDs

                        if (userIds.length > 0) {
                            const userPromises = userIds.map(userId => UserService.getUserById(userId));
                            try {
                                const userResponses = await Promise.all(userPromises);
                                console.log("User responses:", userResponses);

                                const usersMap = userResponses.reduce((acc, response) => {
                                    // Assuming the response contains user data directly
                                    const user = response.data;
                                    acc[user.userId] = user;
                                    return acc;
                                }, {});

                                console.log("Users map:", usersMap);
                                setUsers(usersMap);
                            } catch (userError) {
                                console.error('Error fetching users:', userError);
                            }
                        }
                    } else {
                        console.error('Invalid data format for tasks');
                    }
                } else {
                    console.error('Invalid data format for boards');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [projectId]);

    // Prepare chart data
    const chartData = {
        labels: boards.map(board => board.name), // Labels for the x-axis
        datasets: [{
            label: 'Number of Tasks',
            data: boards.map(board => (tasksByBoard[board.boardId] || []).length), // Data for the y-axis
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ${value} tasks`;
                    }
                }
            }
        }
    };

    return (
        <div className="report-page">
            <h3 className="project-report">
                <i className="fas fa-chart-bar"></i> {/* Bar chart icon */}
                Project  Report
            </h3>
            <div className="scroll-container">
                <div className="chart-container">
                    <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="table-container">
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Board ID</th>
                            <th>Board Name</th>
                            <th>Status</th>
                            <th>Task Name</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Assigned to</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boards.length > 0 ? (
                            boards.map(board => {
                                const tasksForBoard = tasksByBoard[board.boardId] || [];
                                return (
                                    <React.Fragment key={board.boardId}>
                                        {tasksForBoard.length > 0 ? (
                                            tasksForBoard.map(task => {
                                                const user = users[task.assignedToUserId] || {};
                                                const userName = user.firstName && user.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : 'Unassigned'; // Fallback for missing user data
                                                return (
                                                    <tr key={task.taskId}>
                                                        <td className="limited-text">
                                                            <span>{board.boardId}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{board.name}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{task.status}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{task.taskName}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{task.taskDescription || 'No description'}</span>
                                                        </td>
                                                        <td className={`limited-text ${task.priority === 'high' ? 'priority-high' : 
                                                            task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                                                            <span>{task.priority}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{userName}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{user.email}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{new Date(task.createdAt).toLocaleString()}</span>
                                                        </td>
                                                        <td className="limited-text">
                                                            <span>{new Date(task.updatedAt).toLocaleString()}</span>
                                                        </td>

                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr key={`no-tasks-${board.boardId}`}>
                                                <td colSpan="10">No tasks for {board.name}</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10">No boards available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectReport;
