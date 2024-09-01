import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeMemberModal.css';
import UserService from "../Services/UserService.js";
import TaskService from "../Services/TaskService.js";

const ChangeMemberModal = ({

                               onSave,
                               onClose,
                                task,
                               projectId,
                               projectDescription,
                               projectMembers,
                               setProjectId,
                               setProjectDescription,
                               setProjectMembers
                           }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [selectedMembername, setSelectedMembername] = useState('');
    const [userDetails, setUserDetails] = useState([]);
        console.log("change member task : ",task)
    // Fetch user details based on projectMembers
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

    const handleSave = async () => {
        if (selectedMemberId) {
            try {
                // Create the updated task object with the new assigned user
                const updatedTask = {
                    ...task, // Spread the existing task details
                    assignedToUserId: selectedMemberId, // Update the assigned user ID
                };

                // Call the TaskService to update the task with the new assigned user
                await TaskService.updateTask(task.taskId, updatedTask);

                // Alert the user that the assigned user was updated successfully
                alert('Task assigned user updated successfully!');
                onSave(selectedMemberId, selectedMembername); // Pass selected member to parent
                onClose(); // Close modal after saving
            } catch (error) {
                // Handle any errors that occur during the update
                console.error('Error updating task assigned user:', error);
                alert('There was an error updating the task assigned user. Please try again.');
            }
        }
    };

    const handleMemberClick = (memberId, memberUsername) => {
        setSelectedMemberId(memberId);
        setSelectedMembername(memberUsername);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="change-member-modal-overlay-new" onClick={onClose}>
                <div className="change-member-modal-content-new" onClick={(e) => e.stopPropagation()}>
                    <div className="change-member-modal-header-new">
                        <h5>Select a Member</h5>
                        <button className="change-member-close-button-new" onClick={onClose}>X</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="change-member-search-input-new"
                    />
                    <ul className="change-member-list-new">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <li
                                    key={member.userId}
                                    onClick={() => handleMemberClick(member.userId, member.firstName)}
                                    className={`change-member-list-item ${member.userId === selectedMemberId ? 'selected-member' : ''}`}
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

ChangeMemberModal.propTypes = {

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    task: PropTypes.shape({
        taskId: PropTypes.number.isRequired,
        taskName: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        assignedToUserId:PropTypes.string.isRequired,
        assignedUserLetter:PropTypes.string.isRequired,
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

export default ChangeMemberModal;
