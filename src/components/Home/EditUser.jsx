import React, {useEffect, useState} from 'react';
import UserService from '../../Services/UserService.js';
import RoleService from "../../Services/RoleService.js";
import {useNavigate, useParams} from 'react-router-dom';
import './EditUser.css';

const EditUser = () => {
    const {userId} = useParams();
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [functionalRoleId, setFunctionalRoleId] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserService.getUserById(userId);
                const user = response.data;

                setEmail(user.email);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setFunctionalRoleId(user.functionalRoleId);
                setIsTeamLeader(user.isTeamLeader);
                setIsAdmin(user.isAdmin);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        RoleService.getAllRoles().then(response => {
            setRoles(response.data.map(role => ({
                funcRoleId: role.funcRoleId,
                roleName: role.roleName
            })));
        }).catch(error => {
            console.error("Error fetching roles", error);
        });
    }, []);

    const handleEmail = (e) => setEmail(e.target.value);
    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleRole = (e) => setFunctionalRoleId(e.target.value);
    const handleIsTeamLeader = (e) => {
        setIsTeamLeader(e.target.checked);
        if (e.target.checked) {
            setIsAdmin(false); // Uncheck isAdmin if isTeamLeader is checked
        }
    };

    const handleIsAdmin = (e) => {
        setIsAdmin(e.target.checked);
        if (e.target.checked) {
            setIsTeamLeader(false); // Uncheck isTeamLeader if isAdmin is checked
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const user = {
                    email,
                    firstName,
                    lastName,
                    functionalRoleId,
                    isTeamLeader,
                    isAdmin
                };

                await UserService.updateUser(userId, user);

                navigate('/main');
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = {...errors};

        if (!email.trim()) {
            errorsCopy.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
            errorsCopy.email = 'Email address is invalid';
            valid = false;
        } else {
            delete errorsCopy.email;
        }

        if (!firstName.trim()) {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        } else {
            delete errorsCopy.firstName;
        }

        if (!lastName.trim()) {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        } else {
            delete errorsCopy.lastName;
        }

        if (!functionalRoleId.trim()) {
            errorsCopy.role = 'Role is required';
            valid = false;
        } else {
            delete errorsCopy.role;
        }

        setErrors(errorsCopy);
        return valid;
    };

    return (
        <div className="full-screen-centerE">
            <div className="cardE">
                <h2 className="card-headerE">Edit User</h2>
                <div className="card-bodyE">
                    <form onSubmit={updateUser}>
                        <div className="form-rowE">
                            <div className=" mb-2 vertical-groupE">
                                <label className='form-labelE'>Email:</label>
                                <input
                                    type="email"
                                    placeholder="Enter Employee Email"
                                    name="email"
                                    value={email}
                                    className={`form-controlE ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={handleEmail}
                                />
                                {errors.email && <div className='invalid-feedbackE'>{errors.email}</div>}
                            </div>
                        </div>
                        <div className="form-rowE">
                            <div className="  mb-2 horizontal-groupE">
                                <label className='form-labelE'>First Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    name="firstName"
                                    value={firstName}
                                    className={`addUserInputE ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={handleFirstName}
                                />
                                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                            </div>
                            <div className=" mb-2 horizontal-group">
                                <label className='form-labelE'>Last Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    name="lastName"
                                    value={lastName}
                                    className={`addUserInputE ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={handleLastName}
                                />
                                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                            </div>
                            <div className=" mb-2 horizontal-group">
                                <label className='form-labelE'>Role:</label>
                                <select
                                    name="role"
                                    value={functionalRoleId}
                                    className={` addUserInputE ${errors.role ? 'is-invalid' : ''}`}
                                    onChange={handleRole}
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.funcRoleId} value={role.funcRoleId}>
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <div className='invalid-feedbackE'>{errors.role}</div>}
                            </div>
                        </div>
                        <div className="  mb-2">
                            <div className="checkbox-containerE">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isTeamLeader"
                                    checked={isTeamLeader}
                                    onChange={handleIsTeamLeader}
                                />
                                <label className='teamleaderlabelE'>Is Team Leader</label>

                            </div>
                        </div>
                        <div className=" mb-2">
                            <div className="checkbox-containerE">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={isAdmin}
                                    onChange={handleIsAdmin}
                                />
                                <label className='adminlabelE'>Is Admin</label>

                            </div>
                        </div>
                        <button className="btn-successE">Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
