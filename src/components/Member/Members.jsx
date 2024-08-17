import React from 'react';
import PropTypes from 'prop-types';
import './Members.css';

const Members = ({ members, isDeleting, onCheckboxChange, selectedMembers, onMemberClick }) => {
    return (
        <div className="member-list">
            {members.map(member => (
                <div
                    key={member.id}
                    className="member-item"
                    onClick={() => onMemberClick(member)} // Ensure this is passing the full member object
                >
                    {isDeleting && (
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={() => onCheckboxChange(member.id)}
                            />
                        </div>
                    )}
                    <div className="member-name">{member.username}</div>
                    <div className="member-role">{member.role}</div>
                </div>
            ))}
        </div>
    );
};


Members.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired
        })
    ).isRequired,
    isDeleting: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    selectedMembers: PropTypes.arrayOf(PropTypes.number).isRequired,
    onMemberClick: PropTypes.func.isRequired // Add new prop
};

export default Members;
