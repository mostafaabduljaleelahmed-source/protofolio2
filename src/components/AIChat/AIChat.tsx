import React, { useState, useRef, useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { audioEngine } from '../../utils/audioEngine';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm Jaleelo's automated assistant. Ask me anything about Mostafa's background, .NET stack, projects, or availability." }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuery = (queryKey: string, customQuery?: string) => {
    audioEngine.playClick();
    const userText = customQuery || queryKey;
    
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    setTimeout(() => {
      let botReply = SITE_CONFIG.aiKnowledge[queryKey];
      if (!botReply) {
        const lower = userText.toLowerCase();
        if (lower.includes('contact') || lower.includes('email') || lower.includes('whatsapp')) {
          botReply = SITE_CONFIG.aiKnowledge.contact;
        } else if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) {
          botReply = SITE_CONFIG.aiKnowledge.projects;
        } else if (lower.includes('stack') || lower.includes('dotnet') || lower.includes('flutter')) {
          botReply = SITE_CONFIG.aiKnowledge.stack;
        } else {
          botReply = "Mostafa is a .NET 8 / C# Full-Stack Developer, AI Automation Engineer, and Computer Science student at Cairo University. Feel free to contact him directly via email or WhatsApp!";
        }
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 300);
  };

  return (
    <>
      <button
        id="ai-chat-trigger"
        onClick={() => {
          audioEngine.playClick();
          setIsOpen(prev => !prev);
        }}
        title="Open AI System Assistant"
      >
        <i className="ai-pulse"></i>
        <span>🤖 Ask Assistant</span>
      </button>

      <div className={`ai-chat-window ${isOpen ? 'active' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }}></span>
            Jaleelo.AI / Assistant v1.0
          </div>
          <button className="ai-chat-close" onClick={() => setIsOpen(false)}>&times;</button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.sender}`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-chips-area">
          <div className="ai-chip" onClick={() => handleQuery('available', '💼 Available for work?')}>💼 Available?</div>
          <div className="ai-chip" onClick={() => handleQuery('stack', '🛠️ Tech Stack')}>🛠️ Tech Stack</div>
          <div className="ai-chip" onClick={() => handleQuery('projects', '🚀 Top Projects')}>🚀 Projects</div>
          <div className="ai-chip" onClick={() => handleQuery('university', '🎓 Degree')}>🎓 Degree</div>
          <div className="ai-chip" onClick={() => handleQuery('contact', '📬 Contact')}>📬 Contact</div>
        </div>

        <div className="ai-chat-input-box">
          <input
            type="text"
            className="ai-chat-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleQuery('', inputVal.trim());
              }
            }}
            placeholder="Ask a question..."
          />
          <button
            className="ai-chat-send"
            onClick={() => {
              if (inputVal.trim()) handleQuery('', inputVal.trim());
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </>
  );
};
