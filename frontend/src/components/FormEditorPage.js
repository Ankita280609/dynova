// Force commit of my local FormEditorPage.js

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './FormEditorPage.css';
import { Logo, HomeIcon, ThemesIcon, ExportIcon, SearchIcon, PlusIcon, ShareIcon, CopyIcon, WhatsAppIcon, EmailIcon, CloseIcon, SunIcon, MoonIcon, AiBotIcon } from './Icons';
import { API_BASE_URL } from '../config';

/* ---------------------- ICONS ---------------------- */
const Icon = ({ char }) => <span className="option-icon">{char}</span>;

/* ---------------------- DATA MODEL ---------------------- */
const questionTypesData = {
  'Frequently Used': [
    { id: 'nameField', name: 'Name', icon: <Icon char="👤" /> },
    { id: 'emailField', name: 'Email', icon: <Icon char="✉️" /> },
    { id: 'phoneField', name: 'Phone', icon: <Icon char="📞" /> },
  ],
  'Text Fields': [
    { id: 'shortText', name: 'Short Text', icon: <Icon char="📝" /> },
    { id: 'longText', name: 'Long Text', icon: <Icon char="🖊️" /> },
  ],
  'Numbers & Calculations': [
    { id: 'numberField', name: 'Number Field', icon: <Icon char="🔢" /> },
    { id: 'decimalField', name: 'Decimal Field', icon: <Icon char="➗" /> },
    { id: 'currencyField', name: 'Currency Field', icon: <Icon char="💰" /> },
    { id: 'formulaField', name: 'Formula Field', icon: <Icon char="🧮" /> },
  ],
  'Choices & Selections': [
    { id: 'singleSelect', name: 'Single Select (Radio)', icon: <Icon char="🔘" /> },
    { id: 'multiSelect', name: 'Multi Select (Checkbox)', icon: <Icon char="☑️" /> },
    { id: 'dropdown', name: 'Dropdown Menu', icon: <Icon char="🔽" /> },
    { id: 'imageChoice', name: 'Image Choice', icon: <Icon char="🖼️" /> },
    { id: 'emojiRating', name: 'Emoji Rating', icon: <Icon char="😄" /> },
    { id: 'starRating', name: 'Star Rating', icon: <Icon char="⭐" /> },
    { id: 'sliderScale', name: 'Slider Scale', icon: <Icon char="🎚️" /> },
    { id: 'matrixGrid', name: 'Matrix / Grid', icon: <Icon char="🗂️" /> },
  ],
  'Date & Time': [
    { id: 'datePicker', name: 'Date Picker', icon: <Icon char="📅" /> },
    { id: 'timePicker', name: 'Time Picker', icon: <Icon char="⏰" /> },
    { id: 'dateTimeCombo', name: 'Date & Time Combo', icon: <Icon char="🗓️" /> },
    { id: 'monthYearPicker', name: 'Month-Year Picker', icon: <Icon char="🗓️" /> },
  ],
  'Uploads & Media': [
    { id: 'fileUpload', name: 'File Upload', icon: <Icon char="📁" /> },
    { id: 'imageUpload', name: 'Image Upload', icon: <Icon char="🖼️" /> },
    { id: 'mediaUpload', name: 'Audio / Video Upload', icon: <Icon char="🎥" /> },
  ],
  'Consent & Legal': [
    { id: 'termsConditions', name: 'Terms & Conditions', icon: <Icon char="📜" /> },
    { id: 'digitalSignature', name: 'Digital Signature', icon: <Icon char="✍️" /> },
    { id: 'consentCheckbox', name: 'Consent Checkbox', icon: <Icon char="☑️" /> },
  ],
  'Advanced': [
    { id: 'scratchReveal', name: 'Scratch-to-Reveal', icon: <Icon char="🥚" /> },
    { id: 'matchFollowing', name: 'Match the Following', icon: <Icon char="🔗" /> },
    { id: 'moodMeter', name: 'Mood Meter', icon: <Icon char="🌈" /> },
    { id: 'animatedScale', name: 'Animated Scale', icon: <Icon char="🎨" /> },
  ],
};

