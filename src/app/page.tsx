"use client";

import { useEffect, useState } from "react";
import RailBias from "../components/rail-bias";
import Boot from "../components/boot";
import Hero from "../components/hero";
import Scoreboard from "../components/scoreboard";
import Timeline from "../components/timeline";
import Dossiers from "../components/dossiers";
import Essay from "../components/essay";
import Arena from "../components/arena";

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

const TOYS_CSS = `
  .toys { align-items: start; }

  .toy-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(14px, 2vh, 22px);
  }

  .toy-head-side { margin: 0; font-size: 10.5px; letter-spacing: 0.32em; text-transform: uppercase; }
  .toy-head-us { color: var(--us-nasa-glow); font-family: var(--type-us); justify-self: start; }
  .toy-head-cn { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; justify-self: end; }

  .toy-head-mid {
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 9.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cross-ink);
  }

  .toy-head-x {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
  }

  .toy-head-x::before, .toy-head-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 11px;
    height: var(--hairline);
    background: var(--cross-ink);
  }

  .toy-head-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .toy-head-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  .toy-lead {
    margin: 0;
    padding: 12px 16px;
    border-left: 3px solid var(--cross-ink);
    background: rgba(7, 5, 6, 0.6);
    font-size: 13px;
    line-height: 1.7;
    color: var(--us-ink);
    letter-spacing: 0.02em;
  }

  .xsl { margin-top: clamp(12px, 1.8vh, 18px); display: flex; flex-direction: column; gap: 12px; }

  .xsl-scale {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--cn-dim);
  }

  .xsl-track { position: relative; height: 26px; }

  .xsl-rail-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: var(--hairline);
    transform: translateY(-50%);
    background: repeating-linear-gradient(90deg,
      var(--cn-rule) 0px, var(--cn-rule) 6px, transparent 6px, transparent 14px);
  }

  .xsl-fill {
    position: absolute;
    top: 50%;
    left: 0;
    height: 3px;
    transform: translateY(-50%);
    background: linear-gradient(90deg, var(--cn-night-cyan) 0%, var(--cn-night-cyan-hi) 100%);
    box-shadow: 0 0 12px rgba(99, 214, 228, 0.35);
    transition: width 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .xsl-handle {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 26px;
    transform: translate(-50%, -50%);
    background: var(--cn-gold-hi);
    border: var(--hairline) solid rgba(240, 212, 141, 0.8);
    box-shadow: 0 0 14px rgba(210, 169, 79, 0.5);
    pointer-events: none;
  }

  .xsl input[type="range"] {
    position: absolute;
    inset: -6px 0;
    width: 100%;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: ew-resize;
  }

  .xsl input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 26px;
    background: transparent;
    border: none;
  }

  .xsl input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 26px;
    background: transparent;
    border: none;
  }

  .xsl-readout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    align-items: baseline;
    padding-top: 10px;
    border-top: var(--hairline) solid var(--cn-rule);
  }

  .xsl-num {
    font-family: var(--type-us);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--cn-night-cyan-hi);
    font-variant-numeric: tabular-nums;
  }

  .xsl-num small { font-size: 10px; letter-spacing: 0.24em; color: var(--cn-dim); margin-left: 6px; }

  .xsl-note { font-size: 10.5px; letter-spacing: 0.1em; color: var(--cn-dim); }

  .xsl-status {
    font-size: 9px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    padding: 4px 8px;
    border: var(--hairline) solid currentColor;
    white-space: nowrap;
  }

  .xsl-status--open { color: var(--cn-jade); }
  .xsl-status--tight { color: var(--cn-gold-hi); }
  .xsl-status--siege { color: var(--cn-cinnabar); }

  @media (prefers-reduced-motion: reduce) {
    .xsl-fill { transition: none; }
  }

  @media (max-width: 1023px) {
    .toy-head { grid-template-columns: minmax(0, 1fr); row-gap: 14px; }
    .toy-head-mid { justify-self: start; }
  }
`;

