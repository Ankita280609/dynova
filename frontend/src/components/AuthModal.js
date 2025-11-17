import React from 'react';
import AuthPage from './AuthPage';

export default function AuthModal({ initialState, closeModal, setCurrentPage }) {
    return (
        <div className="auth-modal-overlay" onClick={closeModal}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <AuthPage initialState={initialState} setPage={setCurrentPage} />
            </div>
        </div>
    );
}
