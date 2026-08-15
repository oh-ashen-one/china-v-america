/*
 * US-005 - Interactive scoreboard.
 *
 * Ten cross-cutting rows between the rails: open weights, closed flagships,
 * agents, video, speech, robotics, on-device, export, energy, talent. Each
 * row is its own dual-rail band (US cell left on the black field, CN cell
 * right on lacquer) with a diamond tick on the spine. Hovering (or focusing,
 * for keyboard users) expands a note under the row; estimates are labeled
 * with an EST chip and a footnote. Real lab names only: Meta, OpenAI,
 * Anthropic, xAI, ByteDance, Moonshot, Zhipu, Qwen/Alibaba, DeepSeek,
 * Kuaishou, MiniMax, iFlytek, Figure, Tesla, Unitree, UBTech, Qualcomm,
 * Apple, Huawei. Pure CSS interaction (no client JS), so this stays a
 * server component; all styling lives in the scoped style tag below and
 * globals.css is untouched.
 */

type Entry = { text: string; est?: boolean };

type Row = {
  id: string;
  n: string;
  label: string;
  cjk?: string;
  us: Entry;
  cn: Entry;
  noteEn: string;
  noteZh: string;
};

const ROWS: Row[] = [
  {
    id: "open-weights",
    n: "01",
    label: "Open weights",
    cjk: "开放权重",
    us: { text: "Meta · Llama 4 (open, terms-gated)" },
    cn: { text: "Qwen + DeepSeek · open at frontier scale" },
    noteEn:
      "The US open lane runs through Meta: Llama ships with weights public but usage terms attached. China answers at frontier scale; Alibaba's Qwen line and DeepSeek V3 / R1 went fully open, which reset the global price of inference.",
    noteZh: "美国开放路线以 Meta 的 Llama 为锚；Qwen 与 DeepSeek 直接把前沿权重开放，改写了推理的全球价格。",
  },
  {
    id: "closed-flagships",
    n: "02",
    label: "Closed flagships",
    cjk: "闭源旗舰",
    us: { text: "OpenAI GPT-5 · Anthropic Claude · xAI Grok" },
    cn: { text: "ByteDance Doubao · Moonshot Kimi · Zhipu GLM" },
    noteEn:
      "Closed flagships carry the margin in both rails. GPT-5, Claude and Grok on the left; Doubao, Kimi and GLM on the right. Nobody publishes these weights, so capability claims stay vendor-reported.",
    noteZh: "闭源旗舰是两边的利润中心：GPT-5、Claude、Grok 对豆包、Kimi、GLM。权重不公开，能力以厂商口径为准。",
  },
  {
    id: "agents",
    n: "03",
    label: "Agents",
    cjk: "智能体",
    us: { text: "OpenAI Operator · Anthropic Claude agents" },
    cn: { text: "Manus · ByteDance agent suites", est: true },
    noteEn:
      "Agents moved from demo to desk work on both sides. Operator and the Claude agent stack face Manus and ByteDance's agent suites; real task-completion rates are still rough estimates in every public benchmark.",
    noteZh: "智能体从演示走向工位：Operator 与 Claude 对 Manus 和字节系。任务完成率在公开基准里仍是估计值。",
  },
  {
    id: "video",
    n: "04",
    label: "Video",
    cjk: "视频",
    us: { text: "OpenAI Sora 2 · Google Veo" },
    cn: { text: "Kling (Kuaishou) · ByteDance" },
    noteEn:
      "The loudest arena. Sora 2 and Veo on the left; Kuaishou's Kling shipped earlier for creators and ByteDance follows close. Consistency past ten seconds is still the open problem in both rails.",
    noteZh: "声量最大的擂台：Sora 2 与 Veo 对快手可灵和字节。超过十秒的一致性仍是双方的未解问题。",
  },
  {
    id: "speech",
    n: "05",
    label: "Speech",
    cjk: "语音",
    us: { text: "GPT-4o voice · ElevenLabs" },
    cn: { text: "MiniMax · iFlytek Spark" },
    noteEn:
      "Voice is decided by latency and cost. GPT-4o voice and ElevenLabs on the left; MiniMax and iFlytek Spark on the right, where Mandarin coverage runs far ahead of most Western models.",
    noteZh: "语音看延迟与成本：GPT-4o 语音、ElevenLabs 对 MiniMax 和讯飞星火，中文覆盖领先多数西方模型。",
  },
  {
    id: "robotics",
    n: "06",
    label: "Robotics",
    cjk: "机器人",
    us: { text: "Figure 03 · Tesla Optimus", est: true },
    cn: { text: "Unitree H1 / G1 · UBTech", est: true },
    noteEn:
      "Where the chips war meets the factory floor. Figure and Optimus on the left; Unitree (Hangzhou) and UBTech on the right, with Unitree's humanoid unit prices already below Western estimates. Production counts here are estimates.",
    noteZh: "芯片战争在这里撞上车间：Figure 与 Optimus 对宇树和优必选。宇树人形单价已低于西方估计，产量皆为估计值。",
  },
  {
    id: "on-device",
    n: "07",
    label: "On-device",
    cjk: "端侧",
    us: { text: "Qualcomm NPU · Apple Neural Engine", est: true },
    cn: { text: "Huawei Ascend · Honor silicon", est: true },
    noteEn:
      "Inference shifts into phones and laptops. Qualcomm NPUs and Apple's Neural Engine on the left; Huawei Ascend silicon running across its own devices and partners on the right. Unit shipments are estimates.",
    noteZh: "推理搬进手机与笔记本：高通 NPU、苹果神经引擎，对华为昇腾及其生态。出货量均为估计值。",
  },
  {
    id: "export",
    n: "08",
    label: "Export",
    cjk: "出口管制",
    us: { text: "BIS rules · H100 / B200 held back" },
    cn: { text: "SMIC 7nm · Ascend 910C ramp", est: true },
    noteEn:
      "The rail's hard boundary. US rules keep H100-class silicon off mainland fabs; China answers with SMIC 7nm and the Ascend 910C ramp. Every node here is contested, so treat yields as estimates.",
    noteZh: "硬边界所在：H100 级芯片被挡在大陆之外，SMIC 7nm 与昇腾 910C 是对价。良率皆为估计值。",
  },
  {
    id: "energy",
    n: "09",
    label: "Energy",
    cjk: "能耗",
    us: { text: "New DC load · single-digit GW/yr", est: true },
    cn: { text: "Yunnan hydro · TWh-scale grid", est: true },
    noteEn:
      "Partly a grid story. US data-center build-out adds single-digit gigawatts of annual load by 2026 (our estimate); China leans on Yunnan hydro and a dispatchable grid at TWh scale. Both figures are estimates from public filings.",
    noteZh: "也是电网叙事：美国 2026 前每年新增个位数 GW（估），中国靠云南水电与可调度电网，TWh 级（估）。",
  },
  {
    id: "talent",
    n: "10",
    label: "Talent",
    cjk: "人才",
    us: { text: "Import engine · top-lab clusters" },
    cn: { text: "Returnee wave · Tsinghua / USTC" },
    noteEn:
      "The quiet variable. A US import engine concentrated around the top labs, against China's returnee wave and the Tsinghua / USTC pipelines. Net flow is shifting, and headcounts are estimates.",
    noteZh: "安静的变量：美国围绕头部实验室的进口引擎，对中国的回流潮与清华 / 中科大管线。人数皆为估计值。",
  },
];

