import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <a href="/">
                    <img src="./favicon.ico" alt="Watt-App Logo" />
                </a>
                <h1>Watt App</h1>
            </div>
            <div className="navbar-links-wrapper">
                <ul className="navbar-links">
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
