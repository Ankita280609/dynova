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
    }, []); // Run once on mount

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
            return <input className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="Your answer" />;
        case 'emailField':
            return <input type="email" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="name@example.com" />;
        case 'phoneField':
            return <input type="tel" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="(555) 555-5555" />;
        case 'websiteField':
            return <input type="url" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="https://" />;
        case 'addressField':
        case 'longText':
            return <textarea className="viewer-textarea" value={val} onChange={e => onChange(e.target.value)} placeholder="Your answer" />;

        // --- NUMBERS ---
        case 'numberField':
            return <input type="number" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="0" />;
        case 'decimalField':
            return <input type="number" step="0.01" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} placeholder="0.00" />;
        case 'currencyField':
            return (
                <div className="input-with-icon">
                    <span className="input-icon">$</span>
                    <input type="number" step="0.01" className="viewer-input pl-8" value={val} onChange={e => onChange(e.target.value)} placeholder="0.00" />
                </div>
            );

        // --- CHOICES ---
        case 'singleSelect':
        case 'radio':
            return (
                <div className="viewer-options">
                    {(q.meta.options || []).map((opt, i) => (
                        <label key={i} className="viewer-option">
                            <input type="radio" name={q.id} checked={val === opt} onChange={() => onChange(opt)} />
                            <span>{opt}</span>
                        </label>
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
                <div className="viewer-options">
                    {(q.meta.options || []).map((opt, i) => (
                        <label key={i} className="viewer-option">
                            <input type="checkbox" checked={currentVals.includes(opt)} onChange={() => toggle(opt)} />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );
        case 'dropdown':
            return (
                <select className="viewer-select" value={val} onChange={e => onChange(e.target.value)}>
                    <option value="">Select an option</option>
                    {(q.meta.options || []).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
            );

        // --- RATINGS ---
        case 'starRating':
            return (
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= val ? 'filled' : ''}`}
                            onClick={() => onChange(star)}
                            style={{ fontSize: '2rem', cursor: 'pointer', color: star <= val ? '#FFD700' : '#ddd' }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            );
        case 'emojiRating':
            const emojis = ['😠', '🙁', '😐', '🙂', '😍'];
            return (
                <div className="emoji-rating" style={{ display: 'flex', gap: '10px', fontSize: '2rem' }}>
                    {emojis.map((emoji, i) => (
                        <span
                            key={i}
                            onClick={() => onChange(i + 1)}
                            style={{ cursor: 'pointer', opacity: val === i + 1 ? 1 : 0.5, transform: val === i + 1 ? 'scale(1.2)' : 'scale(1)' }}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            );
        case 'sliderScale':
            return (
                <div className="slider-container">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={val || 5}
                        onChange={e => onChange(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '5px' }}>{val || 5}</div>
                </div>
            );

        // --- DATE & TIME ---
        case 'datePicker':
            return <input type="date" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} />;
        case 'timePicker':
            return <input type="time" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} />;
        case 'dateTimeCombo':
            return (
                <div className="datetime-combo" style={{ display: 'flex', gap: '10px' }}>
                    <input type="date" className="viewer-input" value={val.split(' ')[0] || ''} onChange={e => onChange(`${e.target.value} ${val.split(' ')[1] || ''}`)} />
                    <input type="time" className="viewer-input" value={val.split(' ')[1] || ''} onChange={e => onChange(`${val.split(' ')[0] || ''} ${e.target.value}`)} />
                </div>
            );
        case 'monthYearPicker':
            return <input type="month" className="viewer-input" value={val} onChange={e => onChange(e.target.value)} />;

        // --- CHOICES (Extended) ---
        case 'imageChoice':
            return (
                <div className="image-choices" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {(q.meta.options || []).map((opt, i) => (
                        <div
                            key={i}
                            className={`image-option ${val === opt ? 'selected' : ''}`}
                            onClick={() => onChange(opt)}
                            style={{
                                border: val === opt ? '2px solid #B292F2' : '1px solid #ddd',
                                padding: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ width: '100px', height: '80px', background: '#eee', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                            <span>{opt}</span>
                        </div>
                    ))}
                </div>
            );
        case 'matrixGrid':
            return (
                <div className="matrix-grid" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th></th>
                                {(q.meta.columns || []).map((col, i) => <th key={i} style={{ padding: '10px', textAlign: 'center' }}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {(q.meta.rows || []).map((row, r) => (
                                <tr key={r} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{row}</td>
                                    {(q.meta.columns || []).map((col, c) => (
                                        <td key={c} style={{ textAlign: 'center' }}>
                                            <input
                                                type="radio"
                                                name={`${q.id}_row_${r}`}
                                                checked={(val[row] === col)}
                                                onChange={() => onChange({ ...val, [row]: col })}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        // --- UPLOADS ---
        case 'fileUpload':
        case 'imageUpload':
        case 'mediaUpload':
            return (
                <div className="file-upload-wrapper">
                    <input type="file" onChange={(e) => onChange(e.target.files[0]?.name || '')} />
                    {val && <div className="file-selected">Selected: {val}</div>}
                </div>
            );

        // --- LEGAL ---
        case 'termsConditions':
        case 'consentCheckbox':
            return (
                <label className="terms-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" checked={val === true} onChange={(e) => onChange(e.target.checked)} />
                    <span>{q.label}</span>
                </label>
            );
        case 'digitalSignature':
            return (
                <div className="digital-signature">
                    <input
                        className="viewer-input"
                        value={val}
                        onChange={e => onChange(e.target.value)}
                        placeholder="Type full name to sign"
                        style={{ fontFamily: 'cursive', fontSize: '1.2rem' }}
                    />
                </div>
            );

        // --- INSTRUCTIONAL ---
        case 'descriptionText':
            return <div className="description-text" style={{ whiteSpace: 'pre-wrap' }}>{q.label}</div>;
        case 'embeddedMedia':
            return <div className="embedded-media" style={{ background: '#000', color: '#fff', padding: '20px', textAlign: 'center' }}>[Video/Audio Placeholder]</div>;

        // --- ADVANCED ---
        case 'scratchReveal':
            return <button onClick={() => alert(`You won: ${val || 'Prize'}`)} className="btn-viewer-secondary">Scratch Here</button>;
        case 'moodMeter':
            return <input type="range" className="mood-slider" min="0" max="100" value={val || 50} onChange={e => onChange(e.target.value)} />;
        case 'matchFollowing':
            return <div>Match Following (Not fully implemented)</div>;
        case 'animatedScale':
            return <div className="animated-scale">Scale (1-10): <input type="number" min="1" max="10" value={val} onChange={e => onChange(e.target.value)} /></div>;

        default:
            return <input className="viewer-input" value={val} onChange={e => onChange(e.target.value)} />;
    }
}
