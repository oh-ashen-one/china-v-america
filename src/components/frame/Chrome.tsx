"use client";

import { useEffect, useState } from "react";
import { BEATS } from "@/lib/data";
import { useWorld } from "@/lib/world";

/**
 * Persistent frame: film overlays, header chrome with live beat tracking,
 * the two fixed rails (US / CN), the vs spine, and the mobile rail switcher.
 */
export default function Chrome() {
  const { prefs, setPrefs, sound } = useWorld();
  const [beat, setBeat] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);

  /* narrow-screen adaptations (client-only) */
  useEffect(() => {
    const m = () => setNarrow(window.innerWidth < 720);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  /* track which beat is crossing the center band of the viewport */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-beat]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setBeat((en.target as HTMLElement).dataset.beat ?? null);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const beatInfo = BEATS.find((b) => b.id === beat);
  const beatText = beatInfo ? `${beatInfo.hint.split("·")[0].trim()} · ${beatInfo.label}` : "01 · BOOT SEQUENCE";

  const toggle = (patch: Parameters<typeof setPrefs>[0]) => {
    sound.tick("ui");
    setPrefs(patch);
  };

  return (
    <>
      {/* film overlays — visibility driven by <html> data-* from the world engine */}
      <div className="ambience" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="lb lb--top" aria-hidden="true" />
      <div className="lb lb--bottom" aria-hidden="true" />

      {/* header */}
      <header className="hdr">
        <div className="hdr-brand">
          <span className="hdr-seal f-song" aria-hidden="true">衡</span>
          {!narrow && (
            <span className="hdr-word num">
              COMPUTE CIVILIZATIONS <em>· ANNO 2026</em>
            </span>
          )}
        </div>

        <div className="hdr-beat" aria-live="polite">
          <span key={beat ?? "boot"}>{beatText}</span>
        </div>

        <div className="hdr-actions">
          <button
            className={`chip-btn ${prefs.sound ? "is-on" : ""}`}
            onClick={() => toggle({ sound: !prefs.sound })}
            aria-pressed={prefs.sound}
          >
            <span className="dot" />SOUND {prefs.sound ? "ON" : "OFF"}
          </button>
          {!narrow && (
            <button
              className={`chip-btn ${prefs.grain ? "is-on" : ""}`}
              onClick={() => toggle({ grain: !prefs.grain })}
              aria-pressed={prefs.grain}
            >
              <span className="dot" />GRAIN
            </button>
          )}
          {!narrow && (
            <button
              className={`chip-btn ${prefs.letterbox ? "is-on" : ""}`}
              onClick={() => toggle({ letterbox: !prefs.letterbox })}
              aria-pressed={prefs.letterbox}
            >
              <span className="dot" />CINE BARS
            </button>
          )}
          <button
            className={`chip-btn ${prefs.time === "day" ? "is-on" : ""}`}
            onClick={() => toggle({ time: prefs.time === "night" ? "day" : "night" })}
          >
            <span className="dot" />{prefs.time === "night" ? "NIGHT" : "DAY"}
          </button>
          <button className="chip-btn" onClick={() => window.dispatchEvent(new CustomEvent("cc26:cmdk"))}>
            ⌘K
          </button>
        </div>
      </header>

      {/* rail A — America */}
      <aside className="rail rail--us" aria-label="American rail">
        <div>
          <div className="rail-mark num">RAIL // A — AMERICA</div>
          <h2 className="rail-title num">AMERICAN RAIL</h2>
          <div className="rail-sub num">EST. COMPUTE 1956 · CHIPS → CLOUD</div>
        </div>

        <ul className="rail-lines">
          <li><b>CLOUD</b>&nbsp; AZURE · GCP · FAIRWATER</li>
          <li><b>CROWN</b>&nbsp; GPT-5 · OPUS 4.1 (EST)</li>
          <li><b>CEILING</b>&nbsp; ACTIVE · RULE IV, MAR '25</li>
          <li><b>GRID</b>&nbsp; 18.4 GW AI LOAD (EST)</li>
          <li><b>POSTURE</b>&nbsp; CLOSE CROWN · LEASE MID</li>
        </ul>

        <div className="rail-tele num">
          <span><b id="tele-us">—</b> LIT</span>
          <span className="blink" aria-hidden="true">●</span>
          <span>LIVE TELEMETRY (SIM)</span>
        </div>
      </aside>

      {/* rail B — China */}
      <aside className="rail rail--cn" aria-label="China rail">
        <div>
          <div className="rail-mark num">RAIL // B — 中国</div>
          <h2 className="rail-title f-song">华 — 芯片文明</h2>
          <div className="rail-sub num">全栈自立 · 深圳—北京</div>
        </div>

        <ul className="rail-lines" style={{ flexDirection: "row-reverse", alignItems: "flex-start" }}>
          <li><b>生态</b>&nbsp; 开放权重 · QWEN / GLM / KIMI</li>
          <li><b>皇冠</b>&nbsp; 前沿模型 · 内部估算 (EST)</li>
          <li><b>昇腾</b>&nbsp; 集群负荷 87%</li>
          <li><b>电网</b>&nbsp; 19.1 GW AI (EST)</li>
          <li><b>姿态</b>&nbsp; 全栈 · 自立</li>
        </ul>

        <div className="rail-tele num">
          <span><b id="tele-cn">—</b> 点亮 LIT</span>
          <span className="blink" aria-hidden="true">●</span>
          <span>实时 (SIM)</span>
        </div>
      </aside>

      {/* the vs spine */}
      <div className="spine" aria-hidden="true">
        <div className="spine-node"><span>VS</span></div>
      </div>

      {/* mobile rail switcher */}
      <div className="swatch" role="group" aria-label="Rail focus">
        <button className={prefs.rail === "us" ? "is-on" : ""} onClick={() => toggle({ rail: "us" })}>
          US · A
        </button>
        <button className={prefs.rail === "cn" ? "is-on" : ""} onClick={() => toggle({ rail: "cn" })}>
          CN · B
        </button>
      </div>
    </>
  );
}
