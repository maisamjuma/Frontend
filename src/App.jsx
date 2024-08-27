import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useRoutes } from 'react-router-dom';
import Projects from './components/projects';
import Workspace from './components/Workspace';
import User from './components/User';
import Layout from './components/Layout/Layout.jsx';
import OldLogin from './components/Login/Login.jsx'; // old login
import ListUser from './components/ListUser/ListUser.jsx';
import Notification from './components/Notification.jsx';

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

    const routesArray = [
        {
            path: "/login",
            element: isAuthenticated ? <Navigate to="/main" /> : <OldLogin onLogin={handleLogin} />,
        },
        {
            path: "/register",
            element: <Navigate to="/main" />, // Adjust as needed
        },
        {
            path: "/main/*",
            element: isAuthenticated ? (
                <Layout onLogout={handleLogout}>
                    <Routes>
                        <Route path="/" element={<ListUser />} />
                        <Route path="ListUser" element={<ListUser />} />
                        <Route path="User" element={<User />} />
                        <Route path="notifications" element={<Notification loggedInUser="JohnDoe" users={["Alice", "Bob", "Charlie"]} />} />
                        <Route path=":projectName" element={<Projects />} />
                        <Route path="workspace/:projectName/*" element={<Workspace />} />
                    </Routes>
                </Layout>
            ) : (
                <Navigate to="/login" />
            ),
        },
        {
            path: "*",
            element: <Navigate to="/login" />,
        },
    ];

    let routesElement = useRoutes(routesArray);

    return (
        <div className="w-full h-screen flex flex-col">
            {routesElement}
        </div>
    );
}

export default App;
