const stackColors = {
  frontend: { bg: 'rgba(99,255,190,0.08)', border: 'rgba(99,255,190,0.2)', color: '#63ffbe', icon: '⬡' },
  backend: { bg: 'rgba(123,108,255,0.08)', border: 'rgba(123,108,255,0.25)', color: '#a99fff', icon: '⚙' },
  database: { bg: 'rgba(255,181,71,0.08)', border: 'rgba(255,181,71,0.2)', color: '#ffb547', icon: '◫' },
  ai_ml: { bg: 'rgba(255,94,108,0.08)', border: 'rgba(255,94,108,0.2)', color: '#ff8a94', icon: '✦' },
  hosting: { bg: 'rgba(99,200,255,0.08)', border: 'rgba(99,200,255,0.2)', color: '#63c8ff', icon: '⬛' },
};

const stackLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  ai_ml: 'AI / ML',
  hosting: 'Hosting',
};

const weekColors = ['#63ffbe', '#a99fff', '#ffb547', '#63c8ff'];

export default function MVPPlan({ mvp_plan }) {
  return (
    <div className="slide-up space-y-5">
      {/* Core features */}
      <div className="glass-card p-5">
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>
          Core MVP Features
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mvp_plan.core_features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--accent)', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', minWidth: 20 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="glass-card p-5">
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>
          Recommended Tech Stack
        </h4>
        <div className="space-y-2">
          {Object.entries(mvp_plan.tech_stack).map(([key, val]) => {
            const cfg = stackColors[key] || stackColors.frontend;
            return (
              <div
                key={key}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <span style={{ color: cfg.color, fontSize: '16px', minWidth: 20, textAlign: 'center' }}>{cfg.icon}</span>
                <div>
                  <span style={{ fontSize: '10px', color: cfg.color, fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                    {stackLabels[key] || key}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass-card p-5">
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
          4-Week Development Roadmap
        </h4>
        <div className="space-y-4">
          {mvp_plan.roadmap.map((week, i) => (
            <div key={i} className="flex gap-4">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${weekColors[i]}20`, border: `2px solid ${weekColors[i]}`, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '11px', color: weekColors[i] }}
                >
                  {i + 1}
                </div>
                {i < mvp_plan.roadmap.length - 1 && (
                  <div className="flex-1 w-px my-1" style={{ background: 'var(--border)', minHeight: 16 }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-4 flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span style={{ fontSize: '10px', color: weekColors[i], fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{week.week}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{week.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {week.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: weekColors[i], marginTop: 1, flexShrink: 0 }}>→</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* First version scope */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(123,108,255,0.08), rgba(99,255,190,0.05))', border: '1px solid rgba(123,108,255,0.2)' }}
      >
        <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px', color: '#a99fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>
          V1 Scope
        </h4>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>{mvp_plan.first_version_scope}</p>
      </div>
    </div>
  );
}
