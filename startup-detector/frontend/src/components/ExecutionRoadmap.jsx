import { useState, useEffect } from 'react';
import axios from 'axios';

const phaseColors = {
  green:  { bg: 'rgba(99,255,190,0.08)',  border: 'rgba(99,255,190,0.25)',  text: '#63ffbe',  dot: '#63ffbe' },
  purple: { bg: 'rgba(123,108,255,0.08)', border: 'rgba(123,108,255,0.25)', text: '#a99fff',  dot: '#a99fff' },
  yellow: { bg: 'rgba(255,181,71,0.08)',  border: 'rgba(255,181,71,0.25)',  text: '#ffb547',  dot: '#ffb547' },
  blue:   { bg: 'rgba(99,200,255,0.08)',  border: 'rgba(99,200,255,0.25)',  text: '#63c8ff',  dot: '#63c8ff' },
};

function StepCard({ step, phaseColor, onToggle, isDone }) {
  const [expanded, setExpanded] = useState(false);
  const c = phaseColors[phaseColor] || phaseColors.green;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isDone ? 'rgba(99,255,190,0.2)' : 'var(--border)'}`,
        background: isDone ? 'rgba(99,255,190,0.03)' : 'rgba(255,255,255,0.02)',
        opacity: isDone ? 0.7 : 1,
      }}
    >
      {/* Step header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            border: `2px solid ${isDone ? '#63ffbe' : 'rgba(255,255,255,0.2)'}`,
            background: isDone ? 'rgba(99,255,190,0.2)' : 'transparent',
          }}
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#63ffbe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <span
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: c.bg, color: c.text, fontFamily: "'Syne', sans-serif", border: `1px solid ${c.border}` }}
        >
          {step.step}
        </span>

        <span
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
            fontFamily: "'Syne', sans-serif",
            textDecoration: isDone ? 'line-through' : 'none',
          }}
        >
          {step.title}
        </span>

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', paddingTop: 12 }}>
            {step.description}
          </p>

          {/* Action box */}
          <div
            className="p-3 rounded-xl flex items-start gap-2"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <span style={{ color: c.text, fontSize: '14px', flexShrink: 0 }}>→</span>
            <div>
              <p style={{ fontSize: '10px', color: c.text, fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 3 }}>
                Action Now
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{step.action}</p>
            </div>
          </div>

          {/* Resources */}
          {step.resources && step.resources.length > 0 && (
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                Tools & Resources
              </p>
              <div className="flex flex-wrap gap-2">
                {step.resources.map((r, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg text-xs"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExecutionRoadmap({ idea, analysis }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doneSteps, setDoneSteps] = useState({});
  const [activePhase, setActivePhase] = useState(0);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/roadmap', { idea, analysis });
      setRoadmap(data.roadmap);
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (phaseIdx, stepIdx) => {
    const key = `${phaseIdx}-${stepIdx}`;
    setDoneSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPhaseProgress = (phaseIdx, stepsCount) => {
    let done = 0;
    for (let i = 0; i < stepsCount; i++) {
      if (doneSteps[`${phaseIdx}-${i}`]) done++;
    }
    return Math.round((done / stepsCount) * 100);
  };

  const totalSteps = roadmap ? roadmap.phases.reduce((a, p) => a + p.steps.length, 0) : 0;
  const totalDone = Object.values(doneSteps).filter(Boolean).length;
  const overallProgress = totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0;

  if (!roadmap && !loading) {
    return (
      <div className="slide-up flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(99,255,190,0.1)', border: '1px solid rgba(99,255,190,0.2)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#63ffbe" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: 8 }}>
            Execution Roadmap
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: 360, lineHeight: '1.6' }}>
            Get a personalized step-by-step plan to actually launch your startup — from validation to your first paying users.
          </p>
        </div>
        <button onClick={fetchRoadmap} className="btn-primary">
          Generate My Roadmap
        </button>
        {error && <p style={{ color: '#ff5e6c', fontSize: '13px' }}>{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(99,255,190,0.15)', animation: 'spin 3s linear infinite' }} />
          <div className="absolute inset-2 rounded-full" style={{ border: '2px dashed rgba(123,108,255,0.3)', animation: 'spin 2s linear infinite reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 15px var(--accent)' }} />
          </div>
        </div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', color: 'var(--text-secondary)' }}>
          Building your execution plan…
        </p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div className="slide-up space-y-5">
      {/* Overall progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Overall Progress
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
              {totalDone} of {totalSteps} steps completed
            </p>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '24px', color: 'var(--accent)' }}>
            {overallProgress}%
          </span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="score-bar-fill"
            style={{ width: `${overallProgress}%`, height: '100%' }}
          />
        </div>
      </div>

      {/* First action callout */}
      {roadmap.first_action && (
        <div
          className="p-4 rounded-2xl flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(99,255,190,0.1), rgba(99,255,190,0.05))', border: '1px solid rgba(99,255,190,0.25)' }}
        >
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
              Do This Today
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{roadmap.first_action}</p>
          </div>
        </div>
      )}

      {/* Phase tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {roadmap.phases.map((phase, i) => {
          const c = phaseColors[phase.color] || phaseColors.green;
          const prog = getPhaseProgress(i, phase.steps.length);
          return (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs transition-all duration-200"
              style={{
                border: `1px solid ${activePhase === i ? c.border : 'var(--border)'}`,
                background: activePhase === i ? c.bg : 'rgba(255,255,255,0.02)',
                color: activePhase === i ? c.text : 'var(--text-muted)',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span style={{ marginRight: 6 }}>Phase {phase.phase}</span>
              <span style={{ opacity: 0.7 }}>{prog}%</span>
            </button>
          );
        })}
      </div>

      {/* Active phase */}
      {roadmap.phases[activePhase] && (() => {
        const phase = roadmap.phases[activePhase];
        const c = phaseColors[phase.color] || phaseColors.green;
        const prog = getPhaseProgress(activePhase, phase.steps.length);
        return (
          <div className="glass-card p-5 space-y-4">
            {/* Phase header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontFamily: "'Syne', sans-serif" }}
                  >
                    {phase.duration}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                  {phase.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 4, lineHeight: '1.5' }}>{phase.goal}</p>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', color: c.text, flexShrink: 0 }}>
                {prog}%
              </span>
            </div>

            {/* Phase progress bar */}
            <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ width: `${prog}%`, height: '100%', background: c.text, borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {phase.steps.map((step, si) => (
                <StepCard
                  key={si}
                  step={step}
                  phaseColor={phase.color}
                  isDone={!!doneSteps[`${activePhase}-${si}`]}
                  onToggle={() => toggleStep(activePhase, si)}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* Success metrics */}
      {roadmap.success_metrics && (
        <div className="glass-card p-5">
          <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
            Success Metrics
          </h4>
          <div className="space-y-2">
            {roadmap.success_metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent)' }}>✦</span> {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

