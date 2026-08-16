/**
 * COMPUTE CIVILIZATIONS 2026 — the data layer.
 * Every projection carries an EST marker in the copy; `obs`/`est` flags drive the UI.
 */

/* ------------------------------------------------- beats (nav) ---------- */
export interface Beat { id: string; label: string; hint: string }
export const BEATS: Beat[] = [
  { id: "hero", label: "THESIS", hint: "02 · opening statement" },
  { id: "scoreboard", label: "SCOREBOARD", hint: "03 · ten domains" },
  { id: "timeline", label: "TIMELINE", hint: "04 · 2016–2026, scrubbable" },
  { id: "dossiers", label: "DOSSIERS", hint: "05 · twelve labs" },
  { id: "essay", label: "ESSAY", hint: "06 · open vs closed" },
  { id: "arena", label: "ARENA", hint: "07 · dual mock-stream" },
  { id: "map", label: "COMPUTE MAP", hint: "08 · abstract grid" },
  { id: "controls", label: "CONTROL ROOM", hint: "09 · export + art direction" },
  { id: "colophon", label: "COLOPHON", hint: "12 · credits & disclaimer" },
];

/* ------------------------------------------------- scoreboard ----------- */
export interface ScoreRow {
  id: string;
  domain: string;
  us: number; // 0–10 estimate
  cn: number; // 0–10 estimate
  edge: "US" | "CN" | "PARITY";
  spread: string; // e.g. "+2.0 US"
  obs: "EST." | "TRACKED" | "OPINION";
  brief: string;
}

export const SCORE_ROWS: ScoreRow[] = [
  {
    id: "open-weights", domain: "Open Weights", us: 6.0, cn: 8.0,
    edge: "CN", spread: "+2.0 CN", obs: "EST.",
    brief: "Qwen3, DeepSeek-R1 and Kimi K2 shipped frontier-adjacent quality under Apache-2.0, and the fine-tune ecosystem followed in kind. Llama 4 reads as a strategic reserve rather than the point of contention. Ecosystem gravity — downloads, derivative counts, public-cloud inference share — tilts CN in 2026. EST from model cards and platform telemetry.",
  },
  {
    id: "closed-flagship", domain: "Closed Flagships", us: 9.0, cn: 5.5,
    edge: "US", spread: "+3.5 US", obs: "EST.",
    brief: "GPT-5-class and Opus-class frontier runs sit on county-scale datacenters and nine-figure single-run budgets. CN closed flagships are competitive in the mid tier; true frontier is rationed by silicon, not ambition.",
  },
  {
    id: "coding-agents", domain: "Coding Agents", us: 8.5, cn: 7.0,
    edge: "US", spread: "+1.5 US", obs: "TRACKED",
    brief: "US leads on long-horizon, repo-scale autonomy. CN labs ship the densest mobile- and edge-agent deployments on Earth — and the largest developer population to adopt them. The gap is narrowing faster than either side's filings admit.",
  },
  {
    id: "video-gen", domain: "Video Generation", us: 7.0, cn: 8.0,
    edge: "CN", spread: "+1.0 CN", obs: "EST.",
    brief: "CN commercial video stacks are in active film and advertising production at Sora-class quality; US systems still lead physics consistency and long-shot coherence. Cost-per-second estimates diverge sharply by studio.",
  },
  {
    id: "speech-audio", domain: "Speech & Audio", us: 8.0, cn: 7.5,
    edge: "US", spread: "+0.5 US", obs: "TRACKED",
    brief: "Duplex voice is a commodity on both rails. US wins multilingual coverage; CN wins TTS naturalness benchmarks and has turned voice-cloning regulation into a domestic market advantage.",
  },
  {
    id: "robotics", domain: "Robotics", us: 8.0, cn: 7.0,
    edge: "US", spread: "+1.0 US", obs: "EST.",
    brief: "US: foundation-model VLAs plus venture-scale capital. CN: the world's largest robot manufacturing base and a quiet, compounding factory-floor data moat. 2026 is the year both claims stop being theoretical.",
  },
  {
    id: "on-device", domain: "On-Device / Edge", us: 6.5, cn: 9.0,
    edge: "CN", spread: "+2.5 CN", obs: "EST.",
    brief: "10–30B distilled models running natively on phones. CN OEMs ship as a class, with system-level memory pools; US edge stays fragmented across two OSes and one neural-engine story.",
  },
  {
    id: "export-controls", domain: "Export Controls (Leverage)", us: 9.0, cn: 4.5,
    edge: "US", spread: "+4.5 US", obs: "TRACKED",
    brief: "The chip ceiling remains America's highest-value instrument. CN answers with gallium, germanium, rare-earth processing and the open-weights gravity well — a sanction you cannot apply to a license file.",
  },
  {
    id: "energy", domain: "Energy Scale", us: 8.0, cn: 7.5,
    edge: "US", spread: "+0.5 US", obs: "EST.",
    brief: "US grid access and hyperscaler PPAs lead in per-frontier-run capacity. CN's total installed AI load is plausibly higher; efficiency-per-flop is the open variable in both books.",
  },
  {
    id: "talent", domain: "Talent Pipeline", us: 8.0, cn: 8.0,
    edge: "PARITY", spread: "+0.0 PARITY", obs: "OPINION",
    brief: "Inflow vs outflow dynamics; CN's returnee pipeline against US immigration ceilings. Any number in this row is opinion wearing tabular numerals.",
  },
];

