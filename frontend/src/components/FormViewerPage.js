import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FormEditorPage.css';
import { API_BASE_URL } from '../config';

export default function FormViewerPage({ theme, toggleTheme, setTheme }) {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Enforce Layout Shift to Light on Mount if currently dark
    useEffect(() => {
        if (theme === 'dark' && setTheme) {
            setTheme('light');
        }
    }, []); // Run once on mount to set preference

    useEffect(() => {
        fetch(`${API_BASE_URL}/forms/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="viewer-loading" style={{ color: 'var(--text-dark)' }}>Loading form...</div>;
    if (!form) return <div className="viewer-error" style={{ color: 'var(--text-dark)' }}>Form not found</div>;

    if (submitted) {
        return (
            <div className="viewer-submitted page-fade-in" style={{ background: 'var(--bg-app)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="submitted-card" style={{ background: 'var(--bg-white)', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div className="check-icon" style={{ fontSize: '48px', color: '#6aaa64', marginBottom: '20px' }}>✓</div>
                    <h2 style={{ color: 'var(--text-dark)' }}>Response Submitted!</h2>
                    <p style={{ color: 'var(--text-medium)' }}>Thank you for completing the form.</p>
                </div>
            </div>
        );
    }

    const questions = form.questions || [];
    const currentQuestion = questions[currentStep];
    const isLastStep = currentStep === questions.length - 1;

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    };

    const handleNext = () => {
        if (currentQuestion.required && !answers[currentQuestion.id]) {
            alert('This question is required');
            return;
        }
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([qid, val]) => ({
                questionId: qid,
                value: val
            }));

            const res = await fetch(`${API_BASE_URL}/forms/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: formattedAnswers })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting form');
        }
    };

    return (
        <div className="form-viewer-layout page-fade-in">
            {/* Local Header for Viewer */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Theme" style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {theme === 'dark' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    )}
                </button>
            </div>

            <div className="viewer-glass-card">
                <div className="viewer-header">
                    <div className="viewer-step-indicator">
                        Step {currentStep + 1} of {questions.length}
                    </div>
                    <h1>{form.title}</h1>
                    {form.description && <p className="viewer-desc">{form.description}</p>}
                </div>

                <div className="viewer-progress-container">
                    <div
                        className="viewer-progress-bar"
                        style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                <div className="viewer-question-wrapper">
                    <label className="viewer-question-label">
                        {currentQuestion.label} {currentQuestion.required && <span className="req-star">*</span>}
                    </label>

                    <div className="viewer-input-section">
                        {renderInput(currentQuestion, answers[currentQuestion.id], handleAnswer)}
                    </div>
                </div>

                <div className="viewer-footer-actions">
                    <button
                        className="btn-viewer-back"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="btn-viewer-next"
                        onClick={handleNext}
                    >
                        {isLastStep ? 'Submit Response' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function renderInput(q, value, onChange) {
    const val = value || '';

    switch (q.type) {
        // --- TEXT & CONTACT ---
        case 'shortText':
        case 'nameField':
            return <input className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="Your answer" />;
        case 'emailField':
            return <input type="email" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="name@example.com" />;
        case 'phoneField':
            return <input type="tel" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="(555) 555-5555" />;
        case 'websiteField':
            return <input type="url" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="https://" />;
        case 'addressField':
        case 'longText':
            return <textarea className="viewer-textarea-large" value={val} onChange={e => onChange(e.target.value)} placeholder="Your answer" />;

        // --- NUMBERS ---
        case 'numberField':
            return <input type="number" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="0" />;
        case 'decimalField':
            return <input type="number" step="0.01" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="0.00" />;
        case 'currencyField':
            return (
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)', fontWeight: 'bold' }}>$</span>
                    <input type="number" step="0.01" className="viewer-input-large" style={{ paddingLeft: '40px' }} value={val} onChange={e => onChange(e.target.value)} placeholder="0.00" />
                </div>
            );

        // --- CHOICES ---
        case 'singleSelect':
        case 'radio':
            return (
                <div className="viewer-options-grid">
                    {(q.meta.options || []).map((opt, i) => (
                        <div key={i} className={`viewer-option-card ${val === opt ? 'selected' : ''}`} onClick={() => onChange(opt)}>
                            <div className="option-indicator">{val === opt && '✓'}</div>
                            <span>{opt}</span>
                        </div>
                    ))}
                </div>
            );
        case 'multiSelect':
            const currentVals = Array.isArray(val) ? val : (val ? val.split(',') : []);
            const toggle = (opt) => {
                if (currentVals.includes(opt)) {
                    onChange(currentVals.filter(v => v !== opt));
                } else {
                    onChange([...currentVals, opt]);
                }
            };
            return (
                <div className="viewer-options-grid">
                    {(q.meta.options || []).map((opt, i) => (
                        <div key={i} className={`viewer-option-card ${currentVals.includes(opt) ? 'selected' : ''}`} onClick={() => toggle(opt)}>
                            <div className="option-indicator" style={{ borderRadius: '4px' }}>{currentVals.includes(opt) && '✓'}</div>
                            <span>{opt}</span>
                        </div>
                    ))}
                </div>
            );
        case 'dropdown':
            return (
                <select className="viewer-select-large" value={val} onChange={e => onChange(e.target.value)}>
                    <option value="">Select an option</option>
                    {(q.meta.options || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
            );

        // --- RATINGS ---
        case 'starRating':
            return (
                <div className="viewer-rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`viewer-star ${star <= val ? 'active' : ''}`}
                            onClick={() => onChange(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            );

        default:
            return <input className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} />;
    }
}
