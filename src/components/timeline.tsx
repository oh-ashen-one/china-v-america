"use client";

/*
 * US-006 - Scrubbable 2016-2026 timeline.
 *
 * Real beats on both rails: AlphaGo (DeepMind), the Transformer paper,
 * GPT-3, ChatGPT, Sora on the America side; PaddlePaddle, ERNIE, Qwen,
 * DeepSeek V3 / R1 on the China side. Forward-looking items (2025 agent
 * claims, 2026 projections) carry an EST chip. The year is driven two
 * ways: drag the scrubber, or click any of the eleven year ticks; step
 * buttons and arrow keys on the range cover keyboard users. Display is a
 * dual-rail band: US beats left on the black field, CN beats right on
 * lacquer, and a big tabular year numeral centered on the spine. All
 * styling is scoped below; globals.css stays untouched, matching US-005's
 * pattern.
 */

import { useState } from "react";

type Beat = { text: string; est?: boolean };

type YearRow = {
  year: number;
  us: Beat[];
  cn: Beat[];
};

const MIN_YEAR = 2016;
const MAX_YEAR = 2026;

const YEARS: YearRow[] = [
  {
    year: 2016,
    us: [{ text: "AlphaGo defeats Lee Sedol 4-1 · DeepMind, London" }],
    cn: [{ text: "Baidu open-sources PaddlePaddle · first major CN deep-learning stack" }],
  },
  {
    year: 2017,
    us: [{ text: "Transformer paper · Attention Is All You Need (Google)" }],
    cn: [{ text: "Alibaba founds DAMO Academy · research moves in-house" }],
  },
  {
    year: 2018,
    us: [{ text: "GPT-1 · OpenAI's 117M-parameter text generator" }],
    cn: [{ text: "Baidu ERNIE · pretraining arrives in China" }],
  },
  {
    year: 2019,
    us: [{ text: "GPT-2 · 1.5B parameters, full weights held back" }],
    cn: [{ text: "Huawei open-sources MindSpore · Ascend 310 at the edge" }],
  },
  {
    year: 2020,
    us: [{ text: "GPT-3 · 175B parameters, few-shot capability" }],
    cn: [{ text: "Baidu launches ERNIE Bot · Wenxin Yiyan" }],
  },
  {
    year: 2021,
    us: [
      { text: "DALL-E · text-to-image goes mainstream" },
      { text: "GPT-3 API opens to developers" },
    ],
    cn: [{ text: "Zhipu AI founded · Tsinghua KEG spinout" }],
  },
  {
    year: 2022,
    us: [
      { text: "ChatGPT · ~100M users in its first 45 days (Nov)" },
      { text: "Stable Diffusion · open image model (Aug)" },
    ],
    cn: [{ text: "ERNIE Bot 3.0 · Baidu's generative pivot" }],
  },
  {
    year: 2023,
    us: [
      { text: "GPT-4 · multimodal flagship (Mar)" },
      { text: "Anthropic Claude ships · a second closed lane" },
    ],
    cn: [
      { text: "Qwen (Tongyi Qianwen) · Alibaba's open model line" },
      { text: "Moonshot Kimi launches (Oct)" },
    ],
  },
  {
    year: 2024,
    us: [
      { text: "Sora · text-to-video (Feb)" },
      { text: "GPT-4o · one-model voice + vision (May)" },
    ],
    cn: [
      { text: "DeepSeek V3 · open frontier at a fraction of typical cost (Dec)" },
      { text: "Qwen2 open weights · Apache-2.0" },
    ],
  },
  {
    year: 2025,
    us: [
      { text: "OpenAI o3 · reasoning by test-time compute (Apr)" },
      { text: "Computer-use agents reach desktop work", est: true },
    ],
    cn: [
      { text: "DeepSeek R1 · open reasoning model (Jan 20)" },
      { text: "Kimi K2 · first open MoE at frontier scale (Jul)" },
    ],
  },
  {
    year: 2026,
    us: [
      { text: "Frontier agents at desk scale", est: true },
      { text: "Single-digit GW/yr of data-center load added", est: true },
    ],
    cn: [
      { text: "Ascend 910C ramp · counterweight to export rules", est: true },
      { text: "Open-weight frontier keeps price pressure on", est: true },
    ],
  },
];

