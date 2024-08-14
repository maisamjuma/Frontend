import React from 'react';
import PropTypes from 'prop-types';
import './Members.css';

const Members = ({ members, isDeleting, onCheckboxChange, selectedMembers }) => {
    return (
        <div className="member-list">
            {members.map(member => (
                <div key={member.id} className="member-item">
                    {isDeleting && (
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={selectedMembers.includes(member.id)}
                                onChange={() => onCheckboxChange(member.id)}
                            />
                        </div>
                    )}
                    <div className="member-name">{member.name}</div>
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
            name: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired
        })
    ).isRequired,
    isDeleting: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    selectedMembers: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default Members;
