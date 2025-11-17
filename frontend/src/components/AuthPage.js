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
            <div className="social-login-divider"><span>OR</span></div>
            <button className="btn btn-social-google">Sign in with Google</button>
            <button className="btn btn-social-linkedin">Sign in with LinkedIn</button>
            <button onClick={switchToSignUp} className="auth-toggle-link">Don't have an account? Sign Up</button>
        </div>
    );
}

export default function AuthPage({ initialState, setPage, onAuthSuccess }) {
    const [isSigningUp, setIsSigningUp] = useState(initialState === 'signUp');

    return (
        <div className="auth-page">
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
