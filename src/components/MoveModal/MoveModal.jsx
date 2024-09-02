import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './MoveModal.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import BoardService from "../../Services/BoardService.js";

const MoveModal = ({
                       statuses = [],
                       onClose,
                       onMoveTask,
                       boardId,
                       task,
                       projectId,
                       projectDescription,
                       projectMembers,
                       setProjectId,
                       setProjectDescription,
                       setProjectMembers
                   }) => {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await BoardService.getBoardsByProject(projectId);
                console.log('response is :', response);
                setBoards(response.data); // Assuming the response contains the boards array
            } catch (error) {
                console.error('Error fetching boards:', error);
                setError('Failed to fetch boards. Please try again.');
            }
        };

        if (projectId) {
            fetchBoards();
        }
    }, [projectId]);

    console.log('project id :', projectId);
    console.log('board id  :', boardId);

    // Default statuses without boardId field
    const defaultStatuses = [
        {id: 1, title: 'Unassigned Tasks'},
        {id: 2, title: 'To Do'},
        {id: 3, title: 'Doing'},
        {id: 4, title: 'Ready to Review'},
        {id: 5, title: 'Reviewing'},
        {id: 6, title: 'Ready for QA'},
        {id: 7, title: 'In Progress'},
        {id: 8, title: 'QA Failed'},
        {id: 9, title: 'QA Passed'}
    ];

    // Combine default statuses with additional statuses
    const allStatuses = [...defaultStatuses, ...statuses];

    // Remove duplicates by creating a map and converting it back to an array
    const uniqueStatuses = Array.from(new Map(allStatuses.map(status => [status.id, status])).values());

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('move-modal-overlay')) {
            onClose();
        }
    };

    const handleMove = () => {
        console.log('Selected Board:', selectedBoard);
        console.log('Selected Status:', selectedStatus);
        console.log('Selected Priority:', selectedPriority);

        if (typeof onMoveTask === 'function') {
            if (selectedBoard && selectedStatus) {
                onMoveTask(task, selectedBoard, selectedStatus, selectedPriority);
                onClose();
            } else {
                console.log('Board or Status not selected');
            }
        }
    };

    return (
        <div className="move-modal-overlay" onClick={handleOverlayClick}>
            <div className="move-modal-content">
                <span className="move-modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                <div className="move-title">
                    <h2 className="titleMoveTask">Move Task</h2>
                    <p>Select Destination</p>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="move-modal-section">
                    <h3 className="namesOfMoveModal">Board</h3>
                    <select
                        className="selectOfMoveModal"
                        value={selectedBoard}
                        onChange={(e) => {
                            setSelectedBoard(e.target.value);
                            setSelectedStatus(''); // Reset status selection when board changes
                        }}
                    >
                        <option value="">Select a board</option>
                        {boards.map((board) => (
                            <option key={board.boardId} value={board.boardId}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="move-modal-section">
                    <h3 className="namesOfMoveModal">Status</h3>
                    <select
                        className="selectOfMoveModal"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        disabled={!selectedBoard}
                    >
                        <option value="">Select a status</option>
                        {uniqueStatuses.map(status => (
                            <option key={status.id} value={status.id}>
                                {status.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="move-modal-section">
                    <h3 className="namesOfMoveModal">Priority</h3>
                    <select
                        className="selectOfMoveModal"
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        disabled={!selectedStatus}
                    >
                        <option value="">Select a priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="move-modal-buttons">
                    <button onClick={handleMove}>Move</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

MoveModal.propTypes = {
    statuses: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onMoveTask: PropTypes.func.isRequired,
    boardId: PropTypes.number.isRequired,
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        assignedToUserId: PropTypes.string.isRequired,
        assignedUserLetter: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        taskDescription: PropTypes.string.isRequired,
    }),
    projectId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    projectDescription: PropTypes.string,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired,
};

export default MoveModal;
