"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ESSAY } from "@/lib/data";

/**
 * Scene 06 — the designed essay (~540 words). Marginalia light up as their
 * anchored paragraph crosses the center of the viewport.
 */

/** marginalia → anchor-paragraph map (sorted by document position) */
const ANCHORS: Array<{ p: number; t: string; b: string }> = [
  { p: 1, ...ESSAY.marginalia[1] }, // download gravity → open-weights para
  { p: 2, ...ESSAY.marginalia[0] }, // apache moment → closed-frontier para
  { p: 4, ...ESSAY.marginalia[3] }, // accounting shock → cost-curve para
  { p: 5, ...ESSAY.marginalia[2] }, // balance of terror → hybrid-posture para
  { p: 6, ...ESSAY.marginalia[4] }, // second order → hardware para
];

export default function Essay() {
  const [lit, setLit] = useState<number | null>(null);

  useEffect(() => {
    const sec = document.getElementById("essay");
    if (!sec) return;
    const ps = Array.from(sec.querySelectorAll<HTMLElement>("p[data-p]"));
    if (!ps.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setLit(parseInt((en.target as HTMLElement).dataset.p ?? "-1", 10));
        }
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: 0 }
    );
    ps.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  const body: ReactNode[] = [];
  ESSAY.paras.forEach((html, i) => {
    body.push(
      <p key={`p${i}`} data-p={i} dangerouslySetInnerHTML={{ __html: html }} />
    );
    if (i === ESSAY.pullAfterIndex) {
      body.push(
        <div className="pull" key="pull">
          <div className="cn f-song">{ESSAY.pullCn}</div>
          <div className="en num">{ESSAY.pullEn}</div>
        </div>
      );
    }
  });

  return (
    <section id="essay" data-beat="essay" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">06 / ESSAY</span>
          <h2 className="beat-title">
            OPEN VS CLOSED <span className="cn">开放之争</span>
          </h2>
          <span className="beat-kicker num">~540 WORDS · A POINT OF VIEW IS TAKEN</span>
        </div>

        <article className="essay">
          <div className="essay-main rv">{body}</div>

          <aside className="marginal-list" aria-label="Margin notes">
            {ANCHORS.map((a, i) => (
              <div key={i} className={`marginal num ${lit === a.p ? "lit" : ""}`}>
                <b>
                  {String(i + 1).padStart(2, "0")} · {a.t}
                </b>
                {a.b}
              </div>
            ))}
          </aside>
        </article>
      </div>
    </section>
  );
}
