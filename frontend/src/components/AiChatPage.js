import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Logo, AiBotIcon, SendIcon } from './Icons';
import { API_BASE_URL } from '../config';
import './AiChatPage.css';

const AiChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am the Dynova AI Assistant. How can I help you build your form today?' },
    { id: 2, sender: 'bot', text: 'Describe the form you need, like "Create a customer feedback survey" or "Build an event registration form with name, email, and session selection".' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const prompt = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate form');
      }

      const formData = await response.json();

      // Create a success message with the form structure
      let formSummary = `I've created a form for you!\n\n**Title:** ${formData.title || 'Untitled Form'}`;
      if (formData.description) {
        formSummary += `\n**Description:** ${formData.description}`;
      }
      if (formData.elements && formData.elements.length > 0) {
        formSummary += `\n\n**Questions (${formData.elements.length}):**\n`;
        formData.elements.forEach((el, i) => {
          formSummary += `${i + 1}. ${el.label} (${el.type})\n`;
        });
      }

      formSummary += `\n\nClick the button below to create this form!`;

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: formSummary,
        formData: formData // Store the form data for the create button
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I had trouble generating your form. Please try again or check if the AI service is configured correctly.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = async (formData) => {
    // Save the form to the backend
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to create a form');
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title || 'AI Generated Form',
          description: formData.description || '',
          questions: formData.elements.map((el, index) => ({
            id: `q_${index}_${Date.now()}`,
            type: el.type,
            label: el.label,
            required: el.required || false,
            meta: { options: el.options || [] },
            conditional: { enabled: false, rules: [] }
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to create form');

      const savedForm = await response.json();
      navigate(`/forms/${savedForm._id}/edit`);

    } catch (error) {
      console.error('Error creating form:', error);
      alert('Failed to create form. Please try again.');
    }
  };

  return (
    <div className="chat-page-layout page-fade-in">
      <header className="chat-header">
        <button className="chat-back-btn" onClick={() => navigate('/dashboard')}><ArrowLeftIcon /> Back to Dashboard</button>
        <div className="chat-header-title"><Logo /><span>Dynova AI Bot</span></div>
      </header>
      <main className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              {msg.sender === 'bot' && <div className="message-avatar"><AiBotIcon /></div>}
              <div className="message-text">
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line.startsWith('**') && line.endsWith('**')
                      ? <strong>{line.slice(2, -2)}</strong>
                      : line.startsWith('**')
                        ? <><strong>{line.split('**')[1]}</strong>{line.split('**')[2]}</>
                        : line}
                    <br />
                  </span>
                ))}
                {msg.formData && (
                  <button
                    className="btn-create-form"
                    onClick={() => handleCreateForm(msg.formData)}
                    style={{
                      marginTop: '12px',
                      padding: '10px 20px',
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Create This Form →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="message-avatar"><AiBotIcon /></div>
              <div className="message-text">Generating your form...</div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      <footer className="chat-input-area">
        <form onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Describe the form you want to create..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}><SendIcon /></button>
        </form>
      </footer>
    </div>
  );
};

export default AiChatPage;
