"use client";

import { useEffect, useMemo, useState } from "react";
import { BEATS } from "@/lib/data";
import { usePRM, useWorld } from "@/lib/world";

/** ⌘K — navigate beats, flip art direction, toggles. Keyboard-first. */
export default function CommandPalette() {
  const { prefs, setPrefs, sound } = useWorld();
  const prm = usePRM();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  /* open/close events + global hotkey */
  useEffect(() => {
    const onEvt = () => setOpen((v) => !v);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("cc26:cmdk", onEvt);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("cc26:cmdk", onEvt);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
  }, [open]);

  const commands = useMemo(() => {
    const nav = BEATS.map((b) => ({
      cat: "GO TO",
      label: b.label,
      hint: `#${b.id}`,
      run: () => {
        document.getElementById(b.id)?.scrollIntoView({ behavior: prm ? "auto" : "smooth", block: "start" });
      },
    }));
    const acts = [
      { cat: "TOGGLE", label: `SOUND — NOW ${prefs.sound ? "ON" : "OFF"}`, hint: "muted by default", run: () => setPrefs({ sound: !prefs.sound }) },
      { cat: "TOGGLE", label: `FILM GRAIN — NOW ${prefs.grain ? "ON" : "OFF"}`, hint: "grain", run: () => setPrefs({ grain: !prefs.grain }) },
      { cat: "TOGGLE", label: `LETTERBOX — NOW ${prefs.letterbox ? "ON" : "OFF"}`, hint: "cine bars", run: () => setPrefs({ letterbox: !prefs.letterbox }) },
      { cat: "ART DIRECTION", label: `RE-GRADE — NOW ${prefs.time.toUpperCase()}`, hint: "flip day / night", run: () => setPrefs({ time: prefs.time === "night" ? "day" : "night" }) },
      { cat: "RAIL FOCUS", label: "LIT SIDE — AMERICA (A)", hint: "wx → 0", run: () => setPrefs({ rail: "us" }) },
      { cat: "RAIL FOCUS", label: "LIT SIDE — CHINA (B)", hint: "wx → 1", run: () => setPrefs({ rail: "cn" }) },
      { cat: "RAIL FOCUS", label: "LIT SIDE — CURSOR (AUTO)", hint: "wx follows X", run: () => setPrefs({ rail: "auto" }) },
    ];
    return [...nav, ...acts];
  }, [prefs, prm, setPrefs]);

  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return commands;
    return commands.filter((c) => c.label.toUpperCase().includes(s) || c.cat.includes(s));
  }, [commands, q]);

  useEffect(() => setSel(0), [q]);

  const runCmd = (i: number) => {
    const c = filtered[i];
    if (!c) return;
    sound.tick("ui");
    c.run();
    setOpen(false);
  };

  return (
    <div className={`cmdk-root ${open ? "" : "is-closed"}`} onClick={() => setOpen(false)} role="dialog" aria-modal={open} aria-label="Command palette">
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          className="cmdk-input"
          value={q}
          autoFocus={open}
          placeholder="TYPE A BEAT, A TOGGLE…"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
            else if (e.key === "Enter") { e.preventDefault(); runCmd(sel); }
          }}
        />
        <ul className="cmdk-list">
          {filtered.map((c, i) => (
            <li key={c.label}>
              <button
                className={`cmdk-row ${i === sel ? "is-sel" : ""}`}
                onMouseEnter={() => setSel(i)}
                onClick={() => runCmd(i)}
              >
                <span className="cat">{c.cat}</span>
                {c.label}
                <span className="hint num">{c.hint}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="cmdk-row" style={{ opacity: 0.5, cursor: "default" }}>
              <span className="cat">NULL</span>NO MATCH — THE REGISTRY IS CLOSED
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