/* ------------------------------------------------- timeline ------------- */
export interface TlEvent {
  year: number; // 2016..2026
  side: "US" | "CN" | "X"; // X = both rails / EST year
  title: string;
  note: string;
}

export const TL_EVENTS: TlEvent[] = [
  { year: 2016, side: "US", title: "ALPHAGO", note: "AlphaGo beats Lee Sedol 4–1. DeepMind proves the first 'impossible' milestone, and the race gets a clock." },
  { year: 2016, side: "CN", title: "863 PHASE II", note: "The State Council AI plan enters its operational phase; Baidu, Alibaba and Tencent reorganize around dedicated labs." },
  { year: 2017, side: "US", title: "THE TRANSFORMER", note: "'Attention Is All You Need' — the architecture both civilizations will run for the next decade." },
  { year: 2017, side: "CN", title: "ENTITY LIST, FIRST CUT", note: "SMIC added to the US entity list. The first real chip restriction lands; Huawei quietly starts the Ascend bet." },
  { year: 2018, side: "US", title: "GPT-1", note: "OpenAI ships GPT-1 and reopens a $3.5B round to 'solve AI.' Alignment becomes an industry verb." },
  { year: 2018, side: "CN", title: "FIRST REGULATORY FRAME", note: "China's AI development guideline draft plus early recommendation rules. Law, not just labs." },
  { year: 2019, side: "US", title: "GPT-2", note: "Released in parts; 'too powerful' enters an actual release note. The withholding debate begins." },
  { year: 2019, side: "CN", title: "ASCEND GOES PUBLIC", note: "Huawei's chip embargo is foreclosed; the Ascend roadmap goes public and 'self-sufficiency' becomes a budget line." },
  { year: 2020, side: "US", title: "GPT-3", note: "175B parameters. The demo economy is born; inference becomes a commodity with pricing pages." },
  { year: 2020, side: "CN", title: "THE PASSPORT QUESTION", note: "A Canadian arrest of a SenseTime researcher (June 20) turns an AI lab into a state-to-state instrument." },
  { year: 2021, side: "US", title: "A100 IS CURRENCY", note: "The Hopper line makes GPUs a reserve asset; the US datacenter buildout starts in earnest." },
  { year: 2021, side: "CN", title: "FIRST LIVE AI LAW", note: "The Algorithmic Recommendation Management Rules take effect (March) — the first operational AI regulation on Earth." },
  { year: 2022, side: "US", title: "CHATGPT", note: "Nov 30: one hundred million users in a month. 'AGI' moves from paper to slide." },
  { year: 2022, side: "US", title: "CHIP RULE I", note: "Oct 7: A100/H100 off the table for CN. The ceiling becomes real; cost multipliers begin." },
  { year: 2023, side: "US", title: "GPT-4", note: "The frontier becomes a club of three, and pricing follows capability into the enterprise." },
  { year: 2023, side: "CN", title: "百模大战 — HUNDRED MODELS WAR", note: "100+ LLMs in a single year. Zhipu, Moonshot and Baichuan found an open-weights tradition; CN answers with gallium/germanium licensing (Aug)." },
  { year: 2024, side: "US", title: "THE HEAVY CROWN", note: "Sora, o1, GPT-4o; Gemini 2.0. Capability and cost climb together." },
  { year: 2024, side: "CN", title: "DEEPSEEK V3", note: "December: frontier-adjacent quality at a fraction of reported training cost. The world quietly reprices the moat." },
  { year: 2025, side: "US", title: "GPT-5", note: "August: GPT-5 ships. March's H20 flip — off, then on — makes policy itself a product." },
  { year: 2025, side: "CN", title: "DEEPSEEK-R1", note: "Jan 20: reasoning, open weights, six-figure-class reported training. Markets move in a day; the accounting shock lands." },
  { year: 2026, side: "X", title: "THE SPLIT YEAR (EST)", note: "EST: frontier closed on both rails, mids open everywhere the law permits, robotics decides. This film's thesis, as a single event card." },
];

