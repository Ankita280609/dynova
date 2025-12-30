import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './FormEditorPage.css'; // Reuse styles for layout

export default function AnalyticsDashboardPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:5001/api/forms/${id}`).then(res => res.json()),
            fetch(`http://localhost:5001/api/forms/${id}/responses`).then(res => res.json())
        ]).then(([formData, responsesData]) => {
            setForm(formData);
            setResponses(responsesData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
    if (!form) return <div className="p-8 text-center">Form not found</div>;

    // Process data for charts
    const getQuestionStats = (question) => {
        const allAnswers = responses.flatMap(r => r.answers.filter(a => a.questionId === question.id));
        const totalAnswered = allAnswers.length;

        if (['shortText', 'longText', 'emailField', 'phoneField', 'nameField', 'websiteField', 'datePicker', 'timePicker'].includes(question.type)) {
            // For text fields, just show latest answers
            return {
                type: 'text',
                total: totalAnswered,
                latest: allAnswers.slice(0, 5).map(a => a.value)
            };
        }

        if (['numberField', 'decimalField', 'currencyField'].includes(question.type)) {
            // For numbers, show average/min/max
            const values = allAnswers.map(a => parseFloat(a.value)).filter(v => !isNaN(v));
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = values.length ? (sum / values.length).toFixed(2) : 0;
            return {
                type: 'number',
                total: totalAnswered,
                avg,
                min: Math.min(...values),
                max: Math.max(...values),
                values: values
            };
        }

        // For choice fields, count occurrences
        const counts = {};
        allAnswers.forEach(a => {
            const val = a.value;
            if (Array.isArray(val)) {
                val.forEach(v => counts[v] = (counts[v] || 0) + 1);
            } else {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
        return { type: 'chart', total: totalAnswered, data };
    };

    return (
        <div className="form-editor-layout page-fade-in">
            <header className="form-editor-header">
                <div className="editor-header-left">
                    <button onClick={() => navigate('/dashboard')} className="btn-icon-back">←</button>
                    <h2 style={{ margin: 0 }}>{form.title} - Analytics</h2>
                </div>
            </header>

            <div className="form-editor-main" style={{ flexDirection: 'column', overflowY: 'auto' }}>
                <div className="analytics-summary-card">
                    <div className="stat-box">
                        <h3>Total Responses</h3>
                        <div className="stat-value">{responses.length}</div>
                    </div>
                    <div className="stat-box">
                        <h3>Completion Rate</h3>
                        <div className="stat-value">100%</div>
                    </div>
                </div>

                <div className="analytics-questions-list">
                    {form.questions.map((q, idx) => {
                        const stats = getQuestionStats(q);
                        return (
                            <div key={q.id} className="question-card" style={{ marginBottom: 20 }}>
                                <h4>{idx + 1}. {q.label}</h4>
                                <p className="text-sm text-gray-500">{stats.total} responses</p>

                                {stats.type === 'text' && (
                                    <div className="text-answers">
                                        <h5>Latest Answers:</h5>
                                        <ul>
                                            {stats.latest.map((ans, i) => <li key={i} className="text-answer-item">{ans}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {stats.type === 'number' && (
                                    <div className="number-stats">
                                        <div className="stat-row"><span>Average:</span> <strong>{stats.avg}</strong></div>
                                        <div className="stat-row"><span>Min:</span> <strong>{stats.min}</strong></div>
                                        <div className="stat-row"><span>Max:</span> <strong>{stats.max}</strong></div>
                                    </div>
                                )}

                                {stats.type === 'chart' && (
                                    <div style={{ width: '100%', height: 300, marginTop: 20 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.data}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#B292F2" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
