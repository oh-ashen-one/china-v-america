

US-002 is the highest-priority failing story. I'm implementing the dual-rail visual system: both rail token sets in `globals.css`, a desktop `[US rail | SPINE | CN rail]` grid with a fixed center spine line, and a cursor-X crossfade (a tiny client component flips `data-rail` on `<html>` when the pointer crosses 50vw; ambient halves, spine ink and X-node crossfade). US-001's scaffold (package.json/tsconfig/next.config) stays untouched — no new dependencies are introduced.

### FILE: src/app/globals.css
```css
/* ============================================================================
   CHINA × AMERICA · globals.css
   ----------------------------------------------------------------------------
   US-002 — DUAL-RAIL VISUAL SYSTEM

   LEFT RAIL  · AMERICA (persistent)
     black field · NASA blue · legal-pad amber · grotesque type · hairline rules

   RIGHT RAIL · CHINA (persistent / 持续轨)
     lacquer · cinnabar · jade · gold · night cyan

   CENTER     · SPINE — one continuous vertical line at 50vw with a Cursor-X
                node. Crossing the spine (pointer, or ← → keys) crossfades the
                ambient bias of both rails via data-rail on <html>.

   Desktop 1440–1920 is the film hero frame (--stage-maxw).
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1 · RAIL TOKEN SETS
   ------------------------------------------------------------------------- */

:root {
  /* shared geometry -------------------------------------------------------- */
  --hairline: 1px;
  --spine-w: clamp(1px, 0.35vw, 2px);
  --stage-maxw: 1760px;
  --plate-top: 18px;

  color-scheme: dark;

  /* cursor-X crossfade state — neutral until the pointer crosses the spine */
  --bias-us: 0.8;                                   /* US ambient half opacity   */
  --bias-cn: 0.62;                                  /* CN ambient half opacity   */
  --cross-ink: rgba(240, 236, 228, 0.9);            /* spine / X-node ink        */
}

/* --- AMERICA rail tokens --------------------------------------------------- */
:root {
  --us-field:       #05070a;                    /* black field               */
  --us-panel:       #0b1016;                    /* blue-black panel          */
  --us-panel-edge:  #1b2534;                    /* panel hairline            */
  --us-nasa:        #2f5fc2;                    /* NASA blue                 */
  --us-nasa-deep:   #14306b;                    /* NASA blue · deep          */
  --us-nasa-glow:   #8fb1ff;                    /* NASA blue · glow          */
  --us-legalpad:    #f1dd9a;                    /* legal-pad amber · field   */
  --us-amber:       #ffb43a;                    /* hot amber · ink on black  */
  --us-ink:         #e9eef6;                    /* grotesque ink             */
  --us-dim:         #8b9bb0;                    /* dim grotesque             */
  --us-rule:        rgba(143, 168, 205, 0.22);   /* hairline rule             */
}

/* --- CHINA rail tokens ----------------------------------------------------- */
:root {
  --cn-field:         #170b09;                  /* lacquer black field       */
  --cn-panel:         #251009;                  /* lacquer panel             */
  --cn-lacquer:       #3b160f;                  /* lacquer red-black / 漆    */
  --cn-lacquer-hi:    #5c2418;                  /* lacquer sheen             */
  --cn-cinnabar:      #de4a2f;                  /* cinnabar / 朱             */
  --cn-cinnabar-deep: #8c241a;                  /* cinnabar · deep           */
  --cn-jade:          #7cc3a0;                  /* jade / 玉                 */
  --cn-jade-pale:     #c9ebd8;                  /* pale jade · ink           */
  --cn-gold:          #d2a94f;                  /* gold / 金                 */
  --cn-gold-hi:       #f0d48d;                  /* gold · bright             */
  --cn-night-cyan:    #1f7e8c;                  /* night cyan / 夜青         */
  --cn-night-cyan-hi: #63d6e4;                  /* night cyan · lit          */
  --cn-ink:           #f3e9d7;                  /* parchment ink             */
  --cn-dim:           #a5896f;                  /* dim parchment             */
  --cn-rule:          rgba(210, 169, 79, 0.3);   /* gold hairline             */
}

/* --- type stacks (font vars injected by next/font in layout.tsx) ---------- */
:root {
  --type-us: var(--font-grotesk), "Helvetica Neue", Helvetica, Arial, sans-serif;
  --type-cn: var(--font-cjk-serif), "Songti SC", "STSong",
             "Noto Serif CJK SC", "SimSun", serif;
}

/* ---------------------------------------------------------------------------
   2 · CURSOR-X CROSSFADE — data-rail on <html>, set by components/rail-bias
   ------------------------------------------------------------------------- */

@property --sp-a { syntax: "<color>"; inherits: false; initial-value: rgba(255, 255, 255, 0.72); }
@property --sp-b { syntax: "<color>"; inherits: false; initial-value: rgba(255, 255, 255, 0.3); }

html[data-rail="us"] {
  --bias-us: 1;
  --bias-cn: 0.42;
  --cross-ink: var(--us-nasa-glow);
}

html[data-rail="cn"] {
  --bias-us: 0.42;
  --bias-cn: 1;
  --cross-ink: var(--cn-night-cyan-hi);
}

/* ---------------------------------------------------------------------------
   3 · BASE
   ------------------------------------------------------------------------- */

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: #070506; /* neutral mix of both blacks */
  color: var(--us-ink);
  font-family: var(--type-us);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--us-amber); color: #140d02; }

:focus-visible {
  outline: 2px solid var(--cross-ink);
  outline-offset: 3px;
}

/* ---------------------------------------------------------------------------
   4 · FIXED ATMOSPHERE — the two halves + the center spine line
   ------------------------------------------------------------------------- */

.atm {
  position: fixed;
  top: 0;
  bottom: 0;
  width: calc(50vw + 1px); /* halves overlap 2px under the spine */
  pointer-events: none;
  z-index: 0;
}

.atm--us {
  left: 0;
  background:
    radial-gradient(80% 64% at 12% 4%, rgba(47, 95, 194, 0.2), transparent 62%),
    radial-gradient(56% 48% at 0% 100%, rgba(20, 48, 107, 0.55), transparent 72%),
    linear-gradient(180deg, var(--us-field) 0%, #04060d 100%);
  opacity: var(--bias-us);
  transition: opacity 700ms ease;
}

.atm--cn {
  right: 0;
  background:
    radial-gradient(80% 64% at 88% 6%, rgba(222, 74, 47, 0.16), transparent 60%),
    radial-gradient(58% 50% at 100% 96%, rgba(31, 126, 140, 0.22), transparent 72%),
    linear-gradient(180deg, var(--cn-field) 0%, #150706 100%);
  opacity: var(--bias-cn);
  transition: opacity 700ms ease;
}

.spine-line {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  width: var(--spine-w);
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;

  --sp-a: rgba(255, 255, 255, 0.72);
  --sp-b: rgba(255, 255, 255, 0.3);
  background: linear-gradient(180deg,
    transparent 0%,
    var(--sp-a) 12%,
    var(--sp-b) 88%,
    transparent 100%);
  transition: --sp-a 700ms ease, --sp-b 700ms ease;
}

html[data-rail="us"] .spine-line {
  --sp-a: var(--us-nasa-glow);
  --sp-b: rgba(47, 95, 194, 0.38);
}

html[data-rail="cn"] .spine-line {
  --sp-a: var(--cn-gold-hi);
  --sp-b: rgba(222, 74, 47, 0.42);
}

/* ---------------------------------------------------------------------------
   5 · STAGE — the film hero frame (1440–1920)
   ------------------------------------------------------------------------- */

.app-root {
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
}

.stage {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: clamp(26px, 4.5vh, 54px);
  min-height: 100vh;
  width: min(var(--stage-maxw), 100%);
  margin-inline: auto;
  padding: clamp(20px, 3vh, 40px) clamp(20px, 3.4vw, 56px)
            clamp(18px, 3vh, 36px);
}

.stage-main { flex: 1; display: flex; flex-direction: column; }

/* dual-rail grid: [ US rail ] [ SPINE ] [ CN rail ] ------------------------ */

.rail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
  column-gap: clamp(20px, 3vw, 56px);
}

.rail {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.4vh, 28px);
  min-width: 0;
}

.rail--us { font-family: var(--type-us); color: var(--us-ink); }
.rail--cn { font-family: var(--type-cn); color: var(--cn-ink); }

/* ---------------------------------------------------------------------------
   6 · TOPBAR
   ------------------------------------------------------------------------- */

.topbar { align-items: center; }

.tag {
  font-family: var(--type-us);
  font-size: 10.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 8px 12px;
  border: var(--hairline) solid transparent;
}

.tag--us {
  justify-self: start;
  color: var(--us-nasa-glow);
  border-color: var(--us-panel-edge);
  background: rgba(11, 16, 22, 0.72);
}

.tag--cn {
  justify-self: end;
  font-family: var(--type-cn);
  color: var(--cn-gold-hi);
  border-color: rgba(210, 169, 79, 0.3);
  background: rgba(42, 19, 15, 0.72);
}

.topbar-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.brand {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.brand::before, .brand::after {
  content: "";
  width: clamp(24px, 3vw, 56px);
  height: var(--hairline);
  background: var(--cross-ink);
  opacity: 0.55;
  transition: background-color 600ms ease, background 600ms ease;
}

.spine-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cross-ink);
  transition: background-color 600ms ease, background 600ms ease;
}

/* ---------------------------------------------------------------------------
   7 · RAIL PLATES — persistent identity, sticky while the rail scrolls
   ------------------------------------------------------------------------- */

.rail-plate {
  position: sticky;
  top: var(--plate-top);
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
  border: var(--hairline) solid transparent;
}

.plate--us {
  background: linear-gradient(180deg, var(--us-panel) 0%, #0a0e14 100%);
  border-color: var(--us-panel-edge);
}

.plate--cn {
  background: linear-gradient(180deg, var(--cn-lacquer) 0%, #241009 100%);
  border-color: rgba(210, 169, 79, 0.3);
}

.plate-meta {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 9.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.rail--us .plate-meta { color: var(--us-dim); }
.rail--cn .plate-meta { color: var(--cn-dim); letter-spacing: 0.2em; }

.plate-title {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 40px);
  line-height: 1.1;
}

.rail--us .plate-title {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.rail--cn .plate-title {
  font-weight: 700;
  letter-spacing: 0.18em;
}

.rail--cn .plate-title .latin {
  font-family: var(--type-us);
  font-weight: 500;
  font-size: 0.46em;
  letter-spacing: 0.38em;
  color: var(--cn-gold-hi);
  margin-left: 14px;
}

.plate-sub {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.65;
}

.rail--us .plate-sub { color: var(--us-dim); letter-spacing: 0.02em; }
.rail--cn .plate-sub { color: var(--cn-dim); letter-spacing: 0.06em; }

/* ---------------------------------------------------------------------------
   8 · SPINE COLUMN — in-flow partner of the fixed spine line
   ------------------------------------------------------------------------- */

.spine-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spine-x {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: var(--hairline) solid var(--cross-ink);
  color: var(--cross-ink);
  margin-top: 6px;
  transition: border-color 600ms ease, color 600ms ease;
}

.spine-x::before, .spine-x::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: var(--hairline);
  background: currentColor;
}

.spine-x::before { transform: translate(-50%, -50%) rotate(45deg); }
.spine-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

.spine-label {
  margin: 16px auto 0;
  writing-mode: vertical-rl;
  font-size: 9.5px;
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: var(--cross-ink);
  opacity: 0.9;
  transition: color 600ms ease;
}

.spine-ticks {
  flex: 1;
  width: var(--spine-w);
  margin-top: 20px;
  min-height: 48px;
  background: repeating-linear-gradient(180deg,
    var(--cross-ink) 0px, var(--cross-ink) 6px,
    transparent 6px, transparent 18px);
  opacity: 0.45;
}

/* ---------------------------------------------------------------------------
   9 · SPEC CARDS — the two token sets, hairline rows
   ------------------------------------------------------------------------- */

.spec-card {
  display: flex;
  flex-direction: column;
  border: var(--hairline) solid transparent;
  padding: clamp(14px, 1.3vw, 20px) clamp(16px, 1.4vw, 22px);
}

.spec-card--us {
  --row-rule: var(--us-rule);
  background: rgba(10, 15, 21, 0.86);
  border-color: var(--us-panel-edge);
  color: var(--us-ink);
}

.spec-card--cn {
  --row-rule: var(--cn-rule);
  background: rgba(37, 16, 9, 0.88);
  border-color: rgba(210, 169, 79, 0.3);
  color: var(--cn-ink);
}

.card-meta {
  margin: 0 0 10px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 9.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.spec-card--us .card-meta { color: var(--us-dim); }
.spec-card--cn .card-meta { color: var(--cn-dim); letter-spacing: 0.2em; }

/* token rows (US rows are separated by hairline rules, CN by gold hairlines) */

.tok-list { list-style: none; margin: 0; padding: 0; }

.tok {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding-block: 9px;
}

.tok + .tok { border-top: var(--hairline) solid var(--row-rule); }

.swatch {
  width: 42px;
  height: 42px;
  border: var(--hairline) solid rgba(255, 255, 255, 0.22);
  background: #000;
}

.sw-us-field  { background: var(--us-field); }
.sw-nasa      { background: linear-gradient(160deg, var(--us-nasa) 0%, var(--us-nasa-deep) 100%); }
.sw-legalpad  { background: linear-gradient(160deg, var(--us-legalpad) 0%, #d9c273 100%); }
.sw-amber     { background: linear-gradient(160deg, var(--us-amber) 0%, #cf8d24 100%); }
.sw-lacquer   { background: linear-gradient(160deg, var(--cn-lacquer-hi) 0%, var(--cn-lacquer) 55%, #1d0b07 100%); }
.sw-cinnabar  { background: linear-gradient(160deg, var(--cn-cinnabar) 0%, var(--cn-cinnabar-deep) 100%); }
.sw-jade      { background: linear-gradient(160deg, var(--cn-jade-pale) 0%, var(--cn-jade) 70%); }
.sw-gold      { background: linear-gradient(160deg, var(--cn-gold-hi) 0%, var(--cn-gold) 55%, #8a6b28 100%); }
.sw-nightcyan { background: linear-gradient(160deg, var(--cn-night-cyan-hi) 0%, var(--cn-night-cyan) 65%, #0e3d46 100%); }

.tok-name {
  font-size: 11.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.spec-card--cn .tok-name { letter-spacing: 0.1em; text-transform: none; }

.tok-cjk {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  letter-spacing: 0.34em;
  opacity: 0.92;
}

.tok-hex {
  font-size: 10.5px;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

/* type specimen */

.specimen {
  margin-top: 14px;
  border-top: var(--hairline) solid var(--row-rule);
  padding-block-start: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-label {
  margin: 0;
  font-size: 9.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.62;
}

.specimen-big {
  margin: 0;
  font-size: clamp(17px, 1.5vw, 23px);
  line-height: 1.2;
}

.spec-card--us .specimen-big { font-weight: 700; letter-spacing: 0.02em; }
.spec-card--cn .specimen-big { font-weight: 700; letter-spacing: 0.12em; }

.hairline-row span {
  display: block;
  padding-block: 8px;
  font-size: 12.5px;
  line-height: 1.6;
}

.hairline-row span + span { border-top: var(--hairline) solid var(--row-rule); }

.spec-card--us .hairline-row span { color: var(--us-dim); letter-spacing: 0.03em; }
.spec-card--cn .hairline-row span { color: var(--cn-dim); letter-spacing: 0.05em; }

.spec-card--us .hairline-row span.on-amber { color: var(--us-amber); }
.spec-card--cn .hairline-row span.on-nightcyan { color: var(--cn-night-cyan-hi); }

/* ---------------------------------------------------------------------------
   10 · FOOTBAR
   ------------------------------------------------------------------------- */

.footbar { align-items: center; }

.foot-us, .foot-cn {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.foot-us { justify-self: start; color: var(--us-dim); }

.foot-cn {
  justify-self: end;
  font-family: var(--type-cn);
  color: var(--cn-dim);
  letter-spacing: 0.18em;
}

.foot-mid {
  justify-self: center;
  margin: 0;
  text-align: center;
  font-size: 10px;
  line-height: 2.1;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--cross-ink);
  transition: color 600ms ease;
}

.foot-mid .cn-line { display: block; letter-spacing: 0.26em; }

/* ---------------------------------------------------------------------------
   11 · RESPONSIVE — under the desktop film frame, rails stack and the spine
        turns into a horizontal divider
   ------------------------------------------------------------------------- */

@media (max-width: 1023px) {
  .stage { min-height: auto; }

  .spine-line { display: none; }

  .rail-grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: clamp(26px, 5vh, 44px);
  }

  .spine-col {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 18px;
    padding-block: 6px;
  }

  .spine-label {
    margin: 0;
    writing-mode: horizontal-tb;
    letter-spacing: 0.4em;
  }

  .spine-ticks {
    flex: none;
    width: clamp(56px, 18vw, 140px);
    height: var(--spine-w);
    margin-top: 0;
    background: repeating-linear-gradient(90deg,
      var(--cross-ink) 0px, var(--cross-ink) 6px,
      transparent 6px, transparent 18px);
  }
}

/* ---------------------------------------------------------------------------
   12 · MOTION SAFETY
   ------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .atm--us, .atm--cn, .spine-line, .brand::before, .brand::after,
  .spine-dot, .spine-x, .spine-label, .foot-mid {
    transition: none !important;
  }
}
```
### END FILE

