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
