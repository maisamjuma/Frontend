import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './MoveModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MoveModal = ({ statuses = [], task = {}, onClose, onMoveTask }) => {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');

    // Fixed board options
    const boards = [
        { id: 'back', name: 'Back' },
        { id: 'front', name: 'Front' },
        { id: 'qa', name: 'QA' }
    ];

    // Default statuses without boardId field
    const defaultStatuses = [
        { id: 1, title: 'unassigned tasks' },
        { id: 2, title: 'To Do' },
        { id: 3, title: 'Doing' },
        { id: 4, title: 'Ready to Review' },
        { id: 5, title: 'Reviewing' },
        { id: 6, title: 'Complete' }
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

    const onDragEnd = (result) => {
        // Logic to handle drag-and-drop results
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Handle moving tasks here, if needed
    };

    return (
        <div className="move-modal-overlay" onClick={handleOverlayClick}>
            <div className="move-modal-content">
                <span className="move-modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
                <div className="move-title">
                    <h2 className="titleMoveTask">Move Task</h2>
                    <p>Select Destination</p>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="boards" direction="horizontal">
                        {(provided) => (
                            <div
                                className="move-modal-section"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
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
                                    {boards.map((board, index) => (
                                        <Draggable key={board.id} draggableId={board.id} index={index}>
                                            {(provided) => (
                                                <option
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    value={board.id}
                                                >
                                                    {board.name}
                                                </option>
                                            )}
                                        </Draggable>
                                    ))}
                                </select>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

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
    task: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onMoveTask: PropTypes.func.isRequired, // Ensure this is required
};

export default MoveModal;