const PALETTE_CSS = `
  .cmdk-root {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: none;
    padding-top: clamp(64px, 12vh, 130px);
    background: rgba(5, 4, 7, 0.82);
  }

  .cmdk-root[data-open="true"] { display: block; }

  .cmdk-panel {
    width: min(640px, calc(100vw - 32px));
    margin-inline: auto;
    background: rgba(9, 8, 12, 0.97);
    border: var(--hairline) solid rgba(143, 168, 205, 0.28);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
  }

  .cmdk-input {
    width: 100%;
    padding: 15px 18px;
    background: transparent;
    border: none;
    border-bottom: var(--hairline) solid rgba(143, 168, 205, 0.2);
    color: var(--us-ink);
    font-family: var(--type-us);
    font-size: 14px;
    letter-spacing: 0.06em;
    outline: none;
  }

  .cmdk-input::placeholder { color: var(--us-dim); letter-spacing: 0.12em; }

  .cmdk-list { list-style: none; margin: 0; padding: 6px; max-height: 52vh; overflow-y: auto; }

  .cmdk-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    width: 100%;
    padding: 10px 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .cmdk-item.is-active, .cmdk-item:hover { background: rgba(47, 95, 194, 0.16); }

  .cmdk-idx {
    font-size: 9px;
    letter-spacing: 0.24em;
    color: var(--us-dim);
    font-variant-numeric: tabular-nums;
  }

  .cmdk-name { font-size: 12.5px; letter-spacing: 0.1em; color: var(--us-ink); text-transform: uppercase; }
  .cmdk-cjk { font-family: var(--type-cn); color: #d8c4a6; margin-left: 10px; letter-spacing: 0.18em; }
  .cmdk-hint { font-size: 9px; letter-spacing: 0.26em; color: var(--us-dim); text-transform: uppercase; }

  .cmdk-foot {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 14px;
    border-top: var(--hairline) solid rgba(143, 168, 205, 0.2);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--us-dim);
  }

  .cmdk-foot span b { color: var(--cn-gold-hi); font-weight: 400; }
`;

const COLOPHON_CSS = `
  .colo { margin-top: clamp(8px, 1.6vh, 20px); }

  .colo-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: clamp(14px, 1.3vw, 20px) clamp(16px, 1.4vw, 22px);
    background: rgba(7, 5, 6, 0.82);
    border: var(--hairline) solid rgba(143, 168, 205, 0.2);
    color: var(--us-ink);
  }

  .colo-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 9.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--us-dim);
  }

  .colo-title { margin: 0; font-size: clamp(18px, 1.7vw, 26px); letter-spacing: 0.04em; }

  .colo-rows { display: flex; flex-direction: column; }

  .colo-row {
    display: grid;
    grid-template-columns: minmax(120px, 180px) auto minmax(0, 1fr);
    gap: 14px;
    align-items: baseline;
    padding-block: 9px;
  }

  .colo-row + .colo-row { border-top: var(--hairline) solid rgba(143, 168, 205, 0.16); }

  .colo-face { font-size: 20px; line-height: 1.3; }
  .colo-face--us { font-family: var(--type-us); font-weight: 700; letter-spacing: 0.02em; }
  .colo-face--cn { font-family: var(--type-cn); letter-spacing: 0.14em; }

  .colo-name { font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--us-dim); }

  .colo-note { font-size: 10.5px; letter-spacing: 0.08em; color: var(--us-dim); }
`;

/* ---------------------------------------------------------------------------
   US-008 · toy 2 — the export-control slider.
   A diegetic drag-to-siege: tightening the controls drags the H100 transfer
   figure down and flips the watch status. Pure client state, no CSS file.
   ------------------------------------------------------------------------- */
