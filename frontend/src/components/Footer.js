import React from 'react';
import { Logo } from './Icons';

export default function Footer() {
    return (
        <footer className="footer-minimal">
            <div className="container footer-content">
                <div className="footer-left">
                    <Logo />
                    <span>dynova</span>
                </div>
                <div className="footer-center">
                    <p>&copy; {new Date().getFullYear()} Dynova. All rights reserved.</p>
                </div>
                <div className="footer-right">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
            </div>
        </footer>
    );
}
