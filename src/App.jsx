import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Login from './components/Login/Login.jsx';
import Project1 from './components/project1';
import ListUser from "./components/ListUser/ListUser.jsx";
import Workspace from './components/Workspace';
import User from "./components/User";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const styledTitle = document.getElementById('styled-title');
        if (styledTitle) {
            document.title = styledTitle.innerHTML;
        }
    }, []);

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
                                <Route path="/" element={<ListUser />} />
                                <Route path="ListUser" element={<ListUser />} />
                                <Route path="User" element={<User />} />
                                <Route path="project1" element={<Project1 />} />
                                <Route path="workspace/*" element={<Workspace />} />
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
