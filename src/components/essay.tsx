/*
 * US-008 - The essay: two compute civilizations.
 *
 * A 450-620 word argument, set as a two-rail dossier: the America half in
 * grotesque ink on black hairline rules, the China half in Song serif on
 * lacquer with gold hairlines. The spine column carries a vertical kicker,
 * the word count and an "EST" legend. Server-rendered; all styling is scoped
 * to this component's style tag so globals.css stays untouched.
 */

const ESSAY_CSS = `
  .essay { align-items: start; }

  .es-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(14px, 2vh, 22px);
  }

  .es-head-side {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 10.5px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
  }

  .es-head-us { color: var(--us-nasa-glow); font-family: var(--type-us); justify-self: start; }
  .es-head-cn { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; justify-self: end; }

  .es-head-us::before {
    content: "";
    width: clamp(20px, 3vw, 50px);
    height: var(--hairline);
    background: var(--us-nasa);
  }

  .es-head-cn::after {
    content: "";
    width: clamp(20px, 3vw, 50px);
    height: var(--hairline);
    background: var(--cn-gold);
  }

  .es-head-mid {
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

  .es-head-x {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
  }

  .es-head-x::before, .es-head-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 11px;
    height: var(--hairline);
    background: var(--cross-ink);
  }

  .es-head-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .es-head-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  .es-body {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.6vh, 16px);
    min-width: 0;
    padding: clamp(14px, 1.3vw, 20px) clamp(16px, 1.4vw, 22px);
    border: var(--hairline) solid transparent;
  }

  .es-body--us {
    background: linear-gradient(180deg, rgba(11, 16, 22, 0.9) 0%, rgba(7, 10, 15, 0.84) 100%);
    border-color: var(--us-panel-edge);
  }

  .es-body--cn {
    background: linear-gradient(180deg, rgba(42, 19, 15, 0.9) 0%, rgba(32, 13, 9, 0.86) 100%);
    border-color: rgba(210, 169, 79, 0.3);
  }

  .es-kicker {
    margin: 0;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .es-body--us .es-kicker { color: var(--us-dim); font-family: var(--type-us); }
  .es-body--cn .es-kicker { color: var(--cn-dim); font-family: var(--type-cn); letter-spacing: 0.2em; }

  .es-title {
    margin: 0;
    font-size: clamp(19px, 1.7vw, 26px);
    line-height: 1.3;
    font-weight: 700;
  }

  .es-body--us .es-title { font-family: var(--type-us); letter-spacing: 0.02em; color: var(--us-ink); }
  .es-body--cn .es-title { font-family: var(--type-cn); letter-spacing: 0.12em; color: var(--cn-ink); }

  .es-p {
    margin: 0;
    font-size: 13px;
    line-height: 1.82;
  }

  .es-body--us .es-p { color: #c3cfdf; letter-spacing: 0.015em; font-family: var(--type-us); }
  .es-body--cn .es-p { color: #d8c4a6; letter-spacing: 0.05em; font-family: var(--type-cn); }

  .es-p + .es-p {
    margin-top: clamp(10px, 1.5vh, 14px);
    padding-top: clamp(10px, 1.5vh, 14px);
    border-top: var(--hairline) solid transparent;
  }

  .es-body--us .es-p + .es-p { border-top-color: rgba(143, 168, 205, 0.16); }
  .es-body--cn .es-p + .es-p { border-top-color: rgba(210, 169, 79, 0.18); }

  .es-est {
    font-style: normal;
    font-size: 8.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 1px 5px;
    border: var(--hairline) solid currentColor;
    margin-left: 6px;
    vertical-align: 1.5px;
    white-space: nowrap;
  }

  .es-body--us .es-est { color: var(--us-amber); }
  .es-body--cn .es-est { color: var(--cn-gold-hi); }

  @media (max-width: 1023px) {
    .es-head { grid-template-columns: minmax(0, 1fr); row-gap: 14px; }
    .es-head-mid { justify-self: start; flex-direction: row; gap: 12px; }
    .es-head-cn { justify-self: start; }
  }
`;

