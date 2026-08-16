"use client";

import { useEffect, useRef } from "react";
import { useWorld } from "@/lib/world";

/** Scene 02 — one sharp thesis sentence. Reveal is gated on boot completion. */
export default function Hero() {
  const { sound, bootDone } = useWorld();
  const items = useRef<HTMLElement[]>([]);

  const reg = (el: HTMLElement | null) => {
    if (el && !items.current.includes(el)) items.current.push(el);
  };

  /* after the overlay lifts, walk the staged reveals in sequence */
  useEffect(() => {
    if (!bootDone) return;
    const id = window.setTimeout(() => {
      items.current.forEach((el, i) => {
        el.style.setProperty("--d", `${0.15 + i * 0.16}s`);
        el.classList.add("is-in");
      });
    }, 420);
    return () => window.clearTimeout(id);
  }, [bootDone]);

  const enter = () => {
    sound.tick("stamp");
    document.getElementById("scoreboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" data-beat="hero" className="beat hero">
      <div className="wrap">
        <div className="hero-kicker" ref={reg as (el: HTMLDivElement | null) => void}>
          <span className="rule" aria-hidden="true" />
          <span className="txt num">A COMPARISON IN TWO CIVILIZATIONS OF COMPUTE — FILMED AT 60 FPS</span>
        </div>

        <h1 className="hero-thesis" ref={reg as (el: HTMLHeadingElement | null) => void}>
          The world's intelligence is no longer a market — by 2026 it has become a{" "}
          <span className="dim">border</span>: America closes its crown, China opens its mid-tier, and two gravity
          wells are drawing every model on Earth into <span className="cn f-song">两极</span>.
        </h1>

        <div className="hero-foot" ref={reg as (el: HTMLDivElement | null) => void}>
          <button className="btn btn-primary" onClick={enter}>
            <span>ENTER THE COMPARISON</span>
            <span className="btn-arr" aria-hidden="true">→</span>
          </button>

          <div className="hero-meta num">
            <span><b>RAIL A</b>&nbsp; WASHINGTON · AUSTIN · FAIRWATER</span>
            <span><b>RAIL B</b>&nbsp; 北京 · 深圳 · 杭州</span>
            <span><b>POLICY</b>&nbsp; ALL PROJECTIONS LABELED EST.</span>
          </div>
        </div>

        <div className="scroll-cue num" ref={reg as (el: HTMLDivElement | null) => void}>
          <i aria-hidden="true" />
          <span>SCROLL — THE FILM RUNS ON YOUR INPUT</span>
        </div>
      </div>
    </section>
  );
}
