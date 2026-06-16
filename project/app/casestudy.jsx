/* ── ZenFit Case Study card ──────────────────────────────────────── */
function ZenFitCard({ cs }) {
  const stats      = cs.stats      || [];
  const tools      = cs.tools      || [];
  const highlights = cs.highlights || [];
  const flowSteps  = cs.flowSteps  || [];

  return (
    <div className="cs-card glass">
      <div className="cs-card-inner">

        {/* ── Left: content ── */}
        <div className="cs-content">
          <div className="cs-top-row">
            <span className="cs-kicker">{cs.kicker}</span>
            <span className="cs-year">{cs.year}</span>
          </div>

          <div>
            <h3 className="cs-title">{cs.title}</h3>
            <p className="cs-subtitle">{cs.subtitle}</p>
          </div>

          <p className="cs-tagline">{cs.tagline}</p>

          <div className="cs-stats">
            {stats.map(s => (
              <div key={s.label} className="cs-stat">
                <strong className="cs-stat-val">{s.value}</strong>
                <span  className="cs-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="cs-tools-row">
            <span className="cs-tools-label">Design Tools</span>
            <div className="cs-tools">
              {tools.map(t => <span key={t} className="tool">{t}</span>)}
            </div>
          </div>

          <div className="cs-highlights">
            {highlights.map(h => (
              <span key={h} className="cs-highlight-tag">{h}</span>
            ))}
          </div>

          <a href={cs.link} target="_blank" rel="noopener noreferrer" className="btn cs-cta">
            <span>View Case Study</span>
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>

        {/* ── Right: decorative visual ── */}
        <div className="cs-visual" aria-hidden="true">
          <div className="cs-visual-ring cs-vr-1" />
          <div className="cs-visual-ring cs-vr-2" />
          <div className="cs-visual-icon">
            <Icon name="spark" size={44} />
          </div>
          <p className="cs-visual-label">AI-Powered</p>
          <div className="cs-flow-steps">
            {flowSteps.map((step, i) => (
              <div key={step} className="cs-flow-step">
                <span className="cs-flow-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cs-flow-name">{step}</span>
                {i < flowSteps.length - 1 && <span className="cs-flow-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Case Studies section ────────────────────────────────────────── */
function CaseStudies() {
  const D  = window.DATA;
  const cs = (D.caseStudies || [])[0];
  if (!cs) return null;
  return (
    <section id="case-studies" className="cs-section">
      <div className="cs-bg-glow" />
      <div className="wrap cs-wrap">
        <SectionHead
          kicker="Case Studies"
          title={'Design <span class="gold-grad">In Depth</span>'}
          sub="A closer look at the thinking, process, and craft behind selected projects."
        />
        <div className="cs-grid">
          <ZenFitCard cs={cs} />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CaseStudies });

/* Achievements section — uses DATA.achievements → window.Achievements */

function Achievements() {
  const D = window.DATA;
  return (
    <section id="achievements" className="achievements">
      <div className="wrap">
        <SectionHead
          center
          kicker="By The Numbers"
          title={'Creative <span class="gold-grad">Impact</span>'}
          sub="Measurable results from a year of consistent creative execution for a growing travel brand."
        />
        <Reveal delay={100} className="achv-grid">
          {(D.achievements || []).map((a) => (
            <div key={a.label} className="achv-card glass">
              <div className="achv-ico">
                <Icon name={a.icon} size={30} />
              </div>
              <Stat value={a.value} suffix={a.suffix} label={a.label} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { Achievements });
