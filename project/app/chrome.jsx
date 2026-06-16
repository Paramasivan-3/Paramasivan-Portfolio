/* Chrome: Loader, ScrollProgress, Navbar, ThemeToggle, FloatDock, Footer → window */

/* ── Logo Mark — uses actual assets/logo.png in a clean white badge ── */
function LogoMark({ size = 44 }) {
  const r = Math.round(size * 0.22);
  return (
    <span style={{
      width: size, height: size, borderRadius: r,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "#fff", overflow: "hidden", flexShrink: 0,
      boxShadow: "0 0 0 1px rgba(6,182,212,0.2), 0 4px 14px -4px rgba(6,182,212,0.22)",
      padding: Math.round(size * 0.05),
    }}>
      <img src="/assets/logo.png" alt="Paramasivan V"
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        draggable="false" />
    </span>
  );
}

/* DEAD CODE REMOVED — old SVG P+nib replaced by PNG badge above */
function _UNUSED_SVGLogoMark({ size = 44 }) {
  const w = size, h = Math.round(size * 1.38); /* maintain 58:80 aspect ratio */
  const id = "pm" + size;
  return (
    <svg width={w} height={h} viewBox="0 0 58 80" fill="none"
         xmlns="http://www.w3.org/2000/svg" style={{ display:"block", flexShrink:0 }}>
      <defs>
        {/* Main gradient: deep navy-blue bottom-left → bright cyan top-right */}
        <linearGradient id={id+"g"} x1="0" y1="80" x2="58" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0B2FA0"/>
          <stop offset="30%"  stopColor="#1565C0"/>
          <stop offset="65%"  stopColor="#1E88E5"/>
          <stop offset="100%" stopColor="#00C8FF"/>
        </linearGradient>
        {/* Shadow gradient for depth illusion */}
        <linearGradient id={id+"d"} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#051B5E" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#020D3A" stopOpacity="0.9"/>
        </linearGradient>
        {/* Inner bowl shadow (dark left edge = 3D depth) */}
        <linearGradient id={id+"b"} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%"  stopColor="#0A2070" stopOpacity="0.55"/>
          <stop offset="40%" stopColor="#0A2070" stopOpacity="0"/>
        </linearGradient>
        {/* Top highlight sheen */}
        <linearGradient id={id+"h"} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* ── Shadow layer (offset behind) ──────────────────────────────── */}
      <path fill={"url(#"+id+"d)"} opacity="0.5" transform="translate(3,3)"
        d="M5,2 L27,2 C56,2 56,38 27,38 L27,56 L34,65 L19,80 L4,65 L4,56 Z"/>

      {/* ── Main P + Nib shape ─────────────────────────────────────────── */}
      {/* Outer P letterform: stem (left) + bowl (right) + nib (bottom) */}
      <path fill={"url(#"+id+"g)"}
        d="M5,2 L27,2 C56,2 56,38 27,38 L27,56 L34,65 L19,80 L4,65 L4,2 Z"/>

      {/* ── Bowl counter (white negative space inside P bowl) ─────────── */}
      <path fill="white"
        d="M14,11 L14,30 C46,30 46,11 14,11 Z"/>

      {/* ── 3D depth shadow inside bowl (left edge darker) ───────────── */}
      <path fill={"url(#"+id+"b)"}
        d="M14,11 L14,30 C20,30 21,20 21,11 Z"/>

      {/* ── Highlight sheen on top of bowl ────────────────────────────── */}
      <path fill={"url(#"+id+"h)"} opacity="0.7"
        d="M27,3 C50,3 54,12 52,22 C54,10 52,4 27,5 Z"/>

      {/* ── Pen nib interior groove lines (white strokes) ─────────────── */}
      <path stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"
        d="M19,78 L13,63"/>
      <path stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.65"
        d="M19,78 L32,63"/>

      {/* ── Ink dot (bright cyan circle on left nib prong) ───────────── */}
      <circle cx="13" cy="70" r="2.3" fill="#7BE0FF" opacity="0.95"/>
    </svg>
  );
} /* end _UNUSED_SVGLogoMark */

function Loader() {
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 1700);
    const t2 = setTimeout(() => setHide(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (hide) return null;
  return (
    <div className={"loader" + (gone ? " out" : "")}>
      <div className="loader-mark">
        <svg viewBox="0 0 120 120" width="92" height="92">
          <circle className="loader-ring" cx="60" cy="60" r="54" />
        </svg>
        <LogoMark size={46} />
      </div>
      <div className="loader-name">PARAMASIVAN&nbsp;V</div>
      <div className="loader-sub">Creative Design · Social Media Content</div>
    </div>
  );
}

function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-prog" style={{ width: w + "%" }} />;
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button className="theme-tog" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle colour theme" title="Toggle theme">
      <span className="theme-knob" data-theme-state={theme}>
        <Icon name="sun" size={15} stroke={2.2} />
        <Icon name="moon" size={14} stroke={2.2} />
      </span>
    </button>
  );
}

