import React from 'react';
import dynovaVideo from '../Video_Generation_With_Revisions.mp4';

export default function VideoFeatureSection({ setCurrentPage }) {
    return (
        <section id="features" className="video-feature-section">
            <video src={dynovaVideo} autoPlay loop muted playsInline className="video-bg">Your browser does not support the video tag.</video>
            <div className="video-overlay"></div>
            <div className="video-content container">
                <h2>Discover Our Features</h2>
                <p>See our platform in action. All the tools you need in one place.</p>
                <button onClick={() => setCurrentPage && setCurrentPage('features')} className="btn btn-view-more">View More Features</button>
            </div>
        </section>
    );
}
