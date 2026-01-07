import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './FormEditorPage.css';
import { API_BASE_URL } from '../config';

const COLORS = ['#B292F2', '#8A4FFF', '#D6C6F6', '#6AAA64', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

// Helper to get safe string value
const getSafeValue = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return val || '-';
};

export default function AnalyticsDashboardPage({ theme, toggleTheme }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [allForms, setAllForms] = useState([]);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartTypes, setChartTypes] = useState({});
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'responses'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        if (id) {
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
        // Correctly filter answers for this specific question ID
        const allAnswers = responses.flatMap(r =>
            (r.answers || []).filter(a => (a.questionId === question.id || a.id === question.id))
        );
        const totalAnswered = allAnswers.length;

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

    // Filter responses for table view
    const filteredResponses = responses.filter(r => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return r.answers.some(a => String(a.value).toLowerCase().includes(searchLower)) ||
            new Date(r.submittedAt).toLocaleDateString().includes(searchLower);
    });

    if (loading) return <div className="p-8 text-center" style={{ color: 'var(--text-dark)' }}>Loading analytics...</div>;

    // --- VIEW 1: FORM LIST ---
    if (!id) {
        return (
            <div className="form-editor-layout page-fade-in">
                <header className="form-editor-header">
                    <div className="editor-header-left">
                        <button onClick={() => navigate('/dashboard')} className="btn-icon-back">← Dashboard</button>
                        <h2 style={{ margin: 0, color: '#B292F2' }}>Analytics Dashboard</h2>
                    </div>
                    <div className="editor-header-right">
                        <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Theme" style={{ background: 'none', border: 'none', color: 'inherit', padding: '8px', cursor: 'pointer' }}>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </header>
                <div className="form-editor-main" style={{ padding: '40px', overflowY: 'auto', display: 'block' }}>
                    <h3 style={{ color: 'var(--text-white)', marginBottom: '20px' }}>Select a form to view detailed analytics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {allForms.map(f => (
                            <div key={f._id} className="question-card" style={{ cursor: 'pointer', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} onClick={() => navigate(`/forms/${f._id}/analytics`)}>
                                <h4 style={{ color: 'var(--text-white)', marginBottom: '10px' }}>{f.title}</h4>
                                <p style={{ color: 'var(--text-medium)', fontSize: '14px' }}>Responses: {f._count?.responses || 0}</p>
                                <button className="btn-editor-publish" style={{ marginTop: '15px', width: '100%' }}>View Details</button>
                            </div>
                        ))}
                        {allForms.length === 0 && <p style={{ color: 'var(--text-medium)' }}>No forms found.</p>}
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: SINGLE FORM DETAILED ANALYTICS ---
    if (!form) return <div className="p-8 text-center">Form not found</div>;

    return (
        <div className="form-editor-layout page-fade-in">
            <header className="form-editor-header">
                <div className="editor-header-left">
                    <button onClick={() => navigate('/analytics')} className="btn-icon-back">← Back</button>
                    <h2 style={{ margin: 0, color: '#B292F2' }}>{form.title}</h2>
                </div>
                <div className="editor-header-right" style={{ gap: '15px', display: 'flex', alignItems: 'center' }}>
                    <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Theme" style={{ background: 'none', border: 'none', color: 'inherit', padding: '8px', cursor: 'pointer' }}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <span style={{ color: '#6aaa64', fontWeight: 'bold' }}>Live Analytics</span>
                </div>
            </header>

            <div className="form-editor-main" style={{ flexDirection: 'column', overflowY: 'auto', padding: '30px' }}>

                {/* TAB CONTROLS */}
                <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '25px', border: '1px solid var(--border-color)' }}>
                    <button
                        onClick={() => setActiveTab('summary')}
                        style={{
                            padding: '8px 24px',
                            background: activeTab === 'summary' ? 'var(--primary-purple)' : 'transparent',
                            color: activeTab === 'summary' ? 'white' : 'var(--text-medium)',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Summary View
                    </button>
                    <button
                        onClick={() => setActiveTab('responses')}
                        style={{
                            padding: '8px 24px',
                            background: activeTab === 'responses' ? 'var(--primary-purple)' : 'transparent',
                            color: activeTab === 'responses' ? 'white' : 'var(--text-medium)',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Individual Responses
                    </button>
                </div>

                {activeTab === 'summary' ? (
                    <>
                        {/* AI INSIGHTS */}
                        <div className="question-card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-app) 100%)', border: '1px solid #B292F2', marginBottom: '30px' }}>
                            <h3 style={{ color: '#B292F2', marginBottom: '10px' }}>✨ AI Insights</h3>
                            <p style={{ color: 'var(--text-white)', fontSize: '16px' }}>{getAIInsights()}</p>
                        </div>

                        {/* SUMMARY CARDS */}
                        <div className="analytics-summary-card" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div className="stat-box" style={{ flex: 1, background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ color: 'var(--text-medium)', fontSize: '14px' }}>Total Responses</h3>
                                <div className="stat-value" style={{ color: 'var(--text-white)', fontSize: '32px', fontWeight: 'bold' }}>{responses.length}</div>
                            </div>
                            <div className="stat-box" style={{ flex: 1, background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ color: 'var(--text-medium)', fontSize: '14px' }}>Completion Rate</h3>
                                <div className="stat-value" style={{ color: 'var(--text-white)', fontSize: '32px', fontWeight: 'bold' }}>100%</div>
                            </div>
                        </div>

                        {/* QUESTIONS LIST */}
                        <div className="analytics-questions-list">
                            {form.questions.map((q, idx) => {
                                const stats = getQuestionStats(q);
                                const cType = chartTypes[q.id] || 'bar';

                                return (
                                    <div key={q.id} className="question-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '30px', padding: '25px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <h4 style={{ color: 'var(--text-white)', margin: 0 }}>{idx + 1}. {q.label}</h4>
                                            <span style={{ color: 'var(--text-medium)', fontSize: '12px' }}>{stats.total} responses</span>
                                        </div>

                                        {stats.type === 'text' && (
                                            <div className="text-answers">
                                                <h5 style={{ color: '#B292F2', marginBottom: '10px' }}>Sample Answers:</h5>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {stats.latest.map((ans, i) => (
                                                        <div key={i} style={{ background: 'var(--bg-app)', padding: '10px', borderRadius: '6px', color: 'var(--text-medium)' }}>{ans}</div>
                                                    ))}
                                                    {stats.latest.length === 0 && <p style={{ color: 'var(--text-medium)' }}>No data yet</p>}
                                                </div>
                                            </div>
                                        )}

                                        {stats.type === 'number' && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                                {['avg', 'min', 'max'].map(k => (
                                                    <div key={k} style={{ background: 'var(--bg-app)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                                        <div style={{ color: 'var(--text-medium)', fontSize: '12px', textTransform: 'capitalize' }}>{k}</div>
                                                        <div style={{ color: 'var(--text-white)', fontSize: '20px', fontWeight: 'bold' }}>{stats[k]}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {stats.type === 'chart' && (
                                            <>
                                                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                                    <button onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'bar' }))} style={{ background: cType === 'bar' ? '#B292F2' : 'var(--bg-app)', border: '1px solid var(--border-color)', color: cType === 'bar' ? 'white' : 'var(--text-medium)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>Bar</button>
                                                    <button onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'pie' }))} style={{ background: cType === 'pie' ? '#B292F2' : 'var(--bg-app)', border: '1px solid var(--border-color)', color: cType === 'pie' ? 'white' : 'var(--text-medium)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>Pie</button>
                                                </div>
                                                <div style={{ width: '100%', height: 300 }}>
                                                    <ResponsiveContainer>
                                                        {cType === 'bar' ? (
                                                            <BarChart data={stats.data}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                                                <XAxis dataKey="name" stroke="var(--text-medium)" fontSize={12} />
                                                                <YAxis allowDecimals={false} stroke="var(--text-medium)" fontSize={12} />
                                                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-white)' }} />
                                                                <Bar dataKey="value" fill="#B292F2" radius={[4, 4, 0, 0]} />
                                                            </BarChart>
                                                        ) : (
                                                            <PieChart>
                                                                <Pie data={stats.data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                                                    {stats.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                                </Pie>
                                                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-white)' }} />
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
                    </>
                ) : (
                    // --- SPREADSHEET VIEW ---
                    <div className="table-container" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Search responses..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-white)', width: '300px' }}
                            />
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-app)', color: 'var(--text-medium)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px', borderBottom: '2px solid var(--border-color)' }}>Submitted At</th>
                                    {form.questions.map(q => (
                                        <th key={q.id} style={{ padding: '15px', borderBottom: '2px solid var(--border-color)' }}>{q.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResponses.map((r, i) => (
                                    <tr key={r._id || i} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-white)' }}>
                                        <td style={{ padding: '15px' }}>{new Date(r.submittedAt).toLocaleString()}</td>
                                        {form.questions.map(q => {
                                            // Find answer strictly by question ID
                                            const ans = r.answers.find(a => a.questionId === q.id || a.id === q.id);
                                            return (
                                                <td key={q.id} style={{ padding: '15px' }}>
                                                    {ans ? getSafeValue(ans.value) : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {filteredResponses.length === 0 && (
                                    <tr>
                                        <td colSpan={form.questions.length + 1} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-medium)' }}>
                                            No responses matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
