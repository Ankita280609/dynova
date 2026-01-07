export default function Header({ setPage, isAuthenticated, onLogout, theme, toggleTheme }) {
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
                    {/* SVG Logo */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#A067E4" />
                        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
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
                    <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Theme" style={{ background: 'none', border: 'none', color: 'inherit', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        )}
                    </button>

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