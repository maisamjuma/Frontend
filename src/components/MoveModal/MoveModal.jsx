import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MoveModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MoveModal = ({ statuses = [], task = {}, onClose }) => {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');

    // Fixed board options
    const boards = [
        { id: 'back', name: 'Back' },
        { id: 'front', name: 'Front' },
        { id: 'qa', name: 'QA' }
    ];

    // Default statuses with a boardId field
    const defaultStatuses = [
        { id: 1, title: 'unassigned tasks', boardId: 'back' },
        { id: 2, title: 'To Do', boardId: 'back' },
        { id: 3, title: 'Doing', boardId: 'front' },
        { id: 4, title: 'Ready to Review', boardId: 'qa' }
    ];

    // Combine default statuses with additional statuses
    const allStatuses = [...defaultStatuses, ...statuses];

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('move-modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="move-modal-overlay" onClick={handleOverlayClick}>
            <div className="move-modal-content">
                <span className="move-modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
                <h2>Move Task</h2>
                <p>Select Destination</p>

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
                        {allStatuses
                            .filter(status => status.boardId === selectedBoard)
                            .map(status => (
                                <option key={status.id} value={status.id}>
                                    {status.title}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="move-modal-section">
                    <h3>Position</h3>
                    <select
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        disabled={!selectedStatus}
                    >
                        <option value="">Select a position</option>
                        {Array.from({ length: task.positionCount || 1 }, (_, i) => i + 1).map(position => (
                            <option key={position} value={position}>
                                {position}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

MoveModal.propTypes = {
    statuses: PropTypes.array.isRequired,
    task: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MoveModal;
