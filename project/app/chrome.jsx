/* Chrome: Loader, ScrollProgress, Navbar, ThemeToggle, FloatDock → window */

function PLogoImg({ size = 40 }) {
  return (
    <img
      src="/assets/logo.png"
      alt="Paramasivan Logo"
      width={size}
      height={size}
      style={{ display: "block", width: size, height: size, objectFit: "contain" }}
    />
  );
}

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
        <PLogoImg size={48} />
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

function Navbar({ theme, setTheme }) {
  const D = window.DATA;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

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
          <span className="brand-mark brand-mark--logo"><PLogoImg size={58} /></span>
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
          <a href={"#contact"} onClick={(e) => go(e, "contact")} className="btn btn-gold nav-cta-m">Work with me</a>
        </nav>

        <div className="nav-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
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

Object.assign(window, { Loader, ScrollProgress, Navbar, ThemeToggle, FloatDock });
