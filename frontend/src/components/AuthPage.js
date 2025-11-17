import React, { useState } from 'react';

function SignUpForm({ switchToSignIn, setPage, onAuthSuccess }) {
    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('Simulating user sign up...');
        if (onAuthSuccess) onAuthSuccess();
        else setPage && setPage('dashboard');
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Start Creating Smarter Forms Today.</h3>
            <form onSubmit={handleSignUp}>
                <div className="auth-input-group">
                    <input id="username" type="text" placeholder="USERNAME" required />
                </div>
                <div className="auth-input-group">
                    <input id="email" type="email" placeholder="EMAIL" required />
                </div>
                <div className="auth-input-group">
                    <input id="password" type="password" placeholder="PASSWORD" required />
                </div>
                <div className="auth-input-group">
                    <input id="repeat-password" type="password" placeholder="REPEAT YOUR PASSWORD" required />
                </div>
                <button type="submit" className="btn btn-auth-submit">Sign Up</button>
            </form>
            <button onClick={switchToSignIn} className="auth-toggle-link">I Already Have An Account</button>
        </div>
    );
}

function SignInForm({ switchToSignUp, setPage, onAuthSuccess }) {
    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Simulating user sign in...');
        if (onAuthSuccess) onAuthSuccess();
        else setPage && setPage('dashboard');
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Welcome Back!</h3>
            <h4>Sign In and Keep Creating.</h4>
            <form onSubmit={handleSignIn}>
                <div className="auth-input-group">
                    <input id="signin-username" type="text" placeholder="USERNAME/EMAIL" required />
                </div>
                <div className="auth-input-group">
                    <input id="signin-password" type="password" placeholder="PASSWORD" required />
                </div>
                <button type="submit" className="btn btn-auth-submit">Sign In</button>
            </form>
            
            <div className="social-login-divider"><span>or sign in using</span></div>
            
            <div className="social-login-buttons">
                <button className="btn btn-social-icon">G</button>
                <button className="btn btn-social-icon"></button>
            </div>

            <button onClick={switchToSignUp} className="auth-toggle-link">Don't have an account? Sign Up</button>
        </div>
    );
}

export default function AuthPage({ initialState, setPage, onAuthSuccess }) {
    const [isSigningUp, setIsSigningUp] = useState(initialState === 'signUp');

    return (
        <div className="auth-page page-fade-in">
            <div className="auth-page-left">
                {/* This content now matches the image */}
                <div className="auth-left-content">
                    <h1>Collect Smarter.<br/>Analyse Faster.</h1>
                    <p>From form creation to decision making, all in one place. Experience live analytics that transform raw inputs into actionable insight instantly.</p>
                </div>
                {/* Footer and back button from original code (good to keep) */}
                <div className="auth-left-footer">
                    <a href="#">Terms Of Use</a>
                    <a href="#">Privacy</a>
                    <a href="#">Help</a>
                    <a href="#">Cookie preferences</a>
                </div>
                <button onClick={() => setPage && setPage('home')} className="btn btn-go-back auth-back-btn">&larr; Back to Home</button>
            </div>
            <div className="auth-page-right">
                {isSigningUp ? (
                    <SignUpForm switchToSignIn={() => setIsSigningUp(false)} setPage={setPage} onAuthSuccess={onAuthSuccess} />
                ) : (
                    <SignInForm switchToSignUp={() => setIsSigningUp(true)} setPage={setPage} onAuthSuccess={onAuthSuccess} />
                )}
            </div>
        </div>
    );
}