import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ChangeMemberModal.css';

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

    // Use projectMembers if availableMembers is not provided
    const membersToDisplay = availableMembers.length > 0 ? availableMembers : projectMembers;

    const filteredMembers = membersToDisplay.filter(member =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        if (selectedMemberId) {
            onSave(selectedMemberId,selectedMemberUsername); // Pass selected member to parent
            console.log("onSave(memberUsername):",selectedMemberUsername)
            onClose(); // Close modal after saving
        }
    };

    const handleMemberClick = (memberId,memberUsername) => {
        console.log("Member clicked:", memberId);

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
                    <button onClick={handleSave}>hi</button>
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
                                key={member.id}
                                onClick={() => handleMemberClick(member.id,member.username)}
                                className={`change-member-list-item ${member.id === selectedMemberId ? 'selected-member' : ''}`}
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
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
    })),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired,
};

export default ChangeMemberModal;
