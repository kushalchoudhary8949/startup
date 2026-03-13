import { useEffect, useState } from 'react';

const verdictConfig = {
  'Good Idea': { cls: 'verdict-good', icon: '✦', label: 'Good Idea' },
  'Needs Improvement': { cls: 'verdict-improve', icon: '◈', label: 'Needs Improvement' },
  'Not Worth Building': { cls: 'verdict-bad', icon: '✕', label: 'Not Worth Building' },
};

const demandColor = { 'Low': '#ff5e6c', 'Medium': '#ffb547', 'High': '#63ffbe', 'Very High': '#7b6cff' };
const complexityColor = { 'Low': '#63ffbe', 'Medium': '#ffb547', 'High': '#ff5e6c', 'Very High': '#ff5e6c' };

function ScoreArc({ score }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const pct = animated / 10;
  const offset = circumference * (1 - pct);
  const color = score >= 7 ? '#63ffbe' : score >= 4 ? '#ffb547' : '#ff5e6c';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 90, height: 90 }}>
        <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="45" cy="45" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25,1,0.5,1)', filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          <span style={{ fontSize: '1.4rem', color }}>{score}</span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px' }}>/10</span>
        </div>
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
        Problem Score
      </span>
    </div>
  );
}

function MetricPill({ label, value, colorMap }) {
  const color = colorMap[value] || 'var(--accent)';
  return (
    <div className="glass-card px-4 py-3" style={{ borderRadius: 12 }}>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color, fontFamily: "'Syne', sans-serif" }}>{value}</div>
    </div>
  );
}

export default function AnalysisResult({ analysis }) {
  const verdict = verdictConfig[analysis.verdict] || verdictConfig['Needs Improvement'];
  const [barWidths, setBarWidths] = useState({});

  useEffect(() => {
    const t = setTimeout(() => {
      setBarWidths({ problem: `${analysis.problem_score * 10}%` });
    }, 200);
    return () => clearTimeout(t);
  }, [analysis]);

  return (
    <div className="slide-up space-y-5">
      {/* Header row */}
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-6">
          <ScoreArc score={analysis.problem_score} />
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Syne', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              {analysis.problem_score_reason}
            </p>
          </div>
        </div>
        <div
          className={`px-5 py-2.5 rounded-full flex items-center gap-2 ${verdict.cls}`}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap' }}
        >
          <span>{verdict.icon}</span>
          <span>{verdict.label}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3">
        <MetricPill label="Market Demand" value={analysis.market_demand} colorMap={demandColor} />
        <MetricPill label="Build Complexity" value={analysis.build_complexity} colorMap={complexityColor} />
      </div>

      {/* Market demand detail */}
      <div className="glass-card p-5 space-y-4">
        <div>
          <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
            Market Analysis
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{analysis.market_demand_detail}</p>
        </div>
        <div>
          <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
            Build Complexity
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{analysis.build_complexity_detail}</p>
        </div>
      </div>

      {/* Monetization */}
      <div className="glass-card p-5">
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          Monetization Paths
        </h4>
        <div className="flex flex-wrap gap-2">
          {analysis.monetization_possibilities.map((m, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(123,108,255,0.15)', color: '#a99fff', border: '1px solid rgba(123,108,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div className="glass-card p-5">
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          Risk Assessment
        </h4>
        <div className="space-y-3">
          {analysis.risks.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold severity-${r.severity.toLowerCase()}`}
                style={{ fontFamily: "'Syne', sans-serif", whiteSpace: 'nowrap', marginTop: 2 }}
              >
                {r.severity}
              </span>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)', marginBottom: 2 }}>{r.risk}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verdict summary */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(99,255,190,0.06), rgba(123,108,255,0.06))',
          border: '1px solid rgba(99,255,190,0.15)',
        }}
      >
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.75', fontStyle: 'italic' }}>
          "{analysis.verdict_summary}"
        </p>
      </div>
    </div>
  );
}
