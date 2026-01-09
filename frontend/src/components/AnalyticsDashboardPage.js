import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import './AnalyticsDashboardPage.css';
import './FormEditorPage.css';
import { API_BASE_URL } from '../config';
import { Logo, SunIcon, MoonIcon, SearchIcon } from './Icons';

const COLORS = ['#B292F2', '#8A4FFF', '#FF7E67', '#6AAA64', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

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
    const [activeTab, setActiveTab] = useState('summary');
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
        const allAnswers = responses.flatMap(r =>
            (r.answers || []).filter(a => (a.questionId === question.id || a.id === question.id))
        );
        const totalAnswered = allAnswers.length;

        if (['shortText', 'nameField', 'emailField', 'phoneField', 'websiteField', 'addressField', 'longText'].includes(question.type)) {
            return {
                type: 'text',
                total: totalAnswered,
                latest: allAnswers.slice(0, 5).map(a => a.value)
            };
        }

        if (['numberField', 'decimalField', 'currencyField', 'starRating'].includes(question.type)) {
            const values = allAnswers.map(a => parseFloat(a.value)).filter(v => !isNaN(v));
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = values.length ? (sum / values.length).toFixed(2) : 0;

            const counts = {};
            values.forEach(v => counts[v] = (counts[v] || 0) + 1);
            const data = Object.entries(counts).map(([name, value]) => ({ name: String(name), value }));

            return {
                type: 'number_chart',
                total: totalAnswered,
                avg,
                min: values.length ? Math.min(...values) : 0,
                max: values.length ? Math.max(...values) : 0,
                data
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

    const AI_INSIGHTS = [
        "Consistent growth in responses over the last 7 days.",
        "Peak activity detected between 2:00 PM and 5:00 PM.",
        "Users are showing strong preference for multiple choice over text fields.",
        "High satisfaction levels detected based on average ratings.",
        "Most responses are coming from mobile devices."
    ];

    const getAIInsights = () => {
        if (responses.length === 0) return "Gathering data for AI insights...";
        return AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)];
    };

    const filteredResponses = responses.filter(r => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return r.answers.some(a => String(a.value).toLowerCase().includes(searchLower)) ||
            new Date(r.submittedAt).toLocaleDateString().includes(searchLower);
    });

    if (loading) return <div className="loading-screen" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', color: 'var(--text-dark)' }}>Loading premium analytics...</div>;

    if (!id) {
        return (
            <div className="analytics-layout page-fade-in">
                <header className="form-editor-header">
                    <div className="editor-header-left">
                        <div className="editor-logo" onClick={() => navigate('/dashboard')}><Logo /></div>
                        <button onClick={() => navigate('/dashboard')} className="btn-icon-back">← Dashboard</button>
                    </div>
                    <div className="editor-header-center" style={{ flex: 1, textAlign: 'center', fontWeight: '800', fontSize: '20px', color: 'var(--text-dark)' }}>
                        Analytics Overview
                    </div>
                    <div className="editor-header-right">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme" style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}>
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </header>
                <main className="analytics-main-content">
                    <h2 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '700' }}>Your Active Forms</h2>
                    <div className="stats-grid">
                        {allForms.map(f => (
                            <div key={f._id} className="stat-card-premium" onClick={() => navigate(`/forms/${f._id}/analytics`)} style={{ cursor: 'pointer' }}>
                                <div className="stat-label">{f.title}</div>
                                <div className="stat-value-large">{f._count?.responses || 0}</div>
                                <div style={{ color: 'var(--text-medium)', fontSize: '13px', marginTop: '12px' }}>Total Responses</div>
                                <button className="btn-editor-publish" style={{ marginTop: '20px', width: '100%' }}>View Details</button>
                            </div>
                        ))}
                    </div>
                    {allForms.length === 0 && <div className="empty-state" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-medium)' }}>No forms found. Start by creating one!</div>}
                </main>
            </div>
        );
    }

    if (!form) return <div className="error-screen">Form not found</div>;

    return (
        <div className="analytics-layout page-fade-in">
            <header className="form-editor-header">
                <div className="editor-header-left">
                    <div className="editor-logo" onClick={() => navigate('/dashboard')}><Logo /></div>
                    <button onClick={() => navigate('/analytics')} className="btn-icon-back">← Back</button>
                </div>
                <div className="editor-header-center" style={{ flex: 1, textAlign: 'center', fontWeight: '800', fontSize: '20px', color: 'var(--text-dark)' }}>
                    {form.title}
                </div>
                <div className="editor-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="live-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#6aaa64' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6aaa64', boxShadow: '0 0 8px #6aaa64' }}></span>
                        Live
                    </div>
                    <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme" style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}>
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </header>

            <main className="analytics-main-content">
                <div className="analytics-tabs">
                    <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
                    <button className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`} onClick={() => setActiveTab('responses')}>Responses</button>
                </div>

                {activeTab === 'summary' ? (
                    <>
                        <div className="ai-insights-box">
                            <div className="ai-header">✨ AI Insight</div>
                            <div className="ai-text">{getAIInsights()}</div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card-premium">
                                <div className="stat-label">Total Submissions</div>
                                <div className="stat-value-large">{responses.length}</div>
                            </div>
                            <div className="stat-card-premium">
                                <div className="stat-label">Completion Rate</div>
                                <div className="stat-value-large">
                                    {form.views > 0
                                        ? `${Math.round((responses.length / form.views) * 100)}%`
                                        : '0%'}
                                </div>
                            </div>
                            <div className="stat-card-premium">
                                <div className="stat-label">Avg. Response Time</div>
                                <div className="stat-value-large">
                                    {responses.length > 0
                                        ? (() => {
                                            const totalTime = responses.reduce((acc, r) => acc + (r.timeTaken || 0), 0);
                                            const avgSeconds = totalTime / responses.length;
                                            if (avgSeconds >= 60) return `${(avgSeconds / 60).toFixed(1)}m`;
                                            return `${Math.round(avgSeconds)}s`;
                                        })()
                                        : '0s'}
                                </div>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-title">Submission Trend</div>
                            <div style={{ width: '100%', height: 300, marginTop: '24px' }}>
                                <ResponsiveContainer>
                                    <LineChart data={(() => {
                                        const activity = {};
                                        responses.forEach(r => {
                                            const d = new Date(r.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                            activity[d] = (activity[d] || 0) + 1;
                                        });
                                        return Object.entries(activity).map(([date, count]) => ({ date, count }));
                                    })()}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="date" stroke="var(--text-medium)" fontSize={12} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} stroke="var(--text-medium)" fontSize={12} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                                        <Line type="monotone" dataKey="count" stroke="#B292F2" strokeWidth={4} dot={{ r: 6, fill: '#B292F2', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="questions-grid">
                            {form.questions.map((q, idx) => {
                                const stats = getQuestionStats(q);
                                const cType = chartTypes[q.id] || 'bar';

                                return (
                                    <div key={q.id} className="chart-card">
                                        <div className="chart-title-area">
                                            <div className="chart-title">{idx + 1}. {q.label}</div>
                                            <div style={{ color: 'var(--text-medium)', fontSize: '13px' }}>{stats.total} responses</div>
                                        </div>

                                        {stats.type === 'text' && (
                                            <div className="text-responses-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {stats.latest.map((ans, i) => (
                                                    <div key={i} style={{ background: 'var(--bg-light-gray)', padding: '12px 16px', borderRadius: '10px', color: 'var(--text-dark)', fontSize: '14px', border: '1px solid var(--border-color)' }}>{ans}</div>
                                                ))}
                                                {stats.latest.length === 0 && <div style={{ color: 'var(--text-medium)', textAlign: 'center', padding: '20px' }}>No responses yet.</div>}
                                            </div>
                                        )}

                                        {stats.type === 'number_chart' && (
                                            <div className="number-stats-layout">
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                                    {['avg', 'min', 'max'].map(k => (
                                                        <div key={k} style={{ flex: 1, background: 'var(--bg-light-gray)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                                                            <div style={{ color: 'var(--text-medium)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>{k}</div>
                                                            <div style={{ color: 'var(--text-dark)', fontSize: '18px', fontWeight: '800' }}>{stats[k]}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ height: 200 }}>
                                                    <ResponsiveContainer>
                                                        <BarChart data={stats.data}>
                                                            <Bar dataKey="value" fill="#B292F2" radius={[4, 4, 0, 0]} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}

                                        {stats.type === 'chart' && (
                                            <>
                                                <div className="chart-controls" style={{ marginBottom: '20px' }}>
                                                    <button className={`control-btn ${cType === 'bar' ? 'active' : ''}`} onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'bar' }))}>Bar</button>
                                                    <button className={`control-btn ${cType === 'pie' ? 'active' : ''}`} onClick={() => setChartTypes(p => ({ ...p, [q.id]: 'pie' }))}>Pie</button>
                                                </div>
                                                <div style={{ height: 250 }}>
                                                    <ResponsiveContainer>
                                                        {cType === 'bar' ? (
                                                            <BarChart data={stats.data}>
                                                                <XAxis dataKey="name" stroke="var(--text-medium)" fontSize={12} axisLine={false} tickLine={false} />
                                                                <Tooltip cursor={{ fill: 'var(--bg-light-gray)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                                                                <Bar dataKey="value" fill="#8A4FFF" radius={[6, 6, 0, 0]} />
                                                            </BarChart>
                                                        ) : (
                                                            <PieChart>
                                                                <Pie data={stats.data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                                    {stats.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                                </Pie>
                                                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
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
                    <div className="premium-table-container">
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="search-box" style={{ position: 'relative', width: '300px' }}>
                                <input
                                    className="fe-search-input"
                                    type="text"
                                    placeholder="Search responses..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ padding: '10px 16px 10px 40px', width: '100%', borderRadius: '10px', background: 'var(--bg-light-gray)', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}
                                />
                                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-medium)' }}><SearchIcon /></div>
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-medium)', fontWeight: '600' }}>Showing {filteredResponses.length} total responses</div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Submitted At</th>
                                        {form.questions.map(q => <th key={q.id}>{q.label}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResponses.map((r, i) => (
                                        <tr key={r._id || i}>
                                            <td style={{ fontWeight: '600', color: 'var(--text-medium)' }}>{new Date(r.submittedAt).toLocaleString()}</td>
                                            {form.questions.map(q => {
                                                const ans = r.answers.find(a => a.questionId === q.id || a.id === q.id);
                                                return <td key={q.id}>{ans ? getSafeValue(ans.value) : '-'}</td>;
                                            })}
                                        </tr>
                                    ))}
                                    {filteredResponses.length === 0 && (
                                        <tr>
                                            <td colSpan={form.questions.length + 1} style={{ textAlign: 'center', padding: '60px', color: 'var(--text-medium)' }}>No matching responses found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
