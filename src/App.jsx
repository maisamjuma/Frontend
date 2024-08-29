import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Projects from './components/projects';
import Workspace from './components/Workspace';
import User from "./components/User";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import ListUser from "./components/ListUser/ListUser.jsx";
import Notification from "./components/Notification.jsx";
import HomePage from "./components/HomePage.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const styledTitle = document.getElementById('styled-title');
        if (styledTitle) {
            document.title = styledTitle.innerHTML;
        }
    }, []);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

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
                                <Route path="User" element={<User/>}/>
                                <Route path="notifications" element={<Notification loggedInUser="JohnDoe"  />}/> {/* Add Notification route */}
                                <Route path=":projectName" element={<Projects/>}/> {/* Dynamic route for projects */}
                                <Route path="workspace/:projectName/*" element={<Workspace/>}/>
                                <Route path="/" element={<ListUser />} />
                                <Route path="listuser" element={<ListUser />} />
                                <Route path="user" element={<User />} />
                                <Route
                                    path="notifications"

                                    element={
                                        <Notification
                                            loggedInUser="Roaa Gh"

                                        />
                                    }
                                />
                                <Route path=":projectName" element={<Projects />} />
                                <Route path="workspace/:projectName/*" element={<Workspace />} />
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

export default App;