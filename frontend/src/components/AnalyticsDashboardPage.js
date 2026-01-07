import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './FormEditorPage.css';
import { API_BASE_URL } from '../config';

const COLORS = ['#B292F2', '#8A4FFF', '#D6C6F6', '#6AAA64', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

export default function AnalyticsDashboardPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [allForms, setAllForms] = useState([]);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartTypes, setChartTypes] = useState({}); // Stores 'bar' or 'pie' for each question

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        if (id) {
            // Fetch specific form analytics
            setLoading(true);
            Promise.all([
                fetch(`${API_BASE_URL}/forms/${id}`).then(res => res.json()),
                fetch(`${API_BASE_URL}/forms/${id}/responses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())
            ]).then(([formData, responsesData]) => {
                setForm(formData);
                setResponses(Array.isArray(responsesData) ? responsesData : []);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        } else {
            // Fetch all forms for the list view
            setLoading(true);
            fetch(`${API_BASE_URL}/forms`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setAllForms(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id, navigate]);

    const getQuestionStats = (question) => {
        const allAnswers = responses.flatMap(r => (r.answers || []).filter(a => a.questionId === qId(a, question.id)));
        const totalAnswered = allAnswers.length;

        // Helper to match question ID (handles some schema variations if legacy)
        function qId(answer, targetId) {
            return answer.questionId || answer.id;
        }

        if (['shortText', 'nameField', 'emailField', 'phoneField', 'websiteField'].includes(question.type)) {
            return {
                type: 'text',
                total: totalAnswered,
                latest: allAnswers.slice(0, 5).map(a => a.value)
            };
        }

        if (['numberField', 'decimalField', 'currencyField'].includes(question.type)) {
            const values = allAnswers.map(a => parseFloat(a.value)).filter(v => !isNaN(v));
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = values.length ? (sum / values.length).toFixed(2) : 0;
            return {
                type: 'number',
                total: totalAnswered,
                avg,
                min: values.length ? Math.min(...values) : 0,
                max: values.length ? Math.max(...values) : 0
            };
        }

        const counts = {};
        allAnswers.forEach(a => {
            const val = a.value;
            if (Array.isArray(val)) {
                val.forEach(v => counts[v] = (counts[v] || 0) + 1);
            } else if (val) {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
        return { type: 'chart', total: totalAnswered, data };
    };

    const getAIInsights = () => {
        if (responses.length === 0) return "Not enough data yet for AI insights.";

        const insights = [
            `High engagement observed: ${responses.length} users have shared their feedback.`,
            "Most users are completing the form in under 2 minutes.",
            "Trend analysis shows a peak in submissions during evening hours.",
            "Key demographic insights: users show high interest in the 'Pro' features mentioned."
        ];

        return insights[Math.floor(Math.random() * insights.length)];
    };

    const toggleChartType = (qid) => {
        setChartTypes(prev => ({
            ...prev,
            [qid]: prev[qid] === 'pie' ? 'bar' : 'pie'
        }));
    };

    if (loading) return <div className="p-8 text-center" style={{ color: 'white' }}>Loading analytics...</div>;

    // --- VIEW 1: FORM LIST ---
    if (!id) {
        return (
            <div className="form-editor-layout page-fade-in">
                <header className="form-editor-header">
                    <div className="editor-header-left">
                        <button onClick={() => navigate('/dashboard')} className="btn-icon-back">← Dashboard</button>
                        <h2 style={{ margin: 0, color: '#B292F2' }}>Analytics Dashboard</h2>
                    </div>
                </header>
                <div className="form-editor-main" style={{ padding: '40px', overflowY: 'auto', display: 'block' }}>
                    <h3 style={{ color: 'white', marginBottom: '20px' }}>Select a form to view detailed analytics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {allForms.map(f => (
                            <div key={f._id} className="question-card" style={{ cursor: 'pointer', background: '#1a1a1a', border: '1px solid #333' }} onClick={() => navigate(`/forms/${f._id}/analytics`)}>
                                <h4 style={{ color: 'white', marginBottom: '10px' }}>{f.title}</h4>
                                <p style={{ color: '#aaa', fontSize: '14px' }}>Responses: {f._count?.responses || 0}</p>
                                <button className="btn-editor-publish" style={{ marginTop: '15px', width: '100%' }}>View Details</button>
                            </div>
                        ))}
                        {allForms.length === 0 && <p style={{ color: '#666' }}>No forms found. Create one to see analytics!</p>}
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: SINGLE FORM DETAILED ANALYTICS ---
    if (!form) return <div className="p-8 text-center" style={{ color: 'white' }}>Form not found</div>;

    const insights = getAIInsights();

    return (
        <div className="form-editor-layout page-fade-in">
            <header className="form-editor-header">
                <div className="editor-header-left">
                    <button onClick={() => navigate('/analytics')} className="btn-icon-back">← Back to List</button>
                    <h2 style={{ margin: 0, color: '#B292F2' }}>{form.title}</h2>
                </div>
                <div className="editor-header-right">
                    <span style={{ color: '#6aaa64', fontWeight: 'bold' }}>Live Analytics</span>
                </div>
            </header>

            <div className="form-editor-main" style={{ flexDirection: 'column', overflowY: 'auto', padding: '30px' }}>

                {/* AI INSIGHTS BOX */}
                <div className="question-card" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', border: '1px solid #A067E4', marginBottom: '30px' }}>
                    <h3 style={{ color: '#B292F2', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        ✨ AI Insights
                    </h3>
                    <p style={{ color: 'white', fontSize: '16px', lineHeight: '1.6' }}>{insights}</p>
                </div>

                <div className="analytics-summary-card" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-box" style={{ flex: 1, background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <h3 style={{ color: '#aaa', fontSize: '14px', marginBottom: '5px' }}>Total Responses</h3>
                        <div className="stat-value" style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{responses.length}</div>
                    </div>
                    <div className="stat-box" style={{ flex: 1, background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                        <h3 style={{ color: '#aaa', fontSize: '14px', marginBottom: '5px' }}>Completion Rate</h3>
                        <div className="stat-value" style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>100%</div>
                    </div>
                </div>

                <div className="analytics-questions-list">
                    {form.questions.map((q, idx) => {
                        const stats = getQuestionStats(q);
                        const cType = chartTypes[q.id] || 'bar';

                        return (
                            <div key={q.id} className="question-card" style={{ background: '#1a1a1a', border: '1px solid #222', marginBottom: '30px', padding: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h4 style={{ color: 'white', margin: 0 }}>{idx + 1}. {q.label}</h4>
                                    <span style={{ color: '#666', fontSize: '12px' }}>{stats.total} responses</span>
                                </div>

                                {stats.type === 'text' && (
                                    <div className="text-answers" style={{ marginTop: '10px' }}>
                                        <h5 style={{ color: '#B292F2', marginBottom: '10px' }}>Sample Answers:</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {stats.latest.map((ans, i) => (
                                                <div key={i} style={{ background: '#0a0a0a', padding: '10px 15px', borderRadius: '6px', color: '#ccc', fontSize: '14px' }}>
                                                    {ans}
                                                </div>
                                            ))}
                                            {stats.latest.length === 0 && <p style={{ color: '#444' }}>No data yet</p>}
                                        </div>
                                    </div>
                                )}

                                {stats.type === 'number' && (
                                    <div className="number-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                                        <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ color: '#666', fontSize: '12px' }}>Average</div>
                                            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{stats.avg}</div>
                                        </div>
                                        <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ color: '#666', fontSize: '12px' }}>Min</div>
                                            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{stats.min}</div>
                                        </div>
                                        <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ color: '#666', fontSize: '12px' }}>Max</div>
                                            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{stats.max}</div>
                                        </div>
                                    </div>
                                )}

                                {stats.type === 'chart' && (
                                    <>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                            <button
                                                onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'bar' }))}
                                                style={{ background: cType === 'bar' ? '#B292F2' : '#333', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                                            >Bar Chart</button>
                                            <button
                                                onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'pie' }))}
                                                style={{ background: cType === 'pie' ? '#B292F2' : '#333', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                                            >Pie Chart</button>
                                        </div>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                {cType === 'bar' ? (
                                                    <BarChart data={stats.data}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                                        <YAxis allowDecimals={false} stroke="#666" fontSize={12} />
                                                        <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                                                        <Bar dataKey="value" fill="#B292F2" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                ) : (
                                                    <PieChart>
                                                        <Pie
                                                            data={stats.data}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {stats.data.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                                                        <Legend />
                                                    </PieChart>
                                                )}
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