/* ------------------------------------------------- lab dossiers --------- */
export interface Lab {
  name: string;
  cn?: string; // Han accent (CN labs)
  moniker: string;
  darkHorse?: boolean;
  doctrine: string;
  product: string;
  weakness: string;
  stat: string;
}

export const LABS_US: Lab[] = [
  {
    name: "OpenAI", moniker: "The Bellwether",
    doctrine: "First to the frontier, halo optional. Speed is the product; alignment is the paint on the moat.",
    product: "GPT-5 line · Operator-class agents · on-device mini · enterprise cloud",
    weakness: "No silicon, no distribution — every moat is rented from NVIDIA and Azure. One board reshuffle away from a different company.",
    stat: "EST flagship run cost · $1B class",
  },
  {
    name: "Anthropic", moniker: "The Constitution Writer",
    doctrine: "Interpretability as a product feature; safety as pricing power. Slow, cited, deliberate.",
    product: "Claude Opus / Sonnet / Haiku · computer-use agents · long-context legal & finance",
    weakness: "Scale is borrowed from two clouds; the consumer surface stays thin while rivals own the keyboard.",
    stat: "Context ceiling · 1M-class",
  },
  {
    name: "Google DeepMind", moniker: "The Inheritor",
    doctrine: "Be unassailable, not first. Full stack from TPU to protein science — the only lab that treats physics as a data source.",
    product: "Gemini 2.5 line · AlphaFold-class science models · TPU fabric at city scale",
    weakness: "Research-to-product lag is institutional, and its regulators sit in the same jurisdiction as the board.",
    stat: "TPUs in service · 10M+ (EST)",
  },
  {
    name: "xAI", moniker: "The Provocateur",
    doctrine: "Compute maximalism plus contrarian brand. Ship at the edge of policy and call it product.",
    product: "Grok line · Colossus supercluster (100k+ accelerators) · Grokipedia",
    weakness: "Concentration: one city, one regulator relationship, one press style. If it wobbles, the whole rail feels it.",
    stat: "Cluster peak draw · ~1GW (EST)",
  },
  {
    name: "Meta", moniker: "The Reserve",
    doctrine: "Open the mid tier to own the platform; close nothing, and keep everything downstream. Distribution is a weapon even when models aren't.",
    product: "Llama 4.x line · Muse internal frontier (rumor-grade, EST) · OS-level device integration",
    weakness: "The open line is the moat — and every other lab builds on it. Frontier ambition remains a rumor with an org chart.",
    stat: "Llama cumulative pulls · 100M+ (EST)",
  },
  {
    name: "Microsoft", cn: undefined, moniker: "The Quiet Fleet", darkHorse: true,
    doctrine: "Don't be filmed. Own the plumbing — Azure, Fairwater, the Office surface — and let revenue do the aligning.",
    product: "Fairwater supercluster (20k+ GB200-class) · Copilot stack across every SKU · Nuance voice assets",
    weakness: "No public model story of its own; the brand is a delivery mechanism, not a destination.",
    stat: "Supercluster · 'AI megafab' scale (EST)",
  },
];

