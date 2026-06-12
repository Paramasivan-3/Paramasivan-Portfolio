/* Testimonials + Contact + Footer → window */

function Testimonials() {
  const D = window.DATA;
  const [i, setI] = useState(0);
  const n = D.testimonials.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  return (
    <section className="tst">
      <div className="wrap">
        <SectionHead center kicker="Testimonials"
          title='Words from <span class="gold-grad">the team &amp; clients</span>' />
        <Reveal className="tst-stage">
          <button className="tst-nav prev" onClick={() => go(-1)} aria-label="Previous"><Icon name="arrowRight" size={20} style={{ transform: "rotate(180deg)" }} /></button>
          <div className="tst-viewport">
            <div className="tst-track" style={{ transform: `translateX(-${i * 100}%)` }}>
              {D.testimonials.map((t, k) => (
                <div className="tst-slide" key={k}>
                  <div className="tst-card glass">
                    <span className="tst-quote"><Icon name="quote" size={40} fill /></span>
                    <p className="tst-text">{t.quote}</p>
                    <div className="tst-who">
                      <span className="tst-ava">{t.initials}</span>
                      <div><strong>{t.name}</strong><span>{t.role}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="tst-nav next" onClick={() => go(1)} aria-label="Next"><Icon name="arrowRight" size={20} /></button>
        </Reveal>
        <div className="tst-dots">
          {D.testimonials.map((_, k) => (
            <button key={k} className={"tst-dot" + (k === i ? " on" : "")} onClick={() => setI(k)} aria-label={"Go to slide " + (k + 1)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Please enter your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "Enter a valid email";
    if (!f.message.trim()) er.message = "Tell me a little about your project";
    setErr(er);
    if (Object.keys(er).length === 0) { setSent(true); setF({ name: "", email: "", phone: "", message: "" }); setTimeout(() => setSent(false), 5000); }
  };
  return (
    <form className="cf glass" onSubmit={submit} noValidate>
      <div className="cf-row">
        <label className="cf-field">
          <span>Name</span>
          <input value={f.name} onChange={set("name")} className={err.name ? "bad" : ""} placeholder="Your name" />
          {err.name && <em>{err.name}</em>}
        </label>
        <label className="cf-field">
          <span>Email</span>
          <input value={f.email} onChange={set("email")} className={err.email ? "bad" : ""} placeholder="you@email.com" />
          {err.email && <em>{err.email}</em>}
        </label>
      </div>
      <label className="cf-field">
        <span>Phone <i className="cf-opt">(optional)</i></span>
        <input value={f.phone} onChange={set("phone")} placeholder="+91 …" />
      </label>
      <label className="cf-field">
        <span>Message</span>
        <textarea rows="4" value={f.message} onChange={set("message")} className={err.message ? "bad" : ""} placeholder="What would you like to create together?" />
        {err.message && <em>{err.message}</em>}
      </label>
      <button type="submit" className="btn btn-gold cf-submit">{sent ? <><Icon name="check" size={18} /> Message sent!</> : <>Send Message <Icon name="arrowRight" size={17} /></>}</button>
      {sent && <p className="cf-note">Thanks! I'll get back to you shortly.</p>}
    </form>
  );
}

function Contact() {
  const D = window.DATA; const p = D.person;
  return (
    <section id="contact" className="contact">
      <div className="wrap contact-grid">
        <div className="contact-left">
          <SectionHead kicker="Get In Touch"
            title="Let's create something that travels far."
            sub="Open to roles, freelance projects and collaborations with travel brands and agencies." />
          <Reveal className="contact-socials">
            <a href={p.linkedin} target="_blank" rel="noopener" className="soc-btn"><Icon name="linkedin" size={18} /></a>
            <a href={p.behance} target="_blank" rel="noopener" className="soc-btn"><Icon name="behance" size={18} /></a>
            <a href={`https://wa.me/${p.phoneRaw}`} target="_blank" rel="noopener" className="soc-btn"><Icon name="whatsapp" size={18} fill /></a>
            <a href={"mailto:" + p.email} className="soc-btn"><Icon name="mail" size={18} /></a>
          </Reveal>
          <Reveal>
            <a href={`https://wa.me/${p.phoneRaw}`} target="_blank" rel="noopener" className="btn btn-wa"><Icon name="whatsapp" size={18} fill /> Chat on WhatsApp</a>
          </Reveal>
        </div>
        <Reveal delay={140} className="contact-right"><ContactForm /></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const D = window.DATA;
  const go = (e, id) => { e.preventDefault(); const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: "smooth" }); };
  return (
    <footer className="ft">
      <div className="wrap ft-inner">
        <div className="ft-brand">
          <a href="#home" className="brand" onClick={(e) => go(e, "home")}>
            <span className="brand-mark serif">PV</span>
            <span className="brand-txt"><strong>Paramasivan&nbsp;V</strong><em>Creative & Social Media Design</em></span>
          </a>
          <p className="ft-tag">Designing creative visuals &amp; social media content for travel brands.</p>
        </div>
        <nav className="ft-links">
          {D.nav.map((l) => <a key={l.id} href={"#" + l.id} onClick={(e) => go(e, l.id)}>{l.label}</a>)}
        </nav>
      </div>
      <div className="wrap ft-bottom">
        <span>© 2026 Paramasivan V. All Rights Reserved.</span>
        <span className="ft-made">Crafted with care in Coimbatore, Tamil Nadu</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Testimonials, Contact, Footer });