const SB_CSS = `
  #scoreboard { scroll-margin-top: 24px; }

  .sb-head { align-items: center; margin-bottom: clamp(12px, 1.8vh, 20px); }

  .sb-kicker {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 10.5px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
  }

  .sb-kicker--us { justify-self: start; color: var(--us-nasa-glow); font-family: var(--type-us); }
  .sb-kicker--us::before { content: ""; width: clamp(22px, 3vw, 54px); height: var(--hairline); background: var(--us-nasa); }

  .sb-kicker--cn { justify-self: end; color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; }
  .sb-kicker--cn::after { content: ""; width: clamp(22px, 3vw, 54px); height: var(--hairline); background: var(--cn-gold); }

  .sb-head-mid {
    justify-self: center;
    font-size: 9.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cross-ink);
    transition: color 600ms ease;
  }

  .sb-list { list-style: none; margin: 0; padding: 0; }

  .sb-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    padding-block: clamp(14px, 1.9vh, 20px);
  }

  .sb-row + .sb-row { border-top: var(--hairline) solid rgba(255, 255, 255, 0.13); }

  .sb-row:hover {
    background: linear-gradient(90deg,
      rgba(47, 95, 194, 0.09) 0%,
      transparent 46%,
      transparent 54%,
      rgba(222, 74, 47, 0.09) 100%);
  }

  .sb-row:focus-visible { outline-offset: -2px; }

  .sb-us { justify-self: start; text-align: left; font-family: var(--type-us); color: var(--us-ink); min-width: 0; }
  .sb-cn { justify-self: end; text-align: right; font-family: var(--type-cn); color: var(--cn-ink); min-width: 0; }

  .sb-mid { justify-self: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }

  .sb-idx {
    font-family: var(--type-us);
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--cross-ink);
    opacity: 0.75;
    transition: color 600ms ease;
  }

  .sb-diamond {
    width: 8px;
    height: 8px;
    border: var(--hairline) solid var(--cross-ink);
    transform: rotate(45deg);
    opacity: 0.6;
    transition: transform 320ms ease, background-color 320ms ease;
  }

  .sb-row:hover .sb-diamond,
  .sb-row:focus-within .sb-diamond { transform: rotate(45deg) scale(1.4); background: var(--cross-ink); }

  .sb-domain {
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--type-us);
    font-size: 10.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--us-dim);
  }

  .sb-domain-cjk { font-family: var(--type-cn); letter-spacing: 0.2em; text-transform: none; color: var(--cn-dim); }

  .sb-us .sb-val { margin: 0; font-size: 13.5px; line-height: 1.5; font-weight: 600; letter-spacing: 0.02em; }
  .sb-cn .sb-val { margin: 0; font-size: 14px; line-height: 1.6; letter-spacing: 0.05em; }

  .sb-est {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 6px;
    border: var(--hairline) solid currentColor;
    font-family: var(--type-us);
    font-size: 8.5px;
    letter-spacing: 0.24em;
    vertical-align: middle;
  }

  .sb-us .sb-est { color: var(--us-amber); }
  .sb-cn .sb-est { color: var(--cn-gold-hi); }

  /* note expansion, pure CSS on hover / focus-within */
  .sb-note {
    grid-column: 1 / -1;
    display: grid;
    grid-template-rows: 0fr;
    margin-top: 0;
    transition: grid-template-rows 380ms ease, margin-top 380ms ease;
  }

  .sb-row:hover .sb-note,
  .sb-row:focus-within .sb-note { grid-template-rows: 1fr; margin-top: 12px; }

  .sb-note-in { overflow: hidden; min-height: 0; }

  .sb-note-card {
    border-left: 2px solid var(--cross-ink);
    background: rgba(7, 5, 6, 0.82);
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 600ms ease;
  }

  .sb-note-tag { font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--cross-ink); }
  .sb-note-en { margin: 0; font-family: var(--type-us); font-size: 12px; line-height: 1.75; letter-spacing: 0.02em; color: rgba(233, 238, 246, 0.88); }
  .sb-note-zh { margin: 0; font-family: var(--type-cn); font-size: 12.5px; line-height: 1.8; letter-spacing: 0.06em; color: rgba(243, 233, 215, 0.8); }

  .sb-foot {
    margin-top: clamp(12px, 1.8vh, 18px);
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 9.5px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
  }

  .sb-foot-us { font-family: var(--type-us); color: var(--us-dim); }
  .sb-foot-cn { font-family: var(--type-cn); color: var(--cn-dim); letter-spacing: 0.18em; text-transform: none; }

  @media (max-width: 1023px) {
    .sb-row { grid-template-columns: minmax(0, 1fr); row-gap: 12px; }
    .sb-mid { flex-direction: row; justify-self: start; }
    .sb-cn { justify-self: start; text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sb-note, .sb-diamond, .sb-head-mid, .sb-idx { transition: none; }
  }
`;

