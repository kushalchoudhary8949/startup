import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SUGGESTED_QUESTIONS = [
  'How do I find my first 100 users?',
  'What should I charge for this?',
  'How do I beat the top competitor?',
  'What tech should I start with?',
  'How long until I can raise funding?',
  'What is the biggest risk I should solve first?',
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #7b6cff, #a99fff)'
            : 'linear-gradient(135deg, #63ffbe, #4de8a8)',
          color: '#080b14',
          fontFamily: "'Syne', sans-serif",
          marginTop: 2,
        }}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className="max-w-[80%] px-4 py-3 rounded-2xl text-sm"
        style={{
          background: isUser
            ? 'rgba(123,108,255,0.15)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isUser ? 'rgba(123,108,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
          color: 'var(--text-primary)',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: '1.65',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, #63ffbe, #4de8a8)', color: '#080b14', fontFamily: "'Syne', sans-serif" }}
      >
        AI
      </div>
      <div
        className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px' }}
      >
        <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
      </div>
    </div>
  );
}

export default function AIChatBox({ ideaContext, initialIdea }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed your startup idea: "${initialIdea}"\n\nAsk me anything — pricing strategy, how to find users, which features to build first, how to beat competitors, or anything else about your startup. I'm here to help you execute. 🚀`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Only send role+content to backend (no extra fields)
      const payload = newMessages.map(({ role, content }) => ({ role, content }));
      const { data } = await axios.post('/api/chat', {
        messages: payload,
        ideaContext,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="slide-up flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-t-2xl"
        style={{ background: 'rgba(99,255,190,0.05)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="relative">
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
          <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping" style={{ background: 'var(--accent)', opacity: 0.4 }} />
        </div>
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
            AI Startup Advisor
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ask anything about your startup</p>
        </div>
        <div className="ml-auto px-2 py-1 rounded-full" style={{ background: 'rgba(99,255,190,0.1)', fontSize: '10px', color: 'var(--accent)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px' }}>
          LIVE
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions — show only at start */}
      {messages.length <= 1 && (
        <div className="px-5 py-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,255,190,0.3)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 flex gap-3 items-end rounded-b-2xl"
        style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask your advisor anything… (Enter to send)"
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            lineHeight: '1.5',
            maxHeight: '100px',
            outline: 'none',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(99,255,190,0.4)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: loading || !input.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #63ffbe, #4de8a8)',
            border: '1px solid var(--border)',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={loading || !input.trim() ? 'rgba(255,255,255,0.2)' : '#080b14'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

