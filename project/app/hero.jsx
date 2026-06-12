/* Hero — 3 variations + stats bar → window */

function SocialRail({ vertical }) {
  const D = window.DATA;
  const links = [
    { icon: "linkedin", href: D.person.linkedin, label: "LinkedIn" },
    { icon: "behance", href: D.person.behance, label: "Behance" },
    { icon: "whatsapp", href: `https://wa.me/${D.person.phoneRaw}`, label: "WhatsApp", fill: true },
    { icon: "mail", href: `mailto:${D.person.email}`, label: "Email" },
  ];
  return (
    <div className={"social-rail" + (vertical ? " vert" : "")}>
      {links.map((l, i) => (
        <a key={l.icon} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined}
           rel="noopener" className="soc-btn" aria-label={l.label} style={{ "--d": i * 80 + "ms" }}>
          <Icon name={l.icon} size={18} fill={l.fill} />
        </a>
      ))}
    </div>
  );
}

function HeroCTAs() {
  const D = window.DATA;
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: "smooth" });
  };
  return (
    <div className="hero-ctas">
      <a href="#work" className="btn btn-gold" onClick={go("work")}>
        View My Work <Icon name="arrowRight" size={17} />
      </a>
      <a href="#contact" className="btn btn-ghost" onClick={go("contact")}>
        <Icon name="mail" size={17} /> Let's Connect
      </a>
      <a href={D.person.resume} className="btn btn-line" download="Paramasivan-V-Resume.pdf" type="application/pdf">
        <Icon name="download" size={16} /> Resume
      </a>
    </div>
  );
}

function HeroMetrics() {
  const items = [
    { val: "150+", lab: "Designs" },
    { val: "70K+", lab: "Reach"   },
    { val: "1 Yr",  lab: "Experience" },
  ];
  return (
    <div className="hero-metrics glass">
      {items.map((m, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="hero-metric-sep" />}
          <div className="hero-metric">
            <span className="hero-metric-val gold-text">{m.val}</span>
            <span className="hero-metric-lab">{m.lab}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function HeroText({ compact }) {
  return (
    <div className="hero-text">
      <Reveal>
        <div className="hero-badge glass">
          <span className="hero-badge-dot" />
          <span>Creative Visual Designer · Social Media Content Specialist</span>
        </div>
      </Reveal>
      <Reveal delay={90} as="h1" className="hero-h1">
        Creativity<br />
        <span className="italic">in</span> <span className="gold-grad">Creatives</span>.
      </Reveal>
      <Reveal delay={170}>
        <p className="hero-intro">
          I help businesses build a stronger social media presence through creative visual design,
          content strategy, brand storytelling, and lead generation.
        </p>
      </Reveal>
      <Reveal delay={240}><HeroCTAs /></Reveal>
      <Reveal delay={320}><HeroMetrics /></Reveal>
      {!compact && <Reveal delay={400}><SocialRail /></Reveal>}
    </div>
  );
}

function Portrait({ className = "", badge = true }) {
  return (
    <div className={"portrait " + className}>
      <div className="portrait-glow" />
      <div className="portrait-frame">
        <img src="assets/profile.jpg" alt="Paramasivan V" />
        <div className="portrait-shine" />
      </div>
      {badge && (
        <>
          <div className="float-chip chip-a glass">
            <span className="chip-dot" />
            <span>Available for Projects</span>
          </div>
          <div className="float-chip chip-b glass">
            <Icon name="pen" size={13} style={{ color: "var(--gold)" }} />
            <span>Design Executive</span>
          </div>
          <div className="float-chip chip-c glass">
            <strong className="serif gold-text">150+</strong>
            <span>Creatives Designed</span>
          </div>
          <div className="float-chip chip-d glass">
            <Icon name="rocket" size={13} style={{ color: "var(--gold)" }} />
            <span style={{ color: "var(--gold)" }}>Social Media Design</span>
          </div>
        </>
      )}
    </div>
  );
}

function Portrait3D({ className = "" }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current || typeof window.initCharacter3D !== "function") return;
    const cleanup = window.initCharacter3D(canvasRef.current);
    return () => { if (typeof cleanup === "function") cleanup(); };
  }, []);

  return (
    <div className={"char-3d-wrap " + className}>
      <div className="char-aura" />
      <div className="char-aura char-aura-2" />
      <canvas ref={canvasRef} className="char-canvas" />
      <div className="float-chip chip-a glass">
        <span className="chip-dot" />
        <span>Available for Projects</span>
      </div>
      <div className="float-chip chip-b glass">
        <Icon name="pen" size={13} style={{ color: "var(--gold)" }} />
        <span>Design Executive</span>
      </div>
      <div className="float-chip chip-c glass">
        <strong className="serif gold-text">150+</strong>
        <span>Creatives Designed</span>
      </div>
      <div className="float-chip chip-d glass">
        <Icon name="rocket" size={13} style={{ color: "var(--gold)" }} />
        <span style={{ color: "var(--gold)" }}>Digital Marketing</span>
      </div>
    </div>
  );
}

function StatsBar() {
  const D = window.DATA;
  return (
    <Reveal className="wrap" delay={120}>
      <div className="stats-bar glass">
        {D.stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <span className="stats-sep" />}
            <Stat {...s} />
          </React.Fragment>
        ))}
      </div>
    </Reveal>
  );
}

function Hero({ variant = 1 }) {
  return (
    <section id="home" className={"hero hero-v" + variant}>
      <div className="hero-bg-glow" />
      <div className="hero-bg-glow hero-bg-glow-2" />

      {variant === 1 && (
        <div className="wrap hero-grid">
          <HeroText />
          <Reveal delay={200} className="hero-visual"><Portrait /></Reveal>
        </div>
      )}

      {variant === 2 && (
        <div className="wrap hero-center">
          <Reveal className="hero-arch-wrap">
            <div className="hero-arch">
              <img src="assets/profile.jpg" alt="Paramasivan V" />
            </div>
            <SocialRail />
          </Reveal>
          <div className="hero-center-text"><HeroText compact /></div>
        </div>
      )}

      {variant === 3 && (
        <div className="hero-split">
          <div className="hero-split-text wrap"><HeroText compact /></div>
          <Reveal delay={200} className="hero-split-img">
            <img src="assets/profile.jpg" alt="Paramasivan V" />
            <div className="hero-split-veil" />
            <SocialRail vertical />
          </Reveal>
        </div>
      )}

      <div className="hero-stats-anchor"><StatsBar /></div>
    </section>
  );
}

Object.assign(window, { Hero, SocialRail, StatsBar, Portrait, Portrait3D });
