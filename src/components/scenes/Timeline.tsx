"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { TL_EVENTS } from "@/lib/data";
import { useWorld } from "@/lib/world";

/** Scene 04 — 2016–2026. Pointer-drag playhead, click any event, keyboard arrows, autoplay sweep. */
export default function Timeline() {
  const { sound } = useWorld();

  const [year, setYear] = useState(2016);
  const [playing, setPlaying] = useState(false);

  const tRef = useRef(0);
  const dragging = useRef(false);
  const rectCache = useRef<DOMRect | null>(null);
  const headRef = useRef<HTMLDivElement>(null);

  const applyT = useCallback((nt: number) => {
    const c = Math.min(1, Math.max(0, nt));
    tRef.current = c;
    if (headRef.current) headRef.current.style.setProperty("--t", c.toFixed(4));
    const y = Math.round(2016 + c * 10);
    setYear((prev) => (prev === y ? prev : y));
  }, []);

  /* autoplay — one full sweep in ~22s */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = (now - last) / 1000;
      last = now;
      let nt = tRef.current + dt / 22;
      if (nt >= 1) {
        nt = 1;
        setPlaying(false);
      }
      applyT(nt);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, applyT]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    rectCache.current = e.currentTarget.getBoundingClientRect();
    dragging.current = true;
    setPlaying(false);
    applyT((e.clientX - rectCache.current.left) / rectCache.current.width);
    sound.tick("scrub");
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !rectCache.current) return;
    applyT((e.clientX - rectCache.current.left) / rectCache.current.width);
    sound.tick("scrub"); // engine rate-limits to ~14/s
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    rectCache.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); applyT(tRef.current + 0.1); sound.tick("ui"); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); applyT(tRef.current - 0.1); sound.tick("ui"); }
    else if (e.key === "Home") { e.preventDefault(); applyT(0); }
    else if (e.key === "End") { e.preventDefault(); applyT(1); }
    else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); sound.tick("ui"); }
  };

  const X0 = 4; // left inset, %
  const SPAN = 92;
  const xFor = (yr: number) => X0 + ((yr - 2016) / 10) * SPAN;
  const tFor = (yr: number) => (xFor(yr) - X0) / SPAN;

  const playYear = 2016 + tRef.current * 10;
  const isNear = (yr: number) => Math.abs(yr - playYear) <= 0.5 && yr <= year;

  const active = [...TL_EVENTS].filter((e) => e.year <= year).pop() ?? TL_EVENTS[0];

  return (
    <section id="timeline" data-beat="timeline" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">04 / TIMELINE</span>
          <h2 className="beat-title">
            A DECADE OF PULL <span className="cn">十年</span>
          </h2>
          <span className="beat-kicker num">DRAG THE PLAYHEAD · CLICK ANY EVENT · ARROWS + SPACE WORK</span>
        </div>

        <div className="tl-stage rv" style={{ "--d": "0.1s" } as CSSProperties}>
          <div
            className="tl-track"
            tabIndex={0}
            role="slider"
            aria-label="Year, 2016 to 2026"
            aria-valuemin={2016}
            aria-valuemax={2026}
            aria-valuenow={year}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onKeyDown={onKey}
          >
            {/* year ticks */}
            {Array.from({ length: 11 }, (_, i) => 2016 + i).map((yr) => (
              <div key={yr} className={`tl-tick num ${isNear(yr) ? "is-near" : ""}`} style={{ left: `${xFor(yr)}%` }}>
                <span>{yr}</span>
                <i />
              </div>
            ))}

            {/* events — alternating up/down rows */}
            {TL_EVENTS.map((ev, i) => (
              <div
                key={`${ev.year}-${i}`}
                className={[
                  "tl-event",
                  i % 2 === 1 ? "tl-event--up" : "",
                  ev.side === "US" ? "tl-event--us" : ev.side === "CN" ? "tl-event--cn" : "",
                  isNear(ev.year) && ev.year <= year ? "is-near" : "",
                ]
                  .join(" ")
                  .trim()}
                style={{ left: `${xFor(ev.year)}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  applyT(tFor(ev.year));
                  sound.tick("ui");
                }}
              >
                <i aria-hidden="true" />
                <span className="num">{ev.title}</span>
              </div>
            ))}

            {/* playhead */}
            <div className="tl-head" ref={headRef} style={{ "--t": 0 } as CSSProperties} />
          </div>

          {/* readout */}
          <div className="tl-read">
            <div className="tl-year num" aria-live="polite">
              <small>YEAR — SCRUBBED</small>
              {year}
            </div>
            <div className="tl-read-body">
              {active.side === "US" ? (
                <span className="side-chip side-chip--us"><i />AMERICA — RAIL A</span>
              ) : active.side === "CN" ? (
                <span className="side-chip side-chip--cn"><i />CHINA — RAIL B</span>
              ) : (
                <span className="side-chip" style={{ "--c": "var(--acc-b)" } as CSSProperties}>
                  <i />BOTH RAILS — PROJECTION
                </span>
              )}
              <h3 className="num">
                {active.title}
                {active.year === 2026 ? <span className="est-tag" style={{ marginLeft: 10 }}>EST</span> : null}
              </h3>
              <p>{active.note}</p>
            </div>
          </div>

          {/* controls */}
          <div className="tl-controls">
            <button
              className={`chip-btn ${playing ? "is-on" : ""}`}
              onClick={() => {
                setPlaying((p) => !p);
                sound.tick("ui");
              }}
            >
              <span className="dot" />{playing ? "PAUSE SWEEP" : "AUTOSWEEP 2016 → 2026"}
            </button>
            <button
              className="chip-btn"
              onClick={() => {
                setPlaying(false);
                applyT(0);
                sound.tick("ui");
              }}
            >
              RESET TO 2016
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