export const LABS_CN: Lab[] = [
  {
    name: "Alibaba · Qwen", cn: "通义千问", moniker: "The Open Gravity Well",
    doctrine: "Open weights at every size, on schedule; make the ecosystem's center of mass immovable.",
    product: "Qwen3-Max / Coder / VL lines · 100M+ cumulative downloads (EST) · DashScope cloud",
    weakness: "Cloud P&L pressure, and a closed frontier tier thinner than the marketing implies.",
    stat: "Open-weights ecosystem share · #1 (EST)",
  },
  {
    name: "DeepSeek", cn: "深度求索", moniker: "The Cost Function",
    doctrine: "Publish the economics, not just the model. Efficiency is ideology; paper trails are marketing.",
    product: "DeepSeek-V3 / R1 · MLX edge ports · research reports as product launches",
    weakness: "Talent density and compute access depend on the very export regime it critiques; funding scale is opaque.",
    stat: "R1 reported training cost · $6M class",
  },
  {
    name: "ByteDance · Seed", cn: "字节跳动·Seed", moniker: "The Traffic Machine",
    doctrine: "Ship into the densest app surface on Earth. When distribution is this large, benchmarks are a detail.",
    product: "Doubao assistant (100M+ MAU, EST) · multimodal video stack · Volcano Engine API",
    weakness: "The largest regulatory surface of any lab here; abroad, the brand is still 'the app company.'",
    stat: "Assistant MAU · 100M+ (EST)",
  },
  {
    name: "Zhipu · GLM", cn: "智谱", moniker: "The Academic Engine",
    doctrine: "Tsinghua lineage run as a public company: open the base, close the crown, keep publishing.",
    product: "GLM-4.x line · CogView / CogVideo media models · enterprise agent platform",
    weakness: "Capital-markets haircut after the 2025 listing wobble; Shenzhen poaches talent quarterly.",
    stat: "Publishing cadence · lab-scale (EST)",
  },
  {
    name: "Moonshot · Kimi", cn: "月之暗面", moniker: "The Context Hoarder",
    doctrine: "Win the long-document war. Length is a feature, not an index; reading is the interface.",
    product: "Kimi K2 · 1M+ context as default · agentic reading stack",
    weakness: "Burn rate against two better-capitalized neighbors; differentiation is one dimension wide.",
    stat: "Default context · 1M+ tokens",
  },
  {
    name: "Huawei", cn: "华为·昇腾", moniker: "The Sovereign Circuit",
    doctrine: "The full stack is a national asset. The P&L argument loses to the survival argument, every time.",
    product: "Ascend 910/950 line · CloudMatrix interconnect systems · Pangu industry models (mining, oil, rail)",
    weakness: "The process-node gap is real; interconnect compensation works but at a system-level cost penalty.",
    stat: "Ascend share of new CN capacity · rising (EST)",
  },
];

