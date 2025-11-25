import React, { useState, useRef } from 'react';
import './FormEditorPage.css';
import { Logo, HomeIcon, ThemesIcon, ExportIcon, SearchIcon } from './Icons';

/* ---------------------- ICONS (emoji placeholders) ---------------------- */
const ShortTextIcon = () => <span className="option-icon">🔤</span>;
const LongTextIcon = () => <span className="option-icon">📝</span>;
const NameIcon = () => <span className="option-icon">👤</span>;
const EmailIcon = () => <span className="option-icon">✉️</span>;
const PhoneIcon = () => <span className="option-icon">📞</span>;
const AddressIcon = () => <span className="option-icon">🏠</span>;
const WebsiteIcon = () => <span className="option-icon">🌐</span>;
const NumberIcon = () => <span className="option-icon">#️⃣</span>;
const DecimalIcon = () => <span className="option-icon">🔢</span>;
const CurrencyIcon = () => <span className="option-icon">💰</span>;
const FormulaIcon = () => <span className="option-icon">∑</span>;
const SingleSelectIcon = () => <span className="option-icon">🔘</span>;
const MultiSelectIcon = () => <span className="option-icon">☑️</span>;
const DropdownIconQ = () => <span className="option-icon">⬇️</span>;
const ImageChoiceIcon = () => <span className="option-icon">🖼️</span>;
const EmojiRatingIcon = () => <span className="option-icon">😊</span>;
const StarRatingIcon = () => <span className="option-icon">⭐</span>;
const SliderScaleIcon = () => <span className="option-icon">🎚️</span>;
const MatrixGridIcon = () => <span className="option-icon">📊</span>;
const DatePickerIcon = () => <span className="option-icon">📅</span>;
const TimePickerIcon = () => <span className="option-icon">⏰</span>;
const FileUploadIcon = () => <span className="option-icon">📁</span>;
const ImageUploadIcon = () => <span className="option-icon">🖼️</span>;
const MediaUploadIcon = () => <span className="option-icon">🎥</span>;
const DescriptionTextIcon = () => <span className="option-icon">📄</span>;
const TermsConditionsIcon = () => <span className="option-icon">✅</span>;

/* ---------------------- data model ---------------------- */
const questionTypesData = {
  standard: {
    'Text & Contact Fields': [
      { id: 'shortText', name: 'Short Text', icon: <ShortTextIcon /> },
      { id: 'longText', name: 'Long Text', icon: <LongTextIcon /> },
      { id: 'nameField', name: 'Name', icon: <NameIcon /> },
      { id: 'emailField', name: 'Email', icon: <EmailIcon /> },
      { id: 'phoneField', name: 'Phone', icon: <PhoneIcon /> },
      { id: 'addressField', name: 'Address', icon: <AddressIcon /> },
      { id: 'websiteField', name: 'Website / URL', icon: <WebsiteIcon /> },
    ],
    'Numbers & Calculations': [
      { id: 'numberField', name: 'Number Field', icon: <NumberIcon /> },
      { id: 'decimalField', name: 'Decimal Field', icon: <DecimalIcon /> },
      { id: 'currencyField', name: 'Currency Field', icon: <CurrencyIcon /> },
      { id: 'formulaField', name: 'Formula Field', icon: <FormulaIcon /> },
    ],
    'Choices & Selections': [
      { id: 'singleSelect', name: 'Single Select (Radio Buttons)', icon: <SingleSelectIcon /> },
      { id: 'multiSelect', name: 'Multi Select (Checkboxes)', icon: <MultiSelectIcon /> },
      { id: 'dropdown', name: 'Dropdown Menu', icon: <DropdownIconQ /> },
      { id: 'imageChoice', name: 'Image Choice', icon: <ImageChoiceIcon /> },
      { id: 'emojiRating', name: 'Emoji Rating / Mood Scale', icon: <EmojiRatingIcon /> },
      { id: 'starRating', name: 'Star Rating', icon: <StarRatingIcon /> },
      { id: 'sliderScale', name: 'Slider Scale', icon: <SliderScaleIcon /> },
      { id: 'matrixGrid', name: 'Matrix / Grid Input', icon: <MatrixGridIcon /> },
    ],
    'Date & Time': [
      { id: 'datePicker', name: 'Date Picker', icon: <DatePickerIcon /> },
      { id: 'timePicker', name: 'Time Picker', icon: <TimePickerIcon /> },
    ],
    'Uploads & Media': [
      { id: 'fileUpload', name: 'File Upload', icon: <FileUploadIcon /> },
      { id: 'imageUpload', name: 'Image Upload', icon: <ImageUploadIcon /> },
      { id: 'mediaUpload', name: 'Audio / Video Upload', icon: <MediaUploadIcon /> },
    ],
    'Instructional Fields': [
      { id: 'descriptionText', name: 'Description / Paragraph Text', icon: <DescriptionTextIcon /> },
    ],
    'Consent & Legal': [
      { id: 'termsConditions', name: 'Terms & Conditions', icon: <TermsConditionsIcon /> },
    ],
  },
  advanced: {
    'Interactive & Gamified Inputs': [
      { id: 'scratchReveal', name: 'Scratch-to-Reveal', icon: <ShortTextIcon /> },
      { id: 'timerQuestion', name: 'Timer-Based Question', icon: <ShortTextIcon /> },
    ],
    'Logic & Advanced Components': [
      { id: 'subform', name: 'Subform / Nested Section', icon: <ShortTextIcon /> },
    ],
  },
};

