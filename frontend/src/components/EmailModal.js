import React, { useState } from 'react';
import { CloseIcon } from './Icons';

const EmailModal = ({ onClose }) => {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose && onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-card)', color: 'var(--text-dark)' }}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--text-white)' }}>Ask Our Team</h2>
          <button className="modal-close-btn" onClick={onClose} style={{ color: 'var(--text-medium)' }}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          {sent ? (
            <div className="modal-success">
              <h3 style={{ color: 'var(--primary-purple)' }}>Message Sent!</h3>
              <p style={{ color: 'var(--text-medium)' }}>Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: 'var(--text-medium)' }}>Have a question or need help? Send us a message, and we'll get back to you as soon as possible.</p>
              <div className="form-group">
                <label htmlFor="email_message" style={{ color: 'var(--text-dark)' }}>Your Message</label>
                <textarea id="email_message" rows="6" placeholder="Type your message here..." required style={{ background: 'var(--input-bg)', color: 'var(--text-dark)', borderColor: 'var(--border-color)' }}></textarea>
              </div>
              <button type="submit" className="btn btn-cta btn-modal-send">Send Email</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
