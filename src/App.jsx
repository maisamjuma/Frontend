import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    useEffect(() => {
        const styledTitle = document.getElementById('styled-title');
        if (styledTitle) {
            document.title = styledTitle.innerHTML;
        }
    }, []);

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setLoggedInUser(user);
    }
    const handleLogout = () => {
        setIsAuthenticated(false);
        setLoggedInUser(null);
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/main" />
                    ) : (
                        <Login onLogin={handleLogin} />
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
                                <Route path="notifications" element={<Notification loggedInUser={loggedInUser}/>}/> {/* Add Notification route */}
                                <Route path=":projectName" element={<Projects/>}/> {/* Dynamic route for projects */}
                                <Route path="edit-user/:userId" element={<EditUser />} /> {/* Add this route for editing users */}
                                <Route path="workspace/:projectName/*" element={<Workspace/>}/>
                                {/*<Route path="/" element={<ListUser />} />*/}
                                {/*<Route path="listuser" element={<ListUser />} />*/}
                                {/*<Route path="user" element={<AddUser />} />*/}
                                {/*<Route path=":projectName" element={<Projects />} />*/}
                                {/*<Route path="workspace/:projectName/*" element={<Workspace isVisible={true} />} />*/}
                            </Routes>
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

Workspace.propTypes = {
    isVisible: PropTypes.bool.isRequired, // Ensure this matches the actual prop type
};

export default App;