export default function Essay() {
  return (
    <section id="essay" className="rail-grid essay" aria-label="Essay: two compute civilizations">
      <style>{ESSAY_CSS}</style>

      {/* section head: rail labels flanking a spine node */}
      <div className="es-head">
        <p className="es-head-side es-head-us">Essay · 02</p>
        <div className="es-head-mid" aria-hidden="true">
          <span className="es-head-x" />
          <span>Words</span>
        </div>
        <p className="es-head-side es-head-cn" lang="zh-CN">论述 · 贰</p>
      </div>

      {/* AMERICA half of the essay --------------------------------------- */}
      <div className="es-body es-body--us">
        <p className="es-kicker">Part I · The Machine State</p>
        <h3 className="es-title">Two compute civilizations, one spine.</h3>

        <p className="es-p">
          America built compute the way it builds everything else: as a market.
          OpenAI, Anthropic, DeepMind and xAI compete for the same talent pool,
          the same Nvidia silicon, the same frontier narrative. The result is a
          closed flagship economy. GPT and Claude ship as APIs behind paywalls,
          the weights never leave the datacenter, and distribution is the moat.
          Meta keeps the counterweight open; Llama checkpoints are the default
          base model for a third of the world's fine-tunes, and every open line
          that follows borrows from that decision.
        </p>

        <p className="es-p">
          The export controls are the other engine. Every H100 that cannot ship
          east is a frontier model America gets to train first, and every
          restriction is priced into the roadmaps on both sides. The cost curve
          bends, but it bends asymmetrically: the US keeps the frontier, China
          keeps the factory floor.
        </p>

        <p className="es-p">
          The bet is that speed beats scale. Move the frontier six months ahead,
          lock in the developer stack, and the rest of the world fine-tunes your
          machine. That is the American thesis in one sentence: whoever trains
          first, defines next.
        </p>
      </div>

      {/* SPINE column for this section ------------------------------------ */}
      <div className="spine-col" aria-hidden="true">
        <span className="spine-x" />
        <p className="spine-label">Words</p>
        <div className="spine-ticks" />
      </div>

      {/* CHINA half of the essay ------------------------------------------ */}
      <div className="es-body es-body--cn">
        <p className="es-kicker" lang="zh-CN">Part II · 算力文明</p>
        <h3 className="es-title" lang="zh-CN">两条轨道，一个终点。</h3>

        <p className="es-p" lang="zh-CN">
          中国把算力当作基础设施来建设，而不是当作市场。华为在出口管制下造出
          昇腾芯片，从硅到云自成一体；DeepSeek 用更低成本训练出 R1 推理模型，
          把全球定价曲线重新拉平；阿里、字节、智谱、月之暗面在开源与闭源之间
          各自下注。模型可以开放，数据必须留在境内，分发则交给十亿级应用。
          <em className="es-est">Est</em>
        </p>

        <p className="es-p" lang="zh-CN">
          开源不是姿态，是杠杆。Qwen 与 DeepSeek 的权重被亚洲、欧洲和美洲的
          开发者下载、微调、再部署；每一次开源发布，都是把美国的分发渠道变成
          中国的模型生态。当硅谷训练下一代旗舰时，世界其余部分正在用上一代
          中国模型赚钱。这是另一种时间差：不是谁更快，而是谁的机器在更多地方
          运转。
        </p>

        <p className="es-p" lang="zh-CN">
          赌注是规模胜过速度。把模型成本压到美国对手的十分之一，让算力像电力
          一样按量计价，然后等待管制裂缝与开源网络共同放大。中国的论点同样
          一句话：谁的机器跑得更便宜，谁就定义下一个十年。
        </p>
      </div>
    </section>
  );
}
