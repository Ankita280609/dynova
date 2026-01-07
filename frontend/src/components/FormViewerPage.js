import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FormEditorPage.css';
import { API_BASE_URL } from '../config';

export default function FormViewerPage() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

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

    if (loading) return <div className="viewer-loading">Loading form...</div>;
    if (!form) return <div className="viewer-error">Form not found</div>;

    if (submitted) {
        return (
            <div className="viewer-submitted">
                <div className="submitted-card">
                    <div className="check-icon">✓</div>
                    <h2>Response Submitted!</h2>
                    <p>Thank you for completing the form.</p>
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
        case 'shortText':
        case 'nameField':
            return <input className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="Type your answer here..." />;
        case 'emailField':
            return <input type="email" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="name@example.com" />;
        case 'phoneField':
            return <input type="tel" className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="(555) 555-5555" />;
        case 'longText':
        case 'addressField':
            return <textarea className="viewer-textarea-large" value={val} onChange={e => onChange(e.target.value)} placeholder="Type your detailed answer..." rows={4} />;

        case 'singleSelect':
        case 'radio':
        case 'multiSelect':
            const isMulti = q.type === 'multiSelect';
            const currentVals = isMulti ? (Array.isArray(val) ? val : []) : [val];
            const toggle = (opt) => {
                if (isMulti) {
                    onChange(currentVals.includes(opt) ? currentVals.filter(v => v !== opt) : [...currentVals, opt]);
                } else {
                    onChange(opt);
                }
            };
            return (
                <div className="viewer-options-grid">
                    {(q.meta.options || []).map((opt, i) => (
                        <div
                            key={i}
                            className={`viewer-option-card ${currentVals.includes(opt) ? 'selected' : ''}`}
                            onClick={() => toggle(opt)}
                        >
                            <div className="option-indicator">{isMulti ? (currentVals.includes(opt) ? '✓' : '') : (currentVals.includes(opt) ? '●' : '○')}</div>
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

        case 'numberField':
        case 'decimalField':
        case 'currencyField':
            return (
                <div className="viewer-input-with-symbol">
                    {q.type === 'currencyField' && <span className="currency-symbol">$</span>}
                    <input
                        type="number"
                        step={q.type === 'numberField' ? '1' : '0.01'}
                        className="viewer-input-large"
                        value={val}
                        onChange={e => onChange(e.target.value)}
                        placeholder="0"
                    />
                </div>
            );

        default:
            return <input className="viewer-input-large" value={val} onChange={e => onChange(e.target.value)} placeholder="Enter value..." />;
    }
}