const TL_CSS = `
  #timeline { scroll-margin-top: 24px; }

  .tl { display: flex; flex-direction: column; gap: clamp(14px, 2vh, 22px); }

  .tl-head { align-items: center; margin-bottom: clamp(4px, 0.8vh, 10px); }

  .tl-kicker {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 10.5px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
  }

  .tl-kicker--us { justify-self: start; color: var(--us-nasa-glow); font-family: var(--type-us); }
  .tl-kicker--us::before { content: ""; width: clamp(22px, 3vw, 54px); height: var(--hairline); background: var(--us-nasa); }

  .tl-kicker--cn { justify-self: end; color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; }
  .tl-kicker--cn::after { content: ""; width: clamp(22px, 3vw, 54px); height: var(--hairline); background: var(--cn-gold); }

  .tl-head-mid {
    justify-self: center;
    font-size: 9.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cross-ink);
    transition: color 600ms ease;
  }

  /* scrub deck ------------------------------------------------------------- */
  .tl-deck {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: clamp(12px, 1.8vh, 18px) clamp(14px, 1.6vw, 22px);
    border: var(--hairline) solid rgba(255, 255, 255, 0.14);
    background: rgba(7, 5, 6, 0.62);
  }

  .tl-range-row { display: flex; align-items: center; gap: clamp(12px, 1.6vw, 20px); }

  .tl-step {
    appearance: none;
    width: 36px;
    height: 30px;
    border: var(--hairline) solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: var(--cross-ink);
    font-family: var(--type-us);
    font-size: 10px;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background-color 240ms ease, color 600ms ease;
  }

  .tl-step:hover:not(:disabled) { background: rgba(255, 255, 255, 0.07); }
  .tl-step:disabled { opacity: 0.35; cursor: default; }

  .tl-range {
    -webkit-appearance: none;
    appearance: none;
    flex: 1;
    height: 26px;
    margin: 0;
    background: transparent;
    cursor: ew-resize;
  }

  .tl-range::-webkit-slider-runnable-track {
    height: 2px;
    background: linear-gradient(90deg, var(--us-nasa) 0%, rgba(240, 236, 228, 0.35) 50%, var(--cn-gold) 100%);
  }

  .tl-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 13px;
    height: 13px;
    margin-top: -5.5px;
    border: 0;
    background: var(--cross-ink);
    box-shadow: 0 0 10px rgba(240, 236, 228, 0.5);
  }

  .tl-range::-moz-range-track {
    height: 2px;
    background: linear-gradient(90deg, var(--us-nasa) 0%, rgba(240, 236, 228, 0.35) 50%, var(--cn-gold) 100%);
  }

  .tl-range::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border: 0;
    border-radius: 0;
    background: var(--cross-ink);
    box-shadow: 0 0 10px rgba(240, 236, 228, 0.5);
  }

  .tl-range:focus-visible { outline: 2px solid var(--cross-ink); outline-offset: 4px; }

  .tl-years { display: grid; grid-template-columns: repeat(11, minmax(0, 1fr)); }

  .tl-year {
    appearance: none;
    border: 0;
    border-bottom: var(--hairline) solid rgba(255, 255, 255, 0.16);
    background: transparent;
    padding: 6px 2px 7px;
    font-family: var(--type-us);
    font-variant-numeric: tabular-nums;
    font-size: 10.5px;
    letter-spacing: 0.12em;
    color: var(--us-dim);
    cursor: pointer;
    transition: color 240ms ease, border-color 240ms ease;
  }

  .tl-year:hover { color: var(--cross-ink); }
  .tl-year[aria-current="true"] { color: var(--cross-ink); border-bottom-color: var(--cross-ink); }

  /* year display ------------------------------------------------------------ */
  .tl-view { align-items: start; }

  .tl-us, .tl-cn { min-width: 0; }

  .tl-beats { list-style: none; margin: 0; padding: 0; }

  .tl-beat { display: flex; flex-direction: column; gap: 7px; padding-block: clamp(12px, 1.6vh, 16px); }
  .tl-beat + .tl-beat { border-top: var(--hairline) solid rgba(255, 255, 255, 0.13); }

  .tl-beat-meta {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--type-us);
    font-size: 9.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--us-dim);
  }

  .tl-us .tl-beat-text {
    margin: 0;
    font-family: var(--type-us);
    font-size: 13.5px;
    line-height: 1.55;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--us-ink);
  }

  .tl-cn { text-align: right; }

  .tl-cn .tl-beat-meta {
    justify-content: flex-end;
    font-family: var(--type-cn);
    letter-spacing: 0.2em;
    text-transform: none;
    color: var(--cn-dim);
  }

  .tl-cn .tl-beat-text {
    margin: 0;
    font-family: var(--type-cn);
    font-size: 14px;
    line-height: 1.65;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--cn-ink);
  }

  .tl-est {
    display: inline-block;
    padding: 2px 6px;
    border: var(--hairline) solid currentColor;
    font-family: var(--type-us);
    font-size: 8.5px;
    letter-spacing: 0.24em;
  }

  .tl-us .tl-est { color: var(--us-amber); }
  .tl-cn .tl-est { color: var(--cn-gold-hi); }

  /* spine column of the display */
  .tl-mid { display: flex; flex-direction: column; align-items: center; gap: 14px; padding-top: clamp(18px, 2.6vh, 30px); }

  .tl-mid-kicker {
    margin: 0;
    font-size: 9.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cross-ink);
    transition: color 600ms ease;
  }

  .tl-year-big {
    margin: 0;
    font-family: var(--type-us);
    font-weight: 700;
    font-size: clamp(34px, 3.4vw, 56px);
    line-height: 1;
    letter-spacing: 0.03em;
    color: var(--cross-ink);
    font-variant-numeric: tabular-nums;
    transition: color 600ms ease;
  }

  .tl-diamond {
    width: 8px;
    height: 8px;
    border: var(--hairline) solid var(--cross-ink);
    transform: rotate(45deg);
    opacity: 0.7;
  }

  .tl-mid-rule {
    flex: 1;
    width: var(--spine-w);
    min-height: 40px;
    background: repeating-linear-gradient(180deg,
      var(--cross-ink) 0px, var(--cross-ink) 6px,
      transparent 6px, transparent 18px);
    opacity: 0.45;
  }

  /* footnote */
  .tl-foot {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 9.5px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
  }

  .tl-foot-us { font-family: var(--type-us); color: var(--us-dim); }
  .tl-foot-cn { font-family: var(--type-cn); color: var(--cn-dim); letter-spacing: 0.18em; text-transform: none; }

  @media (max-width: 1023px) {
    .tl-view { grid-template-columns: minmax(0, 1fr); row-gap: 8px; }
    .tl-mid { flex-direction: row; justify-content: center; padding-top: 0; }
    .tl-mid-rule { display: none; }
    .tl-cn { text-align: left; }
    .tl-cn .tl-beat-meta { justify-content: flex-start; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tl-year, .tl-step, .tl-head-mid, .tl-mid-kicker, .tl-year-big { transition: none; }
  }
`;