function Navbar() {
  const D = window.DATA;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("home");
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = D.nav.map((n) => n.id);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  };

  return (
    <header className={"nav" + (scrolled ? " on" : "")}>
      <div className="nav-inner wrap">
        <a href="#home" className="brand" onClick={(e) => go(e, "home")}>
          <span className="brand-mark brand-mark--logo"><LogoMark size={42} /></span>
          <span className="brand-txt">
            <strong>Paramasivan&nbsp;V</strong>
            <em>Creative & Social Media Design</em>
          </span>
        </a>

        <nav className={"nav-links" + (open ? " open" : "")}>
          {D.nav.map((n) => (
            <a key={n.id} href={"#" + n.id} onClick={(e) => go(e, n.id)}
               className={active === n.id ? "active" : ""}>{n.label}</a>
          ))}
          <a href="#contact" onClick={(e) => go(e, "contact")} className="btn btn-gold nav-cta-m">Work with me</a>
        </nav>

        <div className="nav-right">
          <a href="#contact" onClick={(e) => go(e, "contact")} className="btn btn-gold nav-cta">Work with me</a>
          <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

function FloatDock() {
  const D = window.DATA;
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={"dock" + (show ? " show" : "")}>
      <a className="dock-btn wa" href={`https://wa.me/${D.person.phoneRaw}`} target="_blank" rel="noopener"
         aria-label="WhatsApp" title="Chat on WhatsApp">
        <Icon name="whatsapp" size={24} fill />
      </a>
      <button className="dock-btn top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top" title="Back to top">
        <Icon name="arrowUp" size={20} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FOOTER — full redesign: 3-column, logo, contact, social, copyright
   ══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const D = window.DATA; const p = D.person;
  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: "smooth" });
  };

  const socials = [
    { name: "linkedin", href: p.linkedin,                      label: "LinkedIn"  },
    { name: "behance",  href: p.behance,                       label: "Behance"   },
    { name: "whatsapp", href: `https://wa.me/${p.phoneRaw}`,   label: "WhatsApp", fill: true },
    { name: "mail",     href: `mailto:${p.email}`,             label: "Email"     },
  ];

  const links = [
    { id: "home",     label: "Home"      },
    { id: "about",    label: "About"     },
    { id: "skills",   label: "Skills"    },
    { id: "work",     label: "Portfolio" },
    { id: "case-studies", label: "Case Study"  },
    { id: "contact",  label: "Contact"   },
  ];

  const contacts = [
    { icon: "mail",     value: p.email,   href: "mailto:" + p.email },
    { icon: "whatsapp", value: p.phone,   href: "https://wa.me/" + p.phoneRaw, fill: true },
    { icon: "globe",    value: p.location, href: null },
  ];

  return (
    <footer className="ft">
      {/* top gradient accent line */}
      <div className="ft-topline" />

      <div className="wrap ft-body">

        {/* column 1 — brand */}
        <div className="ft-col ft-col--brand">
          <a href="#home" className="ft-logo" onClick={(e) => go(e, "home")}>
            <LogoMark size={44} />
            <span className="ft-logo-txt">
              <strong>Paramasivan V</strong>
              <em>Creative & Social Media Design</em>
            </span>
          </a>
          <p className="ft-tagline">
            Designing creative visuals &amp; social media content for travel brands —
            from festival creatives to lead-generation campaigns.
          </p>
          <div className="ft-socials">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined}
                 rel="noopener" className="ft-soc" aria-label={s.label} title={s.label}>
                <Icon name={s.name} size={18} fill={s.fill} />
              </a>
            ))}
          </div>
        </div>

        {/* column 2 — quick links */}
        <div className="ft-col ft-col--links">
          <h4 className="ft-col-head">Quick Links</h4>
          <nav className="ft-nav">
            {links.map((l) => (
              <a key={l.id} href={"#" + l.id} onClick={(e) => go(e, l.id)} className="ft-nav-link">
                <span className="ft-nav-arrow">→</span>{l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* column 3 — contact */}
        <div className="ft-col ft-col--contact">
          <h4 className="ft-col-head">Get In Touch</h4>
          <div className="ft-contact-list">
            {contacts.map((c) => (
              <div key={c.icon} className="ft-contact-row">
                <span className="ft-contact-ico"><Icon name={c.icon} size={15} fill={c.fill} /></span>
                {c.href
                  ? <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="ft-contact-val">{c.value}</a>
                  : <span className="ft-contact-val">{c.value}</span>
                }
              </div>
            ))}
          </div>
          <a href="#contact" onClick={(e) => go(e, "contact")} className="btn btn-gold ft-cta">
            Let's Work Together <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </div>

      {/* bottom bar */}
      <div className="ft-bottom-bar">
        <div className="wrap ft-bottom">
          <span className="ft-copy">© 2026 Paramasivan V. All Rights Reserved.</span>
          <span className="ft-made">Crafted with care in Coimbatore, Tamil Nadu</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Loader, ScrollProgress, Navbar, ThemeToggle, FloatDock, Footer });