### FILE: src/app/layout.tsx
```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";

/*
 * US-002 — type stacks for the dual rails.
 *  - America rail: Space Grotesk (grotesque).
 *  - China rail:   Noto Serif SC. Its Google metadata only exposes the
 *    subsets cyrillic / latin / latin-ext / vietnamese — we take "latin";
 *    CJK glyphs fall through to the Songti / SimSun serif stack in CSS.
 */

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const cjkSerif = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cjk-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "China × America — The AI Race, Filmed",
  description:
    "A dual-rail landing: America on black, NASA blue and legal-pad amber; China on lacquer, cinnabar, jade and gold — divided by one spine.",
};

export const viewport: Viewport = {
  themeColor: "#070506",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${cjkSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
### END FILE

### FILE: src/components/rail-bias.tsx
```tsx
"use client";

/*
 * US-002 — Cursor-X crossfade.
 * Tracks the pointer against the center spine (50vw). Crossing it flips
 * data-rail on <html>, which crossfades the ambient rail bias, the spine
 * line ink and every --cross-ink surface in globals.css. Arrow keys give
 * keyboard users the same control. Touch is left alone (no scroll hijack).
 */

import { useEffect } from "react";

type Rail = "us" | "cn";

export default function RailBias() {
  useEffect(() => {
    const root = document.documentElement;
    let rafId = 0;

    const setRail = (rail: Rail) => {
      if (root.dataset.rail !== rail) root.dataset.rail = rail;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setRail(e.clientX < window.innerWidth * 0.5 ? "us" : "cn");
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setRail("us");
      if (e.key === "ArrowRight") setRail("cn");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
```
### END FILE

### FILE: src/app/page.tsx
```tsx
import RailBias from "../components/rail-bias";

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

        {/* ---- dual-rail spec section -------------------------------------- */}
        <main className="stage-main">
          <section className="rail-grid spec" aria-label="Dual-rail visual system">
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
                    <span>Hairlines are exactly one pixel — never two.</span>
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
                  Lacquer, cinnabar, jade and gold — night cyan for the late
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
            Cursor-X — cross the spine to re-bias both rails
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
```
### END FILE

VERIFY: cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (pkill -f "next start" 2>/dev/null; pkill -f next-server 2>/dev/null; sleep 1; npm run start -- -p 3123 & SRV=$!; sleep 6; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV 2>/dev/null; pkill -f "next start" 2>/dev/null; pkill -f next-server 2>/dev/null; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -q -- "--us-nasa:" src/app/globals.css && grep -q -- "--cn-cinnabar:" src/app/globals.css)