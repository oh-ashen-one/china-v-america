"use client";

import type { CSSProperties } from "react";

/** Scene 12 — colophon. Stack, type, data policy, and the closing plate. */
export default function Colophon() {
  return (
    <footer id="colophon" data-beat="colophon" className="colo">
      <div className="wrap">
        <div className="colo-grid rv">
          <div className="colo-col">
            <h4>PRODUCTION</h4>
            <ul>
              <li>Next.js App Router · TypeScript</li>
              <li>Hand-set CSS design system — no framework UI</li>
              <li>Canvas compute map · WebAudio ticks</li>
              <li>One install: npm i &amp;&amp; npm run dev</li>
              <li>All motion transform + opacity, 60fps target</li>
            </ul>
          </div>

          <div className="colo-col">
            <h4>TYPE &amp; MOTION</h4>
            <ul>
              <li>Space Grotesk — grotesque rail type</li>
              <li>IBM Plex Mono — tabular data, labels</li>
              <li>Noto Serif SC — Song weight, 汉字 motifs</li>
              <li>reduced-motion fallback is designed, not off</li>
              <li>Cursor X crossfades the two worlds via --wx</li>
            </ul>
          </div>

          <div className="colo-col">
            <h4>DATA POLICY</h4>
            <ul>
              <li>Every projection carries an EST tag, on screen</li>
              <li>A judgment call in tabular numerals — not a ranking body</li>
              <li>No stock faces; people are consoles and seals</li>
              <li>No clipart dragons — seal geometry only</li>
              <li>Mute-by-default sound, remembered locally</li>
            </ul>
          </div>

          <div className="colo-col">
            <h4>THE FILM</h4>
            <ul>
              <li>A 12-beat scroll, desktop is the hero (1440–1920)</li>
              <li>Rail A: black / NASA blue / legal amber</li>
              <li>Rail B: lacquer / cinnabar / jade / gold</li>
              <li>The vs spine tracks your scroll position</li>
              <li>Open ⌘K to navigate or re-grade on the fly</li>
            </ul>
          </div>
        </div>

        <div className="colo-finale rv" style={{ "--d": "0.12s" } as CSSProperties}>
          ESTIMATES ARE <span className="cn">估计</span> ESTIMATES.
        </div>

        <div className="colo-seal f-song" aria-hidden="true">
          <span>衡</span>
        </div>

        <p className="colo-fine num">
          COMPUTE CIVILIZATIONS — ANNO 2026 · RAIL A × RAIL B
          <br />
          TWO CIVILIZATIONS OF COMPUTE · NO FACES, ONLY CONSOLES · FILMED IN YOUR BROWSER
        </p>
      </div>
    </footer>
  );
}
