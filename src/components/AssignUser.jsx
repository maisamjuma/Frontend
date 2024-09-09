import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './AssignUserModal.css';
import UserService from "../Services/UserService.js";
import TaskService from "../Services/TaskService.js";

const AssignUserModal = ({ onClose, taskId, projectMembers}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState(null); // Default to null
    const [selectedMemberName, setSelectedMemberName] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [task, setTask] = useState(null); // State to hold the fetched task

    // Fetch task details by taskId
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await TaskService.getTaskById(taskId);
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId]);

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsArray = await Promise.all(
                    projectMembers.map(async (member) => {
                        const response = await UserService.getUserById(member.userId);
                        return response.data;
                    })
                );
                setUserDetails(userDetailsArray);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (projectMembers.length > 0) {
            fetchUserDetails();
        }
    }, [projectMembers]);

    // Filter members based on search term
    const filteredMembers = userDetails.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle save action
    const handleSave = async () => {
        if (selectedMemberId && task) {
            try {
                const updatedTask = {
                    ...task,
                    assignedToUserId: selectedMemberId, // Assign selected user
                    status: "To Do"  // Keep existing status or set a default
                };

                const response = await TaskService.updateTask(taskId, updatedTask);
                console.log("Updated task:", response.data);
                // onSave(selectedMemberId, selectedMemberName);
                onClose();
            } catch (error) {
                console.error('Error updating task assigned user:', error);
                alert('There was an error updating the task. Please try again.');
            }
        } else {
            alert('Please select a member before saving.');
        }
    };

    // Handle member selection
    const handleMemberClick = (memberId, memberUsername) => {
        setSelectedMemberId(memberId);
        setSelectedMemberName(memberUsername);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="assign-user-modal-overlay" onClick={onClose}>
                <div className="assign-user-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="assign-user-modal-header">
                        <h5>Select a Member</h5>
                        <button className="assign-user-close-button" onClick={onClose}>X</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="assign-user-search-input"
                    />
                    <ul className="assign-user-list">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <li
                                    key={member.userId}
                                    onClick={() => handleMemberClick(member.userId, member.firstName)}
                                    className={`assign-user-list-item ${member.userId === selectedMemberId ? 'selected-member' : ''}`}
                                >
                                    <span className="member-initial-circle">
                                        {member.firstName.charAt(0).toUpperCase()}
                                    </span>
                                    {member.firstName} {member.lastName}
                                </li>
                            ))
                        ) : (
                            <li>No members found</li>
                        )}
                    </ul>
                    <div>
                        <button className="saveButton" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
};

AssignUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    // onSave: PropTypes.func.isRequired,
    taskId: PropTypes.number.isRequired,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })).isRequired,
};

export default AssignUserModal;
