import React, { useState } from 'react';
import './AddMember.css';

// eslint-disable-next-line react/prop-types
const AddMember = ({ availableMembers, onAddMember, onSave, onDeleteMode, isDeleting }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(availableMembers);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = availableMembers.filter((member) =>
            member.username.toLowerCase().includes(term) // Update to 'username'
        );
        setFilteredMembers(filtered);
    };


    const handleMemberClick = (member) => {
        if (selectedMembers.includes(member.id)) {
            setSelectedMembers(selectedMembers.filter(id => id !== member.id));
        } else {
            setSelectedMembers([...selectedMembers, member.id]);
        }
    };

    const handleSave = () => {
        if (onAddMember) {
            const membersToAdd = availableMembers.filter(member => selectedMembers.includes(member.id));
            onAddMember(membersToAdd);
        }
        setSelectedMembers([]);
        onSave();
    };

    const handleSaveDeletion = () => {
        if (onDeleteMode) {
            onDeleteMode(selectedMembers);
            setSelectedMembers([]);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="d-flex flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar rounded"
                    />
                    <button className="m-0 pb-2 pt-2 fw-semibold" onClick={() => onSave(true)}>X</button>
                </div>
                <div className="member-list">
                    {filteredMembers.map((member) => (
                        <div
                            key={member.id}
                            className={`member-item ${selectedMembers.includes(member.id) ? 'selected' : ''}`}
                            onClick={() => handleMemberClick(member)}
                        >
                            {isDeleting && (
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    onChange={() => handleMemberClick(member)}
                                />
                            )}
                            <div className="member-name">{member.username}</div>
                            <div className="member-role">{member.role}</div>
                        </div>
                    ))}
                </div>
                {isDeleting ? (
                    <button className="secondary-nav-button" onClick={handleSaveDeletion}>Save Deletion</button>
                ) : (
                    <button className="secondary-nav-button" onClick={handleSave}>Save Members</button>
                )}
            </div>
        </div>
    );
};

export default AddMember;
