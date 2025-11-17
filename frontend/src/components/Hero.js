import React from 'react';

export default function Hero({ setPage, setAuthModalState }) {
    const openSignUp = () => {
        if (setAuthModalState) setAuthModalState('signUp');
        else setPage && setPage('signUp');
    };

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
                        <button onClick={openSignUp} className="btn btn-cta">Create a form</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