export default function Timeline() {
  const [year, setYear] = useState(MIN_YEAR);
  const row = YEARS.find((r) => r.year === year) ?? YEARS[0];

  const step = (delta: number) =>
    setYear((y) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y + delta)));

  return (
    <section id="timeline" className="tl" aria-label="Scrubbable timeline, 2016 to 2026">
      <style>{TL_CSS}</style>

      {/* section head, aligned to the rails */}
      <div className="rail-grid tl-head">
        <p className="tl-kicker tl-kicker--us">Timeline · 03</p>
        <p className="tl-head-mid" aria-hidden="true">2016 / 2026 · scrub or click</p>
        <p className="tl-kicker tl-kicker--cn" lang="zh-CN">时间轴</p>
      </div>

      {/* scrub deck: step buttons, range scrubber, eleven clickable year ticks */}
      <div className="tl-deck">
        <div className="tl-range-row">
          <button
            type="button"
            className="tl-step"
            onClick={() => step(-1)}
            disabled={year === MIN_YEAR}
            aria-label="Previous year"
          >
            ◀
          </button>
          <input
            className="tl-range"
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="Scrub years from 2016 to 2026"
            aria-valuetext={String(year)}
          />
          <button
            type="button"
            className="tl-step"
            onClick={() => step(1)}
            disabled={year === MAX_YEAR}
            aria-label="Next year"
          >
            ▶
          </button>
        </div>

        <div className="tl-years" role="group" aria-label="Jump to a year">
          {YEARS.map((r) => (
            <button
              key={r.year}
              type="button"
              className="tl-year"
              aria-current={r.year === year}
              onClick={() => setYear(r.year)}
            >
              {r.year}
            </button>
          ))}
        </div>
      </div>

      {/* year display: US beats / big year on the spine / CN beats */}
      <div className="rail-grid tl-view">
        <div className="tl-us">
          <ul className="tl-beats">
            {row.us.map((b, i) => (
              <li key={b.text} className="tl-beat">
                <p className="tl-beat-meta">
                  <span>Beat {String(i + 1).padStart(2, "0")}</span>
                  {b.est ? <span className="tl-est">EST</span> : null}
                </p>
                <p className="tl-beat-text">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="tl-mid" aria-hidden="true">
          <p className="tl-mid-kicker">Year</p>
          <p className="tl-year-big">{row.year}</p>
          <span className="tl-diamond" />
          <div className="tl-mid-rule" />
        </div>

        <div className="tl-cn">
          <ul className="tl-beats">
            {row.cn.map((b, i) => (
              <li key={b.text} className="tl-beat">
                <p className="tl-beat-meta">
                  {b.est ? <span className="tl-est">EST</span> : null}
                  <span lang="zh-CN">节点 {String(i + 1).padStart(2, "0")}</span>
                </p>
                <p className="tl-beat-text">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* estimate footnote */}
      <div className="tl-foot">
        <span className="tl-foot-us">Beats marked EST are our projections · 2016-2026</span>
        <span className="tl-foot-cn" lang="zh-CN">拖动滑块或点击年份 · 估计以 EST 标注</span>
      </div>
    </section>
  );
}
