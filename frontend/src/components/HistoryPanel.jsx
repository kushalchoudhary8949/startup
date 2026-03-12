import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoryPanel({ onLoadIdea, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get('/api/history');
        setHistory(data);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="w-full max-w-md h-full bg-[#0a0f1d] border-l border-[rgba(99,255,190,0.2)] p-6 overflow-y-auto shadow-2xl slide-left">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span style={{ color: 'var(--accent)' }}>✦</span> History
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {loading && <div className="text-center text-sm text-gray-400 mt-10">Loading history...</div>}
        {error && <div className="text-center text-sm text-red-400 mt-10">{error}</div>}
        
        {!loading && !error && history.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-10">
            No saved ideas yet.<br/>Analyze an idea and save it to see it here!
          </div>
        )}

        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div 
              key={item._id} 
              onClick={() => onLoadIdea({ ...item.analysis, verdict: item.analysis.verdict }, item.competitors, item.mvp_plan, item.ideaText)}
              className="p-4 rounded-xl cursor-pointer transition-all duration-200 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(99,255,190,0.3)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(99,255,190,0.05)]"
            >
              <div className="text-sm font-semibold text-white mb-2 line-clamp-2">{item.ideaText}</div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                  item.analysis?.verdict === 'PASS' 
                    ? 'bg-[rgba(99,255,190,0.15)] text-[#63ffbc]' 
                    : item.analysis?.verdict === 'PIVOT' 
                      ? 'bg-[rgba(255,200,99,0.15)] text-[#ffc863]' 
                      : 'bg-[rgba(255,94,108,0.15)] text-[#ff5e6c]'
                }`}>
                  {item.analysis?.verdict || 'N/A'}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .slide-left { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideLeft { 
          from { transform: translateX(100%); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}
