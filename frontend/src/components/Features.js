import React from 'react';
import dynovaVideo from '../Video_Generation_With_Revisions.mp4';

export default function Features() {
    return (
        <section className="features">
            <div className="container">
                <h2 className="features-main-title">Our Core Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <video src={dynovaVideo} autoPlay loop muted playsInline className="feature-card-video" />
                        <div className="feature-card-overlay"></div>
                        <div className="feature-card-content">
                            <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h18M3 17.25h18" /></svg>
                            <h3>Live Analytics</h3>
                            <p>Track responses in real-time with dynamic charts and detailed reports.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <video src={dynovaVideo} autoPlay loop muted playsInline className="feature-card-video" />
                        <div className="feature-card-overlay"></div>
                        <div className="feature-card-content">
                            <svg className="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
                            <h3>Interactive Questions</h3>
                            <p>Engage users with interactive question types like sliders, dynamic boxes, and conditional logic.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <video src={dynovaVideo} autoPlay loop muted playsInline className="feature-card-video" />
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
