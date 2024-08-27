import React from 'react';
import PropTypes from 'prop-types';
import './DeleteMember.css';

const DeleteMember = ({
                                 members = [], // Default to an empty array if members is undefined
                                 userDetails = [], // Default to an empty array if userDetails is undefined
                                 selectedMembers = [], // Default value
                                 onMemberClick,
                                 onCheckboxChange,
                             }) => {
    // Create a map of userDetails for quick lookup, only if userDetails is defined
    const userDetailMap = userDetails.reduce((acc, user) => {
        acc[user.userId] = user;
        return acc;
    }, {});

    return (
        <div className="delete-member-overlay">
            {members.length === 0 ? (
                <div>No members to delete.</div>
            ) : (
                members.map((member) => {
                    const user = userDetailMap[member.userId];

                    if (!user) {
                        return <div key={member.userId}>Loading user details...</div>;
                    }

                    return (
                        <div
                            key={member.userId}
                            className={`member-item ${selectedMembers.includes(member.userId) ? 'selected' : ''}`}
                            onClick={() => onMemberClick(member)}
                        >
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.userId)}
                                onChange={() => onCheckboxChange(member.userId)}
                            />
                            <div className="member-name">{user.username}</div>
                            <div className="member-role">{user.role}</div>
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
            role: PropTypes.string.isRequired, // Assuming role is a string, not a number
        })
    ),
    selectedMembers: PropTypes.arrayOf(PropTypes.number),
    onMemberClick: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default DeleteMember;
