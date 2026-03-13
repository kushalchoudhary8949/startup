import { useState } from 'react';

const EXAMPLES = [
  'AI tool that helps students summarize textbooks',
  'Marketplace for freelance therapists',
  'Chrome extension that blocks doom-scrolling with a work timer',
  'SaaS for small restaurant inventory tracking',
];

export default function IdeaInput({ onAnalyze, loading }) {
  const [idea, setIdea] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (idea.trim().length >= 10 && !loading) onAnalyze(idea.trim());
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="w-full max-w-3xl mx-auto slide-up">
      {/* Textarea wrapper */}
      <div
        className="relative rounded-2xl p-[1px] transition-all duration-300"
        style={{
          background: focused
            ? 'linear-gradient(135deg, rgba(99,255,190,0.5), rgba(123,108,255,0.4))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
          boxShadow: focused ? '0 0 60px rgba(99,255,190,0.1)' : 'none',
        }}
      >
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-mid)' }}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder="Describe your startup idea in detail…&#10;&#10;Example: An AI-powered tool that helps students summarize and quiz themselves on textbooks, making studying 3x faster."
            rows={5}
            className="w-full px-6 py-5 text-base resize-none"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              lineHeight: '1.7',
              border: 'none',
            }}
          />
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
              {idea.length} chars · ⌘↵ to analyze
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || idea.trim().length < 10}
              className="btn-primary flex items-center gap-2"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              {loading ? (
                <>
                  <span>Analyzing</span>
                  <span className="flex gap-1">
                    <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#080b14' }} />
                    <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#080b14' }} />
                    <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#080b14' }} />
                  </span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  Detect
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example ideas */}
      <div className="mt-5">
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '10px', textAlign: 'center', fontFamily: "'Syne', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
          Try an example
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setIdea(ex)}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,255,190,0.3)';
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(99,255,190,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
