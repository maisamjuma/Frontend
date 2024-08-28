import React, {useEffect, useState} from 'react';
import './AddMember.css';
import UserService from "../Services/UserService.js";
//import ProjectMemberService from "../Services/ProjectMemberService.js"; // Import the service

// eslint-disable-next-line react/prop-types
const AddMember = ({ projectId,onAddMember, onSave, onDeleteMode, isDeleting }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableMembers, setAvailableMembers] = useState([]); // Initialize availableMembers state
    const [filteredMembers, setFilteredMembers] = useState([]); // Initialize filteredMembers state
    const [selectedMembers, setSelectedMembers] = useState([]); // Initialize selectedMembers state

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                setAvailableMembers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);


    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = availableMembers.filter((member) =>
            member.username.toLowerCase().includes(term)
        );
        setFilteredMembers(filtered);
    };

    const handleMemberClick = (member) => {
        if (selectedMembers.includes(member.userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== member.userId));
        } else {
            setSelectedMembers([...selectedMembers, member.userId]);
        }
    };


    const handleSave = async () => {
        if (onAddMember) {
            // console.log("hi",projectId);

            const membersToAdd = availableMembers.filter(member => selectedMembers.includes(member.userId));
            console.log("membersToAdd:",membersToAdd)

            // Loop through selected users and add each one to the project
            try {

                onAddMember(membersToAdd); // Optionally update the UI //users
                onSave(); // Close the modal or perform any additional actions
            } catch (error) {
                console.error('Error adding members to the project:', error);
            }
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
                <div className="mb-1  d-flex flex-row gap-5 ">
                    <h3>Edit Members</h3>
                    <button className="titleAndx" onClick={() => onSave(true)}>X</button>
                </div>
                <div className="serachForPopup ">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar w-100 "
                    />

                </div>
                <div className="member-list">
                    {availableMembers.map((member) => (
                        <div
                            key={member.userId}
                            className={`member-item ${selectedMembers.includes(member.userId) ? 'selected' : ''}`}
                            onClick={() => handleMemberClick(member)}
                        >
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