/* ---------------------- helper utils ---------------------- */
const makeInstanceId = (typeId) => `${typeId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

/* ---------------------- question renderer ---------------------- */
function QuestionPreview({ q, index, onChangeText }) {
  // q: { id(type_instance), type, label, meta }
  const renderBody = () => {
    const t = q.type;
    if (t === 'shortText') return <input className="q-input" placeholder="Short answer text" readOnly />;
    if (t === 'longText') return <textarea className="q-textarea" placeholder="Long answer" readOnly />;
    if (t === 'numberField') return <input className="q-input" type="number" placeholder="Number" readOnly />;
    if (t === 'datePicker') return <input className="q-input" type="date" readOnly />;
    if (t === 'dropdown') return (
      <select className="q-select" disabled>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    );
    if (t === 'multiSelect') return (
      <div className="q-choices">
        <label><input type="checkbox" disabled /> Option A</label>
        <label><input type="checkbox" disabled /> Option B</label>
      </div>
    );
    if (t === 'singleSelect') return (
      <div className="q-choices">
        <label><input type="radio" disabled name={q.id} /> Option A</label>
        <label><input type="radio" disabled name={q.id} /> Option B</label>
      </div>
    );
    // fallback
    return <input className="q-input" placeholder="Answer" readOnly />;
  };

  return (
    <div className="question-card-body">
      <div className="question-label">
        <input
          className="question-label-input"
          value={q.label}
          onChange={(e) => onChangeText(q.id, e.target.value)}
        />
      </div>
      <div className="question-body">
        {renderBody()}
      </div>
    </div>
  );
}

/* ---------------------- MAIN COMPONENT ---------------------- */
export default function FormEditorPage({ setPage }) {
  const [questionType, setQuestionType] = useState('');
  const [openSubheading, setOpenSubheading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // the list of questions on canvas
  const [questions, setQuestions] = useState([]);
  // simple undo stack for deleted items
  const [undoStack, setUndoStack] = useState([]);

  // drag state for reordering
  const draggingQuestionIdRef = useRef(null);
  const dragOverIndexRef = useRef(null);

  /* ---------------------- search helpers ---------------------- */
  const filterQuestions = (obj) => {
    if (!searchTerm) return obj;
    const out = {};
    Object.keys(obj).forEach((sub) => {
      const arr = obj[sub].filter((q) => q.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (arr.length) out[sub] = arr;
    });
    return out;
  };

  const filteredStandard = filterQuestions(questionTypesData.standard);
  const filteredAdvanced = filterQuestions(questionTypesData.advanced);

  /* ---------------------- drag from left panel ---------------------- */
  const handleDragStartOption = (e, typeId) => {
    e.dataTransfer.setData('application/x-question-type', typeId);
    // for Firefox
    e.dataTransfer.effectAllowed = 'copy';
  };

  /* ---------------------- drop on canvas (append) ---------------------- */
  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const typeId = e.dataTransfer.getData('application/x-question-type');
    const draggingQuestionId = draggingQuestionIdRef.current;
    // if a question card is being dragged (reorder), ignore this path
    if (typeId) {
      const instanceId = makeInstanceId(typeId);
      const newQ = {
        id: instanceId,
        type: typeId,
        label: defaultLabelFor(typeId),
        meta: {},
      };
      // compute index to insert based on dragOverIndexRef (if set)
      const idx = dragOverIndexRef.current != null ? dragOverIndexRef.current : questions.length;
      const newList = [...questions];
      newList.splice(idx, 0, newQ);
      setQuestions(newList);
      // reset refs
      dragOverIndexRef.current = null;
    }
  };

  const handleDragOverCanvas = (e) => {
    e.preventDefault();
    // allow drop: show copy cursor
    e.dataTransfer.dropEffect = 'copy';
  };

  /* ---------------------- reorder question cards (drag inside canvas) ---------------------- */
  const handleQuestionDragStart = (e, qid) => {
    draggingQuestionIdRef.current = qid;
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', qid); } catch (err) {} // some browsers
  };

  const handleQuestionDragOver = (e, overIndex) => {
    e.preventDefault();
    dragOverIndexRef.current = overIndex;
  };

  const handleQuestionDrop = (e) => {
    e.preventDefault();
    const draggingId = draggingQuestionIdRef.current || e.dataTransfer.getData('text/plain');
    const overIndex = dragOverIndexRef.current;
    if (!draggingId) return;
    const fromIndex = questions.findIndex((q) => q.id === draggingId);
    if (fromIndex === -1) return;
    // remove and re-insert at overIndex
    const updated = [...questions];
    const [moving] = updated.splice(fromIndex, 1);
    const insertAt = overIndex != null ? overIndex : updated.length;
    updated.splice(insertAt, 0, moving);
    setQuestions(updated);
    draggingQuestionIdRef.current = null;
    dragOverIndexRef.current = null;
  };

  /* ---------------------- question card actions: duplicate/delete/undo ---------------------- */
  const duplicateQuestion = (qid) => {
    const idx = questions.findIndex((q) => q.id === qid);
    if (idx === -1) return;
    const clone = { ...questions[idx], id: makeInstanceId(questions[idx].type) };
    const arr = [...questions];
    arr.splice(idx + 1, 0, clone);
    setQuestions(arr);
  };

  const deleteQuestion = (qid) => {
    const idx = questions.findIndex((q) => q.id === qid);
    if (idx === -1) return;
    const removed = questions[idx];
    const arr = questions.filter((q) => q.id !== qid);
    setQuestions(arr);
    // push to undo stack
    setUndoStack((s) => [{ action: 'delete', item: removed, index: idx }, ...s]);
  };

  const undoLast = () => {
    if (!undoStack.length) return;
    const [last, ...rest] = undoStack;
    if (last.action === 'delete') {
      const arr = [...questions];
      arr.splice(last.index, 0, last.item);
      setQuestions(arr);
    }
    setUndoStack(rest);
  };

  const changeLabel = (qid, newLabel) => {
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, label: newLabel } : q)));
  };

  /* ---------------------- helpers ---------------------- */
  function defaultLabelFor(typeId) {
    const mapping = {
      shortText: 'Short Answer',
      longText: 'Long Answer',
      nameField: 'Name',
      emailField: 'Email',
      phoneField: 'Phone',
      addressField: 'Address',
      websiteField: 'Website / URL',
      numberField: 'Number',
      decimalField: 'Decimal',
      currencyField: 'Currency',
      formulaField: 'Formula',
      singleSelect: 'Multiple Choice',
      multiSelect: 'Checkboxes',
      dropdown: 'Dropdown',
      imageChoice: 'Image Choice',
      emojiRating: 'Emoji Rating',
      starRating: 'Star Rating',
      sliderScale: 'Slider',
      matrixGrid: 'Grid',
      datePicker: 'Date',
      timePicker: 'Time',
      fileUpload: 'File Upload',
      imageUpload: 'Image Upload',
      mediaUpload: 'Audio / Video',
      descriptionText: 'Description',
      termsConditions: 'Terms & Conditions',
    };
    return mapping[typeId] || 'Question';
  }

  /* ---------------------- UI helpers: toggle subheading ---------------------- */
  const toggleSubheading = (header, sub) => {
    if (searchTerm) return;
    setOpenSubheading((prev) => ({
      ...prev,
      [header]: prev[header] === sub ? null : sub,
    }));
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="form-editor-layout page-fade-in">
      {/* Header */}
      <header className="form-editor-header">
        <div className="editor-header-left">
          <div className="editor-logo" onClick={() => setPage && setPage('dashboard')}><Logo /></div>
          <nav className="editor-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage && setPage('dashboard'); }} className="active"><HomeIcon /> Home</a>
            <a href="#"><ThemesIcon /> Themes</a>
          </nav>
        </div>
        <div className="editor-header-right">
          <button className="btn-editor-preview">Preview</button>
          <button className="btn-editor-publish">Publish</button>
          <button className="btn-editor-export"><ExportIcon /> Export</button>
        </div>
      </header>

      <div className="form-editor-main">
        {/* LEFT: options */}
        <aside className="question-panel">
          <div className="question-search">
            <SearchIcon />
            <input
              className="fe-search-input"
              type="text"
              placeholder="Find question type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="fe-section-title">STANDARD QUESTION TYPES</div>
          {Object.keys(filteredStandard).map((sub) => (
            <div className="fe-subgroup" key={sub}>
              <div
                className={`fe-subheading ${openSubheading[sub] ? 'open' : ''}`}
                onClick={() => toggleSubheading('standard', sub)}
              >
                <span>{sub}</span>
                <span className="fe-subheading-chevron">{openSubheading[sub] ? '▾' : '▸'}</span>
              </div>

              {/* Show items if open or if searching (search shows results even closed) */}
              {((openSubheading[sub]) || searchTerm) && (
                <div className="fe-options">
                  {filteredStandard[sub].map((opt) => (
                    <div
                      key={opt.id}
                      className="option-item"
                      draggable
                      onDragStart={(e) => handleDragStartOption(e, opt.id)}
                      onClick={() => {
                        // quick-add on click as well
                        const newQ = { id: makeInstanceId(opt.id), type: opt.id, label: defaultLabelFor(opt.id), meta: {} };
                        setQuestions((prev) => [...prev, newQ]);
                      }}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="fe-section-title" style={{ marginTop: 12 }}>ADVANCED QUESTION TYPES</div>
          {Object.keys(filteredAdvanced).map((sub) => (
            <div className="fe-subgroup" key={sub}>
              <div
                className={`fe-subheading ${openSubheading[sub] ? 'open' : ''}`}
                onClick={() => toggleSubheading('advanced', sub)}
              >
                <span>{sub}</span>
                <span className="fe-subheading-chevron">{openSubheading[sub] ? '▾' : '▸'}</span>
              </div>
              {((openSubheading[sub]) || searchTerm) && (
                <div className="fe-options">
                  {filteredAdvanced[sub].map((opt) => (
                    <div
                      key={opt.id}
                      className="option-item"
                      draggable
                      onDragStart={(e) => handleDragStartOption(e, opt.id)}
                      onClick={() => {
                        const newQ = { id: makeInstanceId(opt.id), type: opt.id, label: defaultLabelFor(opt.id), meta: {} };
                        setQuestions((prev) => [...prev, newQ]);
                      }}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* CANVAS: drop target */}
        <main
          className="canvas-panel"
          onDragOver={handleDragOverCanvas}
          onDrop={handleCanvasDrop}
        >
          <div className="form-title-group">
            <input type="text" className="form-title-input" defaultValue="Untitled Form" />
            <input type="text" className="form-desc-input" placeholder="Form Description" />
          </div>

          {/* Questions list (droppable for reordering) */}
          <div
            className="questions-list"
            onDragOver={(e) => {
              // allow dropping between last item and end
              handleQuestionDragOver(e, questions.length);
            }}
            onDrop={handleQuestionDrop}
          >
            {questions.length === 0 && (
              <div className="canvas-empty-state">
                <h3>Your form is empty</h3>
                <p>Drag and drop question types from the left panel to start building your form.</p>
                <button className="btn-add-question">Add Question</button>
              </div>
            )}

            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`question-card ${/* highlight drop target style (optional) */''}`}
                draggable
                onDragStart={(e) => handleQuestionDragStart(e, q.id)}
                onDragOver={(e) => handleQuestionDragOver(e, i)}
                onDrop={handleQuestionDrop}
              >
                <div className="question-card-top">
                  <div className="drag-handle">⋮⋮</div>
                  <div className="question-meta">
                    <div className="question-type-chip">{q.type}</div>
                  </div>

                  <div className="question-actions">
                    {/* three-dot menu */}
                    <QuestionMenu
                      onDuplicate={() => duplicateQuestion(q.id)}
                      onDelete={() => deleteQuestion(q.id)}
                      onUndo={() => undoLast()}
                    />
                  </div>
                </div>

                <QuestionPreview q={q} index={i} onChangeText={changeLabel} />
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT settings (minimal for now) */}
        <aside className="settings-panel">
          <div className="settings-tabs">
            <button className="settings-tab active">Question</button>
            <button className="settings-tab">Extras</button>
            <button className="settings-tab">AI Help</button>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label>Selected Question</label>
              <select>
                <option>— Select —</option>
              </select>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn-add-question" onClick={() => {
                // add a sample shortText
                const newQ = { id: makeInstanceId('shortText'), type: 'shortText', label: defaultLabelFor('shortText'), meta: {} };
                setQuestions((p) => [...p, newQ]);
              }}>Add Short Text</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------- small components ---------------------- */
function QuestionMenu({ onDuplicate, onDelete, onUndo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="three-dot-wrap">
      <button className="three-dot-btn" onClick={() => setOpen((s) => !s)} aria-label="open menu">⋯</button>
      {open && (
        <div className="three-dot-menu">
          <button onClick={() => { onDuplicate(); setOpen(false); }}>Duplicate</button>
          <button onClick={() => { onUndo(); setOpen(false); }}>Undo</button>
          <button onClick={() => { onDelete(); setOpen(false); }} className="danger">Delete</button>
        </div>
      )}
    </div>
  );
}
