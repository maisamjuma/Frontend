import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DetailsModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faTimes } from '@fortawesome/free-solid-svg-icons';

const DetailsModal = ({ task, onClose }) => {
    // Initialize tableData with default structure if task or task.tableData is not available
    const initialTableData = (task && task.tableData && Array.isArray(task.tableData) && task.tableData.length > 0)
        ? task.tableData
        : [{ Description: "", Comments: "" }];
    const [tableData, setTableData] = useState(initialTableData);

    useEffect(() => {
        if (task && task.tableData && Array.isArray(task.tableData)) {
            setTableData(task.tableData.length > 0 ? task.tableData : [{ Description: "", Comments: "" }]);
        }
    }, [task]);

    if (!task) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('details-modal-overlay')) {
            onClose();
        }
    };

    const handleInputChange = (e, rowIndex, colKey) => {
        const updatedData = [...tableData];
        updatedData[rowIndex][colKey] = e.target.value;
        setTableData(updatedData);
    };

    const handleAddRow = () => {
        const emptyRow = { Description: '', Comments: '' };
        setTableData([...tableData, emptyRow]);
    };

    return (
        <div className="details-modal-overlay" onClick={handleOverlayClick}>
            <div className="details-modal-content">
                <div className="details-modal-header">
                    <div className="details-modal-title">
                        <FontAwesomeIcon icon={faTasks} className="details-icon" />
                        <h2>{task.name}</h2>
                    </div>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={onClose} />
                </div>
                <p className="task-status">In Status: {task.statusName}</p>
                <p className="task-description">Description {task.description}</p>

                <div className="table-container">
                    {tableData.map((row, rowIndex) => (
                        <div key={rowIndex} className="table-row">
                            {/* Displaying "Member Name" as normal text above each row */}
                            <div className="member-name">Member Name: </div>
                            <table className="task-details-table">
                                <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Comments</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                            <textarea className="textarea"
                                                value={row.Description}
                                                onChange={(e) => handleInputChange(e, rowIndex, 'Description')}
                                                rows="10" // Adjust rows as needed

                                            />
                                    </td>
                                    <td>
                                            <textarea className="textarea"
                                                value={row.Comments}
                                                onChange={(e) => handleInputChange(e, rowIndex, 'Comments')}
                                                rows="10" // Adjust rows as needed

                                            />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                <div className="table-controls">
                    <button onClick={handleAddRow}>Add Row</button>
                </div>
            </div>
        </div>
    );
};

DetailsModal.propTypes = {
    task: PropTypes.shape({
        name: PropTypes.string.isRequired,
        statusName: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        description: PropTypes.string,
        tableData: PropTypes.arrayOf(PropTypes.shape({
            Description: PropTypes.string,
            Comments: PropTypes.string
        })),
    }),
    onClose: PropTypes.func.isRequired,
};

export default DetailsModal;
