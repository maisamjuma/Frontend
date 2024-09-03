import React, {useEffect, useState} from 'react';
import './AddMember.css';
import UserService from "../Services/UserService.js";
import RoleService from "../Services/RoleService.js";
//import ProjectMemberService from "../Services/ProjectMemberService.js"; // Import the service

// eslint-disable-next-line react/prop-types
const AddMember = ({projectId, onAddMember, onSave, onDeleteMode, isDeleting}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableMembers, setAvailableMembers] = useState([]); // Initialize availableMembers state
    const [filteredMembers, setFilteredMembers] = useState([]); // Initialize filteredMembers state
    const [selectedMembers, setSelectedMembers] = useState([]); // Initialize selectedMembers state
    const [roleNames, setRoleNames] = useState({}); // Initialize roleNames state

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                const members = response.data;
                setAvailableMembers(members);
                setFilteredMembers(members);

                const roles = {};
                await Promise.all(members.map(async (member) => {
                    const roleResponse = await RoleService.getRoleById(member.functionalRoleId);
                    roles[member.userId] = roleResponse.data.roleName;
                }));
                setRoleNames(roles);
            } catch (error) {
                console.error('Error fetching users or roles: ', error);
            }
        }

        fetchUsers();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = availableMembers.filter((member) =>
            member.firstName.toLowerCase().includes(term) ||
            member.lastName.toLowerCase().includes(term)
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
            console.log("membersToAdd:", membersToAdd)

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
                    <h3>Add Members</h3>
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
                    {(searchTerm ? filteredMembers : availableMembers).map((member) => (
                        <div
                            key={member.userId}
                            className={`member-item ${selectedMembers.includes(member.userId) ? 'selected' : ''}`}
                            onClick={() => handleMemberClick(member)}
                        >
                            <div className="member-name">{member.firstName} {member.lastName}</div>
                            <div className="member-role">{roleNames[member.userId]}</div>
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