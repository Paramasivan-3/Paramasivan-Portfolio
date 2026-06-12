/* About + Skills → window */

const WHAT_I_DO = [
  {
    num: "01", icon: "share",
    title: "Social Media Management",
    desc: "Managing brand social media pages by creating engaging creatives, scheduling posts, maintaining visual consistency, and improving audience engagement across platforms.",
  },
  {
    num: "02", icon: "pen",
    title: "Creative Post Design",
    desc: "Designing eye-catching social media posts, advertisements, promotional banners, and marketing creatives using Photoshop, Illustrator, Figma, and Canva.",
  },
  {
    num: "03", icon: "search",
    title: "Content Research & Planning",
    desc: "Researching industry trends, competitor strategies, and audience preferences to plan effective content that increases reach and engagement.",
  },
  {
    num: "04", icon: "magnet",
    title: "Lead Generation",
    desc: "Creating high-converting promotional creatives, campaign banners, and marketing materials designed to attract potential customers and generate quality leads.",
  },
  {
    num: "05", icon: "globe",
    title: "Website Content Management",
    desc: "Designing website banners, updating visual assets, optimizing content layouts, and ensuring a consistent brand experience across web pages.",
  },
  {
    num: "06", icon: "spark",
    title: "Festival & Event Campaigns",
    desc: "Creating themed creatives for festivals, holidays, special events, and brand campaigns that boost visibility and audience interaction.",
  },
];

const BIG_SKILL_ICONS = [
  { abbr: "Ps", name: "Adobe Photoshop",   color: "#06B6D4" },
  { abbr: "Ai", name: "Adobe Illustrator", color: "#22D3EE" },
  { abbr: "Fg", name: "Figma",             color: "#0891B2" },
  { abbr: "Ca", name: "Canva",             color: "#38BDF8" },
];

