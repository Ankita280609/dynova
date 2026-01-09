import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Logo, AiBotIcon, SendIcon } from './Icons';

const AiChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am the Dynova AI Assistant. How can I help you build your form today?' },
    { id: 2, sender: 'bot', text: 'You can ask me to generate questions for a specific topic, like "Create a customer feedback survey" or "What are good questions for an event registration form?"' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    const newUserMessage = { id: messages.length + 1, sender: 'user', text: input };
    setMessages([...messages, newUserMessage]);
    setInput('');
    setTimeout(() => {
      const botResponse = { id: messages.length + 2, sender: 'bot', text: `Here are some ideas for "${input}"... (AI response will be generated here)` };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
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
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>
      <footer className="chat-input-area">
        <form onSubmit={handleSend}>
          <input type="text" placeholder="Type your message to the AI..." value={input} onChange={(e) => setInput(e.target.value)} />
          <button type="submit"><SendIcon /></button>
        </form>
      </footer>
    </div>
  );
};

export default AiChatPage;
