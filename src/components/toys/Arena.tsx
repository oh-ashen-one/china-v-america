"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ARENA_MODELS, ARENA_PROMPTS } from "@/lib/data";
import type { ArenaModel } from "@/lib/data";
import { usePRM, useWorld } from "@/lib/world";
import { LDR_KINDS, Ldr } from "../Loaders";

type Phase = "idle" | "load" | "stream" | "done";

/**
 * Toy A — dual mock-stream arena. One shared prompt, one model per rail.
 * Rehearsal rig: loader pass (all four loaders cycle), then character streams
 * with mute-by-default ticks. Custom input is logged and echoed, never faked.
 */
export default function Arena() {
  const { sound } = useWorld();
  const prm = usePRM();

  const [pid, setPid] = useState(ARENA_PROMPTS[0].id);
  const [custom, setCustom] = useState("");
  const [usId, setUsId] = useState(ARENA_MODELS[0].id);
  const [cnId, setCnId] = useState("qwen");

  const [phase, setPhase] = useState<Phase>("idle");
  const [ldrIdx, setLdrIdx] = useState(0);
  const [usN, setUsN] = useState(0);
  const [cnN, setCnN] = useState(0);
  const [stats, setStats] = useState<{ us?: { lat: number; tps: number }; cn?: { lat: number; tps: number } } | null>(null);

  const timers = useRef<number[]>([]);
  const wordsRef = useRef<{ us: string[]; cn: string[] }>({ us: [], cn: [] });
  const latRef = useRef({ us: 0, cn: 0 });
  const countRef = useRef({ us: 0, cn: 0 });

  const usM = ARENA_MODELS.find((m) => m.id === usId) ?? ARENA_MODELS[0];
  const cnM = ARENA_MODELS.find((m) => m.id === cnId) ?? (ARENA_MODELS[3] as ArenaModel);

  const clearAll = () => {
    timers.current.forEach((id) => {
      window.clearInterval(id);
      window.clearTimeout(id);
    });
    timers.current = [];
  };

  useEffect(() => clearAll, []); // cleanup on unmount

  const answerFor = (m: ArenaModel): string => {
    const base = custom.trim();
    if (!base) return m.answers[pid] ?? "NO DOCTRINE FILED FOR THIS PROMPT.";
    const trimmed = base.length > 96 ? `${base.slice(0, 96)}…` : base;
    return (
      `LOGGED PROMPT — "${trimmed}"\n` +
      `REHEARSAL NOTE: the mock rig serves doctrine for preset prompts only. ` +
      `Custom input is logged and echoed; nothing here was trained on you, or anyone else. — ${m.name}`
    );
  };

  const finish = () => {
    const { us, cn } = countRef.current;
    setStats({
      us: { lat: latRef.current.us, tps: Math.max(1, Math.round(us / ((us * 74 + 1680) / 1000))) },
      cn: { lat: latRef.current.cn, tps: Math.max(1, Math.round(cn / ((cn * 74 + 1680) / 1000))) },
    });
    setPhase("done");
  };

  const start = () => {
    clearAll();
    wordsRef.current = { us: answerFor(usM).split(/\s+/), cn: answerFor(cnM).split(/\s+/) };
    latRef.current = { us: 38 + Math.random() * 46, cn: 52 + Math.random() * 70 };
    countRef.current = { us: 0, cn: 0 };
    setUsN(0);
    setCnN(0);
    setStats(null);

    if (prm) {
      // reduced motion: no loader theatrics, settle instantly
      countRef.current = { us: wordsRef.current.us.length, cn: wordsRef.current.cn.length };
      setUsN(wordsRef.current.us.length);
      setCnN(wordsRef.current.cn.length);
      const { us, cn } = countRef.current;
      setStats({
        us: { lat: Math.round(latRef.current.us), tps: Math.max(1, Math.round(us / 0.6)) },
        cn: { lat: Math.round(latRef.current.cn), tps: Math.max(1, Math.round(cn / 0.6)) },
      });
      setPhase("done");
      return;
    }

    sound.tick("stamp");
    setPhase("load");
    timers.current.push(window.setInterval(() => setLdrIdx((i) => (i + 1) % LDR_KINDS.length), 420));
    timers.current.push(
      window.setTimeout(() => {
        setPhase("stream");
        sound.tick("ui");
        timers.current.push(
          window.setInterval(() => {
            const w = wordsRef.current;
            if (countRef.current.us < w.us.length) {
              countRef.current.us += 1;
              setUsN(countRef.current.us);
            }
            if (countRef.current.cn < w.cn.length) {
              countRef.current.cn += 1;
              setCnN(countRef.current.cn);
            }
            sound.tick("token");
            if (countRef.current.us >= w.us.length && countRef.current.cn >= w.cn.length) {
              clearAll();
              sound.tick("stamp");
              finish();
            }
          }, 74)
        );
      }, 1680)
    );
  };

  const abort = () => {
    clearAll();
    setPhase("idle");
    setUsN(0);
    setCnN(0);
  };

  const running = phase === "load" || phase === "stream";
  const effPrompt = custom.trim() || (ARENA_PROMPTS.find((p) => p.id === pid)?.text ?? "");

  const renderPane = (side: "us" | "cn", m: ArenaModel, n: number) => {
    const words = wordsRef.current[side];
    return (
      <div className={`pane pane--${side}`}>
        <div className="pane-head">
          <span className="seal-mini f-song" aria-hidden="true">{m.glyph}</span>
          <span className="who">
            <b>{m.name}</b>
            <span>{m.lab.toUpperCase()} — RAIL {side === "us" ? "A" : "B"}</span>
          </span>
          <select
            className="sel num"
            style={{ marginLeft: "auto" } as CSSProperties}
            value={side === "us" ? usId : cnId}
            disabled={running}
            onChange={(e) => (side === "us" ? setUsId(e.target.value) : setCnId(e.target.value))}
            aria-label={`Model, rail ${side}`}
          >
            {ARENA_MODELS.filter((x) => x.side === side).map((x) => (
              <option key={x.id} value={x.id}>
                {x.name} · {x.lab}
              </option>
            ))}
          </select>
        </div>

        <div className="pane-body">
          {phase === "idle" ? (
            <div className="stream num">
              AWAITING PROMPT — SELECT A PRESET OR TYPE ONE. THE RIG IS COLD, BOTH SIDES WARMED.
            </div>
          ) : phase === "load" ? (
            <div className="loader-slot">
              <Ldr kind={LDR_KINDS[ldrIdx]} glyph={m.glyph} />
            </div>
          ) : (
            <div className={`stream num ${phase === "stream" ? "stream-caret" : ""}`}>
              {words.slice(0, n).map((w, i) => (
                <span
                  key={i}
                  className="tok"
                  ref={(el) => {
                    if (el && i === n - 1 && !prm && el.animate) {
                      el.animate(
                        [{ opacity: 0, transform: "translateY(5px) scale(1.1)" }, { opacity: 1, transform: "none" }],
                        { duration: 160, easing: "ease-out" }
                      );
                    }
                  }}
                >
                  {w}{" "}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pane-foot num">
          <span>
            LAT <b>{stats?.[side] ? `${Math.round(stats[side].lat)}MS` : "—"}</b>
          </span>
          <span>
            TOK/S <b>{stats?.[side] ? Math.round(stats[side].tps) : "—"}</b>
          </span>
          <span style={{ marginLeft: "auto" }}>MODE · MOCK / REHEARSAL</span>
        </div>
      </div>
    );
  };

  return (
    <section id="arena" data-beat="arena" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">07 / ARENA</span>
          <h2 className="beat-title">
            DUAL MOCK-STREAM <span className="cn">对弈</span>
          </h2>
          <span className="beat-kicker num">SHARED PROMPT · TWO SIDES · LOADED, NOT LIVE</span>
        </div>

        <div className="arena-bar rv">
          {ARENA_PROMPTS.map((p) => (
            <button
              key={p.id}
              className={`chip-btn ${!custom && pid === p.id ? "is-on" : ""}`}
              onClick={() => {
                setPid(p.id);
                setCustom("");
                sound.tick("ui");
              }}
            >
              {p.label}
            </button>
          ))}
          <span style={{ width: 1, height: 20, background: "var(--hair)", marginLeft: ".4rem" }} aria-hidden="true" />
          <input
            className="inp num"
            value={custom}
            placeholder="OR TYPE YOUR OWN PROMPT…"
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && custom.trim() && !running) start();
            }}
          />
          <button className="btn btn-primary" onClick={() => (running ? abort() : start())}>
            <span>{running ? "ABORT" : "RUN STREAM"}</span>
          </button>
        </div>

        <div className="panes rv" style={{ "--d": "0.1s" } as CSSProperties}>
          {renderPane("us", usM, usN)}
          <div className="pane-mid" aria-hidden="true" />
          {renderPane("cn", cnM, cnN)}
        </div>

        <p
          className="rv"
          style={{ marginTop: "1.4rem", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", color: "var(--ink-faint)" } as CSSProperties}
        >
          REHEARSAL RIG — ANSWERS ARE WRITTEN DOCTRINE, NOT MODEL OUTPUT. TICKS ARE SYNTHESIZED AND MUTED BY DEFAULT
        </p>

        {/* keep the current prompt on camera even mid-stream */}
        <div className="num" style={{ marginTop: ".6rem", fontSize: 11, letterSpacing: ".08em", color: "var(--ink-faint)" }} aria-live="polite">
          » {effPrompt}
        </div>
      </div>
    </section>
  );
}
