// Projects.jsx
import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import './projects.css';
import Members from "./Member/Members.jsx";
import AddMember from "./AddMember.jsx";
import MemberProfile from "./MemberProfile.jsx";
import defaultProjectIcon from '../assets/projectIcon.png';
import ChangeMemberModal from "./ChangeMemberModal.jsx";
import ProjectMemberService from '../Services/ProjectMemberService';
import UserService from "../Services/UserService.js"; // Import your service

const Projects = () => {
    const {projectName} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {projectId, projectDescription} = location.state || {};

    const [image, setImage] = useState(defaultProjectIcon);
    const [showProfile, setShowProfile] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [userDetails, setuserDetails] = useState([]);
    const [showMembersOnly, setShowMembersOnly] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [availableMembers, setAvailableMembers] = useState([]); // State for available members
    const [selectedMemberForChange, setSelectedMemberForChange] = useState(null);
    const [showChangeMemberModal, setShowChangeMemberModal] = useState(false); // State for modal visibility

    const containerRef = useRef(null);


    useEffect(() => {
        // Initialize available members here
        setAvailableMembers([
            {id: 1, username: 'Maisam', email: 'maisam@example.com', password: 'password123', firstName: 'Maisam', lastName: 'Doe', role: 'Frontend Developer'},
            {id: 2, username: 'Osaid', email: 'osaid@example.com', password: 'password123', firstName: 'Osaid', lastName: 'Doe', role: 'Backend Developer'},
            {id: 3, username: 'Rami', email: 'rami@example.com', password: 'password123', firstName: 'Rami', lastName: 'Doe', role: 'QA Engineer'},
            {id: 4, username: 'Ali', email: 'ali@example.com', password: 'password123', firstName: 'Ali', lastName: 'Doe', role: 'Frontend Developer'},
            {id: 5, username: 'Reema', email: 'reema@example.com', password: 'password123', firstName: 'Reema', lastName: 'Doe', role: 'Backend Developer'},
            {id: 6, username: 'Mona', email: 'mona@example.com', password: 'password123', firstName: 'Mona', lastName: 'Doe', role: 'Frontend Developer'},
            {id: 7, username: 'Daher', email: 'daher@example.com', password: 'password123', firstName: 'Daher', lastName: 'Doe', role: 'Backend Developer'},
            {id: 8, username: 'samarah', email: 'samarah@example.com', password: 'password123', firstName: 'Daher', lastName: 'Doe', role: 'Backend Developer'},
            {id: 9, username: 'Mohammad', email: 'Mohammad@example.com', password: 'password123', firstName: 'Mohammad', lastName: 'Doe', role: 'Backend Developer'},
        ]);
    }, []);
    useEffect(() => {
        const fetchProjectMembers = async () => {
            try {
                const response = await ProjectMemberService.getProjectMembersByProjectId(projectId);
                console.log('Fetched project members:', response.data); // Debugging log
                setProjectMembers(response.data); // Ensure this data matches the expected structure
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
                setuserDetails(userDetailsArray);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (projectMembers.length > 0) {
            fetchUserDetails();
        }
    }, [projectMembers]);




    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (location.state && location.state.projectMembers) {
            console.log("location.state.projectMembers:", location.state.projectMembers)
            setProjectMembers(location.state.projectMembers);
        }
    }, [location.state]);


    const handleMemberClick = (member) => {
        if (!isDeleting) {
            setShowProfile(member);
        }
    };

    const handleCloseProfile = () => {
        setShowProfile(null);
    };

    const handleAddMember = async (newMembers) => {


        for (const member of newMembers) {
            try {
                const response = await ProjectMemberService.addMemberToProject({
                    projectId: projectId,
                    userId: member.userId
                });
                // Optionally, update the member object to include the projectMemberId
                const {projectMemberId} = response.data;
                console.log(projectMemberId);

                console.log({
                    projectId: projectId,
                    userId: member.userId
                });

                console.log(response.data);


                setProjectMembers(prevMembers => [
                    ...prevMembers,
                    response.data,
                ]);


            } catch (error) {
                console.error('Error adding members to the project:', error.response?.data || error.message);
            }


        }


    };


    const handleSaveMembers = () => {
        setIsEditing(false);
        setShowMembersOnly(true);
    };

    const handleDeleteMode = () => {
        setShowDeletePopup(true);
        setIsDeleting(true);
        setShowMembersOnly(false);
        setIsEditing(false);
    };

    const handleCheckboxChange = (memberId) => {
        console.log('Checkbox changed for memberId:', memberId); // Debugging line
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(memberId)
                ? prevSelected.filter(id => id !== memberId)
                : [...prevSelected, memberId]
        );
    };


    const handleSaveDeletion = async () => {
        console.log('Selected members for deletion (userIds):', selectedMembers); // Debugging line

        // Map the selected userIds to their corresponding projectMemberIds
        const projectMemberIdsToDelete = projectMembers
            .filter(member => selectedMembers.includes(member.userId))
            .map(member => member.projectMemberId);

        // Update the project members state by removing those selected
        const updatedMembers = projectMembers.filter(
            member => !projectMemberIdsToDelete.includes(member.projectMemberId)
        );
        setProjectMembers(updatedMembers);
        setSelectedMembers([]);

        try {
            for (const projectMemberId of projectMemberIdsToDelete) {
                if (projectMemberId) { // Ensure projectMemberId is not undefined
                    console.log('Deleting member with projectMemberId:', projectMemberId); // Debugging line
                    await ProjectMemberService.deleteMemberFromProject(projectMemberId, projectId);
                } else {
                    console.error('ProjectMember ID is undefined'); // Log error if ID is undefined
                }
            }
        } catch (error) {
            console.error('Error deleting members:', error);
        }

        setIsDeleting(false);
        setShowMembersOnly(true);
        setShowDeletePopup(false);
    };


    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`, {
            state: {projectDescription, projectId, projectMembers}
        });
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setShowMembersOnly(true);
        }
    };

    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteClick = () => {
        setImage(defaultProjectIcon);
    };

    const handleSelectMember = (memberId) => {
        setSelectedMemberForChange(memberId);
        setShowChangeMemberModal(true);
    };

    useEffect(() => {
        console.log("showMembersOnly changed:", showMembersOnly);
        console.log("isDeleting changed:", isDeleting);
        console.log("projectMembers changed:", projectMembers);
    }, [showMembersOnly, isDeleting, projectMembers]);

    return (
        <div className="d-flex flex-row gap-5" ref={containerRef}>
            <nav className="secondary-navbar">
                <ul className="secondary-nav d-flex flex-row gap-5">
                    <li>
                        <button
                            className={`secondary-nav-button ${!showMembersOnly ? 'active' : ''}`}
                            onClick={() => {
                                setShowMembersOnly(false);
                                setIsEditing(true);
                                setIsDeleting(false);
                            }}
                        >
                            {isEditing ? "Edit Member" : "Add Member"}
                        </button>
                    </li>
                    <li>
                        <button
                            className={`secondary-nav-button ${isDeleting ? 'active' : ''}`}
                            onClick={handleDeleteMode}
                        >
                            Delete Members
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="projectscon">
                <div className="flex-row align-items-center">
                    <figure className="projectIcon">
                        <img
                            src={image}
                            alt="Project Icon"
                            width={100}
                            height={100}
                            onClick={handleImageClick}
                            style={{cursor: 'pointer'}}
                        />
                        {image !== defaultProjectIcon && (
                            <button
                                className="delete-image-button"
                                onClick={handleDeleteClick}
                            >
                                &times;
                            </button>
                        )}
                    </figure>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: 'none'}}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <h1>{projectName}</h1>
                </div>

                <p>{projectDescription}</p>
                <button className="btn btn-primary" onClick={handleButtonClick}>Go to Workspace</button>
            </div>

            <div className="projectsconM">
                <div className="flex-row align-items-center">
                    {showMembersOnly ? (
                        <Members
                            members={projectMembers}
                            userDetails={userDetails}
                            isDeleting={isDeleting}
                            onCheckboxChange={handleCheckboxChange}
                            selectedMembers={selectedMembers}
                            onMemberClick={handleMemberClick}
                        />
                    ) : (
                        <>
                            {isEditing ? (
                                <AddMember
                                    projectId={projectId}  // Pass projectId here
                                    //UserId={UserId}
                                    onAddMember={handleAddMember}
                                    onSave={handleSaveMembers}
                                    isDeleting={isDeleting}
                                    onDeleteMode={handleSaveDeletion}
                                />
                            ) : (
                                <Members
                                    members={projectMembers}
                                    userDetails={userDetails}
                                    isDeleting={isDeleting}
                                    onCheckboxChange={handleCheckboxChange}
                                    selectedMembers={selectedMembers}
                                    onMemberClick={handleMemberClick}
                                />
                            )}
                        </>
                    )}
                </div>

                {showChangeMemberModal && (
                    <ChangeMemberModal
                        availableMembers={availableMembers}
                        selectedMemberId={selectedMemberForChange}
                        onClose={() => setShowChangeMemberModal(false)}
                        onSelectMember={handleSelectMember}
                    />
                )}
                {showDeletePopup && (
                    <div className="delete-popup">
                        <p>Are you sure you want to delete the selected members?</p>
                        <button onClick={handleSaveDeletion}>Yes</button>
                        <button onClick={() => setShowDeletePopup(false)}>No</button>
                    </div>
                )}
                {showProfile && (
                    <MemberProfile
                        member={showProfile}
                        userDetails={userDetails}
                        onClose={handleCloseProfile}
                    />
                )}
            </div>
        </div>
    );
};

export default Projects;
