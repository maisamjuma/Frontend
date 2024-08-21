import React, { useState} from 'react';
import PropTypes from 'prop-types';
import './ChangeMemberModal.css';
// import { useLocation } from 'react-router-dom';

const ChangeMemberModal = ({ availableMembers = [], selectedMember, onClose, onSelectMember ,projectId, projectDescription, projectMembers, setProjectId, setProjectDescription, setProjectMembers}) => {
    const [searchTerm, setSearchTerm] = useState('');
    // const location = useLocation();
    // const [projectId, setProjectId] = useState(null);
    // const [projectDescription, setProjectDescription] = useState(null);
    // const [projectMembers, setProjectMembers] = useState([]); // State for project members
    console.log("projectId:",projectId,"projectDescription:",projectDescription,"projectMembers:",projectMembers);

    availableMembers=projectMembers;
    // useEffect(() => {
    //     console.log("chinaaaaa","memberes:");
    //
    //     if (location.state) {
    //         const { projectId, projectDescription,projectMembers } = location.state;
    //         setProjectId(projectId);
    //         setProjectDescription(projectDescription); // Make sure this is correctly set
    //         setProjectMembers(projectMembers); // Set project members here
    //         console.log("chinaaaaa",projectId,projectDescription,"memberes:",projectMembers);
    //     }
    // }, [location.state]);

    // console.log("Project Description:", projectDescription);
    // console.log("Project ID:", projectId);
    // console.log("Project Members:", projectMembers);
    //
    // console.log('Available Members:', availableMembers);
    // console.log('Search Term:', searchTerm);

    // console.log("projectId:",projectId,"projectDescription:",projectDescription,"projectMembers:",projectMembers);


    const filteredMembers = availableMembers.filter(member =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())

    );



    const handleMemberClick = (memberId) => {
        onSelectMember(memberId);
        onClose();
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
                </div>
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="change-member-search-input-new"
                />
                <ul>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <li
                                key={member.id}
                                onClick={() => handleMemberClick(member.id)}
                                className={member.id === selectedMember ? 'selected-member' : ''}
                            >
                                {member.username}
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
        id: PropTypes.number.isRequired, // or PropTypes.string if ids are strings
        username: PropTypes.string.isRequired,
    })).isRequired,
    selectedMember: PropTypes.number, // or PropTypes.string if ids are strings
    onClose: PropTypes.func.isRequired,
    onSelectMember: PropTypes.func.isRequired,

    projectId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    projectDescription: PropTypes.string,
    projectMembers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired, // or PropTypes.string if ids are strings
        username: PropTypes.string.isRequired,
    })),
    setProjectId: PropTypes.func.isRequired,
    setProjectDescription: PropTypes.func.isRequired,
    setProjectMembers: PropTypes.func.isRequired,
};

export default ChangeMemberModal;
