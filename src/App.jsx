import React, {useEffect, useState} from 'react';
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import Projects from './components/projects';
import Workspace from './components/Workspace';

import AddUser from "./components/Home/AddUser.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import ListUser from "./components/Home/ListUser/ListUser.jsx";
import EditUser from "./components/Home/EditUser.jsx"; // Import the EditUser component
import Notification from "./components/Notification.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import PropTypes from "prop-types";
import ProjectReport from "./components/ProjectReport.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState();
    // const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const styledTitle = document.getElementById('styled-title');
        if (styledTitle) {
            document.title = styledTitle.innerHTML;
        }
    }, []);

    //a debugging useEffect
    useEffect(() => {
        if (loggedInUser) {
            console.log("loggedInUser has been updated: ", loggedInUser);


            //just a test:
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log("user from the localStorage: ", user);
            }
        }
    }, [loggedInUser]);

    const handleLogin = (user) => {
        setIsAuthenticated(true);

        setLoggedInUser(user);
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Ensure user object is stringified

        // console.log("loggedInUser:       ", loggedInUser)
        // console.log("setLoggedInUser(user);", user)
    }

    const handleLogout = async () => {
        try {
            // Clear all local storage items
            localStorage.clear();
            sessionStorage.clear();

            setIsAuthenticated(false);
            setLoggedInUser(null)

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };


    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/main"/>
                    ) : (
                        <Login onLogin={handleLogin}/>
                    )
                }
            />
            <Route
                path="/main/*"
                element={
                    isAuthenticated ? (
                        <Layout onLogout={handleLogout}>
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="ListUser" element={<ListUser/>}/>
                                <Route path="AddUser" element={<AddUser/>}/>
                                <Route path="notifications" element={<Notification
                                    loggedInUser={loggedInUser}/>}/> {/* Add Notification route */}
                                <Route path=":projectName" element={<Projects/>}/> {/* Dynamic route for projects */}
                                <Route path="edit-user/:userId"
                                       element={<EditUser/>}/> {/* Add this route for editing users */}
                                <Route path="workspace/:projectName/*" element={<Workspace/>}/>
                                <Route path="ProjectReport/:projectId/*" element={<ProjectReport/>}/>
                                {/*<Route path="/" element={<ListUser />} />*/}
                                {/*<Route path="listuser" element={<ListUser />} />*/}
                                {/*<Route path="user" element={<AddUser />} />*/}
                                {/*<Route path=":projectName" element={<Projects />} />*/}
                                {/*<Route path="workspace/:projectName/*" element={<Workspace isVisible={true} />} />*/}
                            </Routes>
                        </Layout>
                    ) : (
                        <Navigate to="/login"/>
                    )
                }
            />
            <Route path="/" element={<Navigate to="/login"/>}/>
        </Routes>
    );
}

Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired, // Ensure this matches the actual prop type
};

export default App;