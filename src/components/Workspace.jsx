import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './Workspace.css';
import Backend from './Backend';
import Frontend from './Frontend';
import QA from './QA';

const Workspace = () => {
    return (
        <div className="layout">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold" href="#">New Task Hub</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/main/workspace">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/main/workspace/backend">Backend</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/main/workspace/frontend">Frontend</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/main/workspace/qa">QA</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            <div className="sidebar">
                <h2>New Workspace</h2>
                <ul>
                    <li>Members</li>
                </ul>
            </div>
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
