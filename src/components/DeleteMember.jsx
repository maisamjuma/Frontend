import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './DeleteMember.css';
import RoleService from '../Services/RoleService'; // Make sure you have this service to fetch role names

const DeleteMember = ({
                          members = [],
                          userDetails = [],
                          selectedMembers = [],
                          onMemberClick,
                      }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Separate search term state
    const [filteredMembers, setFilteredMembers] = useState([]); // State for filtered members
    const [rolesMap, setRolesMap] = useState({}); // State to store roleId to roleName map

    // Create a map of userDetails for quick lookup
    const userDetailMap = userDetails.reduce((acc, user) => {
        acc[user.userId] = user;
        return acc;
    }, {});

    useEffect(() => {
        const fetchRoleNames = async () => {
            const uniqueRoleIds = [...new Set(userDetails.map(user => user.functionalRoleId))];

            const rolesPromises = uniqueRoleIds.map(async (roleId) => {
                try {
                    const response = await RoleService.getRoleById(roleId);
                    return { roleId, roleName: response.data.roleName };
                } catch (error) {
                    console.error(`Error fetching role for roleId: ${roleId}`, error);
                    return { roleId, roleName: 'Unknown Role' };
                }
            });

            const roles = await Promise.all(rolesPromises);
            const newRolesMap = roles.reduce((acc, role) => {
                acc[role.roleId] = role.roleName;
                return acc;
            }, {});

            setRolesMap(newRolesMap);
            setFilteredMembers(members); // Initialize filtered members with all members
        };

        fetchRoleNames();
    }, [userDetails, members]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = members.filter((member) => {
            const user = userDetailMap[member.userId];
            return user && (user.firstName.toLowerCase().includes(term) || user.lastName.toLowerCase().includes(term));
        });
        setFilteredMembers(filtered);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar w-100"
            />
            {filteredMembers.length === 0 ? (
                <div>No members to delete.</div>
            ) : (
                filteredMembers.map((member) => {
                    const user = userDetailMap[member.userId];

                    if (!user) {
                        return <div key={member.userId}>Loading user details...</div>;
                    }

                    const roleName = rolesMap[user.functionalRoleId] || 'Loading role...';

                    return (
                        <div
                            key={member.userId}
                            className={`member-item ${selectedMembers.includes(member.userId) ? 'selected' : ''}`}
                            onClick={() => onMemberClick(member)}
                        >
                            <div className="member-name">{user.firstName} {user.lastName}</div>
                            <div className="member-role">{roleName}</div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

DeleteMember.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            projectMemberId: PropTypes.number.isRequired,
            projectId: PropTypes.number.isRequired,
            joinedAt: PropTypes.string.isRequired,
        })
    ),
    userDetails: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            functionalRoleId: PropTypes.string.isRequired,
        })
    ),
    selectedMembers: PropTypes.arrayOf(PropTypes.number),
    onMemberClick: PropTypes.func.isRequired,
};

export default DeleteMember;
