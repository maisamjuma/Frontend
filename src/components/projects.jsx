import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './projects.css';
import Members from "./Member/Members.jsx";
import AddMember from "./AddMember.jsx";

const Projects = () => {
    const navigate = useNavigate();
    const { projectName } = useParams();
    const location = useLocation();
    const { projectDescription } = location.state || {};
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
        { id: 1, name: 'Maisam', role: 'Frontend Developer' },
        { id: 2, name: 'Osaid', role: 'Backend Developer' },
        { id: 3, name: 'Rami', role: 'QA Engineer' },
        { id: 4, name: 'Ali', role: 'Frontend Developer' },
        { id: 5, name: 'Reema', role: 'Backend Developer' },
        { id: 6, name: 'Mona', role: 'Frontend Developer' },
        { id: 7, name: 'Daher', role: 'Backend Developer' },
    ];

    const handleAddMember = (newMembers) => {
        const updatedMembers = [...projectMembers, ...newMembers.filter(newMember => !projectMembers.some(member => member.id === newMember.id))];
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
            state: { projectDescription, projectMembers }
        });
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setShowDeletePopup(false);
            setIsDeleting(false);
            setShowMembersOnly(true);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <nav className="secondary-navbar">
                <ul className="secondary-nav">
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

            <div className="d-flex flex-row align-items-center gap-5">
                <div className="projectscon">
                    <div className="project-header">
                        <div className="flex-row">
                            <figure className="projectImg">
                                <img src="/icons.png" alt="Project Logo" />
                            </figure>
                            <h1>{projectName}</h1>
                        </div>
                    </div>
                    <p>{projectDescription}</p>
                    <button className="secondary-nav-button" onClick={handleButtonClick}>Go to Workspace</button>
                </div>
                <div className="d-flex flex-row gap-5 overflow-x-hidden">
                    {showMembersOnly ? (
                        <Members
                            members={projectMembers}
                            isDeleting={isDeleting}
                            onCheckboxChange={handleCheckboxChange}
                            selectedMembers={selectedMembers}
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
        </div>
    );
};

export default Projects;
