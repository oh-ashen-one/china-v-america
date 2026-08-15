/*
 * US-007 - Lab dossiers.
 *
 * America rail: OpenAI, Anthropic, DeepMind, xAI, Meta + one dark horse
 * (Sakana AI). China rail: Qwen, DeepSeek, ByteDance, Zhipu, Moonshot,
 * Huawei. Each dossier is a designed file card in its own rail (file stamp,
 * seal mark, hairline spec rows) — not a bullet list. All styling is scoped
 * to this component's style tag; globals.css stays untouched. Server-rendered,
 * no client state needed for this section.
 */

const DOSSIER_CSS = `
  .dossiers { align-items: start; }

  /* section head spanning both rails, with a spine node in the middle ------ */
  .ds-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(14px, 2vh, 22px);
  }

  .ds-head-side {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 10.5px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
  }

  .ds-head-us { color: var(--us-nasa-glow); font-family: var(--type-us); justify-self: start; }
  .ds-head-cn { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; justify-self: end; }

  .ds-head-us::before {
    content: "";
    width: clamp(20px, 3vw, 50px);
    height: var(--hairline);
    background: var(--us-nasa);
  }

  .ds-head-cn::after {
    content: "";
    width: clamp(20px, 3vw, 50px);
    height: var(--hairline);
    background: var(--cn-gold);
  }

  .ds-head-mid {
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

  .ds-head-x {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
  }

  .ds-head-x::before, .ds-head-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 11px;
    height: var(--hairline);
    background: var(--cross-ink);
  }

  .ds-head-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .ds-head-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  /* dossier card ----------------------------------------------------------- */
  .ds-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.4vh, 14px);
    padding: clamp(12px, 1.3vw, 18px) clamp(14px, 1.4vw, 20px);
    border: var(--hairline) solid transparent;
    transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease;
    min-width: 0;
  }

  .ds-card--us {
    background: linear-gradient(180deg, rgba(11, 16, 22, 0.9) 0%, rgba(7, 10, 15, 0.84) 100%);
    border-color: var(--us-panel-edge);
  }

  .ds-card--cn {
    background: linear-gradient(180deg, rgba(42, 19, 15, 0.9) 0%, rgba(32, 13, 9, 0.86) 100%);
    border-color: rgba(210, 169, 79, 0.3);
  }

  .ds-card--us:hover { transform: translateX(6px); border-color: var(--us-nasa); box-shadow: -14px 0 34px rgba(20, 48, 107, 0.5); }
  .ds-card--cn:hover { transform: translateX(-6px); border-color: var(--cn-cinnabar); box-shadow: 14px 0 34px rgba(222, 74, 47, 0.32); }

  /* file stamp header */
  .ds-stamp {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .ds-card--us .ds-stamp { color: var(--us-dim); font-family: var(--type-us); }
  .ds-card--cn .ds-stamp { color: var(--cn-dim); font-family: var(--type-cn); letter-spacing: 0.2em; }

  .ds-chip {
    padding: 3px 7px;
    border: var(--hairline) solid currentColor;
    font-size: 8.5px;
    letter-spacing: 0.24em;
    white-space: nowrap;
  }

  .ds-chip--us { color: var(--us-nasa-glow); }
  .ds-chip--cn { color: var(--cn-jade); }

  /* name row */
  .ds-name-row { display: flex; align-items: baseline; gap: 14px; min-width: 0; }

  .ds-name {
    margin: 0;
    font-size: clamp(17px, 1.5vw, 23px);
    line-height: 1.15;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ds-card--us .ds-name { font-family: var(--type-us); font-weight: 700; text-transform: uppercase; color: var(--us-ink); }
  .ds-card--cn .ds-name { font-family: var(--type-cn); font-weight: 700; letter-spacing: 0.14em; color: var(--cn-ink); }

  .ds-seal {
    margin-left: auto;
    flex: none;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: var(--hairline) solid currentColor;
  }

  .ds-card--us .ds-seal { color: var(--us-amber); font-family: var(--type-us); font-size: 13px; font-weight: 700; letter-spacing: 0.06em; }
  .ds-card--cn .ds-seal { color: var(--cn-cinnabar); font-family: var(--type-cn); font-size: 15px; }

  .ds-thesis {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.65;
  }

  .ds-card--us .ds-thesis { color: var(--us-dim); letter-spacing: 0.02em; }
  .ds-card--cn .ds-thesis { color: var(--cn-dim); letter-spacing: 0.05em; }

  /* spec rows, hairline separated */
  .ds-specs { list-style: none; margin: 0; padding: 0; }

  .ds-spec {
    display: grid;
    grid-template-columns: clamp(72px, 6vw, 96px) minmax(0, 1fr);
    gap: 12px;
    padding-block: 7px;
    font-size: 11.5px;
    line-height: 1.5;
  }

  .ds-spec + .ds-spec { border-top: var(--hairline) solid rgba(143, 168, 205, 0.14); }
  .ds-card--cn .ds-spec + .ds-spec { border-top-color: rgba(210, 169, 79, 0.18); }

  .ds-spec dt {
    margin: 0;
    font-size: 9px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    padding-top: 2px;
  }

  .ds-card--us .ds-spec dt { color: var(--us-dim); font-family: var(--type-us); }
  .ds-card--cn .ds-spec dt { color: var(--cn-dim); font-family: var(--type-cn); letter-spacing: 0.16em; }

  .ds-spec dd { margin: 0; min-width: 0; }
  .ds-card--us .ds-spec dd { color: var(--us-ink); font-family: var(--type-us); }
  .ds-card--cn .ds-spec dd { color: var(--cn-jade-pale); font-family: var(--type-cn); letter-spacing: 0.04em; }

  .ds-spec dd em {
    font-style: normal;
    font-size: 8.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 1px 5px;
    border: var(--hairline) solid currentColor;
    margin-left: 8px;
    vertical-align: 1px;
  }

  .ds-card--us .ds-spec dd em { color: var(--us-amber); }
  .ds-card--cn .ds-spec dd em { color: var(--cn-gold-hi); }

  /* rail footer note */
  .ds-foot {
    margin: 0;
    font-size: 9.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    padding-top: 10px;
    border-top: var(--hairline) solid transparent;
  }

  .ds-foot--us { color: var(--us-dim); border-top-color: rgba(143, 168, 205, 0.18); }
  .ds-foot--cn { font-family: var(--type-cn); letter-spacing: 0.16em; color: var(--cn-dim); border-top-color: rgba(210, 169, 79, 0.2); }

  @media (max-width: 1023px) {
    .ds-head { grid-template-columns: minmax(0, 1fr); row-gap: 14px; }
    .ds-head-mid { justify-self: start; flex-direction: row; gap: 12px; }
    .ds-head-cn { justify-self: start; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-card--us:hover, .ds-card--cn:hover { transform: none; }
  }
`;

