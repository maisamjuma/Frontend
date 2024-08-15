import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './MoveModal.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

const MoveModal = ({statuses = [], task = {}, onClose, onMoveTask}) => {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    // Fixed board options
    const boards = [
        {id: 'back', name: 'Back'},
        {id: 'front', name: 'Front'},
        {id: 'qa', name: 'QA'}
    ];

    // Default statuses without boardId field
    const defaultStatuses = [
        {id: 1, title: 'unassigned tasks'},
        {id: 2, title: 'To Do'},
        {id: 3, title: 'Doing'},
        {id: 4, title: 'Ready to Review'},
        {id: 5, title: 'Reviewing'},
        {id: 6, title: 'Complete'}
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
        if (selectedBoard && selectedStatus) {
            onMoveTask(task, selectedBoard, selectedStatus, selectedPriority);
            onClose();
        }
    };

    return (
        <div className="move-modal-overlay" onClick={handleOverlayClick}>
            <div className="move-modal-content">
                <span className="move-modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                <div className="move-title">
                    <h2>Move Task</h2>
                    <p>Select Destination</p>
                </div>
                <div className="move-modal-section">
                    <h3>Board</h3>
                    <select
                        value={selectedBoard}
                        onChange={(e) => {
                            setSelectedBoard(e.target.value);
                            setSelectedStatus(''); // Reset status selection when board changes
                        }}
                    >
                        <option value="">Select a board</option>
                        {boards.map(board => (
                            <option key={board.id} value={board.id}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="move-modal-section">
                    <h3>Status</h3>
                    <select
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
                    <h3>Priority</h3>
                    <select
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
    task: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onMoveTask: PropTypes.func,
};

export default MoveModal;