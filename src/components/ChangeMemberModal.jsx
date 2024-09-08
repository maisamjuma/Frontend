import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeMemberModal.css';
import UserService from "../Services/UserService.js";
import TaskService from "../Services/TaskService.js";
import BoardService from "../Services/BoardService.js";
import RoleService from "../Services/RoleService.js";

const ChangeMemberModal = ({
                               onSave,
                               onClose,
                               task,
                               boardId,
                               projectMembers,
                               setProjectMembers
                           }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [selectedMemberName, setSelectedMemberName] = useState('');
    const [userDetails, setUserDetails] = useState([]);
    const [boardName, setBoardName] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Fetch user details and board name
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsArray = await Promise.all(
                    projectMembers.map(async (member) => {
                        const response = await UserService.getUserById(member.userId);
                        const userData = response.data;

                        // Fetch the role name based on the role ID
                        if (userData.functionalRoleId) {
                            try {
                                const roleResponse = await RoleService.getRoleById(userData.functionalRoleId);
                                userData.roleName = roleResponse.data.roleName;
                            } catch (error) {
                                console.error('Error fetching role name:', error);
                            }
                        }

                        return userData;
                    })
                );

                // Apply role filter based on the board name
                const filteredUsers = userDetailsArray.filter(user =>
                    user.roleName === roleFilter
                );

                setUserDetails(filteredUsers);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchBoardName = async () => {
            try {
                const response = await BoardService.getBoardById(boardId);
                const fetchedBoardName = response.data.name;
                setBoardName(fetchedBoardName);

                // Set role filter based on board name
                setRoleFilter(fetchedBoardName);
            } catch (error) {
                console.error('Error fetching board name:', error);
            }
        };

        if (projectMembers.length > 0) {
            fetchUserDetails();
        }
        fetchBoardName();
    }, [projectMembers, boardId, roleFilter]);

    // Filter members based on search term
    const filteredMembers = userDetails.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        if (selectedMemberId) {
            console.log("selectedMemberId",selectedMemberId)
            try {
                const updatedTask = {
                    ...task,
                    assignedToUserId: selectedMemberId,
                };

                await TaskService.updateTask(task.taskId, updatedTask);

                // alert('Task assigned user updated successfully!');
                onSave(selectedMemberId, selectedMemberName);
                onClose();
            } catch (error) {
                console.error('Error updating task assigned user:', error);
                alert('There was an error updating the task assigned user. Please try again.');
            }
        }
    };

    const handleMemberClick = (memberId, memberUsername) => {
        setSelectedMemberId(memberId);
        setSelectedMemberName(memberUsername);
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
                                    {member.firstName} {member.lastName} - {member.roleName}
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
        assignedToUserId: PropTypes.string.isRequired,
        assignedUserLetter: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        taskDescription: PropTypes.string.isRequired,
    }),
    boardId: PropTypes.number.isRequired,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.number.isRequired,
        projectMemberId: PropTypes.number.isRequired,
        projectId: PropTypes.number.isRequired,
        joinedAt: PropTypes.string.isRequired,
    })),
    setProjectMembers: PropTypes.func.isRequired,
};

export default ChangeMemberModal;