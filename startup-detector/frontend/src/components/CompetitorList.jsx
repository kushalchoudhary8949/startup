export default function CompetitorList({ competitors }) {
  return (
    <div className="slide-up space-y-4">
      {competitors.map((c, i) => (
        <div
          key={i}
          className="glass-card p-5"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)', fontFamily: "'Syne', sans-serif" }}
                >
                  {i + 1}
                </span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)' }}>
                  {c.name}
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{c.description}</p>
            </div>
          </div>

          {/* Strengths & Weaknesses grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(99,255,190,0.05)', border: '1px solid rgba(99,255,190,0.12)' }}>
              <p style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: "'Syne', sans-serif', letterSpacing: '1px", textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
                ✦ Strengths
              </p>
              <ul className="space-y-1.5">
                {c.strengths.map((s, j) => (
                  <li key={j} className="flex items-start gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}>·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,94,108,0.05)', border: '1px solid rgba(255,94,108,0.12)' }}>
              <p style={{ fontSize: '10px', color: '#ff5e6c', fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', marginBottom: 8, fontWeight: 700, letterSpacing: '1px' }}>
                ✕ Weaknesses
              </p>
              <ul className="space-y-1.5">
                {c.weaknesses.map((w, j) => (
                  <li key={j} className="flex items-start gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#ff5e6c', marginTop: 1, flexShrink: 0 }}>·</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Market gap */}
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(123,108,255,0.08)', border: '1px solid rgba(123,108,255,0.2)' }}>
            <span style={{ color: '#a99fff', fontSize: '16px', lineHeight: 1, marginTop: 1 }}>◈</span>
            <div>
              <p style={{ fontSize: '10px', color: '#a99fff', fontFamily: "'Syne', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 4 }}>
                Market Gap
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{c.market_gap}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
