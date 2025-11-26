import React from 'react';
import Typewriter from 'typewriter-effect';

export default function Hero({ setPage }) {
    // 1. Using the new simple name "vid.mp4"
    // 2. Using process.env.PUBLIC_URL to guarantee the path is found
    const videoSource = process.env.PUBLIC_URL + "/vid.mp4";

    const openSignUp = () => {
        if (setPage) {
            setPage('signUp');
        }
    };

    return (
        <section className="hero-section" style={{ position: 'relative', background: 'transparent', height: '100vh', overflow: 'hidden' }}>
            
            {/* The Video Layer */}
            <video 
                key={videoSource} /* Force reload */
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0 
                }}
            >
                <source src={videoSource} type="video/mp4" />
            </video>

            {/* The Overlay Layer */}
            <div 
                className="hero-overlay" 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)', 
                    zIndex: 1
                }}
            ></div>

            {/* The Content Layer */}
            <div 
                className="hero-content-container" 
                style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    paddingTop: '60px'
                }}
            >
                <div className="vision-branding">
                    <h1 className="brand-title">DYNOVA</h1>
                    <p className="brand-subtitle">Where worlds start</p>
                    <div className="brand-divider"></div>
                </div>

                <div className="main-headline-container">
                    <div className="typewriter-headline">
                        <Typewriter
                            options={{
                                strings: ['Data in Motion, Decisions in Seconds.'],
                                autoStart: true,
                                loop: true,
                                delay: 40,
                                deleteSpeed: 20,
                                pauseFor: 4000,
                            }}
                        />
                    </div>
                </div>

                <p className="hero-description">
                    Unlock deeper insights with a platform built for intelligent
                    data analysis.
                </p>

                <button onClick={openSignUp} className="enhanced-cta-button">
                    Create a form
                </button>
            </div>
        </section>
    );
}