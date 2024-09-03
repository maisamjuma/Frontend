import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './Members.css';
import RoleService from "../../Services/RoleService.js";

const Members = ({
                     members,
                     userDetails,
                     selectedMembers = [],
                     onMemberClick
                 }) => {

    const [rolesMap, setRolesMap] = useState({});

    const userDetailMap = userDetails.reduce((acc, user) => {
        acc[user.userId] = user;
        return acc;
    }, {});

    useEffect(() => {
        const fetchRoleNames = async () => {
            const uniqueRoleIds = [...new Set(userDetails.map(user => user.functionalRoleId))];

            const rolesPromises = uniqueRoleIds.map(async (functionalRoleId) => {
                try {
                    const response = await RoleService.getRoleById(functionalRoleId);
                    return {functionalRoleId, roleName: response.data.roleName};
                } catch (error) {
                    console.error(`Error fetching role for roleId: ${functionalRoleId}`, error);
                    return {functionalRoleId, roleName: 'Unknown Role'};
                }
            });

            const roles = await Promise.all(rolesPromises);
            const newRolesMap = roles.reduce((acc, role) => {
                acc[role.functionalRoleId] = role.roleName; // Correctly map functionalRoleId to roleName
                return acc;
            }, {});

            setRolesMap(newRolesMap);
        };

        fetchRoleNames();
    }, [userDetails]);

    return (
        <div className="member-list">
            {members.length === 0 ? (
                <div>No members to display.</div>
            ) : (
                members.map(member => {
                    const user = userDetailMap[member.userId];

                    if (!user) {
                        return <div key={member.userId}>Loading user details...</div>;
                    }

                    const roleName = rolesMap[user.functionalRoleId] || 'Loading role...'; // Correct lookup

                    return (
                        <div
                            key={member.userId}
                            className={`member-item-on-project ${selectedMembers.includes(member.userId) ? 'selected' : ''}`}
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

Members.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            projectMemberId: PropTypes.number.isRequired,
            projectId: PropTypes.number.isRequired,
            joinedAt: PropTypes.string.isRequired,
        })
    ).isRequired,
    userDetails: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            functionalRoleId: PropTypes.number.isRequired, // Make sure this is functionalRoleId
        })
    ).isRequired,
    selectedMembers: PropTypes.arrayOf(PropTypes.number),
    onMemberClick: PropTypes.func.isRequired,
};

export default Members;
