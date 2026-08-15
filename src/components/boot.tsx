"use client";

/*
 * US-003 - Diegetic 8-14s boot, skippable.
 *
 * A cold open for two civilizations, not a progress bar: two in-world
 * consoles type their boot logs on opposite rails (US server room, CN night
 * grid), the spine hairline fills from the top down, the VS node ignites and
 * a lock line lands. One visit is enough: completion or skip writes
 * cc26.boot.v1 to localStorage, and every later load renders nothing.
 * Skip paths: click anywhere, the SKIP button, or ESC / Enter / Space.
 * All styling is inline so this component owns its own look end to end.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const BOOT_KEY = "cc26.boot.v1";
const DURATION_MS = 12000; // diegetic window: 8-14s
const OUT_MS = 560;
const IGNITE_MS = 9600;
const LOCK_MS = 10700;

type Side = "us" | "cn";

type BootLine = { side: Side; text: string; start: number; typeMs: number };

const US_LINES: BootLine[] = [
  { side: "us", text: "RELAY UPLINK ................ LOCKED", start: 600, typeMs: 750 },
  { side: "us", text: "COLD STORAGE ................ ONLINE", start: 1500, typeMs: 680 },
  { side: "us", text: "FAB GRID / 5NM .............. NOMINAL", start: 2450, typeMs: 720 },
  { side: "us", text: "LEGAL MARGIN ................ AMBER", start: 3450, typeMs: 680 },
  { side: "us", text: "TALENT FEED ............... 1,204 DESKS LIVE", start: 4500, typeMs: 780 },
  { side: "us", text: "POWER DRAW .................. 3.1 GW EST", start: 5650, typeMs: 720 },
  { side: "us", text: "EXPORT WATCH ................ TIGHT", start: 6800, typeMs: 640 },
];

const CN_LINES: BootLine[] = [
  { side: "cn", text: "漆格矩阵 ...... 启动中", start: 950, typeMs: 820 },
  { side: "cn", text: "夜青网格 ...... 在线", start: 1950, typeMs: 720 },
  { side: "cn", text: "麒麟芯组 ...... 满负荷", start: 2950, typeMs: 720 },
  { side: "cn", text: "开放权重 ...... 同步中", start: 3950, typeMs: 720 },
  { side: "cn", text: "人才流动 ...... 清华 / 深大 · 稳定", start: 5000, typeMs: 820 },
  { side: "cn", text: "电网能耗 ...... 3.4 TW EST", start: 6100, typeMs: 720 },
  { side: "cn", text: "出口管制 ...... 双向核对", start: 7150, typeMs: 760 },
];

const US_MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const CN_TYPE = "var(--font-cjk-serif), 'Songti SC', 'STSong', serif";

type Phase = "idle" | "run" | "out";

function logText(side: Side): CSSProperties {
  return side === "us"
    ? { fontFamily: US_MONO, fontSize: 12.5, lineHeight: 1.9, color: "#cfd9ea", letterSpacing: "0.04em" }
    : { fontFamily: CN_TYPE, fontSize: 13.5, lineHeight: 2, color: "#f3e9d7", letterSpacing: "0.1em" };
}

function caretStyle(side: Side): CSSProperties {
  return {
    display: "inline-block",
    width: 7,
    height: side === "us" ? 13 : 14,
    marginLeft: 2,
    transform: "translateY(2px)",
    background: side === "us" ? "#8fb1ff" : "#f0d48d",
  };
}

export default function Boot() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [now, setNow] = useState(0);
  const startRef = useRef(0);
  const reducedRef = useRef(false);

  /* First-visit check. Server and first client render stay null, so there is
     no hydration mismatch; only a returning visitor stays hidden. */
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(BOOT_KEY) === "1";
    } catch {
      seen = true; // storage unavailable: never trap the visitor
    }
    if (seen) return;
    try {
      reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reducedRef.current = false;
    }
    setPhase("run");
  }, []);

  const finish = useCallback(() => {
    try {
      window.localStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase((p) => (p === "run" ? "out" : p));
  }, []);

  /* One rAF timeline drives every line, the spine fill and the ignition.
     Skip just ends it early. */
  useEffect(() => {
    if (phase !== "run") return;
    startRef.current = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - startRef.current;
      if (elapsed >= DURATION_MS) {
        finish();
        return;
      }
      setNow(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, finish]);

  /* Fade out after completion or skip, then unmount. */
  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("idle"), OUT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  /* Keyboard skip: ESC, Enter or Space. */
  useEffect(() => {
    if (phase !== "run") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  if (phase === "idle") return null;

  const rm = reducedRef.current;
  const pct = rm ? 100 : Math.min(100, (now / DURATION_MS) * 100);
  const ignited = rm || now >= IGNITE_MS;
  const locked = rm || now >= LOCK_MS;
  const caretOn = Math.floor(now / 450) % 2 === 0;
  const allLines = [...US_LINES, ...CN_LINES];
  const count = allLines.reduce((n, l) => (now >= l.start ? n + 1 : n), 0);

  const renderLine = (l: BootLine) => {
    if (now < l.start) return null;
    const chars = rm
      ? l.text.length
      : Math.max(0, Math.min(l.text.length, Math.floor(((now - l.start) / l.typeMs) * l.text.length)));
    const typing = !rm && now < l.start + l.typeMs;
    return (
      <li key={l.text} style={{ margin: 0, opacity: typing ? 1 : 0.72 }}>
        <span style={{ whiteSpace: "pre", ...logText(l.side) }}>{l.text.slice(0, chars)}</span>
        {typing && caretOn ? <span aria-hidden="true" style={caretStyle(l.side)} /> : null}
      </li>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cold open: both rails coming online. Click anywhere or press ESC to skip."
      onClick={finish}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#050407",
        cursor: "pointer",
        opacity: phase === "out" ? 0 : 1,
        transition: `opacity ${OUT_MS}ms ease`,
      }}
    >
      {/* rail atmospheres: US server-room black, CN lacquer night */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ background: "radial-gradient(90% 72% at 14% 6%, rgba(47,95,194,0.30) 0%, transparent 62%), linear-gradient(180deg, #05070a 0%, #030409 100%)" }} />
        <div style={{ background: "radial-gradient(90% 72% at 86% 6%, rgba(222,74,47,0.20) 0%, transparent 60%), linear-gradient(180deg, #170b09 0%, #120605 100%)" }} />
      </div>

      {/* spine hairline + diegetic top-down fill (the only progress cue) */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, transform: "translateX(-0.5px)", background: "rgba(255,255,255,0.07)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${pct}%`, background: "linear-gradient(180deg, #8fb1ff 0%, #e9eef6 48%, #f0d48d 100%)", boxShadow: "0 0 14px rgba(143,177,255,0.55)" }} />
      </div>

      {/* VS node: ignites when the spine reaches mid-frame */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "1px solid rgba(240,236,228,0.8)",
          background: "rgba(7,5,6,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f0e9dd",
          fontSize: 13,
          letterSpacing: "0.2em",
          transform: `translate(-50%, -50%) scale(${ignited ? 1 : 0.7})`,
          opacity: ignited ? 1 : 0,
          transition: "opacity 600ms ease, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: ignited ? "0 0 26px rgba(143,177,255,0.5), 0 0 64px rgba(240,212,141,0.3)" : "none",
        }}
      >
        VS
      </div>

      {/* lock line: the film's title card lands */}
      <p
        aria-hidden={!locked}
        style={{
          position: "absolute",
          top: "calc(50% + 48px)",
          left: "50%",
          transform: "translateX(-50%)",
          margin: 0,
          whiteSpace: "nowrap",
          opacity: locked ? 1 : 0,
          transition: "opacity 700ms ease",
          fontSize: 11,
          letterSpacing: "0.34em",
        }}
      >
        <span style={{ color: "#f0d48d", fontFamily: CN_TYPE }}>双轨在线</span>
        <span style={{ marginLeft: 12, color: "rgba(240,236,228,0.85)" }}>BOTH RAILS LIVE</span>
      </p>

      {/* slate top */}
      <header style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>
        <span style={{ color: "#8fb1ff", fontFamily: US_MONO }}>Slate 01 · Cold Open</span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: US_MONO }}>Signal / 信号 · No Cut</span>
        <span style={{ color: "#f0d48d", fontFamily: CN_TYPE, letterSpacing: "0.2em" }}>开机 · Do Not Cut</span>
      </header>

      {/* the two consoles, facing each other across the spine */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 1fr) clamp(84px, 10vw, 168px) minmax(0, 1fr)", alignItems: "center", padding: "24px clamp(16px, 3vw, 56px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8b9bb0", fontFamily: US_MONO }}>
            Console 01 · Hawthorn Bay · Server Room
          </p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10, textAlign: "right" }}>
            {US_LINES.map(renderLine)}
          </ol>
        </div>

        <span aria-hidden="true" />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: "0.2em", color: "#a5896f", fontFamily: CN_TYPE }}>
            控制台 02 · 珠江西岸 · 夜班网格
          </p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {CN_LINES.map(renderLine)}
          </ol>
        </div>
      </div>

      {/* bottom bar: sequence counter, timecode, skip control */}
      <footer style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "13px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>
        <span aria-hidden="true" style={{ color: "#8b9bb0", fontFamily: US_MONO }}>
          SEQ {String(count).padStart(2, "0")}/{String(allLines.length).padStart(2, "0")}
        </span>
        <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.6)", fontFamily: US_MONO }}>
          T+ {(now / 1000).toFixed(1)}s / {(DURATION_MS / 1000).toFixed(1)}s
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ color: "#a5896f", fontFamily: CN_TYPE, letterSpacing: "0.18em" }}>点击跳过</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
            style={{ appearance: "none", border: "1px solid rgba(240,212,141,0.5)", background: "rgba(240,212,141,0.05)", color: "#f0d48d", fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", padding: "9px 18px", cursor: "pointer", fontFamily: US_MONO }}
          >
            <span style={{ fontFamily: CN_TYPE, letterSpacing: "0.18em", marginRight: 10 }}>跳过</span>
            Skip · ESC
          </button>
        </div>
      </footer>

      {/* film vignette */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 180px rgba(0,0,0,0.78)" }} />
    </div>
  );
}
