/* App shell: theme + tweaks + composition → renders #root */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "Spotlight",
  "gold": ["#06B6D4", "#22D3EE", "#0891B2"]
}/*EDITMODE-END*/;

const HERO_MAP = { "Spotlight": 1, "Editorial": 2, "Split": 3 };

function hexToRgb(hex) {
  const m = hex.replace("#", "");
  const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", ");
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { document.documentElement.setAttribute("data-theme", "dark"); }, []);

  useEffect(() => {
    const g = t.gold || TWEAK_DEFAULTS.gold;
    const root = document.documentElement.style;
    root.setProperty("--gold", g[0]);
    root.setProperty("--gold-bright", g[1]);
    root.setProperty("--gold-deep", g[2]);
    root.setProperty("--gold-rgb", hexToRgb(g[0]));
  }, [t.gold]);

  const variant = HERO_MAP[t.heroVariant] || 1;

  return (
    <>
      <Loader />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero variant={variant} />
        <About />
        <CreativeProcess />
        <Work />
        <Achievements />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatDock />

      <TweaksPanel>
        <TweakSection label="Hero layout" />
        <TweakRadio label="Variation" value={t.heroVariant}
          options={["Spotlight", "Editorial", "Split"]}
          onChange={(v) => setTweak("heroVariant", v)} />
        <TweakSection label="Accent" />
        <TweakColor label="Cyan tone" value={t.gold}
          options={[["#06B6D4", "#22D3EE", "#0891B2"], ["#0EA5E9", "#38BDF8", "#0284C7"], ["#14B8A6", "#2DD4BF", "#0F766E"]]}
          onChange={(v) => setTweak("gold", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
