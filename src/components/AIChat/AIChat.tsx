import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useAudio } from '../../context/AudioContext';
import { aiAssistantService } from '../../services/aiAssistantService';
import { analyticsService } from '../../services/analyticsService';
import { ChatMessage } from '../../types';
import { Bot, Send, Trash2, X, Sparkles, Code2, Briefcase, GraduationCap } from 'lucide-react';

export const AIChat: React.FC = () => {
  const { isAIChatOpen, closeAIChat, toggleAIChat } = useUI();
  const { playClick } = useAudio();

  const [messages, setMessages] = useState<ChatMessage[]>(() => aiAssistantService.getHistory());
  const [inputVal, setInputVal] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [currentStreamText, setCurrentStreamText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamText, isAIChatOpen]);

  const handleSend = (queryKey: string, customQuery?: string) => {
    if (isStreaming) return;
    playClick();

    const userText = (customQuery || queryKey).trim();
    if (!userText) return;

    analyticsService.trackAIQuery(userText);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setIsStreaming(true);
    setCurrentStreamText('');

    aiAssistantService.streamResponse(
      userText,
      (partialText) => {
        setCurrentStreamText(partialText);
      },
      (finalText) => {
        setIsStreaming(false);
        const botMsg: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          sender: 'assistant',
          text: finalText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedHistory = [...newHistory, botMsg];
        setMessages(updatedHistory);
        aiAssistantService.saveHistory(updatedHistory);
        setCurrentStreamText('');
      }
    );
  };

  const handleClearHistory = () => {
    playClick();
    const fresh = aiAssistantService.clearHistory();
    setMessages(fresh);
  };

  return (
    <>
      {/* CHAT TRIGGER FLOATING BUTTON */}
      <button
        id="ai-chat-trigger"
        onClick={() => {
          playClick();
          toggleAIChat();
        }}
        title="Toggle AI System Assistant"
        aria-label="Toggle AI Assistant Chat"
      >
        <i className="ai-pulse" aria-hidden="true"></i>
        <span>🤖 Ask Assistant</span>
      </button>

      {/* WINDOW */}
      <div
        className={`ai-chat-window ${isAIChatOpen ? 'active' : ''}`}
        role="region"
        aria-label="AI Chat Assistant Window"
        style={{
          width: '420px',
          maxWidth: '92vw',
          height: '580px',
          maxHeight: '85vh',
          borderRadius: '16px',
          background: 'rgba(8, 11, 18, 0.95)',
          border: '1px solid rgba(136, 217, 255, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(136, 217, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* HEADER */}
        <div
          className="ai-chat-header"
          style={{
            padding: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div className="ai-chat-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)' }}>
            <Bot size={18} />
            <span>Jaleelo.AI / Assistant v2.6</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <Trash2 size={15} />
            </button>
            <button
              className="ai-chat-close"
              onClick={closeAIChat}
              aria-label="Close Chat"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MESSAGES FEED */}
        <div
          className="ai-chat-messages"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chat-msg ${m.sender === 'user' ? 'user' : 'bot'}`}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                padding: '10px 14px',
                borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: m.sender === 'user' ? 'rgba(136, 217, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: m.sender === 'user' ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: aiAssistantService.renderMarkdownWithCode(m.text)
                }}
              />
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'right' }}>
                {m.timestamp}
              </span>
            </div>
          ))}

          {/* STREAMING TOKEN RESPONSE BUBBLE */}
          {isStreaming && (
            <div
              className="chat-msg bot"
              style={{
                alignSelf: 'flex-start',
                maxWidth: '88%',
                padding: '10px 14px',
                borderRadius: '14px 14px 14px 2px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(136, 217, 255, 0.3)',
                color: '#ffffff',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: aiAssistantService.renderMarkdownWithCode(currentStreamText)
                }}
              />
              <span style={{ display: 'inline-block', width: '6px', height: '14px', background: 'var(--accent)', marginLeft: '4px', animation: 'blink 0.8s infinite' }}></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTION CHIPS */}
        <div
          className="ai-chat-chips-area"
          style={{
            padding: '6px 1rem',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            whiteSpace: 'nowrap'
          }}
        >
          <div className="ai-chip" onClick={() => handleSend('', '💼 Available for work?')}>
            <Briefcase size={12} /> Available?
          </div>
          <div className="ai-chip" onClick={() => handleSend('', '🛠️ .NET 8 Architecture')}>
            <Code2 size={12} /> Tech Stack
          </div>
          <div className="ai-chip" onClick={() => handleSend('', '🚀 EduSphere Case Study')}>
            <Sparkles size={12} /> EduSphere
          </div>
          <div className="ai-chip" onClick={() => handleSend('', '🎓 Cairo University Degree')}>
            <GraduationCap size={12} /> Degree
          </div>
        </div>

        {/* INPUT BOX */}
        <div
          className="ai-chat-input-box"
          style={{
            padding: '0.75rem 1rem 1rem 1rem',
            display: 'flex',
            gap: '8px'
          }}
        >
          <input
            type="text"
            className="ai-chat-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleSend('', inputVal.trim());
              }
            }}
            placeholder="Ask anything about Mostafa's work..."
            disabled={isStreaming}
            aria-label="Chat query input"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: '0.85rem'
            }}
          />
          <button
            className="ai-chat-send"
            onClick={() => {
              if (inputVal.trim()) handleSend('', inputVal.trim());
            }}
            disabled={isStreaming || !inputVal.trim()}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'var(--accent)',
              border: 'none',
              color: '#080b12',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: isStreaming || !inputVal.trim() ? 'not-allowed' : 'pointer',
              opacity: isStreaming || !inputVal.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={13} /> SEND
          </button>
        </div>
      </div>
    </>
  );
};
