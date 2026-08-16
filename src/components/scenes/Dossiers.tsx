"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { LABS_CN, LABS_US } from "@/lib/data";
import type { Lab } from "@/lib/data";
import { useWorld } from "@/lib/world";

/** Scene 05 — twelve lab dossiers. One open at a time; doctrine / product / weakness / readout. */
export default function Dossiers() {
  const { sound } = useWorld();
  // enter with one card already open — the film wants a dossier on camera
  const [open, setOpen] = useState<string | null>("cn-0");

  const toggle = (id: string) => {
    sound.tick(open === id ? "ui" : "stamp");
    setOpen((cur) => (cur === id ? null : id));
  };

  const renderCol = (side: "us" | "cn", labs: Lab[]) => (
    <div className={`dos-col dos-col--${side}`}>
      <div className="dos-col-head rv">
        <h3>{side === "us" ? "AMERICAN RAIL" : "CHINESE RAIL"}</h3>
        <span className="f-song">实验室档案</span>
        <b className="num">{String(labs.length).padStart(2, "0")} DOSSIERS</b>
      </div>

      {labs.map((lab, i) => {
        const id = `${side}-${i}`;
        const isOpen = open === id;
        return (
          <div className="rv" key={id} style={{ "--d": `${0.06 * i}s` } as CSSProperties}>
            <button className={`dos-row ${isOpen ? "is-open" : ""}`} aria-expanded={isOpen} onClick={() => toggle(id)}>
              <span className="dos-face">
                <span className="dos-idx num">{String(i + 1).padStart(2, "0")}</span>
                <span className="dos-name">
                  {lab.name}
                  {lab.cn ? <span className="cn">{lab.cn}</span> : null}
                </span>
                <span className="dos-arrow" aria-hidden="true">→</span>
              </span>

              <span className="dos-face" style={{ paddingTop: 0 }}>
                <span />
                <span className="dos-mono-line num">
                  {lab.moniker.toUpperCase()}
                  {lab.darkHorse ? " · DARK HORSE" : ""}
                </span>
                <span />
              </span>

              <span className="dos-body-wrap">
                <span className="dos-body-inner">
                  <span className="dos-body">
                    <span className="dos-kv">
                      <b>DOCTRINE</b>
                      {lab.doctrine}
                    </span>
                    <span className="dos-kv">
                      <b>PRODUCT LINE</b>
                      {lab.product}
                    </span>
                    <span className="dos-kv weak">
                      <b>WEAKNESS</b>
                      {lab.weakness}
                    </span>
                    <span className="dos-kv">
                      <b>READOUT</b>
                      {lab.stat}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="dossiers" data-beat="dossiers" className="beat">
      <div className="wrap">
        <div className="beat-head rv">
          <span className="beat-idx num">05 / DOSSIERS</span>
          <h2 className="beat-title">
            TWELVE LABS <span className="cn">十二实验室</span>
          </h2>
          <span className="beat-kicker num">TAP A CARD — DOCTRINE · PRODUCT · WEAKNESS</span>
        </div>

        <div className="dos-cols">
          {renderCol("us", LABS_US)}
          <div className="dos-mid" aria-hidden="true" />
          {renderCol("cn", LABS_CN)}
        </div>
      </div>
    </section>
  );
}
