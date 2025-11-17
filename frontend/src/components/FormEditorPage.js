import React, { useState } from 'react';
import { Logo, HomeIcon, ThemesIcon, ExportIcon, SearchIcon } from './Icons';

const ShortTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>
    </svg>
);
const ParagraphIcon = ShortTextIcon;
const MultipleChoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle>
    </svg>
);
const CheckboxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
);
const DropdownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><polyline points="7 10 12 15 17 10"></polyline>
    </svg>
);
const LinearScaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="17" x2="21" y2="17"></line><line x1="3" y1="7" x2="21" y2="7"></line>
    </svg>
);

const FormEditorPage = ({ setPage }) => {
  const [questionType, setQuestionType] = useState('multipleChoice');

  const questionTypes = {
    standard: [
      { id: 'shortAnswer', name: 'Short Answer', icon: <ShortTextIcon /> },
      { id: 'paragraph', name: 'Paragraph', icon: <ParagraphIcon /> },
      { id: 'multipleChoice', name: 'Multiple Choice', icon: <MultipleChoiceIcon /> },
      { id: 'checkboxes', name: 'Checkboxes', icon: <CheckboxIcon /> },
      { id: 'dropdown', name: 'Dropdown', icon: <DropdownIcon /> },
      { id: 'linearScale', name: 'Linear Scale', icon: <LinearScaleIcon /> },
    ],
    advanced: []
  };

  return (
    <div className="form-editor-layout page-fade-in">
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
        <aside className="question-panel">
          <div className="question-search"><SearchIcon /><input type="text" placeholder="Find question type" /></div>
          <div className="question-group">
            <h4 className="question-group-title">Standard</h4>
            {questionTypes.standard.map(q => (
              <div key={q.id} className={`question-item ${questionType === q.id ? 'active' : ''}`} onClick={() => setQuestionType(q.id)}>
                {q.icon}
                <span>{q.name}</span>
              </div>
            ))}
          </div>
          <div className="question-group"><h4 className="question-group-title">Advanced</h4></div>
        </aside>

        <main className="canvas-panel">
          <div className="form-title-group">
            <input type="text" className="form-title-input" defaultValue="Untitled Form" />
            <input type="text" className="form-desc-input" placeholder="Form Description" />
          </div>
          <div className="canvas-empty-state">
            <h3>Your form is empty</h3>
            <p>Drag and drop question types from the left panel to start building your form.</p>
            <button className="btn-add-question">Add Question</button>
          </div>
        </main>

        <aside className="settings-panel">
          <div className="settings-tabs">
            <button className="settings-tab active">Question</button>
            <button className="settings-tab">Extras</button>
            <button className="settings-tab">AI Help</button>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label htmlFor="question-type">Question Type</label>
              <select id="question-type" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                {questionTypes.standard.map(q => (
                  <option key={q.id} value={q.id}>{q.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="question-text">Question Text</label>
              <input type="text" id="question-text" defaultValue="What is your primary goal?" />
            </div>
            <div className="form-group">
              <label htmlFor="help-text">Help Text (Optional)</label>
              <input type="text" id="help-text" placeholder="e.g. Choose one option" />
            </div>
            <div className="switch-group">
              <label htmlFor="required-switch">Required</label>
              <label className="switch"><input type="checkbox" id="required-switch" defaultChecked /><span className="slider round"></span></label>
            </div>
            <div className="switch-group">
              <label htmlFor="shuffle-switch">Shuffle Options</label>
              <label className="switch"><input type="checkbox" id="shuffle-switch" /><span className="slider round"></span></label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FormEditorPage;
