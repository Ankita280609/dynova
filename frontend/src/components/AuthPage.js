import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { UserIcon, EmailIcon, ShieldIcon } from './Icons';

function SignUpForm({ switchToSignIn, onAuthSuccess }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const repeatPassword = e.target['repeat-password'].value;

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Signup failed');

            if (onAuthSuccess) onAuthSuccess(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Start Creating Smarter Forms Today.</h3>
            {error && <div className="auth-error" style={{ color: '#ff4757', marginBottom: '15px', fontWeight: '500' }}>{error}</div>}
            <form onSubmit={handleSignUp}>
                <div className="auth-input-group">
                    <UserIcon />
                    <input id="username" type="text" placeholder="USERNAME" required />
                </div>
                <div className="auth-input-group">
                    <EmailIcon />
                    <input id="email" type="email" placeholder="EMAIL" required />
                </div>
                <div className="auth-input-group">
                    <ShieldIcon />
                    <input id="password" type="password" placeholder="PASSWORD" required />
                </div>
                <div className="auth-input-group">
                    <ShieldIcon />
                    <input id="repeat-password" type="password" placeholder="REPEAT YOUR PASSWORD" required />
                </div>
                <button type="submit" className="btn btn-auth-submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
            </form>
            <button onClick={switchToSignIn} className="auth-toggle-link">I Already Have An Account</button>
        </div>
    );
}

function SignInForm({ switchToSignUp, onAuthSuccess }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const email = e.target['signin-username'].value;
        const password = e.target['signin-password'].value;

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            if (onAuthSuccess) onAuthSuccess(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-wrapper">
            <h3>Welcome Back!</h3>
            <h4>Sign In and Keep Creating.</h4>
            {error && <div className="auth-error" style={{ color: '#ff4757', marginBottom: '15px', fontWeight: '500' }}>{error}</div>}
            <form onSubmit={handleSignIn}>
                <div className="auth-input-group">
                    <EmailIcon />
                    <input id="signin-username" type="email" placeholder="EMAIL" required />
                </div>
                <div className="auth-input-group">
                    <ShieldIcon />
                    <input id="signin-password" type="password" placeholder="PASSWORD" required />
                </div>
                <button type="submit" className="btn btn-auth-submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
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

export default function AuthPage({ initialState, onAuthSuccess }) {
    const navigate = useNavigate();
    const [isSigningUp, setIsSigningUp] = useState(initialState === 'signUp');

    return (
        <div className="auth-page page-fade-in">
            <div className="auth-page-left">
                <div className="auth-left-content">
                    <h1>Collect Smarter.<br />Analyse Faster.</h1>
                    <p>From form creation to decision making, all in one place. Experience live analytics that transform raw inputs into actionable insight instantly.</p>
                </div>
                <div className="auth-left-footer">
                    <a href="#">Terms Of Use</a>
                    <a href="#">Privacy</a>
                    <a href="#">Help</a>
                    <a href="#">Cookie preferences</a>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-go-back auth-back-btn">&larr; Back to Home</button>
            </div>
            <div className="auth-page-right">
                {isSigningUp ? (
                    <SignUpForm switchToSignIn={() => navigate('/signin')} onAuthSuccess={onAuthSuccess} />
                ) : (
                    <SignInForm switchToSignUp={() => navigate('/signup')} onAuthSuccess={onAuthSuccess} />
                )}
            </div>
        </div>
    );
}