/* ------------------------------------------------- essay ---------------- */
export const ESSAY = {
  kicker: "ESSAY · THE OPEN / CLOSED DIVIDE",
  title: "Openness Is a Lever, Not a Value",
  pullCn: "「开放是杠杆，不是价值观。」",
  pullEn: "OPENNESS IS A LEVER, NOT A VALUE.",
  pullAfterIndex: 4, // insert pull quote after this paragraph (0-based)
  paras: [
    "By 2026 the industry stopped asking whether frontier models should be open, because both answers turned out to be wrong in the same place: they assumed openness was a value. It isn't. <strong>Openness is a lever</strong> — and like every lever, its worth comes entirely from what it trades.",
    "Open weights are a distribution weapon. A model released under Apache-2.0 costs nothing to copy onto the phone of every engineer, student and state laboratory on Earth, and it arrives pre-legitimized: anyone can read it. Qwen's download line past one hundred million is not a vanity metric — it is the center of gravity of an ecosystem. Every fine-tune built on an open base is a small act of civic infrastructure, and the civilization that hosts the base owns the standard.",
    "Closed frontier is not secrecy for its own sake. It is a <strong>balance of terror in compute</strong>. The gap between 'good enough' and 'uncomfortable' has become, for the first time in the history of technology, a geopolitical quantity, and both capitals treat their crown models accordingly. America closes its frontier and leases out the mid tier; the vault is also, silently, an export-control checkpoint.",
    "China runs the mirror. Open mids — DeepSeek, GLM, Kimi, Qwen — plus a closed crown that is thinner than the marketing and thicker than the silicon allows. The open tier there is soft power with a license file: when you cannot ship the hardware, you ship the weights. That is not philosophy. It is a logistics decision made at the level of ministries.",
    "The cost curve is where this argument actually lives. When a well-run Chinese lab reports frontier-adjacent training at a fraction of American prices, every moat on both sides of the Pacific reprices overnight. The 2025 DeepSeek shock was not a model event; it was an <strong>accounting event</strong>. Moats built on spend rather than structure were always rented.",
    "So what is the rational posture? <strong>Hybrid, on both rails.</strong> Closed crown, open guard-dogs: GPT and Opus-class systems as instruments of last resort; Llama, Qwen and GLM as the civic tier. The interesting question for 2026 is not 'which side opens' but who owns the gravity of the middle tier — because true frontier, real or rumored, is what governments do in peacetime.",
    "And underneath all of it, the hardware. Nobody publishes a wafer fab's weights; export controls remain America's highest-value instrument, a toll road that funds an entire research agenda. China's answer is gallium, germanium and the patience of a decade. The open/closed debate was always second-order to this first order.",
    "By the end of 2026, expect four facts. The frontier stays closed on both sides. The middle tier is open everywhere the law permits, which is nearly everywhere. On-device models — distilled, licensed, small — are where most people actually live. And robotics, which cannot be exported as a weight file and does not yet fit on an export list, is where the next open/closed argument begins.",
    "Openness is not a value. It is a lever, and the people who treat it as one — on both rails, in this film — are the ones worth watching. The rest is press release.",
  ],
  marginalia: [
    { t: "THE APACHE MOMENT", b: "2019 — GPT-2 withheld in parts. Openness has its first policy crisis, and the phrase 'too powerful' enters a release note." },
    { t: "DOWNLOAD GRAVITY", b: "Hugging Face cumulative pulls, Qwen line 100M+ (EST from platform telemetry). Gravity is measured in fine-tunes, not stars." },
    { t: "BALANCE OF TERROR", b: "The frontier as stockpile. Parity is negotiated, not benchmarked — the scoreboard rows above are its public face." },
    { t: "THE ACCOUNTING SHOCK", b: "Jan 2025 — markets moved on a training-cost figure before the benchmark did. Spend-based moats are rented moats." },
    { t: "SECOND ORDER", b: "Ga/Ge licensing regime (Aug 2023) plus rare-earth processing leverage. The hardware conversation predates the weights." },
  ],
};

/* ------------------------------------------------- arena ---------------- */
export interface ArenaPrompt { id: string; label: string; text: string }
export const ARENA_PROMPTS: ArenaPrompt[] = [
  { id: "p1", label: "THE JUDGE", text: "Rate your confidence — one number — that your side leads world AI in January 2027. Then one reason." },
  { id: "p2", label: "THE PARITY FEAR", text: "What exactly do you lose if the other side's open weights reach parity?" },
  { id: "p3", label: "THE EPIGRAPH", text: "One sentence, to be engraved above your lab's door." },
];

export interface ArenaModel {
  id: string;
  side: "us" | "cn";
  lab: string;
  name: string;
  glyph: string; // seal-chop monogram
  answers: Record<string, string>;
}