type Rail = "us" | "cn";

type Dossier = {
  file: string;
  name: string;
  seal: string;
  chip?: string;
  thesis: string;
  specs: [string, string, boolean?][]; // label, value, estimated?
};

const US_DOSSIERS: Dossier[] = [
  {
    file: "US-01",
    name: "OpenAI",
    seal: "O1",
    thesis: "The frontier flagship factory. Closed weights, consumer scale, and the most visible run at AGI framing.",
    specs: [
      ["Flagship", "GPT-5.x line · o-series reasoning"],
      ["Stack", "Closed API + self-hosted enterprise"],
      ["Moat", "Distribution, safety theatre, talent gravity"],
    ],
  },
  {
    file: "US-02",
    name: "Anthropic",
    seal: "A1",
    thesis: "Interpretability posture and enterprise trust. Constitutional methods, frontier models a half-step behind the leader.",
    specs: [
      ["Flagship", "Claude 4.x family"],
      ["Stack", "Closed API, long-context focus"],
      ["Moat", "Safety brand, coding + agent depth"],
    ],
  },
  {
    file: "US-03",
    name: "DeepMind",
    seal: "DM",
    chip: "GOOGLE",
    thesis: "Science-first lab inside Google. Reinforcement learning roots, multimodal Gemini, and the robotics pipeline.",
    specs: [
      ["Flagship", "Gemini 2.x multimodal"],
      ["Stack", "TPU farm, DeepMind + Google AI merge"],
      ["Moat", "Science credibility, hardware integration"],
    ],
  },
  {
    file: "US-04",
    name: "xAI",
    seal: "X1",
    thesis: "Compute-maximalist. Colossus GPU clusters, open-ish weights on the mid tier, and a speed-obsessed frontier bet.",
    specs: [
      ["Flagship", "Grok 4.x on Colossus"],
      ["Stack", "Self-built GPU city, API + app"],
      ["Moat", "Raw compute ambition, single-mission focus"],
    ],
  },
  {
    file: "US-05",
    name: "Meta AI",
    seal: "M1",
    chip: "OPEN",
    thesis: "The open-weights engine. Llama family is the default base model for a third of the world's fine-tunes.",
    specs: [
      ["Flagship", "Llama 4.x open weights"],
      ["Stack", "Public checkpoints + enterprise license"],
      ["Moat", "Open ecosystem, dev mindshare at scale"],
    ],
  },
  {
    file: "US-06",
    name: "Sakana AI",
    seal: "SK",
    chip: "DARK HORSE",
    thesis: "Tokyo dark horse. Evolutionary coding agents and small-model efficiency; proof the frontier is not only a US game.",
    specs: [
      ["Flagship", "Sakana Realtime · coding agents"],
      ["Stack", "Japan-based, open collaboration model"],
      ["Moat", "Agent novelty, low-cost efficiency bets"],
    ],
  },
];

