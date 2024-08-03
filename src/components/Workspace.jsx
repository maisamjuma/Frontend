import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './Workspace.css';
import Backend from './Backend';
import Frontend from './Frontend';
import QA from './QA';
import Navbar from './Navbar';



const Workspace = () => {
    return (
        <div className="layout">
            <Navbar />


            <nav className="secondary-navbar">
                <ul className="secondary-nav">
                    <li className="secondary-nav-item">
                        <Link className="nav-link" to="/main/workspace/backend">Backend</Link>
                    </li>
                    <li className="secondary-nav-item">
                        <Link className="nav-link" to="/main/workspace/frontend">Frontend</Link>
                    </li>
                    <li className="secondary-nav-item">
                        <Link className="nav-link" to="/main/workspace/qa">QA</Link>
                    </li>
                </ul>
            </nav>

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<div><h1>Home</h1><p>This is the home content.</p></div>} />
                    <Route path="backend" element={<Backend />} />
                    <Route path="frontend" element={<Frontend />} />
                    <Route path="qa" element={<QA />} />
                </Routes>
            </div>
        </div>
    );
};

export default Workspace;
