import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeMemberModal.css';
import UserService from "../Services/UserService.js";

const ChangeMemberModal = ({
                               availableMembers = [],
                               onSave,
                               onClose,
                               projectId,
                               projectDescription,
                               projectMembers,
                               setProjectId,
                               setProjectDescription,
                               setProjectMembers
                           }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [selectedMemberUsername, setSelectedMemberUsername] = useState('');
    const [userDetails, setUserDetails] = useState([]);

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
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (selectedMemberId) {
            onSave(selectedMemberId, selectedMemberUsername); // Pass selected member to parent
            onClose(); // Close modal after saving
        }
    };

    const handleMemberClick = (memberId, memberUsername) => {
        setSelectedMemberId(memberId);
        setSelectedMemberUsername(memberUsername);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="change-member-modal-overlay-new" onClick={onClose}>
            <div className="change-member-modal-content-new" onClick={(e) => e.stopPropagation()}>
                <div className="change-member-modal-header-new">
                    <h5>Select a Member</h5>
                    <button className="change-member-close-button-new" onClick={onClose}>X</button>
                    <button onClick={handleSave}>Save</button>
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
                                onClick={() => handleMemberClick(member.userId, member.username)}
                                className={`change-member-list-item ${member.userId === selectedMemberId ? 'selected-member' : ''}`}
                            >
                                <span className="member-initial-circle">
                                    {member.username.charAt(0).toUpperCase()}
                                </span>
                                {member.username} {member.lastName}
                            </li>
                        ))
                    ) : (
                        <li>No members found</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

ChangeMemberModal.propTypes = {
    availableMembers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
    })),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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
