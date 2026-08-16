"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { EXPORT_STOPS, US_FIELD } from "@/lib/data";
import { useWorld } from "@/lib/world";

/**
 * Scene 09 — control room. Two toys:
 *   (1) the export-control slider — drag the chip ceiling and watch the CN
 *       field, counter-leverage and training-cost multiplier (EST) respond;
 *   (2) the full art-direction board — scoped night/day previews you can apply.
 */
export default function ControlRoom() {
  const { prefs, setPrefs, sound } = useWorld();
  const [stopIdx, setStopIdx] = useState(1); // open mid-tightening for a richer first frame

  const stop = EXPORT_STOPS[stopIdx];
  const max = EXPORT_STOPS.length - 1;

  return (
    <section id="controls" data-beat="controls" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">09 / CONTROL ROOM</span>
          <h2 className="beat-title">
            LEVERS &amp; LIGHTING <span className="cn">控制室</span>
          </h2>
          <span className="beat-kicker num">EXPORT CEILING · ART DIRECTION</span>
        </div>

        {/* ——— (1) EXPORT-CONTROL SLIDER ——— */}
        <div className="exp">
          <div className="exp-slider-zone rv">
            <div className="lbl-row num">
              <span>CHIP CEILING — DRAG TO TIGHTEN OR LOOSEN THE REGIME</span>
              <span>{stop.code}</span>
            </div>

            <input
              className="exp-range"
              type="range"
              min={0}
              max={max}
              step={1}
              value={stopIdx}
              aria-label="Export control strictness, 2018 to 2026"
              style={{ "--p": (stopIdx / max) * 100 } as CSSProperties}
              onChange={(e) => {
                setStopIdx(Number(e.target.value));
                sound.tick("scrub"); // rate-limited by the engine
              }}
            />

            <div className="exp-scale num">
              {EXPORT_STOPS.map((s, i) => (
                <button
                  key={s.code}
                  style={{ background: "none", border: "none", cursor: "pointer", color: i === stopIdx ? "var(--ink)" : "inherit" }}
                  onClick={() => {
                    setStopIdx(i);
                    sound.tick("ui");
                  }}
                >
                  {s.year}
                </button>
              ))}
            </div>

            <div className="exp-out" style={{ marginTop: "2.4rem" }}>
              {/* big consequence number */}
              <div className="exp-big">
                <span
                  key={stop.code}
                  className="n num"
                  style={{ display: "inline-block", animation: "beatIn .45s cubic-bezier(.2,.7,.2,1)" } as CSSProperties}
                >
                  <small>×</small>
                  {stop.costX.toFixed(1)}
                </span>{" "}
                <span className="est-tag">EST</span>
                <div className="cap num" style={{ marginTop: ".6rem" }}>
                  CN FRONTIER TRAINING-COST MULTIPLIER
                </div>
              </div>

              <div className="exp-mid" aria-hidden="true" />

              {/* ledger */}
              <div className="exp-ledger">
                <div className="exp-field">
                  <h4 className="num"><span style={{ width: 7, height: 7, background: "var(--us-fluor)", display: "inline-block" }} />RAIL A FIELD — DOMESTIC, UNRESTRICTED</h4>
                  <ul className="chiprow">
                    {US_FIELD.map((f) => (
                      <li key={f.label} className="is-live">{f.label}</li>
                    ))}
                  </ul>
                </div>

                <div className="exp-field">
                  <h4 className="num"><span style={{ width: 7, height: 7, background: "var(--cn-cinnabar)", display: "inline-block" }} />RAIL B LEGAL FIELD AT {stop.year}</h4>
                  <ul className="chiprow">
                    {stop.cnField.map((f) => (
                      <li key={f.label} className={f.live ? "is-live" : "is-out"}>{f.label}</li>
                    ))}
                  </ul>
                </div>

                <div className="exp-ceiling">
                  {stop.ceiling}{" "}
                  <span style={{ color: "var(--ink-faint)", display: "inline-block", marginTop: ".5rem" }}>
                    CN COUNTER-LEVERAGE — {stop.counterNote.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ——— (2) FULL ART DIRECTION — scoped previews ——— */}
        <div style={{ marginTop: "clamp(64px, 10vh, 128px)" }}>
          <div className="beat-head rv" style={{ marginBottom: "clamp(20px, 3vh, 40px)" }}>
            <span className="beat-idx num">LIGHTING</span>
            <h2 className="beat-title" style={{ fontSize: "clamp(1.3rem, 2.4vw, 2rem)" }}>
              TWO GRADES OF THE SAME FILM <span className="cn">两种光</span>
            </h2>
          </div>

          <div className="moodboard rv">
            {[
              { key: "night" as const, cls: "plate--night", title: "NIGHT SHIFT", cap: "VOID BLACK · FLUORESCENT & LED · DEFAULT" },
              { key: "day" as const, cls: "plate--day", title: "DAY FLUORESCENT", cap: "COLD PAPER · SERIF WEIGHTS · LEGIBILITY PASS" },
            ].map((pl) => {
              const active = prefs.time === pl.key;
              return (
                <div key={pl.key} className={`plate ${pl.cls}`} style={{ outline: active ? "1px solid var(--acc-b)" : "none", outlineOffset: 3 }}>
                  <div className="strip" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                  <h4>{pl.title}</h4>
                  <p className="num">{pl.cap}</p>
                  <div style={{ marginTop: "1.6rem" }}>
                    <button
                      className={`chip-btn ${active ? "is-on" : ""}`}
                      onClick={() => {
                        if (!active) {
                          sound.tick("stamp");
                          setPrefs({ time: pl.key });
                        }
                      }}
                    >
                      <span className="dot" />{active ? "ACTIVE GRADE" : `APPLY ${pl.title}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="num" style={{ marginTop: "1.4rem", fontSize: 10, letterSpacing: ".24em", color: "var(--ink-faint)" }}>
            THE NIGHT/DAY TOGGLE IN THE HEADER AND ⌘K "RE-GRADE" DRIVE THE SAME STATE — CANVAS, RAILS AND TYPE ALL FOLLOW
          </p>
        </div>
      </div>
    </section>
  );
}
