import React, { useState } from 'react';

export default function Header({ setPage, isAuthenticated, onLogout }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const handleLinkClick = (e) => {
        setIsNavOpen(false);
        if (e.target.hash) {
            e.preventDefault();
            document.querySelector(e.target.hash).scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openSignIn = () => {
        setPage && setPage('signIn');
    };

    return (
        <header className={`header ${isNavOpen ? 'nav-open' : ''}`}>
            <div className="container nav-container">
                <a href="#" onClick={() => setPage && setPage('home')} className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#A067E4"/>
                        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    dynova
                </a>

                <nav className="main-nav">
                    <ul>
                        <li><a href="#why-us" className="nav-link" onClick={handleLinkClick}>Why Us</a></li>
                        <li><a href="#features" className="nav-link" onClick={handleLinkClick}>Features</a></li>
                        <li><a href="#" className="nav-link" onClick={handleLinkClick}>Integrations</a></li>
                        <li><a href="#" className="nav-link nav-link-soon" title="Coming Soon!">Payments</a></li>
                    </ul>
                </nav>

                <div className="nav-right">
                    {!isAuthenticated ? (
                        <button onClick={openSignIn} className="btn btn-login">Login</button>
                    ) : (
                        <button onClick={onLogout} className="btn btn-logout">Logout</button>
                    )}

                    <button className="btn-mobile-nav" onClick={toggleNav}>
                        <svg className="icon-mobile-nav" name="menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg className="icon-mobile-nav" name="close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