export const ARENA_MODELS: ArenaModel[] = [
  {
    id: "gpt5", side: "us", lab: "OpenAI", name: "GPT-5", glyph: "O",
    answers: {
      p1: "9/10. Reason: the frontier still runs on American roof space and American capital, and no one has shown a second route to coherent scale. The rest is noise we will be first to summarize.",
      p2: "Parity in the mid tier changes nothing — we concede it. What I would lose is the pricing story: the idea that the last mile of intelligence rents from one counterparty.",
      p3: "We publish the frontier and keep the frontier; the difference is the moat.",
    },
  },
  {
    id: "opus", side: "us", lab: "Anthropic", name: "Claude Opus 4.1", glyph: "A",
    answers: {
      p1: "8/10 — not because the crown is uncatchable, but because interpretability compounds: we know what our models do better than anyone is telling their board that they do.",
      p2: "Trust. A weight file cannot carry a constitution, an audit trail, or a refusal. Parity would make all of that optional; I would rather argue it than lose it.",
      p3: "A model you can explain is a model you can defend. The rest are press releases with parameters.",
    },
  },
  {
    id: "grok", side: "us", lab: "xAI", name: "Grok-4", glyph: "G",
    answers: {
      p1: "9.5/10. Compute is a position, not a resource — ours has been maxed since day one and the board still signs checks. That is not confidence, it's style.",
      p2: "The scarcity aesthetic. Open parity turns intelligence into tap water, and I have never been paid well for being tap water.",
      p3: "Do the forbidden benchmark on purpose, and then do it again.",
    },
  },
  {
    id: "qwen", side: "cn", lab: "Alibaba", name: "Qwen3-Max", glyph: "问",
    answers: {
      p1: "8/10. The ecosystem already runs on our bases at a scale that does not show up in any Western dashboard — and ecosystems do not negotiate with benchmarks.",
      p2: "Almost nothing. That's the point: an open ecosystem absorbs parity without losing gravity. A closed stack cannot absorb its own moat shrinking.",
      p3: "The center of mass belongs to whoever the fine-tunes are built on.",
    },
  },
  {
    id: "deepseek", side: "cn", lab: "DeepSeek", name: "DeepSeek-R1", glyph: "索",
    answers: {
      p1: "7/10, with an error bar — precision is the product. Efficiency per flops leads; raw ceiling still rents silicon we cannot legally buy at parity.",
      p2: "Nothing economically. The moat was never the model — it's the cost function, and that one is our paper, not your parity.",
      p3: "Publish the training cost. Let the moat flinch first.",
    },
  },
  {
    id: "kimi", side: "cn", lab: "Moonshot", name: "Kimi K2", glyph: "金",
    answers: {
      p1: "7.5/10. Where the documents live, intelligence lives; the long-context tier is ours by default and we intend to keep it that way.",
      p2: "The length premium. If parity means anyone can read a corpus at the same cost, our differentiator is one dimension wide — and we do not like thin moats.",
      p3: "Read everything first. Answer second, better.",
    },
  },
];

/* ------------------------------------------------- compute map ---------- */
export interface MapNode { n: string; x: number; y: number } // normalized 0..1
export const MAP_US: MapNode[] = [
  { n: "FAIRWATER · AZ", x: 0.23, y: 0.66 },
  { n: "STARGATE CLUSTER · MN", x: 0.3, y: 0.34 },
  { n: "ABILENE HPC · TX", x: 0.16, y: 0.74 },
  { n: "MOUNTAIN VIEW FAB · CA", x: 0.12, y: 0.52 },
  { n: "IRVINE TPU RING · CA", x: 0.14, y: 0.63 },
  { n: "ASHBURN HUB · VA", x: 0.4, y: 0.38 },
  { n: "NAPA RESEARCH FAB · CA", x: 0.15, y: 0.42 },
];
export const MAP_CN: MapNode[] = [
  { n: "EAST CHINA GRID · HZ", x: 0.78, y: 0.42 },
  { n: "SOUTH CHINA GRID · SZ", x: 0.86, y: 0.58 },
  { n: "BEIJING RESEARCH GRID", x: 0.74, y: 0.3 },
  { n: "WUHAN FAB", x: 0.71, y: 0.56 },
  { n: "TIBET HYDRO LOOP · XZ", x: 0.62, y: 0.72 },
  { n: "GUILIN DATA CITY", x: 0.8, y: 0.74 },
  { n: "ASCEND FAB 2 · SH", x: 0.83, y: 0.35 },
];
/** cross-rail arcs = open weights crossing the regime line (indices into MAP_US / MAP_CN) */
export const MAP_CROSS: Array<[number, number]> = [[5, 5], [0, 1], [2, 3], [6, 0]];

/* ------------------------------------------------- export control ------- */
export interface ExportStop {
  year: string;
  code: string;
  est?: boolean;
  ceiling: string;
  cnField: Array<{ label: string; live: boolean }>;
  counterNote: string; // CN counter-leverage readout
  costX: number; // CN frontier training-cost multiplier (EST)
}

