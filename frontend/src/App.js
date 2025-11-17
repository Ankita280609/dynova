import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Your CSS file
import dynovaVideo from './Video_Generation_With_Revisions.mp4'; // Your video import

// ===================================
//  ANIMATION HOOK (Detects when items are visible)
// ===================================
function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // This makes the animation re-trigger every time
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                ...options,
            }
        );
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (elementRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(elementRef.current);
            }
        };
    }, [options]);

    return [elementRef, isIntersecting];
}


// ===================================
//  COMPONENT: Header
// ===================================
// UPDATED: Now accepts 'setPage'
function Header({ setPage }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    // Helper to close nav on link click
    const handleLinkClick = (e) => {
        setIsNavOpen(false);
        if (e.target.hash) {
            e.preventDefault();
            document.querySelector(e.target.hash).scrollIntoView({
                behavior: 'smooth'
            });
        }
    };

    return (
        <header className={`header ${isNavOpen ? 'nav-open' : ''}`}>
            <div className="container nav-container">
                <a href="#" onClick={() => setPage('home')} className="logo">
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
                    {/* UPDATED: This button now opens the 'signIn' PAGE */}
                    <button
                        onClick={() => setPage('signIn')}
                        className="btn btn-login"
                    >
                        Login
                    </button>

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

// ===================================
//  COMPONENT: Hero (Full-Screen)
// ===================================
// UPDATED: Now accepts 'setPage'
function Hero({ setPage }) {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="container">
                    <div className="hero-content">
                        <h1>Data in Motion,<br />Decisions in Seconds.</h1>
                        <p>
                            Unlock deeper insights with a platform built for intelligent data
                            analysis — turning every form submission into meaningful, actionable
                            decisions with clarity and speed.
                        </p>
                        {/* UPDATED: This button now opens the 'signUp' PAGE */}
                        <button
                            onClick={() => setPage('signUp')}
                            className="btn btn-cta"
                        >
                            Create a form
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ===================================
//  COMPONENT: Features (REBUILT)
// ===================================
function Features() {
    return (
        <section className="features">
            <div className="container">
                <h2 className="features-main-title">Our Core Features</h2>
                <div className="features-grid">
                    
                    {/* Card 1: Live Analytics */}
                    <div className="feature-card">
                        <video 
                            src={dynovaVideo} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="feature-card-video"
                        />
                        <div className="feature-card-overlay"></div>
                        <div className="feature-card-content">
                            <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h18M3 17.25h18" /></svg>
                            <h3>Live Analytics</h3>
                            <p>Track responses in real-time with dynamic charts and detailed reports.</p>
                        </div>
                    </div>

                    {/* Card 2: Interactive Questions */}
                    <div className="feature-card">
                        <video 
                            src={dynovaVideo} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="feature-card-video"
                        />
                        <div className="feature-card-overlay"></div>
                        <div className="feature-card-content">
                            <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
                            <h3>Interactive Questions</h3>
                            <p>Engage users with interactive question types like sliders, dynamic boxes, and conditional logic.</p>
                        </div>
                    </div>
                    
                    {/* Card 3: Smart Logic */}
                    <div className="feature-card">
                        <video 
                            src={dynovaVideo} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="feature-card-video"
                        />
                        <div className="feature-card-overlay"></div>
                        <div className="feature-card-content">
                            <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5 0l-4.5 16.5" /></svg>
                            <h3>Smart Logic</h3>
                            <p>Build adaptive forms that change based on user answers for a personalized experience.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// ===================================
//  COMPONENT: TimelineItem
// ===================================
function TimelineItem({ number, tagColor, tagText, title, text, align }) {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
    const animationClass = align === 'left' ? 'timeline-slide-in-left' : 'timeline-slide-in-right';

    return (
        <div 
            ref={ref} 
            className={`timeline-item ${align === 'left' ? 'align-left' : 'align-right'} ${isVisible ? 'is-visible' : ''}`}
        >
            <div className="timeline-number-wrapper">
                <div className="timeline-number">{number}</div>
            </div>
            <div className={`timeline-item-content ${animationClass}`}>
                <span className="timeline-tag" style={{ backgroundColor: tagColor }}>{tagText}</span>
                <h3 className="timeline-title">{title}</h3>
                <p className="timeline-text">
                    <strong>{text}</strong>
                </p>
            </div>
        </div>
    );
}

// ===================================
//  COMPONENT: Timeline (Replaces WhyDynova)
// ===================================
function Timeline() {
    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet, turpis vel bibendum dictum, purus enim ultrices mauris, nec sodales ante sem sit amet nunc. Vivamus nibh elit, faucibus at eros id, tincidunt laoreet augue. Mauris sagittis, turpis at dictum luctus, nibh nisl.";
    
    return (
        <section id="why-us" className="timeline-section">
            <div className="container">
                <h2 className="timeline-main-title">TIMELINE</h2>
                <div className="timeline-container">
                    <div className="timeline-central-line"></div>
                    <TimelineItem 
                        number="1" 
                        tagColor="#f5a623" 
                        tagText="Foundation" 
                        title="Our Project Kick-off" 
                        align="left" 
                        text={loremText}
                    />
                    <TimelineItem 
                        number="2" 
                        tagColor="#d0021b" 
                        tagText="Development" 
                        title="Core Feature Build" 
                        align="right" 
                        text={loremText}
                    />
                    <TimelineItem 
                        number="3" 
                        tagColor="#4a90e2" 
                        tagText="Launch" 
                        title="Initial Public Release" 
                        align="left" 
                        text={loremText}
                    />
                    <TimelineItem 
                        number="4" 
                        tagColor="#7ed321" 
                        tagText="Expansion" 
                        title="Scaling and Growth" 
                        align="right" 
                        text={loremText}
                    />
                    <TimelineItem 
                        number="5" 
                        tagColor="#A067E4" 
                        tagText="Future" 
                        title="Vision 2025" 
                        align="left" 
                        text={loremText}
                    />
                </div>
            </div>
        </section>
    );
}


// ===================================
//  COMPONENT: VideoFeatureSection (Full-Screen)
// ===================================
function VideoFeatureSection({ setCurrentPage }) {
    return (
        <section id="features" className="video-feature-section">
            <video
                src={dynovaVideo}
                autoPlay
                loop
                muted
                playsInline
                className="video-bg"
            >
                Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
            <div className="video-content container">
                <h2>Discover Our Features</h2>
                <p>See our platform in action. All the tools you need in one place.</p>
                <button
                    onClick={() => setCurrentPage('features')}
                    className="btn btn-view-more"
                >
                    View More Features
                </button>
            </div>
        </section>
    );
}

// ===================================
//  COMPONENT: HoverBarChart (Re-styled)
// ===================================
function HoverBarChart() {
    const [sectionRef, isVisible] = useIntersectionObserver();

    return (
        <section
            ref={sectionRef}
            className={`hover-bar-chart-section ${isVisible ? 'is-visible' : ''}`}
        >
            <div className="container">
                <h2>Analyze Your Audience</h2>
                <p>See what your users love.</p>
                <div className="hover-chart-wrapper">
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-1"></div>
                        <div className="hover-bar-label">Hamsters</div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-2"></div>
                        <div className="hover-bar-label">Rabbits</div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-3"></div>
                        <div className="hover-bar-label">Dogs</div>
                    </div>
                    <div className="hover-bar-item">
                        <div className="hover-bar bar-4"></div>
                        <div className="hover-bar-label">Cats</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ===================================
//  COMPONENT: AllFeaturesPage
// ===================================
function AllFeaturesPage({ setCurrentPage }) {
    return (
        <div className="all-features-page page-fade-in">
            <div className="container">
                <button
                    onClick={() => setCurrentPage('home')}
                    className="btn btn-go-back"
                >
                    &larr; Go Back
                </button>
                <h1>All Dynova Features</h1>
                <p>Here you can list all the powerful features of your platform.</p>
                <div className="features-page-grid">
                    <div className="feature-item"><h3>Advanced Logic</h3><p>Create complex conditional logic flows with ease.</p></div>
                    <div className="feature-item"><h3>Team Collaboration</h3><p>Invite your team and work on forms together in real-time.</p></div>
                    <div className="feature-item"><h3>Custom Branding</h3><p>Match your forms to your brand with custom fonts, colors, and logos.</p></div>
                    <div className="feature-item"><h3>Integrations</h3><p>Connect to thousands of apps like Slack, Google Sheets, and more.</p></div>
                    <div className="feature-item"><h3>Analytics Suite</h3><p>A full dashboard to track submissions, conversion rates, and user behavior.</p></div>
                    <div className="feature-item"><h3>Secure & Compliant</h3><p>GDPR and HIPAA-ready to keep your data safe.</p></div>
                </div>
            </div>
        </div>
    );
}


// ===================================
//  NEW COMPONENT: AuthPage (Replaces Modal)
// ===================================
function AuthPage({ initialState, setPage }) {
    const [isSigningUp, setIsSigningUp] = useState(initialState === 'signUp');

    return (
        <div className="auth-page">
            {/* Left Side (Image) */}
            <div className="auth-page-left">
                <div className="auth-left-content">
                    <h1>Data in Motion, Decisions in Seconds.</h1>
                    <button className="btn btn-learn-more">Learn More</button>
                    
                    <div className="auth-left-footer">
                        <a href="#">Terms Of Use</a>
                        <a href="#">Privacy</a>
                        <a href="#">Help</a>
                        <a href="#">Cookie preferences</a>
                    </div>
                </div>
                {/* Back to Home Button */}
                <button onClick={() => setPage('home')} className="btn btn-go-back auth-back-btn">
                    &larr; Back to Home
                </button>
            </div>

            {/* Right Side (Form) */}
            <div className="auth-page-right">
                {isSigningUp ? (
                    <SignUpForm switchToSignIn={() => setIsSigningUp(false)} setPage={setPage} />
                ) : (
                    <SignInForm switchToSignUp={() => setIsSigningUp(true)} setPage={setPage} />
                )}
            </div>
        </div>
    );
}

// ===================================
//  COMPONENT: SignUpForm
// ===================================
function SignUpForm({ switchToSignIn, setPage }) {
    
    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Simulating user sign up...");
        setPage('dashboard'); // Navigate to dashboard
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Start Creating Smarter Forms Today.</h3>
            
            <form onSubmit={handleSignUp}>
                <div className="auth-input-group">
                    <label htmlFor="username">ENTER A USERNAME</label>
                    <input id="username" type="text" required />
                </div>
                <div className="auth-input-group">
                    <label htmlFor="password">ENTER A PASSWORD</label>
                    <input id="password" type="password" required />
                </div>
                <div className="auth-input-group">
                    <label htmlFor="repeat-password">REPEAT YOUR PASSWORD</label>
                    <input id="repeat-password" type="password" required />
                </div>
                <button type="submit" className="btn btn-auth-submit">Sign Up</button>
            </form>

            <button onClick={switchToSignIn} className="auth-toggle-link">
                I Already Have An Account
            </button>
        </div>
    );
}

// ===================================
//  COMPONENT: SignInForm
// ===================================
function SignInForm({ switchToSignUp, setPage }) {

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log("Simulating user sign in...");
        setPage('dashboard'); // Navigate to dashboard
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Welcome Back!</h3>
            
            <form onSubmit={handleSignIn}>
                <div className="auth-input-group">
                    <label htmlFor="signin-username">ENTER A USERNAME</label>
                    <input id="signin-username" type="text" required />
                </div>
                <div className="auth-input-group">
                    <label htmlFor="signin-password">ENTER A PASSWORD</label>
                    <input id="signin-password" type="password" required />
                </div>
                <button type="submit" className="btn btn-auth-submit">Sign In</button>
            </form>

            <div className="social-login-divider">
                <span>OR</span>
            </div>
            
            <button className="btn btn-social-google">Sign in with Google</button>
            <button className="btn btn-social-linkedin">Sign in with LinkedIn</button>

            <button onClick={switchToSignUp} className="auth-toggle-link">
                Don't have an account? Sign Up
            </button>
        </div>
    );
}


// =================================================================
//  --- DASHBOARD / EDITOR / CHAT PAGE COMPONENTS ---
// =================================================================

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const ThemesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path>
  </svg>
);
const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);
const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
);
const MoreHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
    </svg>
);
const AiBotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#A067E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"></path><path d="M16 4h-4v4"></path><path d="M12 12h.01"></path><path d="M16 12h.01"></path><path d="M8 12h.01"></path><path d="M16 20c0-2.209-1.791-4-4-4s-4 1.791-4 4v0c0 1.105.895 2 2 2h4c1.105 0 2-.895 2-2v0Z"></path><path d="M18.192 18.192a9 9 0 0 1-12.384 0"></path><path d="M4.929 4.929a9 9 0 0 1 14.142 0"></path>
    </svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const ShortTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>
    </svg>
);
const ParagraphIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>
    </svg>
);
const MultipleChoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle>
    </svg>
);
const CheckboxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
);
const DropdownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><polyline points="7 10 12 15 17 10"></polyline>
    </svg>
);
const LinearScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="17" x2="21" y2="17"></line><line x1="3" y1="7" x2="21" y2="7"></line>
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);
const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#A067E4"/>
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EmailModal = ({ onClose }) => {
  const [sent, setSent] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
        setSent(false);
        onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ask Our Team</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          {sent ? (
            <div className="modal-success">
              <h3>Message Sent!</h3>
              <p>Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p>Have a question or need help? Send us a message, and we'll get back to you as soon as possible.</p>
              <div className="form-group">
                <label htmlFor="email_message">Your Message</label>
                <textarea id="email_message" rows="6" placeholder="Type your message here..." required></textarea>
              </div>
              <button type="submit" className="btn btn-cta btn-modal-send">Send Email</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const forms = [
    { id: 1, title: 'Customer Feedback Survey', updated: '2 days ago', submissions: 128 },
    { id: 2, title: 'Event Registration Form', updated: '1 week ago', submissions: 312 },
    { id: 3, title: 'Website Contact Form', updated: '3 weeks ago', submissions: 88 },
  ];

  const handleAskTeamClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="dashboard-layout page-fade-in">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo">
            <Logo />
            dynova
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">AV</div>
            <span className="user-name">Alex Volkov</span>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className="active"><a href="#"><FileIcon /> My Forms</a></li>
              <li><a href="#"><ChartIcon /> Analytics</a></li>
              <li><a href="#" onClick={handleAskTeamClick}><HelpIcon /> Ask Our Team</a></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-left">
              <h2>My Forms</h2>
              <div className="search-bar">
                <SearchIcon />
                <input type="text" placeholder="Search forms..." />
              </div>
            </div>
            <div className="header-right">
              <button className="notification-btn"><BellIcon /></button>
              <button className="btn-create-form" onClick={() => setPage('formEditor')}>
                <PlusIcon /> Create New Form
              </button>
            </div>
          </header>

          <div className="dashboard-tabs">
            <a href="#" className={activeTab === 'active' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('active'); }}>Active Forms</a>
            <a href="#" className={activeTab === 'bookmarked' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('bookmarked'); }}>Bookmarked Forms</a>
            <a href="#" className={activeTab === 'previous' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('previous'); }}>Previous Forms</a>
          </div>

          <div className="form-grid">
            {forms.map(form => (
              <div className="form-card" key={form.id}>
                <div className={`form-card-thumbnail thumb-${form.id}`}></div>
                <div className="form-card-content">
                  <h3>{form.title}</h3>
                  <p>Last updated: {form.updated}</p>
                  <p>{form.submissions} Submissions</p>
                  <div className="form-card-actions">
                    <button className="btn-card-view" onClick={() => setPage('formEditor')}>View</button>
                    <button className="btn-card-icon"><BarChartIcon /></button>
                    <button className="btn-card-icon"><MoreHorizontalIcon /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="ai-bot-section">
            <div className="ai-bot-icon-wrapper"><AiBotIcon /></div>
            <div className="ai-bot-content">
              <h2>Let AI Build Your Form Smarter</h2>
              <p>Let our AI bot help you brainstorm the right questions for your form in seconds.</p>
            </div>
            <button className="btn-try-now" onClick={() => setPage('aiChat')}>
              Try Now <ArrowRightIcon />
            </button>
          </section>
        </main>
      </div>
      {isModalOpen && <EmailModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

const FormEditorPage = ({ setPage }) => {
  const [questionType, setQuestionType] = useState('multipleChoice');
  
  const questionTypes = {
    standard: [
      { id: 'shortAnswer', name: 'Short Answer', icon: <ShortTextIcon /> },
      { id: 'paragraph', name: 'Paragraph', icon: <ParagraphIcon /> },
      { id: 'multipleChoice', name: 'Multiple Choice', icon: <MultipleChoiceIcon /> },
      { id: 'checkboxes', name: 'Checkboxes', icon: <CheckboxIcon /> },
      { id: 'dropdown', name: 'Dropdown', icon: <DropdownIcon /> },
      { id: 'linearScale', name: 'Linear Scale', icon: <LinearScaleIcon /> },
    ],
    advanced: []
  };

  return (
    <div className="form-editor-layout page-fade-in">
      <header className="form-editor-header">
        <div className="editor-header-left">
          <div className="editor-logo" onClick={() => setPage('dashboard')}><Logo /></div>
          <nav className="editor-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('dashboard'); }} className="active"><HomeIcon /> Home</a>
            <a href="#"><ThemesIcon /> Themes</a>
          </nav>
        </div>
        <div className="editor-header-right">
          <button className="btn-editor-preview">Preview</button>
          <button className="btn-editor-publish">Publish</button>
          <button className="btn-editor-export"><ExportIcon /> Export</button>
        </div>
      </header>

      <div className="form-editor-main">
        <aside className="question-panel">
          <div className="question-search">
            <SearchIcon />
            <input type="text" placeholder="Find question type" />
          </div>
          
          <div className="question-group">
            <h4 className="question-group-title">Standard</h4>
            {questionTypes.standard.map(q => (
              <div key={q.id} className={`question-item ${questionType === q.id ? 'active' : ''}`} onClick={() => setQuestionType(q.id)}>
                {q.icon}
                <span>{q.name}</span>
              </div>
            ))}
          </div>
          
          <div className="question-group">
            <h4 className="question-group-title">Advanced</h4>
          </div>
        </aside>

        <main className="canvas-panel">
          <div className="form-title-group">
            <input type="text" className="form-title-input" defaultValue="Untitled Form" />
            <input type="text" className="form-desc-input" placeholder="Form Description" />
          </div>
          <div className="canvas-empty-state">
            <h3>Your form is empty</h3>
            <p>Drag and drop question types from the left panel to start building your form.</p>
            <button className="btn-add-question">Add Question</button>
          </div>
        </main>

        <aside className="settings-panel">
          <div className="settings-tabs">
            <button className="settings-tab active">Question</button>
            <button className="settings-tab">Extras</button>
            <button className="settings-tab">AI Help</button>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label htmlFor="question-type">Question Type</label>
              <select id="question-type" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                {questionTypes.standard.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="question-text">Question Text</label>
              <input type="text" id="question-text" defaultValue="What is your primary goal?" />
            </div>
            
            <div className="form-group">
              <label htmlFor="help-text">Help Text (Optional)</label>
              <input type="text" id="help-text" placeholder="e.g. Choose one option" />
            </div>
            
            <div className="switch-group">
              <label htmlFor="required-switch">Required</label>
              <label className="switch">
                <input type="checkbox" id="required-switch" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="switch-group">
              <label htmlFor="shuffle-switch">Shuffle Options</label>
              <label className="switch">
                <input type="checkbox" id="shuffle-switch" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const AiChatPage = ({ setPage }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am the Dynova AI Assistant. How can I help you build your form today?' },
    { id: 2, sender: 'bot', text: 'You can ask me to generate questions for a specific topic, like "Create a customer feedback survey" or "What are good questions for an event registration form?"' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newUserMessage = { id: messages.length + 1, sender: 'user', text: input };
    setMessages([...messages, newUserMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse = { id: messages.length + 2, sender: 'bot', text: `Here are some ideas for "${input}"... (AI response will be generated here)` };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="chat-page-layout page-fade-in">
      <header className="chat-header">
        <button className="chat-back-btn" onClick={() => setPage('dashboard')}>
          <ArrowLeftIcon /> Back to Dashboard
        </button>
        <div className="chat-header-title">
          <Logo />
          <span>Dynova AI Bot</span>
        </div>
      </header>
      
      <main className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              {msg.sender === 'bot' && <div className="message-avatar"><AiBotIcon /></div>}
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      
      <footer className="chat-input-area">
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message to the AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};


// ===================================
//  MAIN APP COMPONENT (Controls Paging)
// ===================================
// UPDATED: To handle all pages
function App() {
  // 'home', 'features', 'dashboard', 'formEditor', 'aiChat'
  const [currentPage, setCurrentPage] = useState('home');
  // 'closed', 'signIn', or 'signUp'
  const [authModalState, setAuthModalState] = useState('closed');

  // Scroll to top when page changes, except for home
  useEffect(() => {
    if (currentPage !== 'home') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  // This component renders the correct page
  const renderPage = () => {
    switch (currentPage) {
        case 'home':
            return (
                <>
                    {/* Header is part of the 'home' page layout */}
                    <Header
                        setAuthModalState={setAuthModalState}
                        setPage={setCurrentPage}
                    />
                    <main>
                        <Hero setAuthModalState={setAuthModalState} />
                        <Features />
                        
                        {/* HERE IS THE CHANGE:
                          I replaced <WhyDynova /> with <Timeline />
                        */}
                        <Timeline /> 

                        <VideoFeatureSection setCurrentPage={setCurrentPage} />
                        <HoverBarChart />
                    </main>
                </>
            );
        case 'features':
            return <AllFeaturesPage setCurrentPage={setCurrentPage} />;
        case 'dashboard':
            return <DashboardPage setPage={setCurrentPage} />;
        case 'formEditor':
            return <FormEditorPage setPage={setCurrentPage} />;
        case 'aiChat':
            return <AiChatPage setPage={setCurrentPage} />;
        default:
            return <h2>Page Not Found</h2>; // Fallback
    }
  };

  return (
    <div className="App">
        
        {/* Render the correct page based on state */}
        {renderPage()}

        {/* Conditionally render the modal if state is not 'closed' */}
        {authModalState !== 'closed' && (
            <AuthModal
                initialState={authModalState}
                closeModal={() => setAuthModalState('closed')}
                setCurrentPage={setCurrentPage} // Pass this down
            />
        )}
    </div>
  );
}

export default App;