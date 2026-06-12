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
  {
    name: "Adobe Photoshop", color: "#22D3EE",
    path: "M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z",
  },
  {
    name: "Adobe Illustrator", color: "#22D3EE",
    path: "M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z",
  },
  {
    name: "Figma", color: "#22D3EE",
    path: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
  },
  {
    name: "Canva", color: "#22D3EE",
    path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z",
  },
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
                  <svg viewBox="0 0 24 24" fill={t.color} className="big-skill-logo" aria-label={t.name} xmlns="http://www.w3.org/2000/svg">
                    <path d={t.path} />
                  </svg>
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
