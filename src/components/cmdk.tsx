"use client";

import { useEffect, useRef, useState } from "react";

/**
 * US-008 · CommandK — the cmd-k command palette. A diegetic control deck:
 * Cmd/Ctrl+K (or Meta+K) opens a hairline panel of jump commands that
 * scroll to the film's sections. Tiny, self-contained, no CSS file.
 */

const COMMANDS: { id: string; label: string; hint?: string }[] = [
  { id: "hero", label: "Hero · The Thesis" },
  { id: "scoreboard", label: "Scoreboard · Ten Rows" },
  { id: "timeline", label: "Timeline · 2016 to 2026" },
  { id: "dossiers", label: "Lab Dossiers · Both Rails" },
  { id: "essay", label: "Essay · Two Civilizations" },
  { id: "arena", label: "Toy A · Dual Mock-Stream Arena" },
  { id: "export-slider", label: "Toy B · Export-Control Slider" },
  { id: "colophon", label: "Colophon · Typefaces" },
];

const CMDK_CSS = `
  .cmdk-backdrop {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(4, 5, 8, 0.62);
    display: flex; justify-content: center; align-items: flex-start;
    padding-top: 12vh;
  }

  .cmdk-panel {
    width: min(560px, calc(100vw - 32px));
    background: #0b0f15;
    border: 1px solid var(--us-panel-edge);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
    display: flex; flex-direction: column;
  }

  .cmdk-input {
    width: 100%; box-sizing: border-box;
    background: transparent; border: none; outline: none;
    padding: 14px 16px;
    border-bottom: 1px solid var(--us-rule);
    color: var(--us-ink); font-family: var(--type-us);
    font-size: 14px; letter-spacing: 0.06em;
  }

  .cmdk-list { list-style: none; margin: 0; padding: 6px; max-height: 46vh; overflow-y: auto; }

  .cmdk-item {
    display: flex; justify-content: space-between; gap: 12px; align-items: baseline;
    width: 100%; box-sizing: border-box; text-align: left; cursor: pointer;
    background: transparent; border: 1px solid transparent;
    padding: 9px 12px; color: var(--us-ink); font-family: var(--type-us);
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
  }

  .cmdk-item:hover, .cmdk-item.is-on {
    background: rgba(47, 95, 194, 0.14);
    border-color: var(--us-panel-edge);
    color: var(--us-nasa-glow);
  }

  .cmdk-item small { font-size: 9px; letter-spacing: 0.24em; color: var(--us-dim); }

  .cmdk-foot {
    display: flex; gap: 14px; padding: 8px 12px;
    border-top: 1px solid var(--us-rule);
    font-size: 9px; letter-spacing: 0.26em; text-transform: uppercase;
    color: var(--us-dim); font-family: var(--type-us);
  }

  .cmdk-hint {
    position: fixed; z-index: 40; right: 18px; bottom: 16px;
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--cross-ink); opacity: 0.65; font-family: var(--type-us);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) { .cmdk-backdrop, .cmdk-panel { transition: none !important; } }
`;

export default function CommandK() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (id: string) => {
    setOpen(false);
    setQ("");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <style>{CMDK_CSS}</style>
      {open ? (
        <div className="cmdk-backdrop" role="dialog" aria-label="Command palette (Cmd+K)" onMouseDown={() => setOpen(false)}>
          <div className="cmdk-panel" onMouseDown={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="cmdk-input"
              value={q}
              placeholder="Jump to a section…"
              onChange={(e) => setQ(e.target.value)}
              aria-label="Filter commands"
            />
            <ul className="cmdk-list">
              {filtered.map((c, i) => (
                <li key={c.id}>
                  <button className={`cmdk-item ${i === 0 ? "is-on" : ""}`} onClick={() => run(c.id)}>
                    <span>{c.label}</span>
                    {c.hint ? <small>{c.hint}</small> : null}
                  </button>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="cmdk-item" aria-disabled="true"><span>Nothing filed.</span></li>
              ) : null}
            </ul>
            <div className="cmdk-foot">
              <span>Cmd+K to toggle</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      ) : null}
      <span className="cmdk-hint" aria-hidden="true">Cmd+K · Palette</span>
    </>
  );
}
