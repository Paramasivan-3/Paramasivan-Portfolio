/* Shared UI: icons, hooks, primitives → window */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- Icon set (simple stroke line icons) ------------------------------ */
const PATHS = {
  pen: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  spark: "M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3zM19 3v4M21 5h-4M5 17v3M6.5 18.5h-3",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  magnet: "M6 3v7a6 6 0 0 0 12 0V3M6 3H3M18 3h3M6 9H3M18 9h3",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUp: "M12 19V5M6 11l6-6 6 6",
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  close: "M18 6L6 18M6 6l12 12",
  menu: "M3 12h18M3 6h18M3 18h18",
  check: "M20 6L9 17l-5-5",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  quote: "M9.5 7C6.5 7 5 9 5 12v5h5v-5H7c0-1.5.8-2.5 2.5-2.5V7zM19 7c-3 0-4.5 2-4.5 5v5h5v-5h-3c0-1.5.8-2.5 2.5-2.5V7z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  behance: "M3 6h5.5a2.75 2.75 0 0 1 0 5.5H3zM3 11.5h6a2.75 2.75 0 0 1 0 5.5H3zM15 7.5h6M21 14.5h-7a3 3 0 1 0 6 1.2",
  instagram: "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01",
  whatsapp: "M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.3A8.5 8.5 0 1 1 21 11.5zM8.5 8.5c-.3 0-.7.1-.9.5-.3.4-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 4.9 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4l-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.1-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4z",
  filter: "M22 3H2l8 9.5V19l4 2v-8.5L22 3z",
  layers: "M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5",
  trend: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
};
const FILLED = { whatsapp: true, linkedin: false };

function Icon({ name, size = 24, stroke = 2, fill = false, style }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
         stroke={fill ? "none" : "currentColor"} strokeWidth={stroke} strokeLinecap="round"
         strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

/* ---- hooks ------------------------------------------------------------- */
function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (el.classList.contains("in")) return;
    let io, t;
    const margin = (options.viewport ?? 0.9);
    const reveal = () => { el.classList.add("in"); cleanup(); };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * margin) reveal(); // in view OR already scrolled past
    };
    function cleanup() {
      if (io) io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      clearTimeout(t);
    }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) reveal(); });
      }, { threshold: options.threshold ?? 0.14, rootMargin: options.margin ?? "0px 0px -6% 0px" });
      io.observe(el);
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    t = setTimeout(check, 240); // fallback if IO never fires
    return cleanup;
  }, []);
  return ref;
}

function useCountUp(target, { decimals = 0, duration = 1800 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(target); return; }
    let io, t;
    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(target * eased);
        if (p < 1) requestAnimationFrame(tick); else setVal(target);
      };
      requestAnimationFrame(tick);
      cleanup();
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top >= window.innerHeight) return;        // still below the fold
      if (r.bottom < 0) { done.current = true; setVal(target); cleanup(); return; } // already past — snap
      run();                                          // in view — animate
    };
    function cleanup() {
      if (io) io.disconnect();
      window.removeEventListener("scroll", check);
      clearTimeout(t);
    }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) run(); });
      }, { threshold: 0.45 });
      io.observe(el);
    }
    window.addEventListener("scroll", check, { passive: true });
    t = setTimeout(check, 300);
    return cleanup;
  }, [target]);
  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return [ref, display];
}

/* ---- primitives -------------------------------------------------------- */
function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
  const ref = useReveal();
  const Tag = as;
  return <Tag ref={ref} className={"reveal " + className} style={{ transitionDelay: delay + "ms", ...style }} {...rest}>{children}</Tag>;
}

function Eyebrow({ children, center }) {
  return <span className={"eyebrow" + (center ? " center" : "")}>{children}</span>;
}

function SectionHead({ kicker, title, sub, center, children }) {
  return (
    <div className={"sec-head" + (center ? " center" : "")}>
      <Reveal><Eyebrow center={center}>{kicker}</Eyebrow></Reveal>
      <Reveal delay={80} as="h2" dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <Reveal delay={140} as="p">{sub}</Reveal>}
      {children}
    </div>
  );
}

function Stat({ value, suffix = "", label, decimals = 0 }) {
  const [ref, display] = useCountUp(value, { decimals });
  return (
    <div className="stat">
      <div ref={ref} className="stat-num serif">{display}<span className="stat-suf gold-text">{suffix}</span></div>
      <div className="stat-lab">{label}</div>
    </div>
  );
}

Object.assign(window, {
  useState, useEffect, useRef, useCallback,
  Icon, useReveal, useCountUp, Reveal, Eyebrow, SectionHead, Stat,
});
