/* Services + Portfolio → window */

const CAT_META = {
  "Festival Creatives":        { color: "#06B6D4", icon: "spark"  },
  "Travel Promotions":         { color: "#22D3EE", icon: "globe"  },
  "Lead Generation Creatives": { color: "#0891B2", icon: "magnet" },
  "Social Media Designs":      { color: "#22D3EE", icon: "share"  },
  "General Creative":          { color: "#22D3EE", icon: "layers" },
  "Festival Creative":         { color: "#06B6D4", icon: "spark"  },
  "Lead Generation Post":      { color: "#0891B2", icon: "magnet" },
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

/* ── Work section ────────────────────────────────────────────────── */
function Work() {
  const D = window.DATA;
  const [allWork,        setAllWork]        = useState([]);
  const [activeItem,     setActiveItem]     = useState(null);
  const [insertAfterIdx, setInsertAfterIdx] = useState(-1);
  const [loaded,         setLoaded]         = useState(false);
  const gridRef = useRef(null);

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

  /* Escape to close */
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape" && activeItem) { setActiveItem(null); setInsertAfterIdx(-1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeItem]);

  const featured = allWork.slice(0, 6);

  /* Open: detect which grid row was clicked → insert expand after last card in that row */
  const handleCardOpen = (item, clickEvent) => {
    /* Clicking active card closes it */
    if (activeItem && (activeItem.id === item.id || activeItem.title === item.title)) {
      setActiveItem(null); setInsertAfterIdx(-1); return;
    }

    setActiveItem(item);

    if (clickEvent && gridRef.current) {
      try {
        const cells     = Array.from(gridRef.current.querySelectorAll(".pf-cell"));
        const clicked   = clickEvent.currentTarget.closest(".pf-cell");
        const clickedIdx = cells.indexOf(clicked);
        if (clickedIdx >= 0) {
          const clickedTop = clicked.getBoundingClientRect().top;
          let lastInRow = clickedIdx;
          for (let j = clickedIdx + 1; j < cells.length; j++) {
            if (Math.abs(cells[j].getBoundingClientRect().top - clickedTop) < 20) lastInRow = j;
            else break;
          }
          setInsertAfterIdx(lastInRow);
          return;
        }
      } catch (_) {}
    }
    setInsertAfterIdx(featured.length - 1);
  };

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

        {loaded && (
          <div className="pf-masonry" ref={gridRef}>
            {featured.map((w, i) => {
              const isActive = !!(activeItem &&
                (activeItem.id === w.id || activeItem.title === w.title));
              return (
                <React.Fragment key={w.id || w.title}>
                  {/* Plain div — CSS animation handles reveal, never resets opacity */}
                  <div
                    className={"pf-cell" + (isActive ? " pf-cell--active" : "")}
                    style={{ animationDelay: Math.min(i * 60, 360) + "ms" }}>
                    <PortfolioCard item={w} onOpen={handleCardOpen} isActive={isActive} />
                  </div>

                  {/* Inline expand inserts after the last card in the clicked row */}
                  {activeItem && insertAfterIdx === i && (
                    <InlineExpand
                      item={activeItem}
                      items={featured}
                      onClose={() => { setActiveItem(null); setInsertAfterIdx(-1); }}
                      onNav={next => setActiveItem(next)}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {allWork.length === 0 && (
              <div className="pf-empty">
                <Icon name="search" size={40} style={{ color: "var(--ink-mut)", opacity: 0.4 }} />
                <p>No projects yet.</p>
              </div>
            )}
          </div>
        )}

        {loaded && allWork.length > 6 && (
          <div className="work-foot">
            <p className="pf-foot-note">{allWork.length - 6} more projects in the full gallery</p>
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

Object.assign(window, { Services, Work, ProjectModal, PortfolioCard, CAT_META, ToolAdder, COMMON_TOOLS, ModalBoundary });
