import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Projects from './components/projects';
import Workspace from './components/Workspace';
import User from "./components/User";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import ListUser from "./components/ListUser/ListUser.jsx";
import Notification from "./components/Notification.jsx";
import HomePage from "./components/HomePage.jsx"; // Adjusted from Home to HomePage

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

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
                                <Route path="/" element={<HomePage />} /> {/* Changed from Home */}
                                <Route path="ListUser" element={<ListUser />} />
                                <Route path="User" element={<User />} />
                                <Route
                                    path="notifications"
                                    element={
                                        <Notification
                                            loggedInUser="JohnDoe" // Updated from Roaa Gh to JohnDoe
                                            users={[
                                                "Alice", "Bob", "Charlie"
                                            ]}
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
                                <Route path="notifications" element={<Notification loggedInUser="JohnDoe" users={["Alice", "Bob", "Charlie"]} />} />
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
    const routesArray = [
        {
            path: "/login",
            element: isAuthenticated ? <Navigate to="/old-login" /> : <Login onLogin={handleLogin} />,
        },
        {
            path: "/old-login",
            element: <OldLogin />, // Route to the old login screen
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/home",
            element: isAuthenticated ? <Home /> : <Navigate to="/login" />,
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
        <AuthProvider>
            <Header />
            <div className="w-full h-screen flex flex-col">
                {routesElement}
            </div>
        </AuthProvider>
    );
}

export default App;
