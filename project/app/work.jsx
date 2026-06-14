/* Services + Portfolio → window */

const CAT_META = {
  "Festival Creatives":        { color: "#A78BFA", icon: "spark"  },
  "Travel Promotions":         { color: "#22D3EE", icon: "globe"  },
  "Lead Generation Creatives": { color: "#34D399", icon: "magnet" },
  "Social Media Designs":      { color: "#FB923C", icon: "share"  },
  "General Creative":          { color: "#22D3EE", icon: "layers" },
  "Festival Creative":         { color: "#A78BFA", icon: "spark"  },
  "Lead Generation Post":      { color: "#34D399", icon: "magnet" },
  "Website Content":           { color: "#22D3EE", icon: "globe"  },
};
const CATEGORIES = [
  "All",
  "Festival Creatives",
  "Travel Promotions",
  "Lead Generation Creatives",
];

/* ── Services ────────────────────────────────────────────────────── */
function Services() {
  const D = window.DATA;
  return (
    <section id="services" className="services">
      <div className="wrap">
        <SectionHead kicker="What I Do"
          title={'Services built for <span class="gold-grad">travel brands</span>'}
          sub="Six focused offerings that take a destination from blank canvas to a booked trip." />
        <div className="services-grid">
          {D.services.map((s, i) => (
            <div key={s.title} className="svc-card glass">
              <div className="svc-num serif">{String(i + 1).padStart(2, "0")}</div>
              <span className="svc-ico"><Icon name={s.icon} size={24} /></span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="svc-arrow"><Icon name="arrowUpRight" size={18} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Tool adder ──────────────────────────────────────────────────── */
const COMMON_TOOLS = [
  "Photoshop", "Illustrator", "Figma", "InDesign", "Canva",
  "After Effects", "Premiere Pro", "CorelDRAW", "Lightroom",
  "Adobe XD", "Sketch", "GIMP", "Procreate", "Blender",
];

function ToolAdder({ current, onAdd }) {
  const [open, setOpen] = useState(false);
  const available = COMMON_TOOLS.filter(t => !(current || []).includes(t));
  useEffect(() => {
    if (!open) return;
    const h = e => { if (!e.target.closest(".tool-adder")) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  if (available.length === 0) return null;
  return (
    <div className="tool-adder">
      <button className="tool-add-btn" onClick={() => setOpen(o => !o)}>+ Add</button>
      {open && (
        <div className="tool-dropdown">
          {available.map(t => (
            <button key={t} className="tool-dropdown-item"
              onClick={() => { onAdd(t); setOpen(false); }}>{t}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── ProjectModal — kept for portfolio-gallery.html use ──────────── */
function ProjectModal({ item, items, onClose, onNav, onDelete, onAddOpen, onEditProject, onRemoveImage, onEditTools }) {
  const [zoomed,    setZoomed]    = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [closing,   setClosing]   = useState(false);
  const [slideIdx,  setSlideIdx]  = useState(0);
  const [toolsEdit, setToolsEdit] = useState(false);
  const closeTimerRef = useRef(null);

  const idx      = items.indexOf(item);
  const catColor = (CAT_META[item.category] || {}).color || "var(--gold)";
  const slides   = (item.images && item.images.length > 0) ? item.images : (item.image ? [item.image] : []);
  const curImg   = slides[slideIdx] || item.image;

  const close = () => {
    setClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => { setClosing(false); onClose(); }, 280);
  };

  const navProject = dir => {
    setImgLoaded(false); setImgError(false); setZoomed(false); setSlideIdx(0); setToolsEdit(false);
    onNav(items[(idx + dir + items.length) % items.length]);
  };

  const navSlide = dir => {
    setImgLoaded(false); setImgError(false); setZoomed(false);
    setSlideIdx(s => (s + dir + slides.length) % slides.length);
  };

  useEffect(() => {
    setSlideIdx(0); setToolsEdit(false); setClosing(false);
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  }, [item]);
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowRight") slides.length > 1 ? navSlide(1)  : navProject(1);
      if (e.key === "ArrowLeft")  slides.length > 1 ? navSlide(-1) : navProject(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [idx, items, slideIdx, slides.length]);

  const hasImg = !!(curImg && curImg.trim()) && !imgError;

  return ReactDOM.createPortal(
    <div className={"pv-overlay" + (closing ? " closing" : "")}
      onClick={e => e.target === e.currentTarget && close()}
      role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="pv-modal">
        <button className="pv-close glass" onClick={close} aria-label="Close project viewer">
          <Icon name="close" size={20} />
        </button>
        <div className="pv-img-panel">
          {!imgLoaded && !imgError && curImg && <div className="pv-img-skeleton" />}
          {curImg && !imgError ? (
            <img key={curImg}
              className={"pv-img" + (zoomed ? " zoomed" : "") + (imgLoaded ? " loaded" : "")}
              src={curImg} alt={item.title}
              onClick={() => setZoomed(!zoomed)}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }} />
          ) : (
            <div className="pv-img-ph ph" />
          )}
          {hasImg && (
            <div className="pv-zoom-pill">
              <Icon name={zoomed ? "close" : "eye"} size={13} />
              {zoomed ? "Click to zoom out" : "Click to zoom in"}
            </div>
          )}
          {onRemoveImage && curImg && (
            <button className="pv-remove-img-btn glass"
              onClick={() => {
                const msg = slides.length <= 1 ? "Remove the only image?" : "Remove image " + (slideIdx + 1) + " of " + slides.length + "?";
                if (window.confirm(msg)) onRemoveImage(item.id || item.title, curImg);
              }}>
              <Icon name="close" size={12} /> Remove image
            </button>
          )}
          {slides.length > 1 && (
            <>
              <button className="pv-arrow pv-arrow-l glass" onClick={() => navSlide(-1)}>
                <Icon name="arrowRight" size={20} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button className="pv-arrow pv-arrow-r glass" onClick={() => navSlide(1)}>
                <Icon name="arrowRight" size={20} />
              </button>
              <div className="pv-dots">
                {slides.map((_, i) => (
                  <button key={i} className={"pv-dot" + (i === slideIdx ? " on" : "")}
                    onClick={() => { setSlideIdx(i); setImgLoaded(false); setImgError(false); setZoomed(false); }} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="pv-detail-panel">
          <div className="pv-detail-scroll">
            <span className="pv-cat" style={{ "--cc": catColor }}>{item.category}</span>
            <h2 className="pv-title">{item.title}</h2>
            <p className="pv-desc">{item.description || item.desc}</p>
            <div className="pv-section">
              <div className="pv-section-head">
                <span className="pv-section-label">Tools Used</span>
                {onEditTools && (
                  <button className={"pv-tools-edit-toggle" + (toolsEdit ? " on" : "")}
                    onClick={() => setToolsEdit(v => !v)}>
                    {toolsEdit ? <><Icon name="check" size={11} /> Done</> : <><Icon name="pen" size={11} /> Edit</>}
                  </button>
                )}
              </div>
              <div className="pv-tools">
                {(item.tools || []).map(t => (
                  <span key={t} className={"tool" + (toolsEdit ? " tool-editable" : "")}>{t}
                    {toolsEdit && (
                      <button className="tool-remove-btn"
                        onClick={() => onEditTools(item.id || item.title, (item.tools || []).filter(x => x !== t))}>×</button>
                    )}
                  </span>
                ))}
                {toolsEdit && onEditTools && (
                  <ToolAdder current={item.tools || []}
                    onAdd={t => onEditTools(item.id || item.title, [...(item.tools || []), t])} />
                )}
                {(!item.tools || item.tools.length === 0) && !toolsEdit && (
                  <span style={{ color: "var(--ink-mut)", fontSize: "13px" }}>—</span>
                )}
              </div>
            </div>
            {slides.length > 1 && (
              <div className="pv-section">
                <span className="pv-section-label">Images in this project</span>
                <div className="pv-thumb-strip">
                  {slides.map((src, i) => (
                    <button key={i} className={"pv-thumb-btn" + (i === slideIdx ? " on" : "")}
                      onClick={() => { setSlideIdx(i); setImgLoaded(false); setImgError(false); setZoomed(false); }}>
                      <img src={src} alt="" loading="lazy" onError={e => e.currentTarget.style.display = "none"} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {item.year && (
              <div className="pv-section">
                <span className="pv-section-label">Year</span>
                <span className="pv-section-val">{item.year}</span>
              </div>
            )}
          </div>
          {(onAddOpen || onEditProject || onDelete) && (
            <div className="pv-action-row">
              {onAddOpen && <button className="pv-action-btn pv-action-add" onClick={onAddOpen}><span className="pv-action-plus">+</span>Add</button>}
              {onEditProject && <button className="pv-action-btn pv-action-edit" onClick={() => onEditProject(item)}><Icon name="pen" size={13} /> Edit</button>}
              {onDelete && (
                <button className="pv-action-btn pv-action-del"
                  onClick={() => { if (window.confirm('Delete "' + item.title + '"?')) { onDelete(item.id || item.title); close(); } }}>
                  <Icon name="close" size={13} /> Delete
                </button>
              )}
            </div>
          )}
          <div className="pv-nav-strip">
            <button className="pv-nav-btn glass" onClick={() => navProject(-1)}>
              <Icon name="arrowRight" size={16} style={{ transform: "rotate(180deg)" }} /><span>Prev</span>
            </button>
            <span className="pv-counter">{idx + 1} / {items.length}</span>
            <button className="pv-nav-btn glass" onClick={() => navProject(1)}>
              <span>Next</span><Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── InlineExpand — opens inside the grid, all cards stay visible ── */
function InlineExpand({ item, items, onClose, onNav }) {
  const [slideIdx,  setSlideIdx]  = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const expandRef = useRef(null);

  const catColor = (CAT_META[item.category] || {}).color || "var(--gold)";
  const slides   = Array.isArray(item.images) && item.images.length > 0
    ? item.images : (item.image ? [item.image] : []);
  const curImg   = slides[slideIdx];
  const idx      = items.findIndex(p => p.id === item.id || p.title === item.title);

  useEffect(() => {
    setSlideIdx(0); setImgLoaded(false); setImgError(false);
  }, [item.id, item.title]);

  /* Scroll the panel into view smoothly */
  useEffect(() => {
    const el = expandRef.current;
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    return () => clearTimeout(t);
  }, [item.id, item.title]);

  /* Keyboard: Escape to close, arrows to navigate slides or projects */
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight") {
        if (slides.length > 1) { setImgLoaded(false); setImgError(false); setSlideIdx(s => (s + 1) % slides.length); }
        else if (idx < items.length - 1) onNav(items[idx + 1]);
      }
      if (e.key === "ArrowLeft") {
        if (slides.length > 1) { setImgLoaded(false); setImgError(false); setSlideIdx(s => (s - 1 + slides.length) % slides.length); }
        else if (idx > 0) onNav(items[idx - 1]);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [idx, items, slides.length]);

  const navSlide = dir => {
    setImgLoaded(false); setImgError(false);
    setSlideIdx(s => (s + dir + slides.length) % slides.length);
  };

  return (
    <div ref={expandRef} className="pf-inline-expand" role="region" aria-label={item.title}>

      <button className="pf-ie-close" onClick={onClose} aria-label="Close">
        <Icon name="close" size={16} />
      </button>

      {/* ── Image column ── */}
      <div className="pf-ie-img-col">
        <div className="pf-ie-img-wrap">
          {curImg && !imgError ? (
            <img key={curImg} src={curImg} alt={item.title}
              className={"pf-ie-img" + (imgLoaded ? " loaded" : "")}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }} />
          ) : (
            <div className="pf-ie-img-ph ph" />
          )}

          {slides.length > 1 && (
            <>
              <button className="pf-ie-arrow pf-ie-arrow-l glass" onClick={() => navSlide(-1)} aria-label="Previous image">
                <Icon name="arrowRight" size={18} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button className="pf-ie-arrow pf-ie-arrow-r glass" onClick={() => navSlide(1)} aria-label="Next image">
                <Icon name="arrowRight" size={18} />
              </button>
              <div className="pf-ie-dots">
                {slides.map((_, i) => (
                  <button key={i}
                    className={"pf-ie-dot" + (i === slideIdx ? " on" : "")}
                    onClick={() => { setSlideIdx(i); setImgLoaded(false); setImgError(false); }}
                    aria-label={"Slide " + (i + 1)} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {slides.length > 1 && (
          <div className="pf-ie-strip">
            {slides.map((src, i) => (
              <button key={i}
                className={"pf-ie-thumb" + (i === slideIdx ? " on" : "")}
                onClick={() => { setSlideIdx(i); setImgLoaded(false); setImgError(false); }}>
                <img src={src} alt="" loading="lazy"
                  onError={e => e.currentTarget.style.display = "none"} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info column ── */}
      <div className="pf-ie-info">
        <span className="pv-cat" style={{ "--cc": catColor }}>{item.category}</span>
        <h3 className="pf-ie-title">{item.title}</h3>

        {(item.description || item.desc) && (
          <p className="pf-ie-desc">{item.description || item.desc}</p>
        )}

        {item.tools && item.tools.length > 0 && (
          <div className="pf-ie-section">
            <span className="pv-section-label">Tools Used</span>
            <div className="pf-tools" style={{ marginTop: "8px" }}>
              {item.tools.map(t => <span key={t} className="tool">{t}</span>)}
            </div>
          </div>
        )}

        {item.year && (
          <div className="pf-ie-section">
            <span className="pv-section-label">Year</span>
            <span className="pf-ie-year">{item.year}</span>
          </div>
        )}

        <div className="pf-ie-nav">
          <button className="pf-ie-nav-btn glass" disabled={idx <= 0}
            onClick={() => onNav(items[idx - 1])}>
            <Icon name="arrowRight" size={14} style={{ transform: "rotate(180deg)" }} />
            <span>Prev</span>
          </button>
          <span className="pf-ie-counter">{idx + 1} / {items.length}</span>
          <button className="pf-ie-nav-btn glass" disabled={idx >= items.length - 1}
            onClick={() => onNav(items[idx + 1])}>
            <span>Next</span>
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Portfolio card ──────────────────────────────────────────────── */
function PortfolioCard({ item, onOpen, isActive }) {
  const category = item.category || item.cat;
  const catMeta  = CAT_META[category] || { color: "var(--gold)" };
  const hasImg   = !!(item.image && item.image.trim());

  return (
    <article
      className={"pf-card glass" + (isActive ? " pf-card--active" : "")}
      onClick={e => { e.stopPropagation(); onOpen(item, e); }}
      onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); onOpen(item, e); } }}
      role="button" tabIndex={0}
      aria-label={(isActive ? "Close " : "Open ") + item.title}
      aria-expanded={!!isActive}
    >
      <div className="pf-thumb" style={{ "--cc": catMeta.color }}>
        {hasImg ? (
          <img className="pf-img" src={item.image} alt={item.title} loading="lazy"
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = "flex");
            }} />
        ) : null}
        <div className="pf-ph ph" style={{ display: hasImg ? "none" : "flex" }} />
        <div className="pf-badge" style={{ "--cc": catMeta.color }}>{category}</div>
        <div className="pf-hover-overlay">
          <div className="pf-view-ring">
            <Icon name={isActive ? "close" : "eye"} size={22} />
          </div>
          <span className="pf-view-label">{isActive ? "Close" : "View Project"}</span>
        </div>
      </div>
      <div className="pf-footer">
        <div className="pf-footer-main">
          <h3 className="pf-title">{item.title}</h3>
          <div className="pf-tools">
            {(item.tools || []).slice(0, 3).map(t => (
              <span key={t} className="tool">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── WorkGroup — one category's cards with GSAP scroll-reveal ───────── */
function WorkGroup({ category, items, onOpen, activeItemKey }) {
  const gridRef = useRef(null);
  const catMeta = CAT_META[category] || { color: "var(--gold)", icon: "layers" };

  useEffect(() => {
    if (!gridRef.current || !items.length) return;
    let tries = 0;
    const init = () => {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        if (++tries < 20) { setTimeout(init, 150); return; }
        const cells = gridRef.current.querySelectorAll(".pf-cell");
        cells.forEach(c => { c.style.opacity = "1"; c.style.transform = "none"; });
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      const cells = Array.from(gridRef.current.querySelectorAll(".pf-cell"));
      gsap.fromTo(cells,
        { opacity: 0, y: 36, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1,
          duration: 0.65, ease: "power3.out",
          stagger: { each: 0.09, from: "start" },
          scrollTrigger: { trigger: gridRef.current, start: "top 90%", once: true }
        }
      );
    };
    setTimeout(init, 80);
  }, [items]);

  return (
    <div className="work-group">
      <div className="work-group-header">
        <div className="work-group-badge" style={{ "--cc": catMeta.color }}>
          <Icon name={catMeta.icon || "layers"} size={14} />
          <span>{category}</span>
        </div>
        <span className="work-group-count">{items.length} works</span>
        <div className="work-group-line" />
      </div>
      <div className="work-group-grid" ref={gridRef}>
        {items.map((item, i) => {
          const isActive = !!(activeItemKey &&
            (item.id === activeItemKey || item.title === activeItemKey));
          return (
            <div key={item.id || item.title || i} className="pf-cell">
              <PortfolioCard item={item} onOpen={onOpen} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Work section ────────────────────────────────────────────────── */
function Work() {
  const D = window.DATA;
  const [allWork,    setAllWork]    = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [loaded,     setLoaded]     = useState(false);

  useEffect(() => {
    const norm = raw => {
      if (!raw || typeof raw !== "object") return null;
      const image = raw.image || "";
      return {
        ...raw,
        id:       raw.id    || raw.title || ("w-" + Math.random().toString(36).slice(2)),
        title:    raw.title || "Untitled",
        category: raw.category || raw.cat || "General Creative",
        image,
        images: Array.isArray(raw.images) ? raw.images : (image ? [image] : []),
        tools:  Array.isArray(raw.tools)  ? raw.tools  : [],
      };
    };
    const applyLocalEdits = data => {
      const edits   = JSON.parse(localStorage.getItem("pv-project-edits") || "{}");
      const deleted = JSON.parse(localStorage.getItem("pv-deleted")        || "[]");
      return data
        .map(p => { const edit = edits[p.id || p.title]; return norm(edit ? { ...p, ...edit } : p); })
        .filter(p => p && !deleted.includes(p.id || p.title));
    };
    const inline = window.PORTFOLIO_DATA;
    if (Array.isArray(inline) && inline.length) {
      setAllWork(applyLocalEdits(inline)); setLoaded(true); return;
    }
    fetch("assets/portfolio/portfolio.json")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAllWork(applyLocalEdits(Array.isArray(data) && data.length ? data : (D.work || []))))
      .catch(() => setAllWork(applyLocalEdits(D.work || [])))
      .finally(() => setLoaded(true));
  }, []);

  /* Escape to close modal */
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape" && activeItem) setActiveItem(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeItem]);

  const featured = allWork.slice(0, 6);

  const activeItemKey = activeItem ? (activeItem.id || activeItem.title) : null;

  const handleCardOpen = useCallback((item, _e) => {
    setActiveItem(prev =>
      prev && (prev.id === item.id || prev.title === item.title) ? null : item
    );
  }, []);

  return (
    <section id="work" className="work">
      <div className="pf-bg-accent" />
      <div className="pf-bg-accent pf-bg-accent-2" />

      <div className="wrap">
        <SectionHead center kicker="Creative Showcase"
          title={'Selected <span class="gold-grad">Creative Works</span>'}
          sub="Festival campaigns, travel promotions, lead-gen creatives and social media content — built for a growing travel brand." />

        {!loaded && (
          <div className="pf-skeleton-grid">
            {[340, 260, 300, 280, 360, 240].map((h, i) => (
              <div key={i} className="pf-skeleton-card" style={{ height: h + "px" }} />
            ))}
          </div>
        )}

        {loaded && featured.length > 0 && (
          <div className="pf-masonry">
            {featured.map((w, i) => {
              const isActive = !!(activeItemKey &&
                (w.id === activeItemKey || w.title === activeItemKey));
              return (
                <React.Fragment key={w.id || w.title || i}>
                  <div className={"pf-cell" + (isActive ? " pf-cell--active" : "")}
                       style={{ animationDelay: Math.min(i * 60, 360) + "ms" }}>
                    <PortfolioCard item={w} onOpen={handleCardOpen} isActive={isActive} />
                  </div>
                  {isActive && (
                    <InlineExpand
                      item={activeItem}
                      items={featured}
                      onClose={() => setActiveItem(null)}
                      onNav={setActiveItem}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {loaded && allWork.length === 0 && (
          <div className="pf-masonry">
            <div className="pf-empty">
              <Icon name="search" size={40} style={{ color: "var(--ink-mut)", opacity: 0.4 }} />
              <p>No projects yet.</p>
            </div>
          </div>
        )}

        {loaded && allWork.length > 0 && (
          <div className="work-foot">
            <a href="portfolio-gallery.html" className="pf-showmore-btn">
              <Icon name="layers" size={18} />
              <span>View Full Portfolio Gallery</span>
              <Icon name="arrowRight" size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── ModalBoundary — kept for portfolio-gallery.html use ─────────── */
class ModalBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidUpdate(prev) {
    if (prev.itemKey !== this.props.itemKey && this.state.err) this.setState({ err: false });
  }
  render() {
    if (this.state.err) {
      return ReactDOM.createPortal(
        <div className="pv-overlay" onClick={this.props.onClose} role="dialog" aria-modal="true">
          <div style={{ color: "#fff", textAlign: "center", padding: "2rem" }}>
            <p>Could not open project.</p>
            <button className="btn" onClick={this.props.onClose}>Close</button>
          </div>
        </div>,
        document.body
      );
    }
    return this.props.children;
  }
}

/* ==========================================================================
   HsSlide — one cinematic slide per individual image
   ========================================================================== */
function HsSlide({ src, title, category, index }) {
  const catColor = (CAT_META[category] || {}).color || "var(--gold)";
  const [err, setErr] = useState(false);
  /* Alternate widths: 0→wide, 1→portrait, 2→portrait, 3→wide, repeat */
  const pattern = [520, 320, 340, 480];
  const w = pattern[index % pattern.length];
  return (
    <figure
      className="hs-slide"
      style={{ "--sw": w + "px", "--cc": catColor }}
      aria-label={title}
    >
      {src && !err ? (
        <img
          className="hs-slide-img"
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="hs-slide-ph" />
      )}
      <figcaption className="hs-slide-cap">
        <span className="hs-slide-cat">{category}</span>
        <span className="hs-slide-ttl">{title}</span>
      </figcaption>
      <span className="hs-slide-idx">{String(index + 1).padStart(2, "0")}</span>
    </figure>
  );
}

/* ==========================================================================
   HorizontalCreatives — Cinematic GSAP pin + scrub horizontal filmstrip
   Every individual image from every project folder shown as its own slide.
   ========================================================================== */
function HorizontalCreatives() {
  const [slides, setSlides] = useState([]);
  const sectionRef          = useRef(null);
  const trackRef            = useRef(null);
  const gsapCtxRef          = useRef(null);

  /* ── Flatten every image from every project ─────────────────── */
  useEffect(() => {
    const raw = window.PORTFOLIO_DATA;
    if (!Array.isArray(raw)) return;
    const flat = [];
    raw.forEach(p => {
      const imgs = Array.isArray(p.images) && p.images.length
        ? p.images
        : (p.image ? [p.image] : []);
      imgs.forEach(src => flat.push({
        src,
        title:    p.title    || "Untitled",
        category: p.category || "",
      }));
    });
    setSlides(flat);
  }, []);

  /* ── GSAP pin + horizontal scrub ─────────────────────────────── */
  useEffect(() => {
    if (!slides.length) return;
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    let tries = 0;
    const init = () => {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        if (++tries < 40) { setTimeout(init, 200); return; }
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      if (gsapCtxRef.current) gsapCtxRef.current.revert();

      gsapCtxRef.current = gsap.context(() => {
        const dist = () => track.scrollWidth - section.clientWidth;

        gsap.to(track, {
          x:    () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger:             section,
            start:               "top top",
            end:                 () => "+=" + dist(),
            pin:                 true,
            scrub:               1.2,
            anticipatePin:       1,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const bar = section.querySelector(".hs-bar-fill");
              const ctr = section.querySelector(".hs-counter-cur");
              if (bar) bar.style.transform =
                "scaleX(" + self.progress.toFixed(4) + ")";
              if (ctr) ctr.textContent =
                String(Math.round(self.progress * slides.length)).padStart(2, "0");
            },
          },
        });

        /* subtle per-slide parallax — images scale slightly while scrolling */
        Array.from(track.querySelectorAll(".hs-slide-img")).forEach(img => {
          gsap.fromTo(img,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger:             section,
                start:               "top top",
                end:                 () => "+=" + dist(),
                scrub:               2,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }, section);
    };
    setTimeout(init, 300);

    return () => { if (gsapCtxRef.current) gsapCtxRef.current.revert(); };
  }, [slides]);

  if (!slides.length) return null;

  return (
    <section id="creatives" className="hs-section" ref={sectionRef}>

      {/* ── Fixed UI overlay (stays put while track moves) ─────── */}
      <div className="hs-ui" aria-hidden="true">

        {/* top-left label */}
        <div className="hs-label-tl">
          <span className="hs-label-dot" />
          <span className="hs-label-text">Creative Showcase</span>
        </div>

        {/* top-right counter */}
        <div className="hs-counter">
          <span className="hs-counter-cur">00</span>
          <span className="hs-counter-sep">/</span>
          <span className="hs-counter-tot">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* bottom-left title */}
        <div className="hs-label-bl">
          <h2 className="hs-title">
            Works<br />
            <em>that Travel</em>
          </h2>
          <a href="portfolio-gallery.html" className="hs-gallery-link" aria-label="View full gallery">
            <span>Full Gallery</span>
            <span className="hs-gallery-arrow">→</span>
          </a>
        </div>

        {/* bottom-right scroll hint */}
        <div className="hs-scroll-hint">
          <div className="hs-scroll-line"><div className="hs-scroll-bar" /></div>
          <span className="hs-scroll-text">Scroll</span>
        </div>

      </div>

      {/* ── Filmstrip track ────────────────────────────────────── */}
      <div className="hs-track" ref={trackRef}>
        {slides.map((s, i) => (
          <HsSlide
            key={s.src + "-" + i}
            src={s.src}
            title={s.title}
            category={s.category}
            index={i}
          />
        ))}

        {/* CTA end slide */}
        <a href="portfolio-gallery.html" className="hs-cta-slide" aria-label="View full portfolio gallery">
          <div className="hs-cta-ring">
            <Icon name="layers" size={26} />
          </div>
          <p className="hs-cta-text">View Full<br />Portfolio Gallery</p>
          <span className="hs-cta-arrow">→</span>
        </a>
      </div>

      {/* ── Bottom progress bar ─────────────────────────────────── */}
      <div className="hs-bar-track" aria-hidden="true">
        <div className="hs-bar-fill" />
      </div>

    </section>
  );
}

Object.assign(window, { Services, Work, ProjectModal, PortfolioCard, CAT_META, ToolAdder, COMMON_TOOLS, ModalBoundary, HorizontalCreatives });
