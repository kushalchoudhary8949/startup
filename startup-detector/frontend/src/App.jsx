 

import { useState } from 'react';
import axios from 'axios';
import IdeaInput from './components/IdeaInput';
import AnalysisResult from './components/AnalysisResult';
import CompetitorList from './components/CompetitorList';
import MVPPlan from './components/MVPPlan';
import AIChatBox from './components/AIChatBox';
import ExecutionRoadmap from './components/ExecutionRoadmap';
import HistoryPanel from './components/HistoryPanel';

const TABS = [
  { id: 'analysis',   label: 'Idea Analysis',  icon: '◈' },
  { id: 'competitors',label: 'Competitors',     icon: '⬡' },
  { id: 'mvp',        label: 'MVP Plan',        icon: '✦' },
  { id: 'roadmap',    label: 'Execution Plan',  icon: '◎' },
  { id: 'chat',       label: 'AI Advisor',      icon: '⬟' },
];
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(99,255,190,0.15)', animation: 'spin 3s linear infinite' }} />
        <div className="absolute inset-2 rounded-full" style={{ border: '2px dashed rgba(123,108,255,0.3)', animation: 'spin 2s linear infinite reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent)' }} />
        </div>
        <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background: '#a99fff', top: '-4px', left: '50%', marginLeft: '-5px', animation: 'spin 1.5s linear infinite', transformOrigin: '5px 44px', boxShadow: '0 0 10px #a99fff' }} />
      </div>
      <div className="text-center">
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: 6 }}>
          Analyzing your idea
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Running market analysis, scanning competitors, building MVP plan…
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [activeTab, setActiveTab]       = useState('analysis');
  const [analyzedIdea, setAnalyzedIdea] = useState('');

  const [showHistory, setShowHistory]   = useState(false);
  const [isSaving, setIsSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  const handleAnalyze = async (idea) => {
    setLoading(true);
    setError('');
    setResult(null);
    setAnalyzedIdea(idea);
    setSaveSuccess(false);
    try {
      const { data } = await axios.post('/api/analyze', { idea });
      setResult(data);
      setActiveTab('analysis');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Build context object passed to chat
  const ideaContext = result ? {
    idea: analyzedIdea,
    verdict: result.analysis?.verdict,
    problem_score: result.analysis?.problem_score,
    market_demand: result.analysis?.market_demand,
    build_complexity: result.analysis?.build_complexity,
    top_risks: result.analysis?.risks?.map(r => r.risk),
    competitors: result.competitors?.map(c => c.name),
    core_features: result.mvp_plan?.core_features,
  } : null;

  const handleSaveIdea = async () => {
    if (!result || !analyzedIdea) return;
    setIsSaving(true);
    try {
      await axios.post('/api/save', {
        ideaText: analyzedIdea,
        analysis: result.analysis,
        competitors: result.competitors,
        mvp_plan: result.mvp_plan
      });
      setSaveSuccess(true);
    } catch (err) {
      alert("Failed to save idea. Is the database connected?");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadIdea = (analysis, competitors, mvp_plan, ideaText) => {
    setResult({ analysis, competitors, mvp_plan });
    setAnalyzedIdea(ideaText);
    setActiveTab('analysis');
    setSaveSuccess(true);
    setShowHistory(false);
  };

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="blob absolute rounded-full opacity-20" style={{ width: 600, height: 600, top: '-100px', right: '-150px', background: 'radial-gradient(circle, rgba(99,255,190,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="blob absolute rounded-full opacity-15" style={{ width: 500, height: 500, bottom: '10%', left: '-100px', background: 'radial-gradient(circle, rgba(123,108,255,0.5) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 border border-[rgba(255,255,255,0.05)] hover:border-[rgba(99,255,190,0.3)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(99,255,190,0.05)] text-gray-300"
          >
            <span style={{ color: 'var(--accent)' }}>✦</span> History
          </button>
        </div>

        {/* Hero header */}
        <div className="text-center mb-12 slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(99,255,190,0.1)', border: '1px solid rgba(99,255,190,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 8px var(--accent)' }} />
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              AI Startup Validator
            </span>
          </div>
          <h1 className="font-display mb-4" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1px', background: 'linear-gradient(135deg, #f0f4ff 30%, rgba(99,255,190,0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Startup Detector
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
            Validate your startup idea before building it.<br />
            <span style={{ color: 'var(--text-muted)' }}>Market analysis · Competitor intel · MVP roadmap · AI advisor.</span>
          </p>
        </div>

        {/* Input */}
        <div className="mb-10 slide-up-delay-1">
          <IdeaInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,94,108,0.12)', border: '1px solid rgba(255,94,108,0.3)', color: '#ff5e6c', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingScreen />}

        {/* Results */}
        {result && !loading && (
          <div>
            {/* Analyzed idea pill */}
            <div className="mb-5 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)]">
              <div className="flex items-center gap-2 overflow-hidden">
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Idea</span>
                <span className="truncate" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{analyzedIdea}</span>
              </div>
              
              <button
                onClick={handleSaveIdea}
                disabled={isSaving || saveSuccess}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background: saveSuccess ? 'rgba(99,255,190,0.1)' : 'rgba(123,108,255,0.1)',
                  color: saveSuccess ? '#63ffbc' : '#a99fff',
                  border: `1px solid ${saveSuccess ? 'rgba(99,255,190,0.2)' : 'rgba(123,108,255,0.2)'}`,
                  cursor: (isSaving || saveSuccess) ? 'default' : 'pointer'
                }}
              >
                {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved' : '+ Save'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all duration-200 flex-shrink-0"
                  style={{
                    border: `1px solid ${activeTab === tab.id ? 'rgba(99,255,190,0.3)' : 'var(--border)'}`,
                    background: activeTab === tab.id ? 'rgba(99,255,190,0.12)' : 'rgba(255,255,255,0.03)',
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {/* New badge on chat + roadmap tabs */}
                  {(tab.id === 'chat' || tab.id === 'roadmap') && activeTab !== tab.id && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'rgba(99,255,190,0.2)', color: 'var(--accent)', fontSize: '9px', fontWeight: 800 }}>NEW</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div key={activeTab}>
              {activeTab === 'analysis'    && <AnalysisResult analysis={result.analysis} />}
              {activeTab === 'competitors' && <CompetitorList competitors={result.competitors} />}
              {activeTab === 'mvp'         && <MVPPlan mvp_plan={result.mvp_plan} />}
              {activeTab === 'roadmap'     && (
                <ExecutionRoadmap idea={analyzedIdea} analysis={result.analysis} />
              )}
              {activeTab === 'chat'        && (
                <div className="glass-card overflow-hidden">
                  <AIChatBox ideaContext={ideaContext} initialIdea={analyzedIdea} />
                </div>
              )}
            </div>

            {/* Re-analyze */}
            <div className="mt-10 text-center">
              <button
                onClick={() => setResult(null)}
                style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                ↑ Analyze a different idea
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {!loading && !result && (
          <div className="mt-20 text-center slide-up-delay-2">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {['Market Analysis', 'Competitor Intel', 'MVP Roadmap', 'Execution Plan', 'AI Advisor'].map((f) => (
                <div key={f} className="flex items-center gap-1.5" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>✦</span> {f}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Powered by Groq · Llama 3.3 70B · Results in ~10 seconds</p>
          </div>
        )}
      </div>
      
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} onLoadIdea={handleLoadIdea} />}
    </div>
  );
}




// import { useState } from 'react';
// import axios from 'axios';
// import IdeaInput from './components/IdeaInput';
// import AnalysisResult from './components/AnalysisResult';
// import CompetitorList from './components/CompetitorList';
// import MVPPlan from './components/MVPPlan';

// const TABS = [
//   { id: 'analysis', label: 'Idea Analysis', icon: '◈' },
//   { id: 'competitors', label: 'Competitors', icon: '⬡' },
//   { id: 'mvp', label: 'MVP Plan', icon: '✦' },
// ];

// function LoadingScreen() {
//   return (
//     <div className="flex flex-col items-center justify-center py-24 gap-6">
//       {/* Animated orbit */}
//       <div className="relative w-20 h-20">
//         <div
//           className="absolute inset-0 rounded-full"
//           style={{
//             border: '2px solid rgba(99,255,190,0.15)',
//             animation: 'spin 3s linear infinite',
//           }}
//         />
//         <div
//           className="absolute inset-2 rounded-full"
//           style={{
//             border: '2px dashed rgba(123,108,255,0.3)',
//             animation: 'spin 2s linear infinite reverse',
//           }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent)' }} />
//         </div>
//         {/* Orbiting dot */}
//         <div
//           className="absolute w-2.5 h-2.5 rounded-full"
//           style={{
//             background: '#a99fff',
//             top: '-4px',
//             left: '50%',
//             marginLeft: '-5px',
//             animation: 'spin 1.5s linear infinite',
//             transformOrigin: '5px 44px',
//             boxShadow: '0 0 10px #a99fff',
//           }}
//         />
//       </div>
//       <div className="text-center">
//         <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', marginBottom: 6 }}>
//           Analyzing your idea
//         </p>
//         <p style={{ fontSize: '20px', color: 'var(--text-muted)' }}>
//           Running market analysis, scanning competitors, building MVP plan…
//         </p>
//       </div>
//       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

// export default function App() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('analysis');
//   const [analyzedIdea, setAnalyzedIdea] = useState('');

//   const handleAnalyze = async (idea) => {
//     setLoading(true);
//     setError('');
//     setResult(null);
//     setAnalyzedIdea(idea);

//     try {
//       const { data } = await axios.post('/api/analyze', { idea });
//       setResult(data);
//       setActiveTab('analysis');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen" style={{ zIndex: 1 }}>
//       {/* Background blobs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
//         <div
//           className="blob absolute rounded-full opacity-20"
//           style={{
//             width: 600, height: 600, top: '-100px', right: '-150px',
//             background: 'radial-gradient(circle, rgba(99,255,190,0.4) 0%, transparent 70%)',
//             filter: 'blur(80px)',
//           }}
//         />
//         <div
//           className="blob absolute rounded-full opacity-15"
//           style={{
//             width: 500, height: 500, bottom: '10%', left: '-100px',
//             background: 'radial-gradient(circle, rgba(123,108,255,0.5) 0%, transparent 70%)',
//             filter: 'blur(80px)',
//             animationDelay: '4s',
//           }}
//         />
//       </div>

//       <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
//         {/* Hero header */}
//         <div className="text-center mb-12 slide-up">
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
//             style={{ background: 'rgba(99,255,190,0.1)', border: '1px solid rgba(99,255,190,0.2)' }}>
//             <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 8px var(--accent)' }} />
//             <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
//               AI Startup Validator
//             </span>
//           </div>

//           <h1
//             className="font-display mb-4"
//             style={{
//               fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
//               fontWeight: 800,
//               lineHeight: 1.05,
//               letterSpacing: '-1px',
//               background: 'linear-gradient(135deg, #f0f4ff 30%, rgba(99,255,190,0.8) 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             Startup Detector
//           </h1>
//           <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
//             Validate your startup idea before building it.<br />
//             <span style={{ color: 'var(--text-muted)' }}>Market analysis · Competitor intel · MVP roadmap.</span>
//           </p>
//         </div>

//         {/* Input */}
//         <div className="mb-10 slide-up-delay-1">
//           <IdeaInput onAnalyze={handleAnalyze} loading={loading} />
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,94,108,0.12)', border: '1px solid rgba(255,94,108,0.3)', color: '#ff5e6c', fontSize: '14px', textAlign: 'center' }}>
//             {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading && <LoadingScreen />}

//         {/* Results */}
//         {result && !loading && (
//           <div>
//             {/* Analyzed idea pill */}
//             <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex' }}>
//               <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Idea</span>
//               <span style={{ fontSize: '18px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                 {analyzedIdea}
//               </span>
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
//               {TABS.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-all duration-200 flex-shrink-0 ${activeTab === tab.id ? 'tab-active' : ''}`}
//                   style={{
//                     border: `1px solid ${activeTab === tab.id ? 'rgba(99,255,190,0.3)' : 'var(--border)'}`,
//                     background: activeTab === tab.id ? 'rgba(99,255,190,0.12)' : 'rgba(255,255,255,0.03)',
//                     color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
//                     fontFamily: "'Syne', sans-serif",
//                     fontWeight: 600,
//                     fontSize: '13px',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   <span>{tab.icon}</span>
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>

//             {/* Tab content */}
//             <div key={activeTab}>
//               {activeTab === 'analysis' && <AnalysisResult analysis={result.analysis} />}
//               {activeTab === 'competitors' && <CompetitorList competitors={result.competitors} />}
//               {activeTab === 'mvp' && <MVPPlan mvp_plan={result.mvp_plan} />}
//             </div>

//             {/* Re-analyze nudge */}
//             <div className="mt-10 text-center">
//               <button
//                 onClick={() => setResult(null)}
//                 style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline', textUnderlineOffset: 3 }}
//               >
//                 ↑ Analyze a different idea
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         {!loading && !result && (
//           <div className="mt-20 text-center slide-up-delay-2">
//             <div className="flex justify-center gap-6 mb-4">
//               {['Market Analysis', 'Competitor Intel', 'MVP Roadmap'].map((f) => (
//                 <div key={f} className="flex items-center gap-1.5" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
//                   <span style={{ color: 'var(--accent)' }}>✦</span> {f}
//                 </div>
//               ))}
//             </div>
//             <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Powered by GPT-4o · Results in ~10 seconds</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
