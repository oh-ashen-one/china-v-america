"use client";

/**
 * US-008 · Colophon — the typefaces and film notes, set as a hairline
 * dossier across both rails. Server-safe markup; styling scoped to this
 * component so globals.css stays untouched.
 */

const COLOPHON_CSS = `
  .colo { align-items: start; }

  .colo-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(12px, 1.8vh, 18px);
  }

  .colo-head p {
    margin: 0;
    font-size: 9.5px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
  }

  .colo-head-us { color: var(--us-dim); font-family: var(--type-us); justify-self: start; }
  .colo-head-cn { color: var(--cn-dim); font-family: var(--type-cn); letter-spacing: 0.26em; justify-self: end; }

  .colo-body {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.6vh, 14px);
    min-width: 0;
    padding: clamp(12px, 1.2vw, 18px) clamp(14px, 1.3vw, 20px);
    border: var(--hairline) solid transparent;
  }

  .colo-body--us {
    background: rgba(10, 15, 21, 0.86);
    border-color: var(--us-panel-edge);
    color: var(--us-ink);
  }

  .colo-body--cn {
    background: rgba(37, 16, 9, 0.88);
    border-color: rgba(210, 169, 79, 0.3);
    color: var(--cn-ink);
  }

  .colo-kicker {
    margin: 0;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .colo-body--us .colo-kicker { color: var(--us-dim); font-family: var(--type-us); }
  .colo-body--cn .colo-kicker { color: var(--cn-dim); font-family: var(--type-cn); letter-spacing: 0.2em; }

  .colo-list { list-style: none; margin: 10px 0 0; padding: 0; }

  .colo-list li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-block: 9px;
    font-size: 11.5px;
    letter-spacing: 0.08em;
    align-items: baseline;
  }

  .colo-list li + li { border-top: var(--hairline) solid transparent; }
  .colo-body--us .colo-list li + li { border-top-color: var(--us-rule); }
  .colo-body--cn .colo-list li + li { border-top-color: var(--cn-rule); }

  .colo-list .face {
    font-family: var(--type-us);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 10px;
    opacity: 0.62;
  }

  .colo-list li:first-child .face { font-family: var(--type-cn); letter-spacing: 0.1em; text-transform: none; }

  .colo-note {
    margin-top: 12px;
    padding-top: 10px;
    border-top: var(--hairline) solid transparent;
    font-size: 10.5px;
    line-height: 1.7;
  }

  .colo-body--us .colo-note { border-top-color: var(--us-rule); color: var(--us-dim); }
  .colo-body--cn .colo-note { border-top-color: var(--cn-rule); color: var(--cn-dim); }

  .colo-spec {
    margin-top: 12px;
    font-size: clamp(16px, 1.4vw, 21px);
    line-height: 1.3;
    font-weight: 700;
  }

  .colo-body--us .colo-spec { font-family: var(--type-us); letter-spacing: 0.02em; }
  .colo-body--cn .colo-spec { font-family: var(--type-cn); letter-spacing: 0.12em; }

  @media (max-width: 1023px) {
    .colo-head { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
    .colo-head-cn { justify-self: start; }
  }
`;

export default function Colophon() {
  return (
    <section id="colophon" className="rail-grid colo" aria-label="Colophon: typefaces and film notes">
      <style>{COLOPHON_CSS}</style>

      <div className="colo-head">
        <p className="colo-head-us">Colophon · Type</p>
        <div className="spine-col" aria-hidden="true">
          <span className="spine-x" />
        </div>
        <p className="colo-head-cn" lang="zh-CN">字体 · 尾注</p>
      </div>

      {/* AMERICA rail — grotesque stack */}
      <article className="colo-body colo-body--us">
        <p className="colo-kicker">America Rail · Grotesque</p>
        <ul className="colo-list">
          <li>Space Grotesk<span className="face">400 / 500 / 700</span></li>
          <li>Noto Serif SC<span className="face">Latin subset only</span></li>
          <li>System Fallback<span className="face">Helvetica Neue / Arial</span></li>
        </ul>
        <p className="colo-note">
          Grotesque caps carry the headlines; tabular numerals keep the
          scoreboard honest. Hairlines are exactly one pixel, never two.
        </p>
        <p className="colo-spec">Black field, blue rules.</p>
      </article>

      {/* SPINE column */}
      <div className="spine-col" aria-hidden="true">
        <span className="spine-x" />
        <p className="spine-label">Type</p>
        <div className="spine-ticks" />
      </div>

      {/* CHINA rail — serif stack */}
      <article className="colo-body colo-body--cn">
        <p className="colo-kicker" lang="zh-CN">中国轨 · 宋体</p>
        <ul className="colo-list" lang="zh-CN">
          <li>Noto Serif SC<span className="face">400 / 700</span></li>
          <li>Songti SC<span className="face">系统回退</span></li>
          <li>SimSun<span className="face">最终回退</span></li>
        </ul>
        <p className="colo-note" lang="zh-CN">
          宋体承载论述，金线分隔条目。CJK glyphs fall through to the system
          serif stack; the web font carries the latin subset only.
        </p>
        <p className="colo-spec" lang="zh-CN">漆为底 · 朱为章</p>
      </article>
    </section>
  );
}
