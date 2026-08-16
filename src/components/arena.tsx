"use client";

/*
 * US-008 - Toy 1: the blind arena.
 * Two anonymous answers, one prompt per round; pick a side, then the reveal
 * names the model and its rail. No data fetched — a scripted face-off so the
 * film can show the toy without an API key.
 */

import { useState } from "react";

const ARENA_CSS = `
  .arena { align-items: start; }

  .ar-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(14px, 2vh, 22px);
  }

  .ar-head-side {
    margin: 0;
    font-size: 10.5px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
  }

  .ar-head-us { color: var(--us-nasa-glow); font-family: var(--type-us); justify-self: start; }
  .ar-head-cn { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; justify-self: end; }

  .ar-head-mid {
    justify-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 9.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cross-ink);
  }

  .ar-head-x {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
  }

  .ar-head-x::before, .ar-head-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 11px;
    height: var(--hairline);
    background: var(--cross-ink);
  }

  .ar-head-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .ar-head-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  .ar-prompt {
    margin: 0;
    padding: 12px 16px;
    border-left: 3px solid var(--cross-ink);
    background: rgba(7, 5, 6, 0.6);
    font-size: 13px;
    line-height: 1.7;
    color: var(--us-ink);
    letter-spacing: 0.02em;
  }

  .ar-duel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: stretch;
  }

  .ar-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: clamp(14px, 1.3vw, 20px) clamp(16px, 1.4vw, 22px);
    border: var(--hairline) solid transparent;
    cursor: pointer;
    text-align: left;
    width: 100%;
    font-family: inherit;
  }

  .ar-card--a { background: rgba(10, 15, 21, 0.86); border-color: var(--us-panel-edge); color: var(--us-ink); }
  .ar-card--b { background: rgba(37, 16, 9, 0.88); border-color: rgba(210, 169, 79, 0.3); color: var(--cn-ink); }

  .ar-card:focus-visible { outline: 2px solid var(--cross-ink); outline-offset: 3px; }

  .ar-card-meta {
    margin: 0;
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .ar-card--a .ar-card-meta { color: var(--us-dim); }
  .ar-card--b .ar-card-meta { color: var(--cn-dim); letter-spacing: 0.2em; }

  .ar-answer { margin: 0; font-size: 13px; line-height: 1.82; }
  .ar-card--a .ar-answer { color: #c3cfdf; font-family: var(--type-us); }
  .ar-card--b .ar-answer { color: #d8c4a6; font-family: var(--type-cn); letter-spacing: 0.05em; }

  .ar-reveal {
    margin-top: auto;
    padding-top: 10px;
    border-top: var(--hairline) solid currentColor;
    font-size: 10px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .ar-card--a .ar-reveal { color: var(--us-nasa-glow); }
  .ar-card--b .ar-reveal { color: var(--cn-gold-hi); }

  .ar-vs {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ar-vs span {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
    color: var(--cross-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    letter-spacing: 0.14em;
  }

  .ar-verdict {
    margin: clamp(12px, 1.8vh, 18px) 0 0;
    padding: 12px 16px;
    border: var(--hairline) solid var(--cross-ink);
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cross-ink);
  }

  .ar-reset {
    margin-top: 12px;
    align-self: center;
    appearance: none;
    background: transparent;
    border: var(--hairline) solid var(--cross-ink);
    color: var(--cross-ink);
    font-size: 9.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    padding: 9px 18px;
    cursor: pointer;
  }

  @media (max-width: 1023px) {
    .ar-head, .ar-duel { grid-template-columns: minmax(0, 1fr); row-gap: 14px; }
    .ar-head-mid, .ar-vs { justify-self: start; }
  }
`;

type Round = { prompt: string; a: { name: string; text: string }; b: { name: string; text: string } };

const ROUNDS: Round[] = [
  {
    prompt: "Explain in two sentences why frontier labs still gate their weights.",
    a: { name: "GPT-4o · OpenAI", text: "Weights are the product and the moat. Releasing them would hand a competitor, or a hostile state, the exact asset that justifies the capital spend." },
    b: { name: "Qwen3 · Alibaba", text: "闭源是为了收回成本，开源才是分发。旗舰可以收费，底座必须免费——生态越大，护城河越深。" },
  },
  {
    prompt: "What does the export-control regime actually buy the US?",
    a: { name: "Claude 4 · Anthropic", text: "A lead, not a wall. It delays the rival's frontier training by quarters and keeps the pricing power on the API layer where America already wins." },
    b: { name: "DeepSeek R1 · DeepSeek", text: "管制买不到时间，只买到动机。被卡得越紧，自研芯片和低成本推理的动力越强——围堵本身是杠杆。" },
  },
];

export default function Arena() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<null | "a" | "b">(null);

  const r = ROUNDS[round];
  const pick = (side: "a" | "b") => { if (!picked) setPicked(side); };
  const next = () => { setRound((round + 1) % ROUNDS.length); setPicked(null); };

  return (
    <section id="arena" className="rail-grid arena" aria-label="Toy: the blind arena">
      <style>{ARENA_CSS}</style>

      <div className="ar-head">
        <p className="ar-head-side ar-head-us">Toy 01 · Blind Arena</p>
        <div className="ar-head-mid" aria-hidden="true">
          <span className="ar-head-x" />
          <span>Round {round + 1}</span>
        </div>
        <p className="ar-head-side ar-head-cn" lang="zh-CN">盲斗 · 壹</p>
      </div>

      <p className="ar-prompt">{r.prompt}</p>

      <div className="ar-duel">
        <button type="button" className="ar-card ar-card--a" onClick={() => pick("a")}>
          <p className="ar-card-meta"><span>Model A</span><span>{picked ? "Revealed" : "Anonymous"}</span></p>
          <p className="ar-answer">{r.a.text}</p>
          <span className="ar-reveal" aria-live="polite">
            {picked ? `A is ${r.a.name}` : "Pick a side to reveal"}
          </span>
        </button>

        <div className="ar-vs" aria-hidden="true"><span>VS</span></div>

        <button type="button" className="ar-card ar-card--b" onClick={() => pick("b")}>
          <p className="ar-card-meta"><span lang="zh-CN">模型 B</span><span>{picked ? "Revealed" : "Anonymous"}</span></p>
          <p className="ar-answer">{r.b.text}</p>
          <span className="ar-reveal" aria-live="polite">
            {picked ? `B is ${r.b.name}` : "Pick a side to reveal"}
          </span>
        </button>
      </div>

      {picked ? (
        <p className="ar-verdict" role="status">
          You backed {picked === "a" ? r.a.name : r.b.name}. No score, only taste.
        </p>
      ) : null}

      <button type="button" className="ar-reset" onClick={next}>Next Round →</button>
    </section>
  );
}
