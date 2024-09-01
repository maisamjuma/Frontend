import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Link, useNavigate} from 'react-router-dom';
//import PropTypes from 'prop-types';
import './navbar.css';

const Navbar = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleDevTrackClick = (e) => {
        e.preventDefault();
        navigate('/login'); // Navigate to the Welcome page
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="dropdown">
                    <a className="navbar-brand fw-bold" href="#" role="button" id="dropdownMenuLink"
                       data-bs-toggle="dropdown" aria-expanded="false" onClick={handleDevTrackClick}>
                        <span className="DEV">DEV</span><span className="track">TRACK</span>
                    </a>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link"
                                  to="/main/notifications">Notifications</Link> {/* Updated Path */}
                        </li>
                        <li className="nav-link">Settings</li>

                    </ul>
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default Navbar;
