"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_CN_LINES, BOOT_US_LINES } from "@/lib/data";
import { bootWasSeen, markBootSeen, usePRM, useWorld } from "@/lib/world";
import { LdrCycler } from "@/components/Loaders";

type Phase = "seq" | "title" | "gone";

const SEQ_TOTAL_MS = 10600; // inside the 8–14s envelope
const US_LINE_START = 520;
const CN_LINE_OFFSET = 300; // CN console starts slightly behind — diegetic asymmetry
const LINE_PERIOD = 680;

export default function Boot() {
  const { sound, markBootDone } = useWorld();
  const prm = usePRM();

  const [phase, setPhase] = useState<Phase>("seq");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(-1);
  const stingerRef = useRef<boolean | null>(null);
  const begunRef = useRef(false);

  if (stingerRef.current === null) stingerRef.current = false; // set on mount effect

  /* ---------- begin (idempotent) ---------- */
  const begin = useCallback(() => {
    if (begunRef.current) return;
    begunRef.current = true;
    markBootSeen();
    sound.tick("ui");
    setPhase("gone");
    window.setTimeout(() => markBootDone(), 850);
    // release scroll lock after the exit transition
    window.setTimeout(() => {
      document.body.style.overflow = "visible";
    }, 900);
  }, [sound, markBootDone]);

  /* ---------- mount: scroll lock + mode selection ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const seen = bootWasSeen();
    stingerRef.current = seen;

    if (prm) {
      // reduced motion: static plate, all lines shown, user-driven entry
      setElapsed(SEQ_TOTAL_MS + 10_000); // force every line visible
      setPhase("title");
      return;
    }
    if (seen) {
      // stinger: 900ms title flash, then auto-begin (skippable boot)
      setPhase("title");
      sound.tick("stamp");
      const t = window.setTimeout(() => begin(), 950);
      return () => {
        document.body.style.overflow = "visible";
        window.clearTimeout(t);
      };
    }

    startRef.current = performance.now();
    let raf = 0;
    const tickLoop = () => {
      raf = requestAnimationFrame(() => {
        const e = performance.now() - startRef.current;
        setElapsed(e);
        if (e < SEQ_TOTAL_MS) tickLoop();
      });
    };
    tickLoop();

    return () => {
      document.body.style.overflow = "visible";
      cancelAnimationFrame(raf);
    };
  }, [prm, sound, begin]);

  /* ---------- sequence completion → title ---------- */
  useEffect(() => {
    if (phase !== "seq" || prm) return;
    if (elapsed >= SEQ_TOTAL_MS) {
      setPhase("title");
      sound.tick("stamp");
      const t = window.setTimeout(() => begin(), 3200); // video-continuity auto-begin
      return () => window.clearTimeout(t);
    }
  }, [elapsed, phase, prm, sound, begin]);

  const usVisible =
    Math.max(0, Math.min(BOOT_US_LINES.length, Math.floor((elapsed - US_LINE_START) / LINE_PERIOD) + 1));
  const cnVisible = Math.max(
    0,
    Math.min(BOOT_CN_LINES.length, Math.floor((elapsed - US_LINE_START - CN_LINE_OFFSET) / LINE_PERIOD) + 1)
  );

  const step = Math.min(27, Math.max(0, Math.floor(elapsed / 400)));
  const stepText = `CALIBRATING DUAL REGISTRY · STEP ${String(step).padStart(2, "0")}/27`;

  if (phase === "gone") return null;

  const isTitle = phase === "title";

  return (
    <div className={`boot boot-exit ${isTitle ? "is-title" : ""}`} onClick={() => !prm && phase === "seq" && (setPhase("title"), sound.tick("stamp"))}>
      <div className="boot-frame" />

      <div
        className="boot-cols"
        style={{ opacity: isTitle ? 0.14 : 1, transition: "opacity .9s ease" }}
        aria-hidden={isTitle}
      >
        {/* US console */}
        <div className="console console--us">
          <div className="console-head">
            <b>US // FRONTIER REGISTRY</b>
            <span className="num">SEC: EST·COAST</span>
          </div>
          {BOOT_US_LINES.map((line, i) => (
            <div key={i} className={`c-line ${i < usVisible ? "is-on" : ""} ${i === usVisible - 1 && !isTitle ? "is-active" : ""}`}>
              {line}
            </div>
          ))}
        </div>

        {/* center vs marker */}
        <div className="boot-vs">
          <i />
          <b>V S — 2 0 2 6</b>
          <i />
        </div>

        {/* CN console */}
        <div className="console console--cn">
          <div className="console-head">
            <b>CN // 算力寄存器</b>
            <span className="num">GRID: 深圳—北京</span>
          </div>
          {BOOT_CN_LINES.map((line, i) => (
            <div key={i} className={`c-line ${i < cnVisible ? "is-on" : ""} ${i === cnVisible - 1 && !isTitle ? "is-active" : ""}`}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* calibrating slot — the four loaders in rotation */}
      <div className="boot-stage">
        {prm ? (
          <span>{stepText}</span>
        ) : (
          <>
            <LdrCycler active={phase === "seq"} />
            <span>{stepText}</span>
          </>
        )}
      </div>

      {/* title plate */}
      <div className={`boot-title ${isTitle ? "is-in" : ""}`}>
        <div>
          <div className="big">
            CHINESE AI<span className="x">×</span>AMERICAN AI
          </div>
          <div className="meta num">TWO CIVILIZATIONS OF COMPUTE · ANNO 2026 — ALL NUMBERS LABELED</div>
          {prm || stingerRef.current ? null : (
            <div style={{ marginTop: "2.6rem", display: "flex", justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); begin(); }}>
                <span>ENTER THE WORLD</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* skip control */}
      {!isTitle && !prm ? (
        <div className="boot-skip">
          <button
            className="chip-btn"
            onClick={(e) => {
              e.stopPropagation();
              setPhase("title");
              sound.tick("stamp");
            }}
          >
            <span className="dot" /> SKIP BOOT
          </button>
        </div>
      ) : null}

      {isTitle && prm ? (
        <div className="boot-skip">
          <button className="btn btn-primary" onClick={begin}>
            <span>ENTER THE WORLD</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