const CN_DOSSIERS: Dossier[] = [
  {
    file: "CN-01",
    name: "Qwen",
    seal: "千问",
    chip: "ALIBABA",
    thesis: "Alibaba's open-weights workhorse. The most downloaded Chinese family; long context, multimodal, and a full size ladder.",
    specs: [
      ["Flagship", "Qwen3.x · open + API tier"],
      ["Stack", "ModelScope distribution, cloud integration"],
      ["Moat", "Open-weight mindshare across Asia"],
    ],
  },
  {
    file: "CN-02",
    name: "DeepSeek",
    seal: "深求",
    thesis: "The efficiency shock. R1 reasoning at a fraction of US training cost; the paper that reset global pricing.",
    specs: [
      ["Flagship", "DeepSeek R1 · V3.x"],
      ["Stack", "Open weights, self-hosted at scale"],
      ["Moat", "Cost curve, research velocity"],
    ],
  },
  {
    file: "CN-03",
    name: "ByteDance",
    seal: "字节",
    chip: "DOUBAO",
    thesis: "App-scale distribution. Doubao is China's highest-traffic assistant; Seed lab pushes video and multimodal.",
    specs: [
      ["Flagship", "Doubao · Seed team models"],
      ["Stack", "TikTok-scale inference, consumer apps"],
      ["Moat", "Distribution, data flywheel, cash flow"],
    ],
  },
  {
    file: "CN-04",
    name: "Zhipu AI",
    seal: "智谱",
    chip: "GLM",
    thesis: "Tsinghua-spinoff with the GLM line. Open mid-size models and an enterprise agent platform in the wild.",
    specs: [
      ["Flagship", "GLM-4.x · open + API"],
      ["Stack", "Academic roots, enterprise deployments"],
      ["Moat", "Research pedigree, open mid-tier trust"],
    ],
  },
  {
    file: "CN-05",
    name: "Moonshot AI",
    seal: "月之暗面",
    chip: "KIMI",
    thesis: "The long-context challenger. Kimi's 200k-class context made document work its signature; now a full model ladder.",
    specs: [
      ["Flagship", "Kimi K2 · long-context line"],
      ["Stack", "Consumer app + API, high burn pace"],
      ["Moat", "Context UX, consumer brand in CN"],
    ],
  },
  {
    file: "CN-06",
    name: "Huawei",
    seal: "华为",
    chip: "HARDWARE",
    thesis: "The full-stack state player. Ascend silicon under export pressure, Pangu models on top; the civilizational bet.",
    specs: [
      ["Flagship", "Pangu 5.x on Ascend NPU"],
      ["Stack", "Silicon to cloud, telecom distribution"],
      ["Moat", "Hardware sovereignty, state alignment"],
    ],
  },
];

function DossierCard({ d, rail }: { d: Dossier; rail: Rail }) {
  const cn = rail === "cn";
  return (
    <article className={cn ? "ds-card ds-card--cn" : "ds-card ds-card--us"}>
      <p className="ds-stamp">
        <span>{cn ? "卷宗" : "File"} {d.file}</span>
        <span className={cn ? "ds-chip ds-chip--cn" : "ds-chip ds-chip--us"}>
          {d.chip ?? (cn ? "持续轨" : "US RAIL")}
        </span>
      </p>

      <div className="ds-name-row">
        <h3 className={cn ? "ds-name" : "ds-name"} lang={cn ? "zh-CN" : undefined}>
          {d.name}
        </h3>
        <span className="ds-seal" aria-hidden="true">
          {d.seal}
        </span>
      </div>

      <p className="ds-thesis" lang={cn ? "zh-CN" : undefined}>
        {d.thesis}
      </p>

      <dl className="ds-specs">
        {d.specs.map(([label, value, est]) => (
          <div key={label} className="ds-spec">
            <dt>{label}</dt>
            <dd lang={cn ? "zh-CN" : undefined}>
              {value}
              {est ? <em>Est</em> : null}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function Dossiers() {
  return (
    <section id="dossiers" className="rail-grid dossiers" aria-label="Lab dossiers">
      <style>{DOSSIER_CSS}</style>

      {/* section head: rail labels flanking a spine node */}
      <div className="ds-head" aria-hidden="false">
        <p className="ds-head-side ds-head-us">Dossiers · US</p>
        <div className="ds-head-mid" aria-hidden="true">
          <span className="ds-head-x" />
          <span>Files 12</span>
        </div>
        <p className="ds-head-side ds-head-cn" lang="zh-CN">卷宗 · 中国</p>
      </div>

      {/* AMERICA rail: six file cards */}
      <div className="rail">
        {US_DOSSIERS.map((d) => (
          <DossierCard key={d.file} d={d} rail="us" />
        ))}
        <p className="ds-foot ds-foot--us">
          Six files · one dark horse flagged · estimates marked EST
        </p>
      </div>

      {/* SPINE column for this section */}
      <div className="spine-col" aria-hidden="true">
        <span className="spine-x" />
        <p className="spine-label">Files</p>
        <div className="spine-ticks" />
      </div>

      {/* CHINA rail: six file cards */}
      <div className="rail">
        {CN_DOSSIERS.map((d) => (
          <DossierCard key={d.file} d={d} rail="cn" />
        ))}
        <p className="ds-foot ds-foot--cn" lang="zh-CN">
          六卷 · 含硬件满栈 · 估计数以 EST 标注
        </p>
      </div>
    </section>
  );
}