export default function Scoreboard() {
  return (
    <section id="scoreboard" className="rail-grid score" aria-label="Interactive scoreboard, 2026 estimates">
      <style>{SB_CSS}</style>

      {/* section head, aligned to the rails */}
      <div className="rail-grid sb-head">
        <p className="sb-kicker sb-kicker--us">Scoreboard · 02</p>
        <p className="sb-head-mid" aria-hidden="true">10 rows</p>
        <p className="sb-kicker sb-kicker--cn" lang="zh-CN">对照记分牌</p>
      </div>

      {/* ten cross-cutting rows: US cell / spine tick / CN cell */}
      <ul className="sb-list">
        {ROWS.map((r) => (
          <li key={r.id} className="sb-row" tabIndex={0}>
            {/* America cell: domain label + US entry */}
            <div className="sb-us">
              <p className="sb-domain">
                {r.n} · {r.label}
                {r.cjk ? (
                  <span className="sb-domain-cjk" lang="zh-CN">
                    {r.cjk}
                  </span>
                ) : null}
              </p>
              <p className="sb-val">
                {r.us.text}
                {r.us.est ? <span className="sb-est">EST</span> : null}
              </p>
            </div>

            {/* spine tick */}
            <div className="sb-mid" aria-hidden="true">
              <span className="sb-idx">{r.n}</span>
              <span className="sb-diamond" />
            </div>

            {/* China cell: CN entry, right-anchored */}
            <div className="sb-cn">
              <p className="sb-val" lang={r.cjk ? "zh-CN" : undefined}>
                {r.cn.text}
                {r.cn.est ? <span className="sb-est">EST</span> : null}
              </p>
            </div>

            {/* note: expands on hover or keyboard focus */}
            <div className="sb-note">
              <div className="sb-note-in">
                <div className="sb-note-card">
                  <span className="sb-note-tag">Note · {r.label}</span>
                  <p className="sb-note-en">{r.noteEn}</p>
                  {r.noteZh ? (
                    <p className="sb-note-zh" lang="zh-CN">
                      {r.noteZh}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* estimate footnote */}
      <div className="sb-foot">
        <span className="sb-foot-us">Figures marked EST are our estimates from public reporting · 2026</span>
        <span className="sb-foot-cn" lang="zh-CN">悬停展开注释 · 估计数以 EST 标注</span>
      </div>
    </section>
  );
}

