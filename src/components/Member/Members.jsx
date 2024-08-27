import React from 'react';
import PropTypes from 'prop-types';
import './Members.css';

const Members = ({ members, userDetails, isDeleting, onCheckboxChange, selectedMembers, onMemberClick }) => {
    // Create a map of userDetails for quick lookup
    const userDetailMap = userDetails.reduce((acc, user) => {
        acc[user.userId] = user;
        return acc;
    }, {});

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

                    return (
                        <div
                            key={member.userId}
                            className="member-item"
                            onClick={() => onMemberClick(member)} // Ensure this is passing the full member object
                        >
                            {isDeleting && (
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member.userId)}
                                        onChange={() => onCheckboxChange(member.userId)}
                                    />
                                </div>
                            )}
                            <div className="member-name">{user.username}</div>
                            <div className="member-role">{user.role}</div>
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
            role: PropTypes.number.isRequired,
        })
    ).isRequired,
    isDeleting: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    selectedMembers: PropTypes.arrayOf(PropTypes.number).isRequired,
    onMemberClick: PropTypes.func.isRequired,
};

export default Members;