const comingSoonTypes = [
  'imageChoice', 'emojiRating', 'starRating', 'sliderScale',
  'termsConditions', 'digitalSignature', 'consentCheckbox',
  'scratchReveal', 'matchFollowing', 'moodMeter', 'animatedScale'
];

const allQuestionTypes = Object.values(questionTypesData).flat();

/* ---------------------- HELPER UTILS ---------------------- */
const makeInstanceId = (typeId) => `${typeId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const defaultLabelFor = (typeId) => {
  const found = allQuestionTypes.find(t => t.id === typeId);
  return found ? found.name : 'Question';
};

const initializeMeta = (typeId) => {
  const meta = {};
  if (['singleSelect', 'multiSelect', 'dropdown', 'imageChoice'].includes(typeId)) {
    meta.options = ['Option 1', 'Option 2', 'Option 3'];
  }
  if (typeId === 'matrixGrid') {
    meta.rows = ['Row 1', 'Row 2'];
    meta.columns = ['Column 1', 'Column 2'];
  }
  if (typeId === 'starRating') meta.maxStars = 5;
  if (typeId === 'sliderScale') { meta.min = 0; meta.max = 10; }
  if (typeId === 'fileUpload') { meta.maxFiles = 1; meta.maxSizeMB = 10; }
  return meta;
};

/* ---------------------- SHARE MODAL ---------------------- */
/* ---------------------- SHARE MODAL ---------------------- */
function ShareModal({ formId, formTitle, onClose }) {
  const shareUrl = `${window.location.origin}/forms/${formId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const shareWhatsApp = () => {
    const text = `Check out this form: ${formTitle}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = `Please fill out this form: ${formTitle}`;
    const body = `Hi,\n\nPlease fill out this form "${formTitle}" using the link below:\n${shareUrl}\n\nThanks!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
          <h3 style={{ color: 'var(--text-dark)', margin: 0 }}>Share Form</h3>
          <button className="btn-icon-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body" style={{ padding: '24px 20px' }}>
          <p style={{ marginBottom: '1.2rem', color: 'var(--text-medium)', fontSize: '14px' }}>Share this form with your respondents.</p>

          <div className="share-link-box" style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="settings-input"
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-light-gray)', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}
            />
            <button className="btn-viewer-secondary" onClick={copyToClipboard} title="Copy Link" style={{ padding: '10px' }}>
              <CopyIcon />
            </button>
          </div>

          <div className="share-options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button className="share-option-btn-premium" onClick={shareWhatsApp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-light-gray)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ color: '#25D366' }}><WhatsAppIcon /></div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>WhatsApp</span>
            </button>
            <button className="share-option-btn-premium" onClick={shareEmail} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-light-gray)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ color: '#EA4335' }}><EmailIcon /></div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- MAIN EDITOR COMPONENT ---------------------- */

