import React from 'react';

export default function AllFeaturesPage({ setCurrentPage }) {
    return (
        <div className="all-features-page page-fade-in">
            <div className="container">
                <button onClick={() => setCurrentPage && setCurrentPage('home')} className="btn btn-go-back">&larr; Go Back</button>
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
