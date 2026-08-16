"use client";

import type { CSSProperties } from "react";
import { SCORE_ROWS } from "@/lib/data";
import { useWorld } from "@/lib/world";

/** Scene 03 — ten domains. Hover (or Enter on focus) expands the row into its brief. */
export default function Scoreboard() {
  const { sound } = useWorld();

  return (
    <section id="scoreboard" data-beat="scoreboard" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">03 / SCOREBOARD</span>
          <h2 className="beat-title">
            TEN DOMAINS <span className="cn">十域</span>
          </h2>
          <span className="beat-kicker num">HOVER A ROW — THE BRIEF OPENS · ALL EST. LABELED</span>
        </div>

        <div className="sb">
          <div className="sb-head num rv" style={{ "--d": "0.08s" } as CSSProperties}>
            <span>DOMAIN</span>
            <span className="h-us">AMERICA — RAIL A</span>
            <span className="h-cn">CHINA — RAIL B</span>
            <span className="h-edge">EDGE →</span>
            <span>OBSERVATION</span>
          </div>

          {SCORE_ROWS.map((r, i) => (
            <div
              key={r.id}
              className="sb-row rv"
              role="button"
              tabIndex={0}
              aria-expanded={false}
              style={{ "--d": `${0.1 + i * 0.05}s` } as CSSProperties}
              onPointerEnter={() => sound.tick("hover")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const el = e.currentTarget;
                  const openNow = el.classList.toggle("is-open");
                  el.setAttribute("aria-expanded", String(openNow));
                  sound.tick("ui");
                }
              }}
            >
              <div className="sb-grid">
                <div className="sb-dom">
                  <span className="sb-num num">{String(i + 1).padStart(2, "0")}</span>
                  {r.domain}
                </div>

                <div className="sb-val sb-val--us num">
                  <span className="score">{r.us.toFixed(1)}</span>
                  <span className="meter" aria-hidden="true"><i style={{ "--w": r.us / 10, "--d": `${0.2 + i * 0.06}s` } as CSSProperties} /></span>
                </div>

                <div className="sb-val sb-val--cn num">
                  <span className="score">{r.cn.toFixed(1)}</span>
                  <span className="meter" aria-hidden="true"><i style={{ "--w": r.cn / 10, "--d": `${0.2 + i * 0.06}s` } as CSSProperties} /></span>
                </div>

                <div className={`sb-edge sb-edge--${r.edge.toLowerCase() === "parity" ? "par" : r.edge.toLowerCase()} num`}>
                  <span className="tri" aria-hidden="true">{r.edge === "PARITY" ? "◆" : "▶"}</span>
                  {r.spread}
                </div>

                <div className="sb-num num">
                  {r.obs === "EST." ? <span className="est-tag">EST</span> : r.obs}
                </div>
              </div>

              <div className="sb-brief-wrap">
                <div className="sb-brief-inner">
                  <p className="sb-brief">
                    {r.brief}
                    {r.obs === "EST." ? <span className="est-tag" style={{ marginLeft: 8 }}>EST.</span> : null}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="rv" style={{ marginTop: "1.4rem", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", color: "var(--ink-faint)" } as CSSProperties}>
          SCALE 0–10 · COMPOSITE OF PUBLIC MODEL CARDS, PLATFORM TELEMETRY &amp; PUBLISHED CAPACITY — A JUDGMENT CALL IN TABULAR NUMERALS, NOT A RANKING ORGAN
        </p>
      </div>
    </section>
  );
}