function ExportSlider() {
  const [tension, setTension] = useState(58);

  /* tension 0..100 -> H100s that still cross the line, in thousands */
  const h100k = Math.round(42 * (1 - tension / 130));
  const status = tension < 45 ? "open" : tension < 78 ? "tight" : "siege";
  const statusLabel =
    status === "open" ? "Flows / 通行" : status === "tight" ? "Tightened / 收紧" : "Siege / 围堵";

  return (
    <div className="xsl">
      <div className="xsl-scale" aria-hidden="true">
        <span>Open · 放行</span>
        <span>Siege · 围堵</span>
      </div>

      <div className="xsl-track">
        <div className="xsl-rail-line" aria-hidden="true" />
        <div className="xsl-fill" style={{ width: `${tension}%` }} aria-hidden="true" />
        <div className="xsl-handle" style={{ left: `${tension}%` }} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={tension}
          onChange={(e) => setTension(Number(e.target.value))}
          aria-label="Export-control tension, 0 open to 100 siege"
        />
      </div>

      <div className="xsl-readout">
        <span className="xsl-num">
          {h100k}K<small>H100s EAST · EST</small>
        </span>
        <span className="xsl-note">Tension {tension}/100 · every point is a checkpoint.</span>
        <span className={`xsl-status xsl-status--${status}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   US-008 · colophon — the typefaces and how the film is built.
   ------------------------------------------------------------------------- */
function Colophon() {
  return (
    <section id="colophon" className="rail-grid colo" aria-label="Colophon">
      <div className="colo-card">
        <p className="colo-meta">
          <span>Colophon</span>
          <span lang="zh-CN">片尾字卡</span>
        </p>
        <h2 className="colo-title">Typefaces &amp; Build</h2>

        <div className="colo-rows" role="list">
          <div className="colo-row" role="listitem">
            <span className="colo-face colo-face--us" aria-hidden="true">Aa Rr 01</span>
            <span className="colo-name">Space Grotesk</span>
            <span className="colo-note">America rail · grotesque display + tabular numerals. Served via next/font, latin subset.</span>
          </div>
          <div className="colo-row" role="listitem">
            <span className="colo-face colo-face--cn" lang="zh-CN" aria-hidden="true">双轨在线</span>
            <span className="colo-name">Noto Serif SC</span>
            <span className="colo-note">China rail · Song-dynasty serif. Served via next/font, latin subset; CJK falls through to the Songti / SimSun stack.</span>
          </div>
          <div className="colo-row" role="listitem">
            <span className="colo-face colo-face--us" aria-hidden="true" style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 15 }}>01</span>
            <span className="colo-name">System Mono</span>
            <span className="colo-note">Boot consoles, timecodes and the Cmd+K palette · ui-monospace fallback.</span>
          </div>
        </div>

        <p className="colo-note" style={{ margin: 0 }}>
          Built as a Next.js film frame: one persistent dual-rail, a Cursor-X spine crossfade,
          a diegetic 12s cold open, and two toys (the blind arena, the export slider).
          No Inter. No purple. Estimates are labeled EST throughout.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   US-008 · cmd-k — command palette for the film's chapters.
   Opens on Cmd/Ctrl+K, filters with the keyboard, jumps to a section.
   ------------------------------------------------------------------------- */
function CommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setQuery(""), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const items = [
    { id: "hero", label: "Hero · Thesis", hint: "01" },
    { id: "scoreboard", label: "Scoreboard", hint: "02" },
    { id: "timeline", label: "Timeline 2016–2026", hint: "03" },
    { id: "dossiers", label: "Lab Dossiers", hint: "04" },
    { id: "essay", label: "Essay · Two Civilizations", hint: "05" },
    { id: "arena", label: "Toy 01 · Blind Arena", hint: "06" },
    { id: "export-slider", label: "Toy 02 · Export Slider", hint: "07" },
    { id: "colophon", label: "Colophon · Typefaces", hint: "08" },
  ];

  const q = query.trim().toLowerCase();
  const filtered = items.filter((it) => it.label.toLowerCase().includes(q));

  const go = (id: string) => {
    setOpen(false);
    setQuery("");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="cmdk-root" data-open={open ? "true" : "false"}>
      <style>{PALETTE_CSS}</style>
      {open ? (
        <div className="cmdk-panel" role="dialog" aria-label="Command palette">
          <input
            className="cmdk-input"
            type="text"
            value={query}
            autoFocus
            placeholder="Jump to a chapter…"
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="cmdk-list">
            {filtered.map((it, i) => (
              <li key={it.id}>
                <button type="button" className={`cmdk-item${i === 0 ? " is-active" : ""}`} onClick={() => go(it.id)}>
                  <span className="cmdk-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cmdk-name">{it.label}</span>
                  <span className="cmdk-hint">Ch. {it.hint}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="cmdk-foot">
            <span><b>Esc</b> close · click a chapter to jump</span>
            <span>Cmd + K</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <div className="app-root">
      {/* US-003 · diegetic cold open, first visit only (localStorage) */}
      <Boot />

      {/* US-008 · cmd-k command palette (cmd + K / ctrl + K) */}
      <CommandK />

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

          {/* US-006 · scrubbable 2016-2026 timeline, real beats on both rails */}
          <Timeline />

          {/* US-007 · lab dossiers, file cards in each rail */}
          <Dossiers />

          {/* US-008 · essay: two compute civilizations, one spine */}
          <Essay />

          {/* US-008 · toy 1: the blind arena, pick a model and face its rival */}
          <Arena />

          {/* US-008 · toy 2: the export-control slider, a drag-to-siege */}
          <section id="toys" className="rail-grid toys" aria-label="Toys: the export-control slider">
            <style>{TOYS_CSS}</style>

            <div className="toy-head">
              <p className="toy-head-side toy-head-us">Toy 02 · Export Slider</p>
              <div className="toy-head-mid" aria-hidden="true">
                <span className="toy-head-x" />
                <span>Drag</span>
              </div>
              <p className="toy-head-side toy-head-cn" lang="zh-CN">出口管制 · 贰</p>
            </div>

            <p className="toy-lead">
              Tighten the controls and watch the H100s stop moving east. Every point on this
              slider is a checkpoint: licenses, fab access, and the price of a delay.
            </p>

            <div className="rail rail--cn">
              <article className="spec-card spec-card--cn" id="export-slider">
                <p className="card-meta">
                  <span>Toy · E-02</span>
                  <span lang="zh-CN">出口管制滑杆</span>
                </p>

                <div className="hairline-row" role="presentation">
                  <span lang="zh-CN">拖动滑杆：管制收紧，H100 东移量下降。</span>
                  <span>Tighten the controls and watch the H100s stop moving east.</span>
                </div>

                <ExportSlider />
              </article>
            </div>
          </section>

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

          {/* US-008 · colophon: typefaces + how the film is built */}
          <Colophon />
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

      <style>{COLOPHON_CSS}</style>
    </div>
  );
}