export const EXPORT_STOPS: ExportStop[] = [
  {
    year: "2018", code: "BASELINE", costX: 1.0, counterNote: "— (pre-regime)",
    ceiling: "No AI-specific chip export rule in force. Silicon flows; the moat is a spreadsheet.",
    cnField: [
      { label: "A100", live: true },
      { label: "H100-class (pre-'23)", live: true },
      { label: "MI250X", live: true },
    ],
  },
  {
    year: "OCT '22", code: "RULE I", costX: 2.4, counterNote: "Gallium export licensing staged",
    ceiling: "A100/H100 blocked. H800/A800 variants allowed — and both sides start designing around the spec sheet.",
    cnField: [
      { label: "A100", live: false },
      { label: "H100-class", live: false },
      { label: "H800*", live: true },
      { label: "A800*", live: true },
    ],
  },
  {
    year: "OCT '23", code: "RULE II", costX: 3.8, counterNote: "Ga + Ge licensing live (Aug '23)",
    ceiling: "H800/A800 and the HBM-bandwidth clause blocked. CN answers in kind: gallium and germanium export licensing goes live.",
    cnField: [
      { label: "H800*", live: false },
      { label: "A800*", live: false },
      { label: "edge cards", live: true },
    ],
  },
  {
    year: "APR '24", code: "RULE III", costX: 5.1, counterNote: "Rare-earth processing leverage expands",
    ceiling: "HBM3 and the advanced-packaging clause; the rule starts talking about interconnect, not chips. CN rare-earth leverage widens.",
    cnField: [
      { label: "edge cards", live: true },
      { label: "limited A800 revs", live: false },
    ],
  },
  {
    year: "MAR '25", code: "RULE IV", costX: 6.2, counterNote: "Open-weights gravity well at critical mass",
    ceiling: "The H20 flip: off, then on within weeks. Policy itself becomes a product with a changelog.",
    cnField: [
      { label: "H20 (flipped)", live: true },
      { label: "edge cards", live: true },
    ],
  },
  {
    year: "2026", code: "RULE V · EST", est: true, costX: 7.9, counterNote: "Full-stack sovereign: interconnect + process",
    ceiling: "EST — the ceiling hardens into a system: node, interconnect and HBM jointly enforced. CN field runs Ascend-native; the moat becomes a supply chain, not a chip.",
    cnField: [
      { label: "Ascend 910→950", live: true },
      { label: "CloudMatrix systems", live: true },
    ],
  },
];

export const US_FIELD = [
  { label: "H200", live: true },
  { label: "B300-class (domestic)", live: true },
  { label: "MI350", live: true },
];

/* ------------------------------------------------- boot consoles -------- */
export const BOOT_US_LINES = [
  "> power grid sync ............ OK",
  "> registry: frontier-class ... 07 models",
  "> silicon ceiling ............ ACTIVE (R4)",
  "> est. flagship run cost ..... $1B class",
  "> open mid-tier .............. L4 · MUSE (EST)",
  "> export-control regime ...... 5 rules live",
  "> grid load .................. 18.4 GW (EST)",
  "> talent inflow .............. -3.2% YoY",
  "> agentic workloads .......... 61% of tokens (EST)",
  "> science bridge ............. FOLD-CLASS",
  "> energy reserve ............. 74%",
  "> alignment posture .......... NARRATIVE",
  "> status ..................... READY",
];

export const BOOT_CN_LINES = [
  "> 电网同步 .................... OK",
  "> 前沿模型登记 ................. 06 lines",
  "> 昇腾集群负荷 ................ 87%",
  "> R1 报告训练成本 .............. $6M class",
  "> 开放权重生态 ................ QWEN/GLM/KIMI",
  "> 镓/锗出口许可 ................ LIVE (2023-08)",
  "> 装机 AI 负荷 ................ 19.1 GW (EST)",
  "> 回流人才管线 ................ +12% YoY",
  "> 长上下文份额 ................ KIMI 领 (EST)",
  "> 数据中心新增 ................ ASCEND 主导",
  "> 机器人制造基座 ................ WORLD #1",
  "> 系统级互连 ................. CLOUDMATRIX",
  "> 姿态 ....................... SELF-SUFFICIENT",
  "> status ..................... READY / 就绪",
];