export default function FormEditorPage({ setPage, theme, toggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSubheading, setOpenSubheading] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Generate form using Gemini API
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!response.ok) throw new Error('Failed to generate form');
      const formData = await response.json();

      if (formData.title) setFormTitle(formData.title);
      if (formData.description) setFormDescription(formData.description);

      if (formData.elements && Array.isArray(formData.elements)) {
        const newQuestions = formData.elements.map(el => ({
          id: makeInstanceId(el.type),
          type: el.type,
          label: el.label || defaultLabelFor(el.type),
          meta: { ...initializeMeta(el.type), options: el.options || [] },
          required: el.required || false,
          conditional: { enabled: false, rules: [] }
        }));
        setQuestions(newQuestions);
        alert('AI generated your form!');
        setShowAiPrompt(false);
        setAiPrompt('');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate form with AI');
    } finally {
      setAiLoading(false);
    }
  };

  // Load form
  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/forms/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormTitle(data.title);
          setFormDescription(data.description || '');
          setQuestions(data.questions || []);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const saveForm = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to save a form.");
      navigate('/signin');
      return;
    }

    try {
      const url = id ? `${API_BASE_URL}/forms/${id}` : `${API_BASE_URL}/forms`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: formTitle, description: formDescription, questions }),
      });
      if (res.ok) {
        alert('Form saved!');
        if (!id && setPage) setPage('dashboard');
        else if (!id) navigate('/dashboard'); // Use navigate if setPage not present
      } else {
        const data = await res.json();
        alert(`Failed to save: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuestion = (qid, updates) => {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, ...updates } : q));
  };

  const addQuestion = (typeId) => {
    if (comingSoonTypes.includes(typeId)) {
      alert('Coming Soon: This feature is not yet functional.');
      return;
    }

    const newQ = {
      id: makeInstanceId(typeId),
      type: typeId,
      label: defaultLabelFor(typeId),
      meta: initializeMeta(typeId),
      required: false,
      conditional: { enabled: false, rules: [] }
    };
    setQuestions(prev => [...prev, newQ]);
    setSelectedQuestionId(newQ.id);
  };

  const duplicateQuestion = (qid) => {
    const idx = questions.findIndex(q => q.id === qid);
    if (idx === -1) return;
    const clone = { ...questions[idx], id: makeInstanceId(questions[idx].type) };
    const arr = [...questions];
    arr.splice(idx + 1, 0, clone);
    setQuestions(arr);
    setSelectedQuestionId(clone.id);
  };

  const deleteQuestion = (qid) => {
    setQuestions(prev => prev.filter(q => q.id !== qid));
    if (selectedQuestionId === qid) setSelectedQuestionId(null);
  };

  // Drag & Drop
  const draggingItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    draggingItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const fromIndex = draggingItem.current;
    const toIndex = dragOverItem.current;
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;

    const copy = [...questions];
    const item = copy[fromIndex];
    copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, item);
    setQuestions(copy);

    draggingItem.current = null;
    dragOverItem.current = null;
  };

  const handleSidebarDragStart = (e, typeId) => {
    e.dataTransfer.setData('typeId', typeId);
  };

  const handleDropOnCanvas = (e) => {
    const typeId = e.dataTransfer.getData('typeId');
    if (typeId) {
      addQuestion(typeId);
    }
  };

  return (
    <div className="form-editor-layout page-fade-in">
      <header className="form-editor-header">
        <div className="editor-header-left">
          <div className="editor-logo" onClick={() => navigate('/dashboard')}><Logo /></div>
          <button onClick={() => navigate('/dashboard')} className="btn-icon-back">← Back to Dashboard</button>
        </div>
        <div className="editor-header-center" style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: 'var(--text-dark)' }}>
          {formTitle}
        </div>
        <div className="editor-header-right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setShowAiPrompt(true)} className="btn-viewer-secondary" title="Generate with AI" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AiBotIcon /> Generate with AI
          </button>
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme" style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {id && (
            <button className="btn-share-premium" onClick={() => setShowShareModal(true)}>
              <ShareIcon /> Share
            </button>
          )}
          <button className="btn-editor-publish" onClick={saveForm} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (id ? 'Save Changes' : 'Create Form')}
          </button>
        </div>
      </header>

      {showShareModal && <ShareModal formId={id} formTitle={formTitle} onClose={() => setShowShareModal(false)} />}

      <div className="form-editor-main">
        {/* LEFT: Question Types */}
        <aside className="question-panel">
          <button className="btn-add-default" onClick={() => addQuestion('singleSelect')}>
            <PlusIcon /> Add Question
          </button>
          <div className="question-search">
            <SearchIcon />
            <input
              className="fe-search-input"
              placeholder="Find question type"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="types-list">
            {Object.entries(questionTypesData).map(([category, types]) => {
              const filtered = types.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
              if (searchTerm && filtered.length === 0) return null;
              const displayTypes = searchTerm ? filtered : types;
              const isOpen = openSubheading[category] || searchTerm;

              return (
                <div key={category} className="fe-subgroup">
                  <div
                    className="fe-subheading"
                    onClick={() => setOpenSubheading(prev => ({ ...prev, [category]: !prev[category] }))}
                  >
                    {category}
                  </div>
                  {isOpen && (
                    <div className="fe-options">
                      {displayTypes.map(t => (
                        <div
                          key={t.id}
                          className="option-item"
                          draggable
                          onDragStart={(e) => handleSidebarDragStart(e, t.id)}
                          onClick={() => addQuestion(t.id)}
                        >
                          {t.icon} {t.name}
                          {comingSoonTypes.includes(t.id) && (
                            <span style={{ fontSize: '10px', marginLeft: '8px', color: '#f59e0b', backgroundColor: '#fffbeb', padding: '2px 4px', borderRadius: '4px' }}>
                              Coming Soon
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER: Canvas */}
        <main
          className="canvas-panel"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropOnCanvas}
        >
          <div className="form-title-group">
            <input
              className="form-title-input"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
            />
            <input
              className="form-desc-input"
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Form Description"
            />
          </div>

          <div className="questions-list">
            {questions.length === 0 && (
              <div className="add-question-placeholder" onClick={() => document.querySelector('.question-panel').scrollIntoView({ behavior: 'smooth' })}>
                <PlusIcon /> Drag and drop question types here
              </div>
            )}
            {questions.map((q, index) => (
              <QuestionPreview
                key={q.id}
                q={q}
                index={index}
                isSelected={selectedQuestionId === q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        </main>

        {/* RIGHT: Settings */}
        <aside className="settings-panel">
          <SettingsPanel
            questions={questions}
            selectedId={selectedQuestionId}
            updateQuestion={updateQuestion}
            onDuplicate={() => duplicateQuestion(selectedQuestionId)}
            onDelete={() => deleteQuestion(selectedQuestionId)}
          />
        </aside>
      </div>

      {/* AI PROMPT MODAL */}
      {showAiPrompt && (
        <div className="modal-overlay" onClick={() => setShowAiPrompt(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Generate Form with AI</h3>
              <button className="btn-icon-close" onClick={() => setShowAiPrompt(false)}><CloseIcon /></button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p style={{ marginBottom: '16px', color: 'var(--text-medium)' }}>Describe the form you want to create:</p>
              <textarea
                className="q-textarea"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g., Create a gym membership registration form with name, email, membership type"
                rows={5}
                style={{ width: '100%', resize: 'vertical', marginBottom: '16px' }}
              />
              <button
                className="btn-editor-publish"
                onClick={handleGenerateWithAI}
                disabled={aiLoading || !aiPrompt.trim()}
                style={{ width: '100%' }}
              >
                {aiLoading ? 'Generating...' : 'Generate Form'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ---------------------- QUESTION PREVIEW (Canvas) ---------------------- */
function QuestionPreview({ q, index, isSelected, onClick, onDragStart, onDragEnter, onDragEnd }) {
  return (
    <div
      className={`question-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
    >
      <div className="drag-handle">⋮⋮</div>
      <div className="question-preview-label">
        {index + 1}. {q.label} {q.required && <span style={{ color: 'red' }}>*</span>}
      </div>
      <div className="question-preview-body">
        {renderPreviewBody(q)}
      </div>
    </div>
  );
}