function CreativeProcess() {
  return (
    <section id="skills" className="process">
      <div className="wrap">

        {/* ── Big Skill Icons (top) ── */}
        <SectionHead center kicker="Skills"
          title={'My Creative <span class="gold-grad">Skills</span>'}
          sub="Tools I use and services I deliver for every project." />

        <div className="tools-group-head-wrap">
          <div className="tools-group-head">
            <span className="sk-group-ico"><Icon name="pen" size={16} /></span>
            <span>Design</span>
          </div>
        </div>

        <div className="big-skills-row">
          {BIG_SKILL_ICONS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80} className="big-skill-wrap">
              <div className="big-skill-card glass" style={{"--float-delay": `${i * 0.4}s`, "--sc": t.color}}>
                <div className="big-skill-glow" style={{ background: `radial-gradient(circle, ${t.color}22, transparent 70%)` }} />
                <div className="big-skill-roll">
                  <span className="big-skill-abbr" style={{ color: t.color }}>{t.abbr}</span>
                </div>
              </div>
              <span className="big-skill-name">{t.name}</span>
            </Reveal>
          ))}
        </div>

        {/* ── What I Do (below) ── */}
        <div className="big-skills-head">
          <span className="eyebrow center">What I Do</span>
        </div>
        <Reveal delay={80} className="proc-sub-text">
          <p>From concept to delivery — I design creatives, manage social media, and run digital campaigns that help travel brands grow their audience, boost engagement, and generate quality leads.</p>
        </Reveal>
        <div className="process-grid">
          {WHAT_I_DO.map((s, i) => (
            <Reveal key={s.num} delay={i * 90} className="proc-card glass">
              <div className="proc-num serif">{s.num}</div>
              <div className="proc-ico-wrap">
                <div className="proc-ico"><Icon name={s.icon} size={28} /></div>
              </div>
              <h3 className="proc-title">{s.title}</h3>
              <p className="proc-desc">{s.desc}</p>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

function FactRow({ k, v }) {
  return <div className="fact"><span className="fact-k">{k}</span><span className="fact-v">{v}</span></div>;
}

function About() {
  const D = window.DATA;
  const p = D.person;
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <Reveal className="about-card-col">
          <div className="id-card glass">
            <div className="id-top">
              <div className="id-photo"><img src="assets/profile.jpg" alt="Paramasivan V" /></div>
              <div>
                <h3 className="id-name">{p.name}</h3>
                <span className="id-role gold-text">Design & Marketing Executive</span>
                <span className="id-loc"><Icon name="pin" size={14} /> {p.location}</span>
              </div>
            </div>
            <div className="id-facts">
              <FactRow k="Native" v={p.native} />
              <FactRow k="Working in" v="Coimbatore" />
              <FactRow k="Experience" v={p.experience} />
              <FactRow k="Company" v={p.company} />
              <FactRow k="Industry" v={p.industry} />
            </div>
            <div className="id-actions">
              <a href={p.resume} download="Paramasivan-V-Resume.pdf" type="application/pdf" className="btn btn-gold"><Icon name="download" size={16} /> Resume</a>
              <a href={p.linkedin} target="_blank" rel="noopener" className="btn btn-line"><Icon name="linkedin" size={16} /> LinkedIn</a>
            </div>
          </div>
        </Reveal>

        <div className="about-body">
          <SectionHead kicker="About Me"
            title='A creative who thinks in <span class="gold-grad">campaigns</span>, not just posts.' />
          <Reveal delay={120}>
            <p className="about-lede">Passionate creative professional specializing in social media marketing, content creation, branding, lead generation, and digital growth strategies for travel businesses.</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="about-p">Based in Coimbatore and rooted in coastal Thoothukudi, I turn destinations into stories that travel — pairing a designer's eye with a marketer's discipline to build feeds that look premium and actually convert.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Real brand logos via Simple Icons CDN + custom SVG for non-brand skills */
const SKILL_ICONS = {
  /* ── Design tools ──────────────────────────────────────────────────── */
  "Adobe Photoshop":     { abbr: "Ps",               color: "#06B6D4" },
  "Adobe Illustrator":   { abbr: "Ai",               color: "#22D3EE" },
  "Figma":               { abbr: "Fg",               color: "#0891B2" },
  "Canva":               { abbr: "Ca",               color: "#22D3EE" },
  /* ── Digital Marketing ──────────────────────────────────────────────── */
  "Social Media Marketing": { ico: "share",          color: "#06B6D4" },
  "Meta Ads":            { ico: "globe",              color: "#22D3EE" },
  "Google Ads":          { ico: "search",             color: "#0891B2" },
  "SEO":                 { ico: "trend",              color: "#22D3EE" },
  "Lead Generation":     { ico: "magnet",             color: "#06B6D4" },
  "Campaign Management": { ico: "rocket",             color: "#22D3EE" },
  /* ── Website & Content ──────────────────────────────────────────────── */
  "WordPress":           { abbr: "Wp",               color: "#0891B2" },
  "Content Strategy":    { ico: "layers",             color: "#22D3EE" },
  "Content Planning":    { ico: "book",               color: "#0891B2" },
  "Website Updates":     { ico: "globe",              color: "#06B6D4" },
  /* ── Soft Skills ────────────────────────────────────────────────────── */
  "Communication":       { ico: "mail",               color: "#22D3EE" },
  "Creativity":          { ico: "spark",              color: "#06B6D4" },
  "Problem Solving":     { ico: "search",             color: "#0891B2" },
  "Customer Engagement": { ico: "share",              color: "#22D3EE" },
};

function SkillIconCard({ name, delay }) {
  const meta = SKILL_ICONS[name] || { ico: "pen", color: "#06B6D4" };
  return (
    <Reveal delay={delay} className="sk-cell">
      <div className="sk-card glass" style={{ "--sc": meta.color }}>
        <div className="sk-ico">
          {meta.abbr
            ? <span className="sk-abbr">{meta.abbr}</span>
            : meta.si
            ? <img
                className="sk-si"
                src={`https://cdn.simpleicons.org/${meta.si}/${meta.color.replace("#", "")}`}
                alt={name}
                width="30"
                height="30"
                loading="lazy"
              />
            : <Icon name={meta.ico} size={26} style={{ color: meta.color }} />
          }
        </div>
        <span className="sk-name">{name}</span>
      </div>
    </Reveal>
  );
}

function SkillGroup({ group, startDelay }) {
  return (
    <Reveal className="sk-group">
      <div className="sk-group-head">
        <span className="sk-group-ico"><Icon name={group.icon} size={16} /></span>
        <span className="sk-group-label">{group.title}</span>
      </div>
      <div className="sk-row">
        {group.skills.map((s, i) => (
          <SkillIconCard key={s} name={s} delay={startDelay + i * 45} />
        ))}
      </div>
    </Reveal>
  );
}

function Skills() {
  const D = window.DATA;
  let offset = 0;
  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <SectionHead center kicker="Capabilities"
          title='Skills that <span class="gold-grad">cover the funnel</span>'
          sub="From the first creative to the captured lead — design, marketing and web, end to end." />
        <div className="sk-sections">
          {D.skillGroups.map((g) => {
            const d = offset;
            offset += g.skills.length * 45 + 80;
            return <SkillGroup key={g.title} group={g} startDelay={d} />;
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { About, Skills, CreativeProcess });
