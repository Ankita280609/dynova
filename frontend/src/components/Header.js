import React, { useState } from 'react';
import { SunIcon, MoonIcon, Logo } from './Icons';

export default function Header({ setPage, isAuthenticated, onLogout, theme, toggleTheme, isHomePage, isAuthPage }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);

    const handleLinkClick = (e) => {
        setIsNavOpen(false);
        if (e.target.hash) {
            e.preventDefault();
            const el = document.querySelector(e.target.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openSignIn = () => { setPage && setPage('signIn'); };

    return (
        <header className={`header ${isNavOpen ? 'nav-open' : ''}`}>
            <div className="container nav-container">
                <a href="#" onClick={() => setPage && setPage('home')} className="logo">
                    <Logo />
                    <span style={{ color: 'inherit', marginLeft: '8px' }}>dynova</span>
                </a>

                <nav className="main-nav">
                    <ul>
                        <li><a href="#why-us" className="nav-link" onClick={handleLinkClick}>Why Us</a></li>
                        <li><a href="#features" className="nav-link" onClick={handleLinkClick}>Features</a></li>
                        {isAuthenticated && (
                            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setPage && setPage('analytics'); }}>Analytics</a></li>
                        )}
                        <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setPage && setPage('dashboard'); }}>Dashboard</a></li>
                    </ul>
                </nav>

                <div className="nav-right">
                    {(!isHomePage && !isAuthPage) && (
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    )}

                    {!isAuthenticated ? (
                        <button onClick={openSignIn} className="btn btn-login">Login</button>
                    ) : (
                        <button onClick={onLogout} className="btn btn-logout" style={{ background: 'var(--bg-light-gray)', color: 'var(--text-white)' }}>Logout</button>
                    )}

                    {/* Mobile Menu Button */}
                    <button className="btn-mobile-nav" onClick={toggleNav}>
                        <svg className="icon-mobile-nav" name="menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}