function renderPreviewBody(q) {
  if (['shortText', 'nameField', 'emailField', 'phoneField', 'websiteField'].includes(q.type)) {
    return <input className="q-input" disabled placeholder="Short answer text" />;
  }
  if (['longText', 'addressField', 'descriptionText'].includes(q.type)) {
    return <textarea className="q-textarea" disabled placeholder="Long answer text" />;
  }
  if (['singleSelect', 'radio'].includes(q.type)) {
    return (
      <div className="q-choices">
        {(q.meta.options || []).map((opt, i) => (
          <div key={i} className="q-choice-item"><input type="radio" disabled /> {opt}</div>
        ))}
      </div>
    );
  }
  if (['multiSelect', 'consentCheckbox', 'termsConditions'].includes(q.type)) {
    return (
      <div className="q-choices">
        {(q.meta.options || ['Option']).map((opt, i) => (
          <div key={i} className="q-choice-item"><input type="checkbox" disabled /> {opt}</div>
        ))}
      </div>
    );
  }
  if (q.type === 'dropdown') {
    return (
      <select className="q-select" disabled>
        <option>Select option</option>
      </select>
    );
  }
  if (q.type === 'matrixGrid') {
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '12px' }}>
          <thead>
            <tr><th></th>{(q.meta.columns || []).map((c, i) => <th key={i}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {(q.meta.rows || []).map((r, i) => (
              <tr key={i}><td>{r}</td>{(q.meta.columns || []).map((c, j) => <td key={j}><input type="radio" disabled /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>{q.type} preview</div>;
}

/* ---------------------- SETTINGS PANEL (Right) ---------------------- */
function SettingsPanel({ questions, selectedId, updateQuestion, onDuplicate, onDelete }) {
  if (!selectedId) {
    return (
      <div className="settings-empty">
        <p>Select a question to edit its properties.</p>
      </div>
    );
  }

  const q = questions.find(x => x.id === selectedId);
  if (!q) return <div className="settings-empty">Question not found.</div>;

  const handleMetaChange = (key, val) => {
    updateQuestion(q.id, { meta: { ...q.meta, [key]: val } });
  };

  return (
    <div className="settings-content">
      <div className="settings-header">Edit Question</div>

      <div className="form-group">
        <label>Label</label>
        <input
          className="settings-input"
          value={q.label}
          onChange={e => updateQuestion(q.id, { label: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          className="settings-select"
          value={q.type}
          onChange={e => updateQuestion(q.id, { type: e.target.value, meta: initializeMeta(e.target.value) })}
        >
          {allQuestionTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={q.required || false}
            onChange={e => updateQuestion(q.id, { required: e.target.checked })}
          /> Required
        </label>
      </div>

      {/* WORD LIMITS (Text Fields) */}
      {['shortText', 'longText'].includes(q.type) && (
        <div className="settings-section">
          <h4>Word Limits</h4>
          <div className="form-group">
            <label>Minimum Words</label>
            <input
              type="number"
              className="settings-input"
              value={q.meta.minWords || ''}
              onChange={e => handleMetaChange('minWords', e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <div className="form-group">
            <label>Maximum Words</label>
            <input
              type="number"
              className="settings-input"
              value={q.meta.maxWords || ''}
              onChange={e => handleMetaChange('maxWords', e.target.value)}
              placeholder="e.g. 100"
            />
          </div>
        </div>
      )}

      {/* OPTIONS CONFIG */}
      {['singleSelect', 'multiSelect', 'dropdown', 'imageChoice'].includes(q.type) && (
        <div className="settings-section">
          <h4>Options</h4>
          <div className="options-list">
            {(q.meta.options || []).map((opt, i) => (
              <div key={i} className="option-row">
                <input
                  className="settings-input"
                  value={opt}
                  onChange={e => {
                    const newOpts = [...q.meta.options];
                    newOpts[i] = e.target.value;
                    handleMetaChange('options', newOpts);
                  }}
                />
                <button className="btn-icon-danger" onClick={() => {
                  const newOpts = [...q.meta.options];
                  newOpts.splice(i, 1);
                  handleMetaChange('options', newOpts);
                }}>×</button>
              </div>
            ))}
          </div>
          <button className="btn-small-add" onClick={() => handleMetaChange('options', [...(q.meta.options || []), `Option ${(q.meta.options || []).length + 1}`])}>+ Add Option</button>
        </div>
      )}

      {/* GRID CONFIG */}
      {q.type === 'matrixGrid' && (
        <div className="settings-section">
          <h4>Rows</h4>
          <div className="options-list">
            {(q.meta.rows || []).map((r, i) => (
              <div key={i} className="option-row">
                <input className="settings-input" value={r} onChange={e => {
                  const newRows = [...q.meta.rows];
                  newRows[i] = e.target.value;
                  handleMetaChange('rows', newRows);
                }} />
                <button className="btn-icon-danger" onClick={() => {
                  const newRows = [...q.meta.rows];
                  newRows.splice(i, 1);
                  handleMetaChange('rows', newRows);
                }}>×</button>
              </div>
            ))}
          </div>
          <button className="btn-small-add" onClick={() => handleMetaChange('rows', [...(q.meta.rows || []), `Row ${(q.meta.rows || []).length + 1}`])}>+ Add Row</button>

          <h4 style={{ marginTop: 16 }}>Columns</h4>
          <div className="options-list">
            {(q.meta.columns || []).map((c, i) => (
              <div key={i} className="option-row">
                <input className="settings-input" value={c} onChange={e => {
                  const newCols = [...q.meta.columns];
                  newCols[i] = e.target.value;
                  handleMetaChange('columns', newCols);
                }} />
                <button className="btn-icon-danger" onClick={() => {
                  const newCols = [...q.meta.columns];
                  newCols.splice(i, 1);
                  handleMetaChange('columns', newCols);
                }}>×</button>
              </div>
            ))}
          </div>
          <button className="btn-small-add" onClick={() => handleMetaChange('columns', [...(q.meta.columns || []), `Column ${(q.meta.columns || []).length + 1}`])}>+ Add Column</button>
        </div>
      )}


      {/* CONDITIONAL LOGIC (Numbers & Dates) */}
      {(['numberField', 'decimalField', 'currencyField', 'datePicker'].includes(q.type)) && (
        <div className="settings-section" style={{ border: 'none', padding: 0 }}>
          <label style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#333' }}>
            <input
              type="checkbox"
              checked={q.conditional?.enabled || false}
              onChange={e => updateQuestion(q.id, { conditional: { ...q.conditional, enabled: e.target.checked } })}
              style={{ marginRight: '8px', width: '16px', height: '16px' }}
            /> Add Conditional Logic
          </label>

          {q.conditional?.enabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {q.type === 'datePicker' && (
                <div style={{ marginBottom: '4px', padding: '0 4px' }}>
                  <label style={{ fontSize: '12px', marginRight: '8px', color: '#666' }}>Logic Type:</label>
                  <select
                    value={q.conditional.mode || 'date'}
                    onChange={e => updateQuestion(q.id, { conditional: { ...q.conditional, mode: e.target.value, rules: [] } })}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
                  >
                    <option value="date">Date Based</option>
                    <option value="age">Age Based</option>
                  </select>
                </div>
              )}

              {(q.conditional.rules || []).map((rule, i) => (
                <div key={i} className="logic-rule-card" style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '14px', color: '#4b5563', whiteSpace: 'nowrap' }}>Condition {i + 1}: If answer is</span>

                      <select
                        value={rule.operator}
                        onChange={e => {
                          const newRules = [...q.conditional.rules];
                          newRules[i].operator = e.target.value;
                          updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          color: '#111827',
                          minWidth: '180px'
                        }}
                      >
                        {/* Date Mode Operators */}
                        {q.type === 'datePicker' && (q.conditional.mode === 'date' || !q.conditional.mode) && (
                          <>
                            <option value="before">Before</option>
                            <option value="after">After</option>
                            <option value="is">Is</option>
                          </>
                        )}

                        {/* Number/Age Mode Operators */}
                        {(!['datePicker'].includes(q.type) || (q.type === 'datePicker' && q.conditional.mode === 'age')) && (
                          <>
                            <option value="gt">Greater than (&gt;)</option>
                            <option value="gte">Greater than or equal (&ge;)</option>
                            <option value="lt">Less than (&lt;)</option>
                            <option value="lte">Less than or equal (&le;)</option>
                            <option value="eq">Equal to (=)</option>
                            <option value="neq">Not equal to (&ne;)</option>
                          </>
                        )}
                      </select>

                      {/* Input based on type/mode */}
                      {q.type === 'datePicker' && (q.conditional.mode === 'date' || !q.conditional.mode) ? (
                        <input
                          type="date"
                          value={rule.value}
                          onChange={e => {
                            const newRules = [...q.conditional.rules];
                            newRules[i].value = e.target.value;
                            updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                          }}
                          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', width: '140px' }}
                        />
                      ) : (
                        <input
                          type="number"
                          value={rule.value}
                          placeholder={q.conditional?.mode === 'age' ? "Age" : "Value"}
                          onChange={e => {
                            const newRules = [...q.conditional.rules];
                            newRules[i].value = e.target.value;
                            updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                          }}
                          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', width: '100px' }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const newRules = [...q.conditional.rules];
                        newRules.splice(i, 1);
                        updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                      title="Remove Condition"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Follow-up Questions Section */}
                  <div style={{ marginLeft: '16px', borderLeft: '2px solid #3b82f6', paddingLeft: '16px', marginTop: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>Follow-up questions:</div>

                    {(rule.targets || []).map((targetId, tIdx) => {
                      const targetQ = questions.find(x => x.id === targetId);
                      return (
                        <div key={tIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#1f2937' }}>
                          <span>• {targetQ ? targetQ.label : 'Unknown Question'}</span>
                          <button
                            onClick={() => {
                              const newRules = [...q.conditional.rules];
                              const newTargets = [...(newRules[i].targets || [])];
                              newTargets.splice(tIdx, 1);
                              newRules[i].targets = newTargets;
                              updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                            }}
                            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}
                          >×</button>
                        </div>
                      );
                    })}

                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          // Toggle a simple dropdown for demo purposes
                          const dropdown = document.getElementById(`followup-dropdown-${i}`);
                          if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: 0 }}
                      >
                        + Add Follow-up Question
                      </button>
                      {/* Simple Dropdown for selecting follow-up questions */}
                      <div id={`followup-dropdown-${i}`} style={{
                        display: 'none',
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        borderRadius: '6px',
                        zIndex: 10,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        width: '250px',
                        marginTop: '4px'
                      }}>
                        {questions.filter(x => x.id !== q.id && !(rule.targets || []).includes(x.id)).map(targetQ => (
                          <div
                            key={targetQ.id}
                            onClick={() => {
                              const newRules = [...q.conditional.rules];
                              const newTargets = [...(newRules[i].targets || [])];
                              newTargets.push(targetQ.id);
                              newRules[i].targets = newTargets;
                              updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                              document.getElementById(`followup-dropdown-${i}`).style.display = 'none';
                            }}
                            style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                          >
                            {targetQ.label}
                          </div>
                        ))}
                        {questions.filter(x => x.id !== q.id && !(rule.targets || []).includes(x.id)).length === 0 && (
                          <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9ca3af' }}>No other questions available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn-add-condition"
                disabled={!(q.conditional.rules || []).every(r => r.value && r.value.trim() !== '')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px dashed #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: (q.conditional.rules || []).every(r => r.value && r.value.trim() !== '') ? '#f9fafb' : '#f3f4f6',
                  color: (q.conditional.rules || []).every(r => r.value && r.value.trim() !== '') ? '#4b5563' : '#9ca3af',
                  cursor: (q.conditional.rules || []).every(r => r.value && r.value.trim() !== '') ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px',
                  textAlign: 'center'
                }}
                onClick={() => {
                  const canAdd = (q.conditional.rules || []).every(r => r.value && r.value.trim() !== '');
                  if (!canAdd) return;

                  let defaultOp = 'eq';
                  if (q.type === 'datePicker' && (q.conditional.mode === 'date' || !q.conditional.mode)) defaultOp = 'is';
                  else defaultOp = 'gt';

                  const newRules = [...(q.conditional.rules || []), { operator: defaultOp, value: '', targets: [] }];
                  updateQuestion(q.id, { conditional: { ...q.conditional, rules: newRules } });
                }}
              >
                + Add Another Condition
              </button>

              <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', marginTop: '8px', textAlign: 'center' }}>
                Note: Multiple conditions allow different follow-up questions based on the answer
              </div>
            </div>
          )}
        </div>
      )}

      <div className="settings-actions">
        <button className="btn-action" onClick={onDuplicate}>Duplicate</button>
        <button className="btn-action danger" onClick={onDelete}>Delete</button>
      </div>
    </div >
  );
}
