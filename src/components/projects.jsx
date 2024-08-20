import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './projects.css';
import Members from "./Member/Members.jsx";
import AddMember from "./AddMember.jsx";
import MemberProfile from "./MemberProfile.jsx";
import defaultProjectIcon from '../assets/projectIcon.png';

const Projects = () => {
    const { projectName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { projectId, projectDescription } = location.state || {};

    const [image, setImage] = useState(defaultProjectIcon);
    const [showProfile, setShowProfile] = useState(null);
    const [projectMembers, setProjectMembers] = useState(
        JSON.parse(localStorage.getItem(projectName + '-members')) || []
    );
    const [showMembersOnly, setShowMembersOnly] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const containerRef = useRef(null);

    const availableMembers = [
        {id: 1, username: 'Maisam', email: 'maisam@example.com', password: 'password123', firstName: 'Maisam', lastName: 'Doe', role: 'Frontend Developer'},
        {id: 2, username: 'Osaid', email: 'osaid@example.com', password: 'password123', firstName: 'Osaid', lastName: 'Doe', role: 'Backend Developer'},
        {id: 3, username: 'Rami', email: 'rami@example.com', password: 'password123', firstName: 'Rami', lastName: 'Doe', role: 'QA Engineer'},
        {id: 4, username: 'Ali', email: 'ali@example.com', password: 'password123', firstName: 'Ali', lastName: 'Doe', role: 'Frontend Developer'},
        {id: 5, username: 'Reema', email: 'reema@example.com', password: 'password123', firstName: 'Reema', lastName: 'Doe', role: 'Backend Developer'},
        {id: 6, username: 'Mona', email: 'mona@example.com', password: 'password123', firstName: 'Mona', lastName: 'Doe', role: 'Frontend Developer'},
        {id: 7, username: 'Daher', email: 'daher@example.com', password: 'password123', firstName: 'Daher', lastName: 'Doe', role: 'Backend Developer'},
    ];

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMemberClick = (member) => {
        // Only show the profile if not in delete mode
        if (!isDeleting) {
            setShowProfile(member);
        }
    };

    const handleCloseProfile = () => {
        setShowProfile(null);
    };

    const handleAddMember = (newMembers) => {
        const updatedMembers = [
            ...projectMembers,
            ...newMembers.filter(newMember => !projectMembers.some(member => member.id === newMember.id))
        ];
        setProjectMembers(updatedMembers);
        localStorage.setItem(projectName + '-members', JSON.stringify(updatedMembers));
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
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(memberId)
                ? prevSelected.filter(id => id !== memberId)
                : [...prevSelected, memberId]
        );
    };

    const handleSaveDeletion = () => {
        const updatedMembers = projectMembers.filter(member => !selectedMembers.includes(member.id));
        setProjectMembers(updatedMembers);
        localStorage.setItem(projectName + '-members', JSON.stringify(updatedMembers));
        setSelectedMembers([]);
        setIsDeleting(false);
        setShowMembersOnly(true);
        setShowDeletePopup(false);
    };

    const handleButtonClick = () => {
        navigate(`/main/workspace/${projectName}`, {
            state: { projectDescription, projectId, projectMembers }
        });
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            // setShowDeletePopup(false);
            // setIsDeleting(false);
            setShowMembersOnly(true);
        }
    };

    const handleImageClick = () => {
        document.getElementById('fileInput').click(); // Trigger the file input click
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Update the image state
            };
            reader.readAsDataURL(file); // Convert the file to a base64 URL
        }
    };

    const handleDeleteClick = () => {
        setImage(defaultProjectIcon); // Reset the image to the initial icon
    };
    useEffect(() => {
        console.log("showMembersOnly changed:", showMembersOnly);
        console.log("isDeleting changed:", isDeleting);
        console.log("projectMembers changed:", projectMembers);

        // Other effect logic
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
                            style={{ cursor: 'pointer' }}
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
                        style={{ display: 'none' }}
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
                            isDeleting={isDeleting}
                            onCheckboxChange={handleCheckboxChange}
                            selectedMembers={selectedMembers}
                            onMemberClick={handleMemberClick} // Pass the click handler
                        />
                    ) : (
                        <>
                            {isEditing ? (
                                <AddMember
                                    availableMembers={availableMembers}
                                    onAddMember={handleAddMember}
                                    onSave={handleSaveMembers}
                                    isDeleting={isDeleting}
                                    onDeleteMode={handleSaveDeletion}
                                />
                            ) : (
                                <Members
                                    members={projectMembers}
                                    isDeleting={isDeleting}
                                    onCheckboxChange={handleCheckboxChange}
                                    selectedMembers={selectedMembers}
                                    onMemberClick={handleMemberClick} // Pass the click handler
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {showDeletePopup && (
                <div className="overlay show" onClick={handleClickOutside}>
                    <div className="delete-members-popup" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Members</h3>
                        <Members
                            members={projectMembers}
                            isDeleting={isDeleting}
                            onCheckboxChange={handleCheckboxChange}
                            selectedMembers={selectedMembers}
                            onMemberClick={handleMemberClick} // Pass the click handler
                        />
                        <button
                            onClick={handleSaveDeletion}
                            className="delete-members-button"
                        >
                            Save Deletion
                        </button>
                        <button
                            onClick={() => setShowDeletePopup(false)}
                            className="secondary-nav-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showProfile && !isDeleting && (
                <MemberProfile member={showProfile} onClose={handleCloseProfile} />
            )}
        </div>
    );
};

export default Projects;
