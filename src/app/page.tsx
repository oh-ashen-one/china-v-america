import RailBias from "../components/rail-bias";
import Boot from "../components/boot";
import Hero from "../components/hero";
import Scoreboard from "../components/scoreboard";

type Token = { cjk?: string; name: string; hex: string; swatch: string };

const US_TOKENS: Token[] = [
  { name: "Field · Black", hex: "#05070A", swatch: "sw-us-field" },
  { name: "NASA Blue", hex: "#2F5FC2", swatch: "sw-nasa" },
  { name: "Legal-Pad Amber", hex: "#F1DD9A", swatch: "sw-legalpad" },
  { name: "Hot Amber Ink", hex: "#FFB43A", swatch: "sw-amber" },
];

const CN_TOKENS: Token[] = [
  { cjk: "漆", name: "Lacquer", hex: "#3B160F", swatch: "sw-lacquer" },
  { cjk: "朱", name: "Cinnabar", hex: "#DE4A2F", swatch: "sw-cinnabar" },
  { cjk: "玉", name: "Jade", hex: "#7CC3A0", swatch: "sw-jade" },
  { cjk: "金", name: "Gold", hex: "#D2A94F", swatch: "sw-gold" },
  { cjk: "夜青", name: "Night Cyan", hex: "#1F7E8C", swatch: "sw-nightcyan" },
];

export default function Home() {
  return (
    <div className="app-root">
      {/* US-003 · diegetic cold open, first visit only (localStorage) */}
      <Boot />

      <RailBias />

      {/* fixed atmosphere: US half / CN half / center spine line */}
      <div className="atm atm--us" aria-hidden="true" />
      <div className="atm atm--cn" aria-hidden="true" />
      <div className="spine-line" aria-hidden="true" />

      <div className="stage">
        {/* ---- topbar ----------------------------------------------------- */}
        <header className="rail-grid topbar">
          <span className="tag tag--us">
            US · <span lang="zh-CN">美国</span>
          </span>
          <div className="topbar-mid">
            <p className="brand">China × America</p>
            <span className="spine-dot" aria-hidden="true" />
          </div>
          <span className="tag tag--cn">
            <span lang="zh-CN">中国</span> · CN
          </span>
        </header>

        {/* ---- stage main: hero thesis first, then the spec section ------- */}
        <main className="stage-main">
          {/* US-004 · hero thesis + CTA, sitting inside the dual-rail */}
          <Hero />

          {/* US-005 · interactive scoreboard, ten rows across both rails */}
          <Scoreboard />

          {/* ---- dual-rail spec section ---------------------------------- */}
          <section id="spec" className="rail-grid spec" aria-label="Dual-rail visual system">
            {/* ============ AMERICA RAIL (left) ============================= */}
            <div className="rail rail--us">
              <div className="rail-plate plate--us">
                <p className="plate-meta">
                  <span>Rail 01</span>
                  <span>Persistent</span>
                </p>
                <p className="plate-title">America</p>
                <p className="plate-sub">
                  Black field, NASA blue rules, legal-pad amber. Grotesque type
                  on hairline rules.
                </p>
              </div>

              <article className="spec-card spec-card--us">
                <p className="card-meta">
                  <span>Token Set · R-01</span>
                  <span>Grotesque / Hairline</span>
                </p>

                <ul className="tok-list">
                  {US_TOKENS.map((t) => (
                    <li key={t.name} className="tok">
                      <span className={`swatch ${t.swatch}`} aria-hidden="true" />
                      <span className="tok-name">{t.name}</span>
                      <span className="tok-hex">{t.hex}</span>
                    </li>
                  ))}
                </ul>

                <div className="specimen">
                  <p className="spec-label">Type Specimen</p>
                  <p className="specimen-big">Black field, blue rules.</p>
                  <div className="hairline-row" role="presentation">
                    <span>Grotesque caps carry the headline.</span>
                    <span>Hairlines are exactly one pixel, never two.</span>
                    <span className="on-amber">Amber marks the legal margin.</span>
                  </div>
                </div>
              </article>
            </div>

            {/* ============ SPINE (center) ================================== */}
            <div className="spine-col" aria-hidden="true">
              <span className="spine-x" />
              <p className="spine-label">Spine</p>
              <div className="spine-ticks" />
            </div>

            {/* ============ CHINA RAIL (right) ============================== */}
            <div className="rail rail--cn">
              <div className="rail-plate plate--cn">
                <p className="plate-meta">
                  <span>Rail 02</span>
                  <span lang="zh-CN">持续轨</span>
                </p>
                <p className="plate-title">
                  <span lang="zh-CN">中国</span>
                  <span className="latin">China</span>
                </p>
                <p className="plate-sub">
                  Lacquer, cinnabar, jade and gold; night cyan for the late
                  shift.
                </p>
              </div>

              <article className="spec-card spec-card--cn">
                <p className="card-meta">
                  <span>Token Set · R-02</span>
                  <span lang="zh-CN">令牌组</span>
                </p>

                <ul className="tok-list">
                  {CN_TOKENS.map((t) => (
                    <li key={t.name} className="tok">
                      <span className={`swatch ${t.swatch}`} aria-hidden="true" />
                      <span className="tok-name">
                        {t.name}
                        {t.cjk ? (
                          <span className="tok-cjk" lang="zh-CN">
                            {t.cjk}
                          </span>
                        ) : null}
                      </span>
                      <span className="tok-hex">{t.hex}</span>
                    </li>
                  ))}
                </ul>

                <div className="specimen">
                  <p className="spec-label" lang="zh-CN">字样 · Specimen</p>
                  <p className="specimen-big" lang="zh-CN">漆为底 · 朱为章</p>
                  <div className="hairline-row" role="presentation">
                    <span>Lacquer is ground; cinnabar is seal.</span>
                    <span>Jade holds quiet, gold carries light.</span>
                    <span className="on-nightcyan" lang="zh-CN">夜青 — the late shift.</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>

        {/* ---- footbar ----------------------------------------------------- */}
        <footer className="rail-grid footbar">
          <span className="foot-us">Persistent Rail · Left</span>
          <p className="foot-mid">
            Cursor-X · cross the spine to re-bias both rails
            <br />
            <span className="cn-line" lang="zh-CN">指针越过脊柱，双侧光线随之交叉淡变</span>
          </p>
          <span className="foot-cn">
            <span lang="zh-CN">右 · 持续轨</span> Persistent Rail
          </span>
        </footer>
      </div>
    </div>
  );
}

