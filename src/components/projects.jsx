import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import './projects.css';
import Members from './Member/Members.jsx';
import AddMember from './AddMember.jsx';
import MemberProfile from './MemberProfile.jsx';
import DeleteMember from './DeleteMember.jsx';
import defaultProjectIcon from '../assets/projectIcon.png';
import ProjectMemberService from '../Services/ProjectMemberService';
import UserService from '../Services/UserService.js';
import {userIsAdmin, userIsTeamLeader} from '../utils/authUtils'; // Import the utility function

const Projects = () => {
    const {projectName} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {projectId, projectDescription} = location.state || {};

    const [image, setImage] = useState(defaultProjectIcon);
    const [showProfile, setShowProfile] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [showMembersOnly, setShowMembersOnly] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const userRoleIsAdmin = userIsAdmin(); // Check if the user is an admin
    const userRoleIsTeamLeader = userIsTeamLeader(); // Check if the user is an admin

    const containerRef = useRef(null);

    useEffect(() => {
        const fetchProjectMembers = async () => {
            try {
                const response = await ProjectMemberService.getProjectMembersByProjectId(projectId);
                setProjectMembers(response.data);
            } catch (error) {
                console.error('Error fetching project members:', error);
            }
        };

        fetchProjectMembers();
    }, [projectId]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetailsArray = await Promise.all(
                    projectMembers.map(async (member) => {
                        const response = await UserService.getUserById(member.userId);
                        return response.data;
                    })
                );
                setUserDetails(userDetailsArray);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (projectMembers.length > 0) {
            fetchUserDetails();
        }
    }, [projectMembers]);

    const handleDeleteMode = () => {
        setIsDeleting(true);
        setShowDeletePopup(true);
    };
    const handleCancelDelete = () => {
        setIsDeleting(false);
        setShowDeletePopup(false);
    };


    const handleDeleteMembers = async () => {
        const projectMemberIdsToDelete = projectMembers
            .filter((member) => selectedMembers.includes(member.userId))
            .map((member) => member.projectMemberId);

        try {
            for (const projectMemberId of projectMemberIdsToDelete) {
                await ProjectMemberService.deleteMemberFromProject(projectMemberId, projectId);
            }
            setProjectMembers((prevMembers) =>
                prevMembers.filter((member) => !projectMemberIdsToDelete.includes(member.projectMemberId))
            );
        } catch (error) {
            console.error('Error deleting members:', error);
        }

        setSelectedMembers([]);
        setIsDeleting(false);
        setShowDeletePopup(false);
    };

    const handleCheckboxChange = (userId) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => document.getElementById('fileInput').click();

    const handleDeleteImageClick = () => setImage(defaultProjectIcon);

    const navigateToWorkspace = () => {
        navigate(`/main/workspace/${projectName}`, {
            state: {projectDescription, projectId, projectMembers},
        });
    };

    return (
        <div className="d-flex flex-row gap-5" ref={containerRef}>
            <nav className="secondary-navbarForPro d-flex flex-row gap-5">
                <ul className="secondary-navbarForPro">
                    {(userRoleIsAdmin || userRoleIsTeamLeader ) && (
                        <li>
                            <button
                                className={`secondary-nav-button ${!showMembersOnly ? 'active' : ''}`}
                                onClick={() => {
                                    setShowMembersOnly(false);
                                    setIsEditing(true);
                                    setIsDeleting(false);
                                }}
                            >
                                {isEditing ? 'Edit Member' : 'Edit Member'}
                            </button>
                        </li>
                    )}
                    {(userRoleIsAdmin || userRoleIsTeamLeader ) && (
                        <li>
                            <button
                                className={`secondary-nav-button ${isDeleting ? 'active' : ''}`}
                                onClick={handleDeleteMode}
                            >
                                Delete Members
                            </button>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="projectscon">
                <div className="flex-row align-items-center">
                    <figure className="projectIcon">
                        <img
                            src={image}
                            alt="Project Icon"
                            width={90}
                            height={90}
                            onClick={handleImageClick}
                            style={{cursor: 'pointer'}}
                        />
                        {image !== defaultProjectIcon && (
                            <button className="delete-image-button" onClick={handleDeleteImageClick}>
                                &times;
                            </button>
                        )}
                    </figure>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: 'none'}}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <h2 className="projectTitle">{projectName}</h2>
                </div>

                <div className="descriptionPar">{projectDescription}</div>
                <button className="btn-primaryForProject" onClick={navigateToWorkspace}>
                    Go to Workspace
                </button>
            </div>

            <div className="projectsconM">
                <div className="flex-row align-items-center">
                    {showMembersOnly ? (
                        <Members
                            members={projectMembers}
                            userDetails={userDetails}
                            isDeleting={isDeleting}
                            onMemberClick={(member) => {
                                if (!isDeleting) {
                                    setShowProfile(member);
                                }
                            }}
                        />
                    ) : isEditing ? (
                        <AddMember
                            projectId={projectId}
                            onAddMember={async (newMembers) => {
                                for (const member of newMembers) {
                                    try {
                                        const response = await ProjectMemberService.addMemberToProject({
                                            projectId,
                                            userId: member.userId,
                                        });
                                        setProjectMembers((prevMembers) => [...prevMembers, response.data]);
                                    } catch (error) {
                                        console.error('Error adding members to the project:', error);
                                    }
                                }
                                setShowMembersOnly(true);
                            }}
                            onSave={() => setShowMembersOnly(true)}
                        />
                    ) : null}
                </div>

                {showProfile && (
                    <MemberProfile
                        member={showProfile}
                        userDetails={userDetails}
                        onClose={() => setShowProfile(null)}
                    />
                )}
            </div>

            {showDeletePopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="mb-1  d-flex flex-row gap-5 ">
                            <h3>Delete Member</h3>
                            <button className="titleAndx" onClick={handleCancelDelete}>X</button>
                        </div>


                        <div className="serachForPopup">

                            <input
                                type="text"
                                placeholder="Search members..."
                                className="search-bar w-100 "
                            />

                        </div>

                        <DeleteMember
                            members={projectMembers}
                            userDetails={userDetails}
                            selectedMembers={selectedMembers}
                            onMemberClick={(member) => handleCheckboxChange(member.userId)}
                            onCheckboxChange={handleCheckboxChange}

                        />

                        <button className="secondary-nav-button" onClick={handleDeleteMembers}>
                            Confirm Deletion
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
};

export default Projects;
