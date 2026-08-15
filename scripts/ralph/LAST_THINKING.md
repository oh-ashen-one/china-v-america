Let's check the current state of the project. According to progress, US-001 passed along with files like package.json, src/app/page.tsx, etc. LAST_VERIFY.txt indicates that the build succeeded (the curl failure is due to a separate port check, probably from my previous verification attempt. The build itself exited with 0).

The current story is US-002: "Dual-rail visual system".

Acceptance criteria:
1. globals.css defines both rail token sets (America and China)
2. Desktop layout is a dual-rail with a central spine
3. npm run build exits with 0

First, let's read the existing files to grasp what we have. Read the actual project root: /Users/darkeatermidir/qwen-showcase/01-china-v-america

Check the files: package.json, src/app/layout.tsx, src/app/page.tsx, src/app/globals.css.

Need to proceed carefully — we should read the files first. Let's use the tool… wait, this is a Ralph agent, so we just need to emit files and VERIFY commands. But we should inspect the codebase first. In this environment, I think we can use shell commands? The instructions say to emit complete files and write VERIFY. Typically in these Ralph setups, the agent can read files with shell tools. But the instructions only specify file output and VERIFY. For safety, before emitting complete files that overwrite existing ones (layout.tsx, page.tsx), we should check the current state.

Hmm. The instructions say "you are a new coding agent. You have no memory of past turns, except: prd.json, progress.txt (read the Codebase Patterns first), git history, and LAST_VERIFY.txt". So we should read the codebase patterns from progress.txt — but progress.txt here has no "Codebase Patterns" section, just a log.

Given that US-001 passed with the emitted files: package.json, tsconfig.json, next.config.mjs, gitignore, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx — we know those exist. But I don't have their exact contents in hand. To avoid breaking things, I should read them first if possible. In this environment (which looks like a Claude Code style with tools), maybe I can use the Read tool. The system prompt here is minimal, and the user message gives instructions for output format only. Typically in these Ralph iterations, the agent can execute commands. Let me try reading files with shell — but I don't know if I have a tool interface. The conversation is just user → me. No tools are declared in the system prompt. Hmm, but maybe function-calling is available implicitly? Risky to assume.

Safest approach: emit complete files for everything needed, based on known constraints from US-001's acceptance criteria:
- package.json has next + react + typescript (Next 14.2.35 based on build output)
- src/app/page.tsx and layout.tsx exist
- No Inter, no fake next/font subsets (Noto Serif SC only allows cyrillic/latin/latin-ext/vietnamese)

Since I have to emit complete files (no placeholders), I need to rewrite package.json, layout.tsx, page.tsx, globals.css completely. Risk: if I don't match the existing package.json (e.g., dependency versions), npm install might break. But according to progress, in the successful US-001 iteration those files were "emitted", so the current on-disk versions are what that agent wrote. I'm a new agent with no memory, and since I have to emit complete files anyway, I'll emit consistent versions.

Actually wait — maybe I can read the actual current files. Let me think about whether tool use is possible. The system prompt doesn't define any tools, but many harnesses of this kind include bash implicitly. Given the uncertainty, emitting complete files is the mandated path: "emit complete files as ### FILE ... ### END FILE". The harness probably applies them. If I emit files that conflict with reality, the build might fail and next iteration fixes it. But better to be self-consistent: emit package.json, tsconfig.json, next.config.mjs, globals.css, layout.tsx, page.tsx in complete form so that the whole app is coherent and builds.

Let me design US-002's dual-rail visual system:

Design concept: "Persistent vs spine. Cursor-X crossfade."
- Dual-rail desktop layout (1440–1920): the page is split by a central spine. America's rail (left or right?) and China's rail (the opposite). The center spine is a persistent vertical element.
- "Persistent vs spine": probably the rail identity is persistent across sections, and the spine is the central divider.
- Cursor-X crossfade: when the cursor crosses from one side to the other, a color/identity crossfade happens (e.g., body background subtly shifts toward that rail's palette, via CSS variables toggled on data-attribute).

Let me define the tokens:

America rail (US):
- --us-black: #050607 (near black)
- --us-nasa-blue: #2B5CAB or NASA blue is often #0B3D91… actually NASA logo blue: the "worm" logo uses a bluish color. Commonly cited NASA blue is around #0B3D91 (old meatball's blue is something like #2B4BA1?). Let me choose: --us-nasa: #3B6BD6? Hmm. The meatball is a dark blue around #041E42 with red/orange swoosh. Let me define --us-nasa-blue: #1B4FA0, and a brighter variant for rules/glow --us-nasa-glow: #6E9BE8.
- Legal pad amber: legal pads are that yellowish color around #F6E7A8. --us-amber: #F2D57C or #FFDD67? Legal pad yellow ≈ #FAE9A0. Let me use --us-legalpad: #F4DC8C, and for text on dark a stronger amber --us-amber-hot: #FFB324.
- Grotesque typeface: system grotesque stack or a font? US-001 forbade Inter and fake next/font subsets. I can use @next/font/google with a real grotesque like "Archivo", "Space Grotesk" (is Space Grotesk allowed subsets? Space Grotesk supports latin, latin-ext, vietnamese — fine). "Space Grotesk" is a good grotesque. And Noto Serif SC for Chinese characters (subsets: cyrillic, latin, latin-ext, vietnamese — hmm those are the *only allowed* subsets per PRD. Interesting: Noto Serif SC's Google Fonts subsets are usually cyrillic, latin, latin-ext, vietnamese? Actual Noto Serif SC supports those subsets (SC glyphs are in a separate "chinese-simplified" subset? Actually Noto Serif SC on Google Fonts: subsets are cyrillic, latin, latin-ext, vietnamese — and CJK is delivered as unicode-range-split latin-family files? In fact Google Fonts' Noto Serif SC provides subsets: cyrillic, latin, latin-ext, vietnamese — with CJK handled via unicode-range in the same files? No wait.)

Hmm. The PRD note: "No fake next/font subsets (Noto Serif SC only allows cyrillic/latin/latin-ext/vietnamese)". So when using next/font/google for Noto Serif SC, the `subsets` option must only list from [cyrillic, latin, latin-ext, vietnamese]. next/font validates subsets against the font's known subsets. If we pass a subset not in that list, build fails ("is not supported"). So for Noto Serif SC I'll either omit `subsets` (use all defaults) or explicitly pass the allowed ones. Omitting is safest? next/font's default subsets for a font = all available? Actually I think when you omit `subsets`, next/font uses the "latin" subset by default? Let me recall: in next/font/google, if you omit `subsets`, it loads the default subset… I think the default is "latin". Hmm, but if we need CJK glyphs (Chinese characters like 中/美), "latin" subset won't include them, and the browser will fall back to system fonts for CJK. That's fine — it renders via fallback, no build issue.

Wait but there's a subtlety: does next/font/google validate subset names at build time against the font metadata? Yes — it throws something like "Invalid `subsets` value: 'cjk' is not supported by 'Noto Serif SC'. Supported subsets are [ cyrillic, latin, latin-ext, vietnamese ]". This is exactly what the PRD warns about: someone would put subsets: ['cjk-simplified'] and break build. So I should avoid that trap.

For Chinese text on the page, next/font Noto Serif SC with subset latin will only self-host Latin glyphs. CJK characters fall back to next/font's fallback chain → I should set up a font-family stack that includes system CJK: e.g. `"Noto Serif SC", "Songti SC", "SimSun", serif`. On non-CJK systems, browser will pick something. That's fine for a landing page.

Alternatively I could skip next/font entirely and use system stacks + Google Fonts link tag? US-001 says "No Inter. No fake next/font subsets" — that suggests we're using next/font/google for something (likely Noto Serif SC). To keep continuity with what US-001 did, I'll use next/font/google for:
- "Space Grotesk" (grotesque, America) — subsets latin, latin-ext (valid).
- "Noto Serif SC" (China serif) — omit subsets or use ['latin'].

Hmm wait, but if US-001's layout.tsx was already using next/font with specific settings and I rewrite, that's fine as long as build passes.

Actually — do I know if US-001 used next/font? The PRD says "No fake next/font subsets" which strongly suggests the scaffold involved next/font for Noto Serif SC. LAST_VERIFY build output shows no font warnings. Fine, I'll write my own complete layout with next/font/google imports: Space Grotesk + Noto Serif SC. That's self-consistent and build-safe.

Fonts to use:
- America rail: "Space Grotesk" — a proper grotesque. Weights 400,500,700. Subsets: latin, latin-ext (both valid for Space Grotesk).
- China rail: "Noto Serif SC" — weights 400,700. Subsets: omit (default) or ['latin']. CJK glyphs will fall back — but wait, do I want next/font to self-host CJK? That would be huge (hundreds of kB split into many unicode-range chunks). next/font actually handles this well — it splits CJK fonts into many ~120KB woff2 chunks with unicode-range. Build time might increase but it works. However if I omit `subsets`, which subsets does next/font load? Default subset for a multi-subset font: I think all of them? No… let me recall from Next.js docs: "subsets: An array of font subsets to use… default is 'latin'". Hmm, I really do recall that the docs said the subset option defaults to "latin" if unspecified. Yes: next/font/google `subsets` default = ["latin"].

So with Noto Serif SC subset latin, CJK falls back to system fonts. On a Mac (which is the dev machine), Songti SC / PingFang are available, and CJK renders fine. Acceptable for a landing page and it keeps build fast. Actually hmm, but the design is Chinese-themed ("cinematic"). System CJK fallback looks fine (PingFang/Hiragino). I could also add "Noto Serif TC"? No, keep it simple.

Wait — actually, maybe I should include CJK properly via `@import` from Google Fonts CSS (link tag in layout) rather than next/font. That would load the full CJK unicode-range set at runtime and always render correctly. But US-001 says "No Inter" (system-ui is fine?). Hmm, system fonts: US rail grotesque — could use a pure system stack too ("Helvetica Neue", Arial…). But next/font Space Grotesk is more characterful and build-safe.

Decision:
- layout.tsx: next/font/google → SpaceGrotesk (variable? Space Grotesk has variable weight axis. Use weights) and NotoSerifSC (weights 400,500,600? Does Noto Serif SC support variable weight 200-900 on Google Fonts? It offers weights 200,300,400,500,600,700,900 as static, and also variable. To be safe use static weights 400 and 700).

Note: next/font/google with NotoSerifSC static weights — fine.

Font classes passed via CSS variables:
- `var(--font-grotesk)` → 'Space Grotesk'
- `var(--font-serif-cn)` → 'Noto Serif SC'

Set fallback stacks in globals.css:
- --us-font: var(--font-grotesk), "Helvetica Neue", Arial, sans-serif;
- --cn-font: var(--font-serif-cn), "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", serif;

Token sets (globals.css, US-002 core):

```css
:root {
  /* ===== AMERICA RAIL TOKENS (US) ===== */
  --us-ink: #05070a;        /* black field */
  --us-paper: #0B1220?? 
```

Let me make it more intentional. America = black, NASA blue, legal pad amber, grotesque typeface, hairline rules.
China = lacquer (deep red-black/glossy black-red), cinnabar (vermilion ~#E34234 / #C3272B), jade (#5C9E7F / #6FA287, pale jade #A8D5BA?), gold (#C9A227 / #D4AF37), night cyan (#1E3F45? "Night cyan" is a dark teal ~ #0E2A2F or brighter #2AA8B5?).

Let me define:

```css
/* ===== AMERICA RAIL (US) — persistent tokens ===== */
--us-field: #060809;        /* black rail field */
--us-black-2: #0D1115;      /* panel black */
--us-nasa: #2C60C4;         /* NASA blue (primary) */  -- hmm, let me choose #3067C8? NASA "worm" blue ~ #2E5A9F? Meatball background is like #1B3F8F. Let's go --us-nasa: #2E5FB8, glow is #7FA6F0.
--us-nasa-glow: #8FB4FF;
--us-legalpad: #F3E29B;     /* legal pad amber (field accent) */
--us-amber: #FFC145;        /* hot amber for text on black */
--us-rule: rgba(255,255,255,0.16);  /* hairline rule */
--us-hair: 1px;
--us-text: #E8EDF4;         /* grotesque text */
--us-dim: #93A1B5;

/* ===== CHINA RAIL (CN) — persistent tokens ===== */
--cn-field: #170B09;        /* lacquer-black red field */  -- hmm, lacquer: glossy deep red like #5C1F1A? "Lacquer" as a field could be near-black with red sheen. Let me make --cn-field: #1A0C0B (lacquer black-red), panel is #241010.
--cn-lacquer: #3E1410;      /* lacquer red-black panel */
--cn-cinnabar: #D64532;     /* cinnabar/vermilion */  -- classic cinnabar ~ #E34234; let's use #DE4A33.
--cn-jade: #7FB69B;         /* jade */  -- maybe #8FCBB0. Pale jade for text.
--cn-gold: #D9B24C;         /* gold */  -- #C8A037 is classic metallic. Let's use #D4AF37 (metallic gold).
--cn-night-cyan: #2FB6C9;   /* night cyan */  -- brighter accent on dark.
--cn-text: #F4E9D8;         /* warm parchment text */
--cn-dim: #B79A86;?  -- maybe #A88F7E.
```

Also crossfade state tokens: page-level "bias" variables that shift with cursor side:
```css
/* ===== CURSOR-X CROSSFADE (spine bias) ===== */
--bias: 0; /* -1 = fully US, +1 = fully CN, set by JS */
```

And implement crossfade in plain CSS on `html[data-rail="us"]` / `data-rail="cn"` that transitions background gradient stops, spine glow color, and cursor color. Use `transition: background 600ms` etc. A small client component (RailBias) with mousemove listener: if e.clientX < window.innerWidth/2 → set document.documentElement.dataset.rail='us' else 'cn'. Also touch/focus fallback defaults to 'us'? Or neutral? The spine is at center. Default data-rail="us"? Let's default to "cn"? Hmm, the page starts with hero in center. The crossfade affects ambient background: a fixed gradient behind everything, with the center spine splitting into US-side color and CN-side color.

Layout structure (desktop dual-rail with central spine):
- Fixed background layer `.rail-bg`: full viewport, split at center: left half US palette gradient (black + subtle NASA blue vertical glow), right half CN palette (lacquer + cinnabar/jade hints). Center spine = 1px gold/white line with glow, plus tick marks.
- Content container `.dual`: grid `grid-template-columns: 1fr minmax(0,auto)? ...`. Actually dual-rail content: two columns flanking the spine. Use CSS grid: `grid-template-columns: 1fr minmax(240px, 360px) 1fr`? Hmm "dual-rail with a central spine" — the spine is a divider. Content sits in each rail: US content on left, CN content on right, spine (with vertical label, tick marks) at center.

Simplest robust approach:
```css
.stage {
  min-height: 100vh; /* or 100dvh for hero */
}
.rail-grid {
  display: grid;
  grid-template-columns: minmax(0,1fr) clamp(56px, 8vw, 140px) minmax(0,1fr);
}
.rail-grid > .rail--us { ... left }
.spine { grid-column: 2; } /* central spine column containing the line */
.rail-grid > .rail--cn { ... right }
```
Spine itself: vertical line down center (absolute inset-y, left 50% translateX(-50%), width:1px background linear-gradient gold/white), with a pulsing node, and vertical text "PERSISTENT // SPINE"? The description says "Persistent vs spine." — I interpret as: rail identity is *persistent* (fixed), the *spine* is a central structural line. Maybe "Persistent" is the left-rail section name and "spine" is center. Let me just implement visually: each rail has a persistent header strip at top (a sticky mini-bar indicating US/CN identity), and the central spine is a continuous vertical line spanning all sections.

For build to pass, I only need HTML + CSS + small client script (for cursor bias). Page content for US-002: I shouldn't implement hero CTA (US-004) or scoreboard (US-005), etc. But the page needs *some* content that demonstrates the dual-rail: e.g., a "system" section showing both rails' tokens (like a design spec sheet — fits perfectly: rail token swatches). This also gives me visual proof that "globals.css defines both rail token sets" and dual-rail layout. But wait — US-004 adds the hero later, so for now I'll have a minimal masthead (title "CHINA × AMERICA — AI RACE"?). Actually the project description: "Cinematic landing of China vs America's AI". For US-002, I'll provide:

- `<html lang="en">`
- Layout with fonts + RailBias client component (sets data-rail on html, also `prefers-reduced-motion` guard? mousemove is not motion itself but transitions are. Add media query to disable transitions for reduced-motion).
- Page:
  - Persistent rail headers: `.rail-us-header` and `.rail-cn-header` sticky? Keep it simple: at top of each rail, a persistent identity plate (e.g., "US — PERSISTENT RAIL" and "CN — 中国").
  - Center spine with vertical label.
  - Section: "VISUAL SYSTEM / 视觉系统" — dual-rail spec sheet listing each rail's tokens with swatches (colors pulled from CSS vars, so they actually reflect the token set). This is diegetic content that proves the system.
  - Maybe a second small section: "HAIRLINE RULES vs JADE PILLARS" text sample? Keep scope tight: one solid section + footer strip. No boot (US-003), no hero CTA (US-004). A minimal top masthead is acceptable (project title, not hero thesis).

Hmm but US-004's acceptance is "hero with CTA on homepage" — that comes later and I shouldn't implement now ("implement only that story"). Having a small masthead title is fine (project identity, not thesis/CTA).

Cursor-X crossfade details:
- `html[data-rail="cn"]` → background bias shifts CN side brighter, US side dimmer. Spine glow color interpolates cinnabar↔gold; cursor accent variable `--cross: var(--cn-gold)` vs `--us-amber`.
- Implementation: fixed `.atmos` div with 2 halves via `linear-gradient(90deg, USside 0 50%, CNside 50% 100%)` — hard-stop gradient. Change `--atm-us-o`, `--atm-cn-o` (opacity layers) per data-rail, transition.
Simpler: two fixed overlay divs (`.atm-us`, `.atm-cn`), each covering 50% width. Base opacity .55/.45; when data-rail="us": us→.85, cn→.2. transition opacity 700ms ease. Plus a spine glow element whose color changes via CSS var `--spine-glow` with transition.
- Also body cursor: crosshair? "Cursor-X" might just name the effect (cursor X-cross). Can set `cursor: crosshair` on `.stage` — nice touch, diegetic (like aiming/compare). Let me add cursor: crosshair on the stage for desktop pointer:fine.

Also `@media (max-width: 1023px)` fallback: single column stack with a horizontal spine instead (mobile not the focus of hero but mustn't look broken). Keep simple: rails stack vertically, spine becomes horizontal rule between them.

Now for files to emit (complete):
1. `src/app/globals.css` — full rewrite with both token sets + layout CSS.
2. `src/app/layout.tsx` — fonts (Space Grotesk, Noto Serif SC), body class, meta.
3. `src/app/page.tsx` — dual-rail page content (server component) importing client RailBias.
4. `src/components/rail-bias.tsx` — 'use client' mousemove handler.
5. `package.json`, `tsconfig.json`, `next.config.mjs` — emit complete versions to guarantee consistency? If on-disk package.json already works and my page only uses react + next, I don't strictly need to re-emit package.json. But the rule: "no placeholders… emit complete files". I can choose which files to emit — only ones that change. US-002 changes: globals.css, layout.tsx (maybe not), page.tsx, + new component. If US-001's layout.tsx already has fonts etc., rewriting is safe as long as it's complete and consistent with package.json (which includes next 14.2.x, react 18). Let me emit layout.tsx in full anyway (I'm not confident about its current font setup. Consistency matters more). And I'll emit package.json in full too to pin a known-working set — per LAST_VERIFY build succeeded with next 14.2.35, react probably ^18. Emitting package.json with `next: "14.2.35"`, `react: "^18.3.1"`, `react-dom: "^18.3.1"`, typescript, @types/react, @types/node, @types/react-dom matches the observed environment. Risk: if npm install re-runs with slightly different lockfile… fine, same major.

Hmm wait: does the harness re-run `npm install` before verify? US-001's verify was `npm install && npm run build`. US-002's verify is just `npm run build`. If package.json changed meaningfully (added deps), no new install → build fails. So: **don't add any new dependencies** in this iteration, and ideally don't change package.json at all. next/font/google ships with Next itself (in 14, it fetches fonts from Google at build time — requires network. US-001 probably already used it, or maybe not!).

Danger: if US-001's layout did *not* use next/font/google (e.g., plain system stack to avoid network), and the build environment has no internet… but LAST_VERIFY shows successful build with 4 pages generated, which is consistent either way. If the sandbox has no network and I introduce next/font/google imports, `next build` will fail fetching font metadata → story fails.

Which is more likely? US-001's acceptance mentioned "No Inter. No fake next/font subsets (Noto Serif SC only allows cyrillic/latin/latin-ext/vietnamese)" — this constraint strongly suggests they actually used next/font/google with Noto Serif SC in the scaffold (otherwise why specify subsets?). The build succeeded. So network is likely available and next/font was used. I'll go with next/font/google: Space Grotesk + Noto Serif SC.

For extra safety on subsets, I'll pass `subsets: ["latin", "latin-ext"]` for Space Grotesk (both valid), and omit `subsets` entirely for Noto Serif SC… wait, is it OK to omit? Default is latin (valid). But hmm, if I want CJK glyphs self-hosted for the CN rail… that pulls in many chunks. next/font handles it (unicode-range). Build time + tens of seconds, fine. But the "only allows cyrillic/latin/latin-ext/vietnamese" constraint suggests passing `subsets: ["cyrillic","latin","latin-ext","vietnamese"]` would be legal, and CJK isn't in the subset list at all — meaning next/font's Noto Serif SC metadata has no CJK "subset" (CJK glyph coverage is in the default file?). Actually on Google Fonts, Noto Serif SC page lists subsets: cyrillic, latin, latin-ext, vietnamese. The CJK glyphs are served via unicode-range-split "latin" file? No… Google Fonts' Noto Serif SC: the `text=` parameter supports Chinese. The CSS delivers ~100+ @font-face blocks with unicode-range covering CJK (these are technically part of the "default" delivery. next/font's subset filter maps to these). If I select subsets ["latin"], does CJK still get self-hosted? next/font builds its own unicode-range files from the woff2 it downloads. For a "latin" subset request, google returns only latin-range files → CJK not self-hosted → system fallback.

Design call: system fallback for CJK is acceptable (PingFang SC on Mac, Noto Sans CJK on others) — but the CN rail aesthetic wants a *serif* CJK. System serifs: "Songti SC" (Mac), "SimSun"/"NSimSun" (Windows). I'll put in fallback chain: `var(--font-serif-cn), "Songti SC", "STSong", "SimSun", serif`. Good enough for the token system story. Keeps build lean and avoids subset traps.

Wait, actually I could also add a `<link>` to Google Fonts CSS for Noto Serif SC (full CJK, unicode-range) in layout's head instead of next/font — runtime fetch, no build risk (if offline at runtime, falls back gracefully). That would reliably render CJK serif. But mixing: does US-001 say "no fake next/font subsets" implying we should use next/font for Noto Serif SC? Not necessarily. Simpler: use next/font for both. CJK via fallback chain. Decided.

Hmm, another consideration: `Space Grotesk` — valid name for next/font/google: `import { Space_Grotesk } from "next/font/google"` → class variable. Subsets available: latin, latin-ext, vietnamese? I think Space Grotesk subsets are latin, latin-ext. Requesting ["latin"] only is safest: `subsets: ["latin"]`. Latin-only covers my English text. Yes, minimal risk: subsets: ["latin"].

Noto Serif SC weights: Google offers 200..900 static. Let me request `weights: ["400", "700"]`. Hmm — does next/font require weights sorted? No. It's fine as string array (must be strings for static fonts). OK.

Also add `display: "swap"`.

Now the CSS architecture (globals.css) — complete rewrite. Let me write it carefully, keeping clean sections:

```css
/* ============================================================
   CHINA × AMERICA — GLOBALS
   US-002: dual-rail visual system
   Left rail  = AMERICA (persistent identity)
   Right rail = CHINA   (persistent identity)
   Center     = SPINE (continuous line, cursor-X crossfade bias)
   ============================================================ */

/* ---------- tokens: shared / meta ---------- */
:root {
  --spine-w: clamp(1px, 0.4vw, 2px);
  --hairline: 1px;
  --maxw: 1760px; /* desktop film hero frame */
  color-scheme: dark;

  /* cursor-X crossfade state (JS flips data-rail on <html>) */
  --bias-us: 1;   /* opacity of US ambient half */
  --bias-cn: 0.55;/* opacity of CN ambient half */
}

/* ---------- tokens: AMERICA rail ---------- */
:root {
  --us-field: #05070a;         /* black field */
  --us-panel: #0b1016;         /* blue-black panel */
  --us-nasa: #2f5fc2;          /* NASA blue */
  --us-nasa-deep: #14336e;     /* NASA blue, deep */
  --us-nasa-glow: #86abff;     /* NASA blue, glow */
  --us-legalpad: #f1de9c;      /* legal pad amber (field) */
  --us-amber: #ffb43a;         /* hot amber (ink on black) */
  --us-ink: #e9eef6;           /* grotesque ink */
  --us-dim: #8b9bb0;           /* dim grotesque */
  --us-rule: rgba(148, 173, 210, 0.22); /* hairline rule */
  --us-font: "Space Grotesk", var(--font-grotesk), ... 
}
```

Hmm wait — layout.tsx's next/font sets CSS vars on html: e.g. `--font-space-grotesk`, `--font-noto-serif-sc`. If I also declare in globals, careful with ordering: layout's `className` on `<html>` sets vars inline — inline styles beat :root. Let me name them: `variable: "--font-grotesk"` and `"--font-cjk-serif"`. And in :root: `--us-type: var(--font-grotesk, "Helvetica Neue", Arial, sans-serif);`.

China tokens:
```css
  --cn-field: #150b0a;        /* lacquer black field */
  --cn-lacquer: #2a120e;      /* lacquer red-black */
  --cn-lacquer-glow: #4d1a12; /* lacquer sheen */
  --cn-cinnabar: #e0492f;     /* cinnabar / vermilion */
  --cn-cinnabar-deep: #8f2418;
  --cn-jade: #7cc3a0;         /* jade */
  --cn-jade-pale: #bfe6d2;    /* pale jade (ink) */
  --cn-gold: #d3a94e;         /* gold */
  --cn-gold-bright: #f2d38a;  /* bright gold */
  --cn-night-cyan: #1f7e8c;   /* night cyan */
  --cn-night-cyan-bright: #59d4e2; /* night cyan, lit */
  --cn-ink: #f3ead9;          /* warm parchment ink */
  --cn-dim: #a78d7b;          /* dim parchment */
  --cn-rule: rgba(211, 169, 78, 0.25); /* gold hairline */
```

Fonts:
```css
  --type-us: var(--font-grotesk), "Helvetica Neue", Helvetica, Arial, sans-serif;
  --type-cn: var(--font-cjk-serif), "Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", serif;
```

Base:
```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--cn-field)?  
```
The body base should be neutral dark (spine crossfade happens via overlay). Let me make body background `#080607` (mix of both blacks), text is default? Set per rail.

`.app-root { min-height: 100vh; position: relative; overflow-x: clip; }`

Ambient halves (fixed):
```css
.atm { position: fixed; top:0; bottom:0; width:50vw; pointer-events:none; z-index:-1? }
.atm--us { left:0; background: radial/linear us colors; opacity: var(--bias-us); transition: opacity .7s ease; }
.atm--cn { right:0; ...; opacity: var(--bias-cn); transition:...; }
```
Use two divs instead of gradient for easy opacity transitions:
- .atm--us background: `linear-gradient(90deg, var(--us-field) 0%, #071022 60%, transparent 100%)`? For a cinematic ambient: deep navy vignette + faint NASA blue glow upper-left. Let me build it:
  `background: linear-gradient(105deg, rgba(20,51,110,.28), transparent 45%), radial-gradient(90% 70% at 12% 8%, rgba(47,95,194,.20), transparent 60%), linear-gradient(180deg, var(--us-field) 0%, #04050a 100%);`
- .atm--cn: `radial-gradient(90% 70% at 88% 12%, rgba(224,73,47,.16), transparent 60%), radial-gradient(70% 55% at 82% 90%, rgba(31,126,140,.18), transparent 65%), linear-gradient(180deg, var(--cn-field) 0%, #120706 100%);`

Spine (fixed, z-index above atm but below content? Spine should read through the sections — make it fixed with a subtle mask, z-index 1. Content sections have transparent background so the spine is visible behind? If content text sits on top, a 1px line in center would cross the spec table… Design: spine runs full height. Rail content is offset from center (rail grids leave a central gap column). Put spine at fixed z-index 0, content above with the gap. Actually simplest: stage grid's central column is where spine sits (in-flow), and add a fixed full-height line at 50% behind everything for continuity across the page? Both: visual center line fixed `.spine-line { position: fixed; top:0; bottom:0; left:50%; width:var(--spine-w); transform:translateX(-50%); background: linear-gradient(180deg, transparent, var(--spine-a) 12%, var(--spine-b) 88%, transparent); opacity:.9; z-index:0 }` plus per-section spine nodes (in-flow dots at top of central column). Content z-index:1, positioned relative.

Crossfade CSS:
```css
html[data-rail="us"] { --bias-us: 1; --bias-cn: .45; }
html[data-rail="cn"] { --bias-us: .45; --bias-cn: 1; }
html[data-rail="us"] .spine-line { --spine-a: var(--us-nasa-glow); --spine-b: var(--us-amber); }
html[data-rail="cn"] .spine-line { --spine-a: var(--cn-gold-bright); --spine-b: var(--cn-cinnabar); }
.spine-line { --spine-a: rgba(255,255,255,.6); --spine-b: rgba(255,255,255,.3); transition: background .7s; } 
```
Hmm transitioning a custom property doesn't animate unless registered with @property. Transitioning `background` when only the var changes: background is computed from the vars, so changing the var triggers a background value change → `transition: background .7s` will animate (background as shorthand is interpolable if same gradient structure). Yes, transition applies to the used value of `background` when var changes… actually transitions fire on computed style changes, and custom property changes propagate. `transition: background 700ms` on element will animate when the var it uses changes. Yes, this works (common pattern).

Also crossfade cursor accent: `--cross-ink` variable used for link underline/cursor tick.
```css
html[data-rail="us"] { --cross-ink: var(--us-nasa-glow); }
html[data-rail="cn"] { --cross-ink: var(--cn-night-cyan-bright); }
```

Rail grid layout (desktop film hero frame):
```css
.stage {
  position: relative;
  z-index: 1;
  width: min(100%, var(--maxw));
  margin-inline: auto;
}

.rail-grid {
  display: grid;
  grid-template-columns: minmax(0,1fr) clamp(64px, 9vw, 152px) minmax(0,1fr);
  gap: clamp(18px, 2.4vw, 40px) var(--spine-gap)?;
}
```
Gap around spine column handles clearance.

Rail identity plates (persistent): sticky? "Persistent vs spine" — let me implement as sticky rail headers:
```css
.rail { position: relative; display:flex; flex-direction:column; gap:...; }
.rail-plate {
  position: sticky; top: 16px; z-index: 5;
  border: var(--hairline) solid ...;
}
```
Left rail plate: black with NASA blue edge, text "US // PERSISTENT RAIL" + "AMERICA". Right: lacquer with gold edge, "CN // 持续?" Let's use Chinese labels too: 美国 vs 中国? The plate: "美国 · AMERICA" hmm. Actually the rail identity is by flag side: left = US, right = CN (reading L→R is "US × CN"). Good.

Section: token spec sheet — each rail lists its own palette with swatches + type specimen:
- US side cards: swatch grid (black, nasa, legalpad, amber), type specimen "Grotesque / hairline rules" text with 1px rule between rows.
- CN side cards: swatches (lacquer, cinnabar, jade, gold, night-cyan), type specimen in 中文: "漆 · 朱 · 玉 · 金" and a CJK line.

This content directly demonstrates "globals.css defines both rail token sets" visually and the dual-rail layout.

Also a spine top node: a circular "X" marker (cursor-X):
```css
.spine-node { width: 14px; height:14px; border-radius:50%; border:1px solid var(--cross-ink); position:relative; }
.spine-node::before/::after → crosshair tick (X) 
```
A center X mark = "Cursor-X".

Masthead at top (not hero): full-width, between rails: a horizontal bar with project title "CHINA × AMERICA" split by spine: left part in grotesque, right part mirrored in CJK "中 × 美". Keep minimal since US-004 will add the real hero. Hmm — risk that the grader thinks a masthead title is enough for "hero" later? No, US-004 will add it. Fine.

Footer strip: colophon-ish line? US-008 handles the colophon. Skip for now or a small footer with "US-002 · DUAL-RAIL SYSTEM". Let me include a thin bottom bar labeled "SYSTEM: PERSISTENT RAILS + SPINE — CROSSFADE WITH CURSOR-X". Good.

Mobile fallback (<1024px): grid to single column: order US rail, spine horizontal divider (rotate the fixed line? just hide .spine-line and show a `.spine-h` element?), CN rail. Keep simple:
```css
@media (max-width: 1023px) {
  .rail-grid { grid-template-columns: 1fr; }
  .spine-col { min-height: clamp(48px, 10vw, 96px); position:relative; }
  .spine-line { display:none; }
  .rail-grid::after?  
```
Let me structure the spine column as an element `.spine-col` that contains a `.spine-ticks` (repeating ticks). On mobile it becomes horizontal with `writing-mode: vertical-rl`? Just make spine-col a flex centered column with ticks. On mobile it becomes a row with rotated ticks (a ::before with width:100% height:1px gradient line). Manageable.

Now the client component `src/components/rail-bias.tsx`:
```tsx
"use client";

import { useEffect } from "react";

type Rail = "us" | "cn";

export default function RailBias() {
  useEffect(() => {
    const root = document.documentElement;

    const setRail = (rail: Rail) => {
      if (root.dataset.rail !== rail) root.dataset.rail = rail;
    };

    // Default: center (no bias) until first pointer move. Bias toward US at init? Let's default 'us'?
    setRail("us"); // hmm or leave unset and define neutral in CSS. Let's keep CSS default as neutral, JS sets on move.

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // don't hijack scroll on touch
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX;
        setRail(x < window.innerWidth * 0.5 ? "us" : "cn");
      });
    };

    const onKey = (e: KeyboardEvent) => {
      // keyboard users: arrow keys bias the rail (a11y path for cursor-X)
      if (e.key === "ArrowLeft") setRail("us");
      if (e.key === "ArrowRight") setRail("cn");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
```
Wait: default dataset.rail unset → CSS `:root { --bias-us:.75; --bias-cn:.7 }`? Neutral baseline. Good.

Note: e.key for arrow keys — fine.

Also respect `prefers-reduced-motion`: disable transition in media query:
```css
@media (prefers-reduced-motion: reduce) {
  .atm--us, .atm--cn, .spine-line, [class*="fade"] { transition: none !important; }
}
```

layout.tsx (complete):
```tsx
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const cjkSerif = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],   // legal per Google metadata. CJK glyph coverage falls back to Songti/SimSun/serif
  variable: "--font-cjk-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "China × America — The AI Race, Filmed",
  description: "A dual-rail landing...",
};

export const viewport: Viewport = { themeColor: "#0a0708" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${cjkSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Wait: Space_Grotesk weight is "400","500","700" — Space Grotesk supports 300-700 variable. Static weights available: 300,400,500,600,700. OK. Noto Serif SC: 200-900 available (400,700 fine).

TS: `React.ReactNode` requires `import type { ReactNode } from "react"` or use the global React namespace — in Next TS with `"jsx": "preserve"` and @types/react, `React.ReactNode` requires React in scope? With `"jsx": "preserve"` and @types/react, the `React` UMD global reference works in .tsx without importing? TypeScript only allows `React.ReactNode` if React is imported or a UMD global exists. Does @types/react declare `export as namespace React`? Yes, and that makes it a UMD global usable in type positions without import (UMD globals only usable in modules if you import? Rule: UMD global access within a module requires import. But *type-only* usage is allowed!). Yes: "You can use UMD globals in type positions without import". Correct — `const x: React.ReactNode` compiles fine within a module without importing react. Safe either way; I'll import type ReactNode explicitly to be safer:
```tsx
import type { ReactNode } from "react";
... function RootLayout({ children }: { children: ReactNode })
```

page.tsx (server component) — dual-rail content. Let me draft the markup:

```tsx
import RailBias from "@/components/rail-bias"; // or relative "../components/rail-bias"
```
tsconfig paths — US-001's tsconfig may or may not define `@/*`. Not sure! Use relative import `../components/rail-bias` — always works. Yes, relative.

Markup plan:
```tsx
export default function Home() {
  return (
    <div className="app-root">
      <RailBias />
      {/* ambient halves */}
      <div className="atm atm--us" aria-hidden="true" />
      <div className="atm atm--cn" aria-hidden="true" />
      {/* fixed center spine */}
      <div className="spine-line" aria-hidden="true">
        <span className="spine-node" />  ← hmm, node position? Let me put the X node as a separate fixed element near top: .spine-x { position: fixed; top: 18px? } 
      </div>
```

Let me reorganize fixed elements:
- `.atm--us`, `.atm--cn` (fixed halves)
- `.spine-line` (fixed vertical gradient line at 50%)
- `.spine-x` (fixed, top: calc(var(--plate-h)/2)? simpler: position absolute inside stage's spine column). Let me put the X node in-flow at top of each grid's central column.

Stage content:
```tsx
<main className="stage">
  {/* masthead bar */}
  <header className="masthead rail-grid align-center"> 
    ... hmm, masthead spans all three columns: US title left, spine tick center, CN title right.
  </header>

  <section className="rail-grid spec" aria-labelledby="spec-title">
    {/* US rail */}
    <div className="rail rail--us">
      <div className="rail-plate plate--us" role="?"> 
        <span className="plate-code">US</span>
        <div><strong>PERSISTENT RAIL</strong><small>AMERICA · 美国视角?</small></div>
      </div>
      ... spec card
    </div>

    {/* spine column */}
    <div className="spine-col" aria-hidden? no, has label> 
      <span className="spine-node spine-x">X mark</span>
      <p className="spine-label" aria-hidden? >SPINE · 脊柱?</p>
      <div className="spine-ticks" />
    </div>

    {/* CN rail */}
    <div className="rail rail--cn"> ... </div>
  </section>

  <footer className="footbar rail-grid">...system note...</footer>
</main>
```

Masthead: keep super minimal to not preempt US-004's hero. Actually — maybe I'll skip a separate masthead and fold the title into each rail-plate: US plate: big "AMERICA" + sub "UNITED STATES · PERSISTENT RAIL". CN plate: big "中国 AMERICA? no — 中国" + sub "CHINA · PERSISTENT RAIL". Then center spine top has an X node with vertical label "SPINE × SPINE"? Project title: put in the spine? A small top-center block above the grid: "CHINA × AMERICA — AI RACE" centered spanning across? I think a slim top strip is fine and makes the page self-explanatory:

```html
<header class="topbar">
  <span class="topbar-mid">CHINA × AMERICA</span> — hmm, centered text in fixed center: use grid 1fr auto 1fr with side dots.
</header>
```

OK let me just commit to the full CSS now (I'll write it into globals.css). I'll also handle "hairline rules": `.rule { height:1px; background: var(--us-rule); }` US side uses hairline rule separators between token rows. CN side: gold hairline `--cn-rule`. Also "hairline" for US plate border.

Type scale: 
- Plate title: clamp(28px, 3vw, 44px) — US in grotesque 700 uppercase letter-spacing .08em. CN: serif-cjk 700, size slightly larger? Keep same grid alignment.
- Spec rows: token name 13px caps + hex value mono? Grotesque works for hex (or ui-monospace). Use `font-family: var(--type-us)` with tabular? Just use grotesque for hex, fine. Swatch: 40px square with inner border.

Swatches US: field (#var), nasa, legalpad, amber. CN: lacquer, cinnabar, jade, gold, night-cyan. Include a tiny CJK character on each CN swatch label? Cute: 漆 (lacquer), 朱 (cinnabar/vermilion — actually cinnabar is 丹 or 朱砂. Cinnabar = cinnabar mineral 辰砂, color is vermilion 朱红), 玉 (jade), 金 (gold), 夜青 (night cyan). US: field, NASA, LEGAL-PAD, AMBER.

Type specimen blocks:
US: 
```
GROTESQUE TYPE
Space Grotesk — black, blue rules, amber marks.
+ hairline rule demo: 3 rows separated by var(--us-rule)
```
CN: 
```
宋体衬线 / Noto Serif SC  (fallback Songti)
漆面为底，朱砂为章，玉与金为其光。
```

Footer strip: "CURSOR-X CROSSFADE ACTIVE — MOVE YOUR POINTER ACROSS THE SPINE · 指针越过脊柱即换轨". Also US-002 tag.

Edge cases: `overflow-x: clip` on app-root to prevent scrollbars from fixed halves (fixed doesn't create scroll). body margin 0.

z-index: atm z 0? fixed at z-index:-1 works (creates a layer below body background if not on root… fine). Use z-index: 0 for atm, spine-line z-index: 1? But content main is relative with z-index 2. Wait, spine should be *visible* between rails (rails have transparent bg) → put spine-line behind content with z-index 1 and main at z 2. Rail cards have panel bg that would cover the spine, but central column is a gap → line shows through.

Rail plate sticky: `position: sticky; top: 14px;` — plates stick while section scrolls. Sections are short, page likely fits in one viewport on desktop 1440×~900 — fine, still persistent-ish.

Also `body { font-family: var(--type-us); }` default is US grotesque. `.rail--cn { font-family: var(--type-cn); }`? Hmm — CN rail's *identity* type is serif CJK. But the CN rail also has English sub text… Let me set base font for CN rail to CJK serif stack. Latin in that stack falls through to the first available (does Noto Serif SC self-host latin? if I set next/font subsets ["latin"], var(--font-cjk-serif) covers Latin glyphs in a serif). Good: --type-cn = var(--font-cjk-serif), "Songti SC", ... serif → Latin renders in Noto Serif (serif) — elegant.

For US: --type-us = var(--font-grotesk), "Helvetica Neue", Arial, sans-serif.

Selection color: `::selection { background: var(--us-amber); color: #0a0c10; }` fun.

Focus visible: `:focus-visible { outline: 2px solid var(--cross-ink); outline-offset: 3px; }`.

Scrollbar? Skip.

OK the full text of globals.css — let me write it out, thoroughly but tight (~350-450 lines). Ensuring no `@apply` (that's tailwind; we're not using it — US-001 scaffold: did it include Tailwind? Build output "Linting and checking validity of types" is normal. If US-001's globals.css had `@tailwind` directives, they'd only break build if I rewrite globals without tailwind — removing @tailwind is fine either way (no more directive = no postcss processing needed). But wait: if package.json includes tailwindcss + a postcss.config with tailwind plugin, and next.config expects it — removing @tailwind lines is fine (the plugin just processes css with no tailwind directives → outputs as-is). If there was no tailwind, also fine. Either way my globals rewrite is safe. But if some component imported a "globals.css" with tailwind classes… my page rewrite eliminates those. OK.

Should I emit package.json? If US-001's had tailwind deps, leaving them is fine. I'll *not* emit package.json — no need to change for this story, and emitting risks mismatch (e.g., lockfile version drift forcing reinstall… verify won't install anyway). Rule says emit complete files for what I implement. I only emit: globals.css, layout.tsx, page.tsx, components/rail-bias.tsx.

But risk: US-001's layout.tsx might have been `<html lang="en"><body>{children}</body>` without fonts, and my page relies on the font variables I set in *my* layout — consistent since I'm emitting both. Good. And no need to emit next.config/tsconfig (imports are relative, TS strict is fine).

One more check — next/font/google in Next 14.2: API is `import { Space_Grotesk, Noto_Serif_SC } from "next/font/google"`. Weight prop for static: `weight: ["400","500","700"]`. Subsets validation happens at build time with network fetch. If the sandbox blocks fonts.googleapis.com… US-001's PRD note about Noto Serif SC subsets strongly implies they've already successfully used next/font in this environment. I'll proceed.

Also `adjustFontFallback` defaults true — fine.

Viewport/metadata: keep simple, no `export const dynamic`. Static prerender is fine (LAST_VERIFY showed static /).

TypeScript strictness: pointermove listener type — `window.addEventListener("pointermove", onMove)` with `onMove = (e: PointerEvent) => void` — fine.

For rail-bias, I also want to set initial bias on mount? On desktop first paint: no pointer move yet → neutral. Let me add `matchMedia("(pointer:fine)")` → if fine pointer and not touch, leave it neutral. JS sets on first move anyway. OK.

Add `document.documentElement.dataset.rail` default: set "us" on mount? If user has no pointer (headless verify), neutral = fine, and looks intentional.

CSS detail — writing the whole file:

```css
/* ==========================================================================
   CHINA × AMERICA · globals.css
   US-002 — Dual-rail visual system

   LEFT RAIL  AMERICA · persistent
     black / NASA blue / legal-pad amber / grotesque type / hairline rules
   RIGHT RAIL CHINA · persistent  
     lacquer / cinnabar / jade / gold / night cyan
   CENTER     SPINE · continuous vertical line at 50vw
   CURSOR-X   crossing the spine crossfades ambient bias (data-rail on <html>)
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. RAIL TOKEN SETS
   -------------------------------------------------------------------------- */

:root {
  /* shared geometry */
  --hairline: 1px;
  --stage-maxw: 1760px;
  --spine-w: clamp(1px, 0.35vw, 2px);
  --plate-sticky-top: 16px;

  color-scheme: dark;

  /* neutral cursor-X state (until pointer crosses the spine) */
  --bias-us: 0.8;
  --bias-cn: 0.62;
  --cross-ink: rgba(244, 234, 217, 0.85);
}

/* ---- AMERICA rail tokens (US-002) ---- */
:root {
  --us-field:        #05070a; /* black field            */
  --us-panel:        #0b1016; /* blue-black panel       */
  --us-panel-edge:   #1a2433; /* panel hairline         */
  --us-nasa:         #2f5fc2; /* NASA blue              */
  --us-nasa-deep:    #14306b; /* NASA blue, deep        */
  --us-nasa-glow:    #8fb1ff; /* NASA blue, glow        */
  --us-legalpad:     #f1dd9a; /* legal-pad amber field  */
  --us-amber:        #ffb43a; /* hot amber ink          */
  --us-ink:          #e9eef6; /* grotesque ink          */
  --us-dim:          #8b9bb0; /* dim grotesque          */
  --us-rule:         rgba(143, 168, 205, 0.22); /* hairline rule */
}

/* ---- CHINA rail tokens (US-002) ---- */
:root {
  --cn-field:        #170b09; /* lacquer black field    */
  --cn-panel:        #231009;?? 
```

Hmm lacquer panel: glossy deep maroon #2a1310. Panel edge gold-ish rgba(211,169,78,.2).

```
  --cn-lacquer:      #3b160f; /* lacquer red-black      */
  --cn-lacquer-hi:   #5c241a; /* lacquer sheen          */
  --cn-cinnabar:     #de4a2f; /* cinnabar / vermilion   */
  --cn-cinnabar-deep:#8c241a; /* cinnabar, deep         */
  --cn-jade:         #7cc3a0; /* jade                   */
  --cn-jade-pale:    #c8ead7; /* pale jade ink          */
  --cn-gold:         #d2a94f; /* gold                   */
  --cn-gold-hi:      #f0d48d; /* gold, bright           */
  --cn-night-cyan:   #1f7e8c; /* night cyan             */
  --cn-night-cyan-hi:#63d6e4; /* night cyan, lit        */
  --cn-ink:          #f3e9d7; /* parchment ink          */
  --cn-dim:          #a5896f; /* dim parchment          */
  --cn-rule:         rgba(210, 169, 79, 0.28); /* gold hairline */
}

/* type stacks (font vars injected by next/font in layout.tsx) */
:root {
  --type-us: var(--font-grotesk), "Helvetica Neue", Helvetica, Arial, sans-serif;
  --type-cn: var(--font-cjk-serif), "Songti SC", "STSong", "Noto Serif CJK SC", "SimSun", serif;
}
```

1. Crossfade state:
```css
html[data-rail="us"] {
  --bias-us: 1;
  --bias-cn: 0.42;
  --cross-ink: var(--us-nasa-glow);
}
html[data-rail="cn"] {
  --bias-us: 0.42;
  --bias-cn: 1;
  --cross-ink: var(--cn-night-cyan-hi);
}
```

2. Base reset and body:
```css
*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: #070506;
  color: var(--us-ink);
  font-family: var(--type-us);
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--us-amber); color: #120b02; }
.rail--cn ::selection? — can't easily scope. Skip: keep global amber selection… actually make it cross-ink neutral? Keep amber, fine.

:focus-visible { outline: 2px solid var(--cross-ink); outline-offset: 3px; border-radius: 2px; }
```

3. Fixed ambience:
```css
.atm {
  position: fixed; top: 0; bottom: 0; width: 51vw;
  pointer-events: none; z-index: 0;
}
.atm--us {
  left: -1vw;
  background:
    radial-gradient(80% 65% at 14% 6%, rgba(47, 95, 194, 0.22), transparent 62%),
    radial-gradient(55% 45% at 4% 96%, rgba(20, 48, 107, 0.5), transparent 70%),
    linear-gradient(180deg, var(--us-field) 0%, #03040a?? hmm end color) 
```
Let me pick: linear-gradient(180deg, #05070a 0%, #04060c 100%)? Slight blue at bottom. And opacity var(--bias-us); transition: opacity 700ms ease;

atm--cn right:-1vw; background is radial cinnabar top-right (rgba(222,74,47,.18)), radial night-cyan bottom-right (rgba(31,126,140,.2)), base linear-gradient(180deg,#170b09,#150806); opacity var(--bias-cn).

The 51vw width overlapping at center under the spine (spine covers seam) — good, avoids hairline gap.

4. Spine:
```css
.spine-line {
  position: fixed; top: 0; bottom: 0; left: 50%;
  width: var(--spine-w); transform: translateX(-50%);
  background: linear-gradient(180deg, transparent 0%, var(--spine-a) 14%, var(--spine-b) 86%, transparent 100%);
  --spine-a: rgba(255,255,255,.7); --spine-b: rgba(255,255,255,.28);
  z-index: 1; pointer-events: none;
}
html[data-rail="us"] .spine-line { --spine-a: var(--us-nasa-glow); --spine-b: rgba(47,95,194,.35); }
html[data-rail="cn"] .spine-line { --spine-a: var(--cn-gold-hi);   --spine-b: rgba(222,74,47,.4); }
.spine-line { transition: background 700ms ease; } — can't merge with other rules. Let me put transition in the base block.
```
Add a soft glow via box-shadow: `box-shadow: 0 0 18px rgba(255,255,255,.06);` skip dynamic.

spine-x (in-flow X node at top of central column):
```css
.spine-x {
  width: 34px; height: 34px; border-radius: 50%;
  border: var(--hairline) solid var(--cross-ink);
  display: grid; place-items: center;
  position: relative; background: #0a0708cc? keep transparent; 
  transition: border-color .5s ease, color .5s ease;
  color: var(--cross-ink);
}
.spine-x::before, .spine-x::after {
  content: ""; position: absolute; width: 18px; height: var(--hairline);
  background: currentColor; left: 50%; top: 50%;
}
.spine-x::before { transform: translate(-50%,-50%) rotate(45deg); }
.spine-x::after  { transform: translate(-50%,-50%) rotate(-45deg); }
```
An X mark. 

spine-label vertical text:
```css
.spine-label {
  writing-mode: vertical-rl; letter-spacing: .42em; text-transform: uppercase;
  font-size: 10px; color: var(--cross-ink); opacity:.85; margin: 14px auto 0;
  transition: color .5s ease;
}
```

spine-ticks: repeating hairlines running down center column:
```css
.spine-ticks { flex: 1; min-height: 40px; width: var(--spine-w); margin: 18px auto 24px;
  background: repeating-linear-gradient(180deg, var(--cross-ink) 0 6px, transparent 6px 18px); opacity:.5; transition: background .5s ease; }
```

5. Stage & rail grid:
```css
.app-root { position: relative; min-height: 100vh; overflow-x: clip; }

.stage {
  position: relative; z-index: 2;
  width: min(100% - 48px??, var(--stage-maxw)); hmm padding: 
  width: min(var(--stage-maxw), 100%);
  margin-inline: auto;
  padding: clamp(20px, 3vh, 40px) clamp(20px, 3.4vw, 56px) clamp(28px, 5vh, 56px);
  display: flex; flex-direction: column; gap: clamp(28px, 5vh, 64px);
}

.rail-grid { display: grid; grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr); column-gap: clamp(20px, 3vw, 56px); align-items: stretch; }
```

Top bar (masthead strip): 
```css
.topbar { grid spans 3 cols with rail-grid; align-items:center; padding-bottom: clamp(16px,2.4vh,28px); border-bottom? nope }
.topbar-us { justify-self: start; } text "AMERICA / 美国·?" 
```
Let me simplify topbar:
```html
<div class="topbar rail-grid">
  <span class="tag tag--us">◼ US RAIL — PERSISTENT</span>
  <div class="topbar-spine"><span class="brand">CHINA × AMERICA</span>? 
```
Hmm — brand in center top: "中美 · CHINA × AMERICA" small caps centered, with hairlines flanking. OK:
```css
.topbar { align-items: center; }
.topbar-spine { display:flex; flex-direction: column; align-items:center; gap:8px; }
.brand { font-size: 11px; letter-spacing:.34em; text-transform: uppercase; color:#fff8; display:flex; align-items:center; gap:12px; }
.brand::before, .brand::after { content:""; width: clamp(24px,3vw,56px); height: var(--hairline); background: var(--cross-ink); opacity:.5; transition: background .5s; }
```

Tag plates (persistent rail plates) sticky:
```css
.rail { display: flex; flex-direction: column; gap: clamp(16px, 2.4vh, 28px); min-width: 0; }

.rail-plate {
  position: sticky; top: var(--plate-sticky-top); z-index: 3;
  border-block-start? full hairline frame;
}
.plate--us { background: linear-gradient(180deg, var(--us-panel), #0a0e14); border: var(--hairline) solid var(--us-panel-edge); }
.plate--us .plate-tag { color: var(--us-nasa-glow); border-color...}
.plate--cn { background: linear-gradient(180deg, var(--cn-lacquer), #241009); border: var(--hairline) solid rgba(210,169,79,.28); }

.rail-plate { padding: 14px 16px 16px; display:flex; align-items: baseline?? column; gap: 6px; }
.plate-row { display:flex; justify-content: space-between; font-size: 10px; letter-spacing:.3em; text-transform: uppercase; }
.plate--us .plate-row { color: var(--us-dim); }
.plate-title--us? 
```

Let me define plate contents:
US plate:
- row1: [ "US · 美国" ] ... [ "PERSISTENT RAIL 01" ]
- title: AMERICA (grotesque 700, clamp(26px,2.6vw,40px), letter-spacing .06em)
- sub: "BLACK · NASA BLUE · LEGAL-PAD AMBER — GROTESQUE, HAIRLINE RULES" small dim.

CN plate:
- row1: [ "CN · 中国" ] ... [ "持续轨 PERSISTENT RAIL 02" ]
- title: 中国 CHINA (serif-cjk)
- sub: "漆 LACQUER · 朱 CINNABAR · 玉 JADE · 金 GOLD · NIGHT CYAN"

6. Spec cards:
```css
.spec-card { border: var(--hairline) solid transparent; padding: clamp(14px,1.4vw,20px); display:flex; flex-direction:column; gap: 14px; }
.spec-card--us { background: color-mix(in srgb, var(--us-panel) 82%, transparent); border-color: var(--us-panel-edge); }
```
color-mix — supported in modern browsers. Build-safe (it's just CSS, no build-time parsing issue; Next doesn't compile CSS, passes through). Fine but let me avoid fancy: use rgba directly. US card bg: #0a0f15e6 (hex alpha). CN card bg: #22100be6.

Token rows (hairline-separated for US — "hairline rules" requirement):
```css
.tok { display: grid; grid-template-columns: 44px minmax(0,1fr) auto; gap: 12px; align-items:center; padding-block: 10px; }
.tok + .tok { border-top: var(--hairline) solid var(--row-rule); }
.spec-card--us { --row-rule: var(--us-rule); color: var(--us-ink); }
.spec-card--cn { --row-rule: var(--cn-rule); color: var(--cn-ink); }
.swatch { width: 44px; height: 44px; border: var(--hairline) solid rgba(255,255,255,.18); background: var(--sw); position: relative; }
.swatch::after { content:""; position:absolute; inset:auto -4px?? no keep simple }
.tok-name { font-size: 12px; letter-spacing:.18em; text-transform: uppercase; }
.spec-card--cn .tok-name { letter-spacing:.12em; }
.tok-cjk { display:block; font-size: 13px; opacity:.85; margin-top:2px; letter-spacing:.2em }
.tok-hex { font-size: 11px; opacity:.75; letter-spacing:.08em; }
```
Swatch background is set via inline style `style={{ ["--sw" as string]: "var(--us-nasa)" }}`? In TSX, inline style with CSS variable: `style={{ "--sw": "var(--us-nasa)" } as React.CSSProperties}`. Works. Or simpler: give each swatch a class `.sw-nasa { background: var(--us-nasa); }` etc — cleaner, no TS cast. Let me use modifier classes: sw-us-field, sw-nasa, sw-legalpad, sw-amber, sw-lacquer, sw-cinnabar, sw-jade, sw-gold, sw-nightcyan.

US type specimen:
```css
.specimen { border-top? padding-top; display flex column gap 8px }
.spec-label { font-size:10px; letter-spacing:.3em; text-transform:uppercase; opacity:.7 }
.specimen--us .big { font-family: var(--type-us); font-weight: 700; font-size: clamp(18px, 1.6vw, 24px); letter-spacing:.02em; }
.hairline-row { display:flex; flex-direction:column; gap:0; margin-top:6px }
.hairline-row span { padding-block: 7px; font-size: 12.5px; color: var(--us-dim); letter-spacing:.04em }
.hairline-row span + span { border-top: var(--hairline) solid var(--us-rule); }
```
Rows: "BLACK FIELD / #05070A"? Better specimen text lines: 
- "GROTESQUE HEADLINE"
- "Hairline rules, 1px — never 2."
- "Amber marks the legal line: ▮" with an amber square? Use `.mark--amber { background: var(--us-legalpad); width:10px;...}`. Keep text simple: line 3 in amber color `style` class `.on-amber { color: var(--us-amber); }`.

CN specimen:
```css
.specimen--cn .big { font-family: var(--type-cn); font-weight: 700; font-size: clamp(18px,1.7vw,26px); }
CN text: big "漆 · 朱 · 玉 · 金 · 夜" ; lines separated by gold hairline:
- "Lacquer is the ground; cinnabar is the seal."
- "Jade and gold carry the light. 金为光。"
- night-cyan line in color: "NIGHT CYAN · 夜青 #1F7E8C"
```

Card header row: "R-01 / TOKEN SET — AMERICA"? Let me name it: US card header: "TOKEN SET · R-01" + right "AMERICA". CN: "令牌组 · R-02"? Mix: "TOKEN SET · R-02 / 令牌". Keep bilingual-light.

7. Footer bar:
```css
.footbar { border-top? no — foot bar: rail-grid align-center; font-size 10.5px; letter-spacing .28em; text-transform uppercase; color: #ffffff73 }
.foot-us { justify-self:start } .foot-cn { justify-self:end; color: var(--cn-dim)?? maybe gold-ish }
.foot-mid { text-align:center; color: var(--cross-ink); transition: color .5s }
```
Foot text: US side: "PERSISTENT RAIL · LEFT". Center: "CURSOR-X — CROSS THE SPINE TO CROSSFADE / 越过脊柱即换轨". CN side: "右 · PERSISTENT RAIL".

8. Responsive (below 1024):
```css
@media (max-width: 1023px) {
  .spine-line { display: none; }
  .rail-grid { grid-template-columns: minmax(0,1fr); row-gap: clamp(24px,5vh,40px); }
  .spine-col { flex-direction: row; align-items:center; justify-content:center; gap:16px; min-height:auto; padding-block: 8px; }
  .spine-label { writing-mode: horizontal-tb; margin:0 auto?? order } 
  .spine-ticks { width:auto; height: var(--spine-w)?? horizontal ticks: background repeating-linear-gradient(90deg,...); min-width: clamp(48px,16vw,120px); flex: 0 1 auto }
```
Simplify mobile spine-col: `<div class="spine-col"><span class="spine-x"/><p class="spine-label">SPINE</p><div class="spine-ticks"/></div>` desktop: flex column center. Mobile: row: [ticks horizontal][X][label]. Use order property to reorder flex.

Hmm, `.spine-col` is the central grid item in each rail-grid (topbar? no—). Wait — topbar also uses rail-grid with middle column = brand. Spec section's spine-col is a separate element in the same grid: each `.rail-grid` needs its central child. So structure per rail-grid instance:
- topbar: [tagUs, brandMid, tagCn] — 3 children ✓
- spec: [rail--us, spine-col, rail--cn] — 3 children ✓
- footbar: [footUs, footMid, footCn] — 3 children ✓

But then the spine-X node only appears once (in spec). Fine: one persistent-ish X + a fixed line. Actually, to make the spine continuous visually, add small `.spine-dot` (6px circle) in topbar center below brand and footbar center above text. Simple: `.spine-dot { width:6px;height:6px;border-radius:50%;background:var(--cross-ink); box-shadow? transition }`.

Also rail-grid `column-gap` — central column width clamp(72px,9vw,148px) plus gap. At 1440: column ~129px + gap 2×~43px → side rails each ~(1440 - padding 2×56? stage width min(1760,100%)-padding) let me compute: 1440 - 2*56 = 1328 content. Central column 9vw=129.6, gap 3vw×2≈86 → rail each (1328-129.6-86)/2 ≈ 556px.

At 1920: content = 1760-… stage-maxw 1760, padding 2×56 → inner 1648. Central column capped at 148, gap capped at 56×2 → rail (1648-148-112)/2=694px. Nice film hero proportions.

9. Reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  .atm--us, .atm--cn, .spine-line, .spine-x, .spine-label, .foot-mid { transition: none !important; }
}
```

10. Print? Skip.

Also `.rail--cn` base font: `font-family: var(--type-cn);` and its dim text color. English sub lines within CN rail will render in Noto Serif's latin — OK aesthetically (serif).

Wait, one concern: `--font-cjk-serif` with subsets ["latin"] — next/font still self-hosts the Latin file (~30-60KB). Fine.

Also Noto Serif SC `weight` — must be string array: ["400","700"].

Space_Grotesk weight: available are [300..700]. Use ["400","500","700"].

Both `display: "swap"`.

Now page.tsx content — full JSX. Let me write out the tokens list as data arrays and map (keeps code DRY, still complete):

```tsx
const US_TOKENS = [
  { cjk: null, name: "FIELD / BLACK", hex: "#05070A", swatch: "sw-us-field" },
  { cjk: null, name: "NASA BLUE", hex: "#2F5FC2", swatch: "sw-nasa" },
  { cjk: null, name: "LEGAL-PAD AMBER", hex: "#F1DD9A", swatch: "sw-legalpad" },
  { cjk: null, name: "HOT AMBER INK", hex: "#FFB43A", swatch: "sw-amber" },
];

const CN_TOKENS = [
  { cjk: "漆", name: "LACQUER", hex: "#3B160F", swatch: "sw-lacquer" },
  { cjk: "朱", name: "CINNABAR", hex: "#DE4A2F", swatch: "sw-cinnabar" },
  { cjk: "玉", name: "JADE", hex: "#7CC3A0", swatch: "sw-jade" },
  { cjk: "金", name: "GOLD", hex: "#D2A94F", swatch: "sw-gold" },
  { cjk: "夜青", name: "NIGHT CYAN", hex: "#1F7E8C", swatch: "sw-nightcyan" },
];
```

JSX skeleton (page is server component. Data arrays are local — fine):

```tsx
import RailBias from "../components/rail-bias";

export default function Home() {
  return (
    <div className="app-root">
      <RailBias />

      {/* fixed ambience — US half / CN half / spine */}
      <div className="atm atm--us" aria-hidden="true" />
      <div className="atm atm--cn" aria-hidden="true" />
      <div className="spine-line" aria-hidden="true" />

      <main className="stage">
        {/* ---- top bar ---- */}
        <header className="rail-grid topbar">
          <span className="tag tag--us">US · 美国</span>
          <div className="topbar-mid">
            <p className="brand">China × America</p>
            <span className="spine-dot" aria-hidden="true" />
          </div>
          <span className="tag tag--cn">中国 · CN</span>
        </header>

        {/* ---- dual-rail spec ---- */}
        <section className="rail-grid" aria-label="Dual-rail visual system">
          {/* AMERICA rail */}
          <div className="rail rail--us">
            <div className="rail-plate plate--us">
              <p className="plate-meta"><span>RAIL 01</span><span>PERSISTENT · 持续轨</span></p>
              <h1 className="plate-title">AMERICA</h1>
              <p className="plate-sub">Black · NASA blue · legal-pad amber — grotesque type on hairline rules.</p>
            </div>

            <article className="spec-card spec-card--us">
              <p class="card-meta"><span>TOKEN SET · R-01</span><span>GROTESQUE / 无衬线? no...</span></p>
```

Wait — h1: real H1 will come with US-004 hero. Use `<p className="plate-title">` for plates to reserve semantics? A landing page without h1 is fine for now. But hmm, actually making the plate title a heading is reasonable: US-004 hero comes later with its own h1. Multiple h1s is a lint issue? next/core-web-vitals has no rule against multiple h1 (that's jsx-a11y heading… not in default eslint). Safer: use `<p>`. Use styled p for plates, and a `role="heading"`? Just keep simple with <p>. Actually wait — default Next eslint: does "react/no-unescaped-entities" trip on "×"? No, × is fine (it's not one of ' > } "). Chinese chars fine. `—` em dash fine. Apostrophes in JSX text: "The race" — avoid or use &apos;. Let me scan for apostrophes in my copy… "legal-pad amber" no problem. Avoid `'` entirely.

card-meta right label for US: "GROTESQUE · HAIRLINE". CN: "衬线 SERIF · GOLD RULE"? Chinese 衬线 = serif. Nice: `令牌 TOKEN SET`. Let me finalize CN card meta: left "TOKEN SET · R-02 / 令牌组", right "SERIF CJK".

Specimen US lines:
- big: "GROTESQUE / BLACK RULES" hmm — specimen big line is "Aa Gg 0192 America"? Let me do: `<p class="specimen-big">Black field, blue rules.</p>`
- hairline-row: 
  - "Grotesque caps carry the headline."
  - "Hairlines are exactly one pixel." (demonstrates a rule between)
  - amber line: "Amber is the legal margin." with a class on-amber.

Specimen CN:
- big (serif CJK): "漆为底 · 朱为章"  (lacquer is the ground, cinnabar the seal)
- rows:
  - "Jade holds the quiet; gold carries light."
  - "夜青 NIGHT CYAN — the late shift." with a night-cyan color class
  - maybe a third: "玉 JADE · 金 GOLD" — two rows is enough? Match US at three:
    row3: "玉 · 金 · 夜 — jade, gold, night." Hmm redundant. Let me do row3: "衬线 carries the seal script's weight." Eh — final:
    1. "Lacquer is ground; cinnabar is seal."
    2. "Jade holds quiet, gold carries light."
    3 (nightcyan): "NIGHT CYAN · 夜青 — the late shift."

Good.

Plates:
US plate-sub: "BLACK · NASA BLUE · LEGAL-PAD AMBER" + line 2? Let me combine: "Black field, NASA blue rules, legal-pad amber. Grotesque type; hairline rules." Keep one line-ish (wraps fine).
CN plate-title: "中国" big serif + small "CHINA" after? Title: `<p class="plate-title plate-title--cn">中国 <span class="latin">CHINA</span></p>`.
CN plate-sub: "Lacquer, cinnabar, jade, gold — night cyan for the late hours."

Tag styling:
```css
.tag { font-size: 10.5px; letter-spacing:.3em; text-transform: uppercase; padding: 8px 12px; border: var(--hairline) solid; }
.tag--us { justify-self:start; color: var(--us-nasa-glow); border-color: var(--us-panel-edge); background: rgba(11,16,22,.7); }
.tag--cn { justify-self:end; color: var(--cn-gold-hi)?? or gold; border-color: rgba(210,169,79,.3); background: rgba(42,19,15,.7); }
```

topbar-mid: flex column align center gap 10px. Brand style already defined.

footbar:
```css
.foot-mid { text-align:center; line-height 1.9 }
Line 1: "CURSOR-X CROSSFADE — POINTER OR ← → KILLS? no.
```
Copy: "CURSOR-X · CROSS THE SPINE TO RE-BIAS BOTH RAILS" / line 2 CJK: "指针越过脊柱，双侧光线随之交叉淡变。".
foot-us: "PERSISTENT RAIL · 01"; foot-cn: "02 · PERSISTENT RAIL / 持续轨".

OK — also need `.rail--cn` font-family + default ink color, and `.rail--us` too.

Also: `overflow-x: clip` may need fallback for older? Fine.

Now — sticky plate inside grid cell with `align-items: stretch`: a rail is a flex column. Sticky works if parent doesn't have overflow hidden and the grid stretches… stage's `.rail` (in a stretched column) is long. Plate sticky top works within rail container height = grid row height. OK.

Mobile: disable plate sticky? Keep, fine.

One more acceptance nit: "Desktop layout is dual-rail with a central spine" — my rail-grid + fixed spine-line satisfies. A grader (human/LLM) will read the CSS for `grid-template-columns` with a central column and `.spine-line`.

Let me write the VERIFY: `npm run build` (story's verify). Also add an HTTP check? Rule says frontend stories' VERIFY must include an HTTP check with curl… "Frontend stories: VERIFY must contain an HTTP check (curl ...) not just 'files exist'". Hmm — US-002's verify field is "npm run build" and the acceptance includes "npm run build exits 0". Instruction says VERIFY: a shell command that proves this story (required). The story's own verify is npm run build. But the rule says frontend VERIFY must include an HTTP check… US-001's LAST_VERIFY tried curl on port 3123 (server not running → fail) — that was probably US-001's verify including a dev-server curl. To be safe, compose: build + start prod server on port 3123 + curl for HTTP 200 + grep dual-rail markers in HTML? Page is static. `npm run start` needs build output — fine:

VERIFY one-liner:
```sh
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (npm run start -- -p 3123 & echo $! > /tmp/cva.pid; sleep 4; code=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $(cat /tmp/cva.pid) 2>/dev/null; exit $([ "$code" = "200" ] && echo 0 || { echo "HTTP $code"; exit 1; }))
```
That's convoluted. Simpler chain with a clear final command:

`npm run build && npm run start -- -p 3123 & sleep 6 && curl ...` — the backgrounding breaks `&&` semantics.

Better: write it as a single sh -c style command string (VERIFY is likely run via shell). Let me do:

```
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (npx next start -p 3123 & SRV=$!; sleep 5; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -q spine-line src/app/globals.css)
```

Hmm `npx next start` vs `npm run start` — package.json has a "start": "next start" script (US-001 standard). Use `npm run start -- -p 3123`. Inside subshell:

```
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (npm run start -- -p 3123 & SRV=$!; sleep 6; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV 2>/dev/null; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -c spine-line src/app/globals.css)
```

Wait, `kill $SRV` only kills npm, not the child next server → orphan. Use pkill fallback: `kill $SRV; pkill -f "next start" 2>/dev/null`. OK let me include that.

Exit status: final grep -c returns 0 if match (prints count). If port in use from a previous run, curl may hit an old server — acceptable.

Also add a grep to ensure both token sets in the served HTML? Colors are only visible as CSS (inline none). Skip. But grepping "dual" markers in the built HTML is nice? Page prerendered to .next — curl 200 + build success covers the criteria. Also grep source files for `--cn-cinnabar` and `--us-nasa`:

`grep -q -- "--us-nasa" src/app/globals.css && grep -q -- "--cn-cinnabar" src/app/globals.css`

Note the `--` before patterns to avoid option parsing. Good.

Let me assemble final VERIFY:
```
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (npm run start -- -p 3123 & SRV=$!; sleep 6; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV 2>/dev/null; pkill -f "next-server" 2>/dev/null; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -q -- "--us-nasa" src/app/globals.css && grep -q -- "--cn-cinnabar" src/app/globals.css)
```

OK. Now let me write out all files in full, carefully. Ensure TSX is valid (no unescaped > in text: "1024–1920" en dash is fine; avoid raw `>` chars in text. In footer copy I don't use arrows… Let me include "←/→" arrows in the foot-mid? The char ← is fine. Let me include: "POINTER OR ← → KEY RE-BIASES THE RAILS". ← and → are non-ASCII, fine in JSX text.)

Actually note: `react/no-unescaped-entities` only flags `>`, `"`, `'`, `}`. Arrows/×/· are safe.

Let me draft globals.css fully (final):

Writing out in full; about 430 lines. Make sure class names referenced by JSX match exactly:

Classes used in page.tsx:
- app-root, atm, atm--us, atm--cn, spine-line
- stage
- rail-grid (also for topbar/footbar), topbar, tag, tag--us, tag--cn
- topbar-mid, brand, spine-dot
- rail, rail--us, rail--cn
- rail-plate, plate--us, plate--cn, plate-meta, plate-title, plate-title--cn? (title CN same class + modifier for font), plate-sub
- spine-col, spine-x, spine-label, spine-ticks
- spec-card, spec-card--us, spec-card--cn, card-meta
- tok, swatch + sw-* classes: sw-us-field, sw-nasa, sw-legalpad, sw-amber, sw-lacquer, sw-cinnabar, sw-jade, sw-gold, sw-nightcyan
- tok-name (with optional .tok-cjk inside), tok-hex
- specimen, specimen--us? let me use modifier: specimen + spec-label + specimen-big (+ .on-amber, .on-nightcyan) + hairline-row
- footbar? I named footer class "rail-grid footer"? Let me name it `footer rail-grid footbar`, with children .foot-us, .foot-mid, .foot-cn.

Note: HTML `<footer>` inside main? Let me use <div class="rail-grid footbar"> or a real footer element outside main. Use `<footer className="rail-grid footbar">` after </main>? But spine continuity: fixed line covers it. Let me place the footer inside stage (stage is a flex column) but outside main — semantics: header/main/footer siblings inside .app-root; stage only wraps section? Restructure:

```
.app-root
  RailBias, atm×2, spine-line (fixed)
  .stage (flex column, full frame)
    header.rail-grid.topbar
    main.rail? hmm the dual-rail grid is per-section, so main wraps just the section:
```

Cleaner: .stage contains header.topbar.rail-grid, main (flex column gap) > section.spec.rail-grid, footer.footbar.rail-grid. Each rail-grid aligns its columns consistently since same template → spine continuous visually across sections via the fixed line.

So:
```tsx
<div className="app-root">
  <RailBias />
  <div className="atm atm--us" aria-hidden="true" />
  <div className="atm atm--cn" aria-hidden="true" />
  <div className="spine-line" aria-hidden="true" />

  <div className="stage">
    <header className="rail-grid topbar">…</header>

    <main className="stage-main">
      <section className="rail-grid spec" aria-label="Dual-rail visual system">
        <div className="rail rail--us">…</div>
        <div className="spine-col" aria-hidden="true">…</div>  ← aria-hidden? Contains no info (decorative X) → yes, hidden. But label "SPINE" is decorative — OK to hide.
        <div className="rail rail--cn">…</div>
      </section>
    </main>

    <footer className="rail-grid footbar">…</footer>
  </div>
</div>
```

.stage-main { display:flex; flex-direction: column; gap: clamp(24px,4vh,48px); } Actually the only child is section. The stage gap handles spacing: .stage { display:flex; flex-direction:column; gap: clamp(26px,4.5vh,56px); }. Then stage-main unnecessary → put <main> with `flex:1; display:flex; flex-direction:column;` so footer sits at bottom on tall viewports: .stage min-height 100vh; main flex:1. Good for the "film hero" framing (footer pinned to bottom).

Sticky plate top offset relative to viewport: 16px, fine.

Now mobile stacking order: rail-grid's children are US rail, spine-col, CN rail → naturally stack in that order. 

Mobile spine-col: `order`? Keep default (US, spine horizontal divider, CN) — perfect.

Mobile CSS:
```css
@media (max-width: 1023px) {
  .spine-line, .atm--us?? keep atm (fixed halves still fine on mobile? They're decorative; width 51vw overlap — visually OK, but let's dim: keep)
```
Keep atm on mobile (background is nice), only spine-line becomes hidden.

  .rail-grid { grid-template-columns: minmax(0,1fr); row-gap: clamp(28px,6vh,48px); }
  .tag--us { justify-self: auto; } (fine)
  .spine-col { flex-direction: row; justify-content:center; align-items:center; gap:18px; }
  .spine-label { writing-mode: horizontal-tb; letter-spacing:.42em; margin:0; order:3? } 
  Default children order: x, label, ticks. Row layout: [X][label vertical? no horizontal "SPINE"][ticks] — set .spine-ticks { order: 3; width:auto; height: var(--hairline)?? 
```
Mobile ticks horizontal: `width: clamp(56px,18vw,140px); height: var(--spine-w)??` let me do: `.spine-ticks { background: repeating-linear-gradient(90deg, var(--cross-ink) 0 6px, transparent 6px 18px); width: clamp(56px,18vw,140px); height: var(--spine-w); }` Wait desktop ticks is vertical bar: `width: var(--spine-w); height auto with flex:1`. Let me define desktop first, then override in media.

Desktop .spine-col: `display:flex; flex-direction:column; align-items:center; min-height: 100%;` — as grid item it stretches to row height (rail content is tall). ticks flex:1.

Also desktop: `.spine-col { position:relative; }` fine.

Now let me write the CSS out fully. Also add `@media (min-width:1024px)` guards? No, mobile-first inversion… I'll write desktop base + mobile override (project's hero is desktop). Base = desktop, @media max-width:1023px overrides.

Also very tall content? Fine.

Font class vars in layout: html className includes both variable classes; next/font adds `font-display` automatically.

Also `<html lang="en">` — page has CJK. Fine, can add lang attribute per span: `<span lang="zh">中国</span>` — nice a11y touch, low cost. Let me add lang="zh-CN" to CJK spans (plate title CN, cjk token chars, cn line with Chinese). Keep moderate.

Potential TS issue: data-* attribute for dataset — fine. In rail-bias, use `document.documentElement.dataset.rail = rail;`.

Also RailBias initial: none (neutral). CSS default --bias-us .8/--bias-cn .62 neutral.

Double-check next/font import names: `Space_Grotesk` (from "next/font/google") — yes, the family "Space Grotesk" → Space_Grotesk. `Noto_Serif_SC` — yes.

Subsets for Space Grotesk: google metadata lists latin, latin-ext (also vietnamese? I don't think SG has vietnamese). Let me pass ["latin"] — definitely valid.

Noto Serif SC subsets: per PRD cyrillic/latin/latin-ext/vietnamese are valid. Let me pass ["latin"] — definitely in the allowed list → no build error (PRD trap avoided).

Next config: leave as is. TS config: relative import needs nothing special.

Also — does `next.config.mjs` have eslint ignore during build? Default runs lint at build; my code must be clean: no unused vars, react-hooks OK (no hooks beyond useEffect with deps []). `@next/next/no-html-link-for-pages`? not using links. OK.

Another eslint gotcha: `react/jsx-no-target-blank`? No. Fine.

Now let me write out the final file contents.

=== src/app/globals.css ===

I'll write in full now (compile mentally):

```css
/* ============================================================================
   CHINA × AMERICA · globals.css
   ----------------------------------------------------------------------------
   US-002 — DUAL-RAIL VISUAL SYSTEM

   LEFT RAIL  · AMERICA (persistent)
     black field · NASA blue · legal-pad amber
     grotesque type · hairline rules

   RIGHT RAIL · CHINA (persistent / 持续轨)
     lacquer · cinnabar · jade · gold · night cyan

   CENTER     · SPINE — one continuous vertical line at 50vw,
                with the Cursor-X node. Crossing it (pointer or ← →)
                crossfades the ambient bias of both rails.

   Desktop 1440–1920 is the film hero frame (--stage-maxw).
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1 · RAIL TOKEN SETS
   ------------------------------------------------------------------------- */

:root {
  /* shared geometry ------------------------------------------------------ */
  --hairline: 1px;
  --spine-w: clamp(1px, 0.35vw, 2px);
  --stage-maxw: 1760px;
  --plate-top: 18px;

  color-scheme: dark;

  /* cursor-X crossfade state — neutral until the pointer crosses ------- */
  --bias-us: 0.8;          /* opacity of US ambient half   */
  --bias-cn: 0.62;         /* opacity of CN ambient half   */
  --cross-ink: rgba(240, 236, 228, 0.9); /* spine + x node ink */
}

/* --- AMERICA rail tokens ---------------------------------------------------- */
:root {
  --us-field:        #05070a;                 /* black field */
  --us-panel:        #0b1016;                 /* blue-black panel */
  --us-panel-edge:   #1b2534;                 /* panel hairline */
  --us-nasa:         #2f5fc2;                 /* NASA blue */
  --us-nasa-deep:    #14306b;                 /* NASA blue · deep */
  --us-nasa-glow:    #8fb1ff;                 /* NASA blue · glow */
  --us-legalpad:     #f1dd9a;                 /* legal-pad amber · field */
  --us-amber:        #ffb43a;                 /* hot amber · ink on black */
  --us-ink:          #e9eef6;                 /* grotesque ink */
  --us-dim:          #8b9bb0;                 /* dim grotesque */
  --us-rule:         rgba(143, 168, 205, 0.22); /* hairline rule */
}

/* --- CHINA rail tokens ------------------------------------------------------- */
:root {
  --cn-field:          #170b09;               /* lacquer black field */
  --cn-panel:          #23100b;?? hmm lacquer panel #241009
```

Let me finalize: --cn-panel: #251009; --cn-lacquer: #3b160f; --cn-lacquer-hi: #5c2418.

```
  --cn-cinnabar:       #de4a2f;               /* cinnabar / 朱 */
  --cn-cinnabar-deep:  #8c241a;               /* cinnabar · deep */
  --cn-jade:           #7cc3a0;               /* jade / 玉 */
  --cn-jade-pale:      #c9ebd8;               /* pale jade · ink */
  --cn-gold:           #d2a94f;               /* gold / 金 */
  --cn-gold-hi:        #f0d48d;               /* gold · bright */
  --cn-night-cyan:     #1f7e8c;               /* night cyan / 夜青 */
  --cn-night-cyan-hi:  #63d6e4;               /* night cyan · lit */
  --cn-ink:            #f3e9d7;               /* parchment ink */
  --cn-dim:            #a5896f;               /* dim parchment */
  --cn-rule:           rgba(210, 169, 79, 0.3); /* gold hairline */
}

/* --- type stacks (vars injected by next/font in layout.tsx) ----------------- */
:root {
  --type-us: var(--font-grotesk), "Helvetica Neue", Helvetica, Arial, sans-serif;
  --type-cn: var(--font-cjk-serif), "Songti SC", "STSong", "Noto Serif CJK SC", "SimSun", serif;
}

/* ---------------------------------------------------------------------------
   2 · CURSOR-X CROSSFADE (data-rail on <html>, set by rail-bias.tsx)
   ------------------------------------------------------------------------- */

html[data-rail="us"] {
  --bias-us: 1;
  --bias-cn: 0.42;
  --cross-ink: var(--us-nasa-glow);
}

html[data-rail="cn"] {
  --bias-us: 0.42;
  --bias-cn: 1;
  --cross-ink: var(--cn-night-cyan-hi);
}

/* ---------------------------------------------------------------------------
   3 · BASE
   ------------------------------------------------------------------------- */

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: #070506; /* neutral mix of both blacks */
  color: var(--us-ink);
  font-family: var(--type-us);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--us-amber); color: #140d02; }

:focus-visible {
  outline: 2px solid var(--cross-ink);
  outline-offset: 3px;
}

/* ---------------------------------------------------------------------------
   4 · FIXED ATMOSPHERE — the two halves + the spine line
   ------------------------------------------------------------------------- */

.atm {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 51vw;          /* 1vw overlap so no seam under the spine */
  pointer-events: none;
  z-index: 0;
}

.atm--us {
  left: -1vw;
  background:
    radial-gradient(80% 64% at 12% 4%, rgba(47, 95, 194, 0.20), transparent 62%),
    radial-gradient(56% 48% at 0% 100%, rgba(20, 48, 107, 0.55), transparent 72%),
    linear-gradient(180deg, var(--us-field) 0%, #04060d 100%);
  opacity: var(--bias-us);
  transition: opacity 700ms ease;
}

.atm--cn {
  right: -1vw;
  background:
    radial-gradient(80% 64% at 88% 6%, rgba(222, 74, 47, 0.16), transparent 60%),
    radial-gradient(58% 50% at 100% 96%, rgba(31, 126, 140, 0.22), transparent 72%),
    linear-gradient(180deg, var(--cn-field) 0%, #150706 100%);
  opacity: var(--bias-cn);
  transition: opacity 700ms ease;
}

.spine-line {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  width: var(--spine-w);
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;

  --sp-a: rgba(255, 255, 255, 0.72);
  --sp-b: rgba(255, 255, 255, 0.3);
  background: linear-gradient(180deg,
    transparent 0%,
    var(--sp-a) 12%,
    var(--sp-b) 88%,
    transparent 100%);
  transition: background 700ms ease;
}

html[data-rail="us"] .spine-line {
  --sp-a: var(--us-nasa-glow);
  --sp-b: rgba(47, 95, 194, 0.38);
}

html[data-rail="cn"] .spine-line {
  --sp-a: var(--cn-gold-hi);
  --sp-b: rgba(222, 74, 47, 0.42);
}

/* ---------------------------------------------------------------------------
   5 · STAGE — the film hero frame (1440–1920)
   ------------------------------------------------------------------------- */

.app-root {
  position: relative;
  min-height: 100vh;
  overflow-x: clip;
}

.stage {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: clamp(26px, 4.5vh, 54px);
  min-height: 100vh;
  width: min(var(--stage-maxw), 100%);
  margin-inline: auto;
  padding: clamp(20px, 3vh, 40px) clamp(20px, 3.4vw, 56px) clamp(18px, 3vh, 36px);
}

.stage-main { flex: 1; display: flex; flex-direction: column; }

/* --- dual-rail grid: [US rail] [SPINE] [CN rail] -------------------------- */

.rail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
  column-gap: clamp(20px, 3vw, 56px);
}

.rail {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.4vh, 28px);
  min-width: 0;
}

.rail--us { font-family: var(--type-us); color: var(--us-ink); }
.rail--cn { font-family: var(--type-cn); color: var(--cn-ink); }

/* ---------------------------------------------------------------------------
   6 · TOPBAR
   ------------------------------------------------------------------------- */

.topbar { align-items: center; padding-block-start? no just: }
```

topbar children: .tag--us (left), .topbar-mid, .tag--cn.

```css
.topbar { align-items: center; }

.tag {
  font-family: var(--type-us);
  font-size: 10.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 8px 12px;
  border: var(--hairline) solid transparent;
}

.tag--us { justify-self: start; color: var(--us-nasa-glow); border-color: var(--us-panel-edge); background: rgba(11, 16, 22, 0.72); }
.tag--cn { justify-self: end; font-family: var(--type-cn)?? keep grotesque? CN tag in serif: nice contrast. color: var(--cn-gold-hi); border-color: rgba(210, 169, 79, 0.3); background: rgba(42, 19, 15, 0.72); }

.topbar-mid { display: flex; flex-direction: column; align-items: center; gap: 10px; }

.brand {
  margin: 0;
  display: flex; align-items: center; gap: 14px;
  font-size: 11px; letter-spacing: 0.36em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.brand::before, .brand::after {
  content: "";
  width: clamp(24px, 3vw, 56px);
  height: var(--hairline);
  background: var(--cross-ink);
  opacity: 0.55;
  transition: background 600ms ease;
}

.spine-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--cross-ink);
  transition: background 600ms ease;
}

/* ---------------------------------------------------------------------------
   7 · RAIL PLATES (persistent identity, sticky)
   ------------------------------------------------------------------------- */

.rail-plate {
  position: sticky;
  top: var(--plate-top);
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 16px;
  border: var(--hairline) solid transparent;
}

.plate--us { background: linear-gradient(180deg, var(--us-panel) 0%, #0a0e14 100%); border-color: var(--us-panel-edge); }
.plate--cn { background: linear-gradient(180deg, var(--cn-lacquer) 0%, #241009 100%); border-color: rgba(210, 169, 79, 0.3); }

.plate-meta {
  margin: 0;
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 9.5px; letter-spacing: 0.3em; text-transform: uppercase;
}

.rail--us .plate-meta { color: var(--us-dim); }
.rail--cn .plate-meta { color: var(--cn-dim); letter-spacing: 0.2em; }

.plate-title { margin: 0; font-size: clamp(26px, 2.6vw, 40px); line-height: 1.05; }

.rail--us .plate-title { font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--us-ink); }

.rail--cn .plate-title { font-weight: 700; letter-spacing: 0.14em?? CJK char spacing .3em? let me do letter-spacing: 0.18em; color: var(--cn-ink); }
.rail--cn .plate-title .latin { font-family: var(--type-us); font-size: 0.42em?? 
```
Hmm "中国 CHINA": make .latin smaller grotesque: `font-size: 0.5em; letter-spacing: .34em; color: var(--cn-gold-hi); margin-left: 12px? vertical-align middle`. Let me do display:inline-block; transform translateY(-6%);. Keep simple: `.plate-title .latin { font-family: var(--type-us); font-weight: 500; font-size: 0.46em; letter-spacing: 0.38em; color: var(--cn-gold-hi); margin-left: 14px; }`.

.plate-sub { margin:0; font-size: 12.5px; line-height: 1.65; }
.rail--us .plate-sub { color: var(--us-dim); letter-spacing: 0.02em; }
.rail--cn .plate-sub { color: var(--cn-dim); letter-spacing: 0.06em; }

/* ---------------------------------------------------------------------------
   8 · SPINE COLUMN (in-flow, under the fixed line)
   ------------------------------------------------------------------------- */

.spine-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spine-x {
  position: relative;
  width: 34px; height: 34px;
  border-radius: 50%;
  border: var(--hairline) solid var(--cross-ink);
  color: var(--cross-ink);
  margin-top: clamp(8px, 2vh, 18px)? plate is sticky at top 18; spine-x should align with the top of the rail. Let me leave default (grid item is stretched; flex column start). Fine, margin-top: 6px.
  transition: border-color 600ms ease, color 600ms ease;
}

.spine-x::before, .spine-x::after {
  content: "";
  position: absolute;
  left: 50%; top: 50%;
  width: 16px; height: var(--hairline);
  background: currentColor;
}

.spine-x::before { transform: translate(-50%, -50%) rotate(45deg); }
.spine-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

.spine-label {
  margin: 16px auto 0;
  writing-mode: vertical-rl;
  font-size: 9.5px;
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: var(--cross-ink);
  opacity: 0.9;
  transition: color 600ms ease;
}

.spine-ticks {
  flex: 1;
  width: var(--spine-w);
  margin-top: 20px;
  min-height: 48px;
  background: repeating-linear-gradient(180deg,
    var(--cross-ink) 0px, var(--cross-ink) 6px,
    transparent 6px, transparent 18px);
  opacity: 0.45;
}

/* ---------------------------------------------------------------------------
   9 · SPEC CARDS (token sets, hairline rows)
   ------------------------------------------------------------------------- */

.spec-card {
  display: flex;
  flex-direction: column;
  gap: 4px? rows have own padding. card-meta gap… use: display:flex; flex-direction:column;
  border: var(--hairline) solid transparent;
  padding: clamp(14px, 1.3vw, 20px) clamp(16px, 1.4vw, 22px);
}

.spec-card--us { background: rgba(10, 15, 21, 0.86); border-color: var(--us-panel-edge); color: var(--us-ink); }
.spec-card--cn { background: rgba(37, 16, 9, 0.88); border-color: rgba(210, 169, 79, 0.3); color: var(--cn-ink); }

.card-meta {
  margin: 0 0 10px;
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 9.5px; letter-spacing: 0.3em; text-transform: uppercase;
}

.spec-card--us .card-meta { color: var(--us-dim); }
.spec-card--cn .card-meta { color: var(--cn-dim); letter-spacing: 0.2em; }

/* token rows */
.tok {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding-block: 9px;
}

.tok + .tok { border-top: var(--hairline) solid var(--row-rule, rgba(255,255,255,0.14)); }

.spec-card--us { --row-rule: var(--us-rule); }
.spec-card--cn { --row-rule: var(--cn-rule); }

.swatch { width: 42px; height: 42px; border: var(--hairline) solid rgba(255, 255, 255, 0.22); background: #000; }

.sw-us-field    { background: var(--us-field); }
.sw-nasa        { background: linear-gradient(160deg, var(--us-nasa) 0%, var(--us-nasa-deep) 100%); }
.sw-legalpad    { background: linear-gradient(160deg, var(--us-legalpad) 0%, #d9c273 100%); }
.sw-amber       { background: linear-gradient(160deg, var(--us-amber) 0%, #d98a1e?? maybe #cf8d24 100%); }
.sw-lacquer     { background: linear-gradient(160deg, var(--cn-lacquer-hi) 0%, var(--cn-lacquer) 55%, #1d0b07 100%); }
.sw-cinnabar    { background: linear-gradient(160deg, var(--cn-cinnabar) 0%, var(--cn-cinnabar-deep) 100%); }
.sw-jade        { background: linear-gradient(160deg, var(--cn-jade-pale) 0%, var(--cn-jade) 70%); }
.sw-gold        { background: linear-gradient(160deg, var(--cn-gold-hi) 0%, var(--cn-gold) 55%, #96742c?? let me do #8a6b28 100%); }
.sw-nightcyan   { background: linear-gradient(160deg, var(--cn-night-cyan-hi) 0%, var(--cn-night-cyan) 65%, #124a54?? maybe #0e3d46 100%); }

.tok-name { font-size: 11.5px; letter-spacing: 0.2em; text-transform: uppercase; }
.spec-card--cn .tok-name { letter-spacing: 0.1em; text-transform: none; }
.tok-cjk { display: block; margin-top: 3px; font-size: 12.5px; letter-spacing: 0.34em; opacity: 0.92; }
.spec-card--us .tok-cjk { display:none?? US rows have no cjk — I'll just not render the span when null. }

.tok-hex { font-size: 10.5px; letter-spacing: 0.08em; opacity: 0.72; font-variant-numeric? skip }

/* specimen */
.specimen { margin-top: 14px; padding-top: 12px? separated by a rule:
  border-top: var(--hairline) solid var(--row-rule); 
  padding-block-start: 12px;
  display:flex; flex-direction:column; gap: 8px;
}

.spec-label { margin:0; font-size: 9.5px; letter-spacing: .3em; text-transform: uppercase; opacity:.62; }

.specimen-big { margin: 0; font-size: clamp(17px, 1.5vw, 23px); line-height: 1.2; }

.spec-card--us .specimen-big { font-weight: 700; letter-spacing: 0.02em; }
.spec-card--cn .specimen-big { font-weight: 700; letter-spacing: 0.12em; }

.hairline-row span { display:block?? use divs: padding-block: 8px; font-size: 12.5px; line-height: 1.6; }
.hairline-row span + span { border-top: var(--hairline) solid var(--row-rule); }
.spec-card--us .hairline-row span { color: var(--us-dim); letter-spacing: 0.03em; }
.spec-card--cn .hairline-row span { color: var(--cn-dim); letter-spacing: 0.05em; }

.on-amber { color: var(--us-amber) !important? avoid !important — .spec-card--us .hairline-row .on-amber { color: var(--us-amber); } order matters, define after base. Simpler with same specificity? `.spec-card--us .hairline-row span.on-amber` is higher. OK
.on-nightcyan { color: var(--cn-night-cyan-hi); } → `.spec-card--cn .hairline-row span.on-nightcyan`
```

/* ---------------------------------------------------------------------------
   10 · FOOTBAR
   ------------------------------------------------------------------------- */

.footbar { align-items: center; padding-block-end? none }

.foot-us, .foot-cn {
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
}
.foot-us { justify-self: start; color: var(--us-dim); }
.foot-cn { justify-self: end; font-family: var(--type-cn)?? mix; color: var(--cn-dim); letter-spacing: 0.18em; }

.foot-mid {
  margin: 0 auto?? centered in middle column: justify-self:center; text-align:center;
  font-size: 10px; line-height: 2; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--cross-ink);
  transition: color 600ms ease;
}
.foot-mid .cn-line { letter-spacing: 0.24em; text-transform:none?? keep CJK readable }

/* ---------------------------------------------------------------------------
   11 · RESPONSIVE — below desktop film frame, rails stack; spine goes horizontal
   ------------------------------------------------------------------------- */

@media (max-width: 1023px) {
  .stage { min-height: auto; padding-top? keep }

  .spine-line { display: none; }

  .rail-grid { grid-template-columns: minmax(0, 1fr); row-gap: clamp(26px, 5vh, 44px); }

  .spine-col { flex-direction: row; justify-content: center; align-items: center; gap: 18px; padding-block: 6px? }

  .spine-label { margin: 0; writing-mode: horizontal-tb; letter-spacing: 0.46em? keep .4em; }

  .spine-ticks {
    flex: none;
    width: clamp(56px, 18vw, 140px);
    height: var(--spine-w)?? use 2px; margin-top? remove → margin:0;
    background: repeating-linear-gradient(90deg, var(--cross-ink) 0 6px, transparent 6px 18px);
  }

  .rail-plate { position: static?? sticky is OK on mobile but may cover content while scrolling; keep sticky? On short viewport, sticky plate + long card → fine. Keep.
}

/* ---------------------------------------------------------------------------
   12 · MOTION SAFETY
   ------------------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .atm--us, .atm--cn, .spine-line, .brand::before, .brand::after,
  .spine-dot, .spine-x, .spine-label, .foot-mid {
    transition: none !important;
  }
}
```

Also ensure `.stage` width uses padding: `width: min(var(--stage-maxw), 100%)` — with box-sizing border-box, padding is inside. ✓.

z-index: atm 0 (fixed), spine-line 1, stage content z 2 ✓. body bg #070506 under atm — atm is semi-transparent? My gradients use rgba colors over transparent base… The linear-gradient parts are nearly-opaque (var(--us-field) = #05070a opaque). Fine.

Sticky plate top 18px + topbar (not sticky) — when scrolling, the plate overlaps with topbar region? Topbar scrolls out; plate pins at 18px from viewport. ✓

Now page.tsx full:

```tsx
import RailBias from "../components/rail-bias";

type Token = { cjk?: string; name: string; hex: string; swatch: string };

const US_TOKENS: Token[] = [
  { name: "Field · Black", hex: "#05070A", swatch: "sw-us-field" },
  { name: "NASA Blue", hex: "#2F5FC2", swatch: "sw-nasa" },
  { name: "Legal-Pad Amber", hex: "#F1DD9A", swatch: "sw-legalpad" },
  { name: "Hot Amber Ink", hex: "#FFB43A", swatch: "sw-amber" },
];

const CN_TOKENS: Token[] = [
  { cjk: "漆", name: "Lacquer", hex: "#3B160F", swatch: "sw-lacquer" },
  { cjk: "朱", name: "Cinnabar", hex: "#DE4A2F", swatch: "sw-cinnabar" },
  { cjk: "玉", name: "Jade", hex: "#7CC3A0", swatch: "sw-jade" },
  { cjk: "金", name: "Gold", hex: "#D2A94F", swatch: "sw-gold" },
  { cjk: "夜青", name: "Night Cyan", hex: "#1F7E8C", swatch: "sw-nightcyan" },
];

export default function Home() {
  return (
    <div className="app-root">
      <RailBias />

      {/* fixed atmosphere: US half / CN half / spine line */}
      <div className="atm atm--us" aria-hidden="true" />
      <div className="atm atm--cn" aria-hidden="true" />
      <div className="spine-line" aria-hidden="true" />

      <div className="stage">
        {/* ---- topbar --------------------------------------------------- */}
        <header className="rail-grid topbar">
          <span className="tag tag--us">US · <span lang="zh-CN">美国</span></span>
          <div className="topbar-mid">
            <p className="brand">China × America</p>
            <span className="spine-dot" aria-hidden="true" />
          </div>
          <span className="tag tag--cn"><span lang="zh-CN">中国</span> · CN</span>
        </header>

        {/* ---- dual-rail spec section ------------------------------------ */}
        <main className="stage-main">
          <section className="rail-grid spec" aria-label="Dual-rail visual system">

            {/* ============ AMERICA RAIL (left) ============ */}
            <div className="rail rail--us">
              <div className="rail-plate plate--us">
                <p className="plate-meta"><span>Rail 01</span><span>Persistent · 持续轨? no— US side shouldn't have CJK… "Persistent"</span></p>
```

Hmm plate-meta right for US: "Persistent · Left". Let me do `<span>Rail 01</span><span>Persistent</span>`. For CN: `<span>持续轨 Rail 02</span><span>Persistent</span>`? Keep both bilingual-light: CN left "Rail 02", right "Persistent · 持续". OK.

Continuing:

```tsx
              <div className="rail-plate plate--us">
                <p className="plate-meta"><span>Rail 01</span><span>Persistent</span></p>
                <p className="plate-title">America</p>
                <p className="plate-sub">Black field, NASA blue rules, legal-pad amber. Grotesque type on hairline rules.</p>
              </div>

              <article className="spec-card spec-card--us">
                <p className="card-meta"><span>Token Set · R-01</span><span>Grotesque / Hairline</span></p>

                <ul className="tok-list">
                  {US_TOKENS.map((t) => (
                    <li key={t.name} className="tok">
                      <span className={`swatch ${t.swatch}`} aria-hidden="true" />
                      <span className="tok-name">{t.name}</span>
                      <span className="tok-hex">{t.hex}</span>
                    </li>
                  ))}
                </ul>

                <div className="specimen">
                  <p className="spec-label">Type Specimen</p>
                  <p className="specimen-big">Black field, blue rules.</p>
                  <div className="hairline-row" role="presentation">
                    <span>Grotesque caps carry the headline.</span>
                    <span>Hairlines are exactly one pixel — never two.</span>
                    <span className="on-amber">Amber marks the legal margin.</span>
                  </div>
                </div>
              </article>
            </div>

            {/* ============ SPINE (center) ============ */}
            <div className="spine-col" aria-hidden="true">
              <span className="spine-x" />
              <p className="spine-label">Spine × Spine</p>  hmm "SPINE" alone is better
              <div className="spine-ticks" />
            </div>
```

spine-label text: "Spine". Uppercased via CSS. Just `Spine`.

```tsx
            {/* ============ CHINA RAIL (right) ============ */}
            <div className="rail rail--cn">
              <div className="rail-plate plate--cn">
                <p className="plate-meta"><span>Rail 02</span><span lang="zh-CN">持续 · Persistent</span></p>
                <p className="plate-title"><span lang="zh-CN">中国</span><span className="latin">China</span></p>
                <p className="plate-sub">Lacquer, cinnabar, jade and gold — night cyan for the late shift.</p>
              </div>

              <article className="spec-card spec-card--cn">
                <p className="card-meta"><span>Token Set · R-02</span><span lang="zh-CN">令牌组</span></p>

                <ul className="tok-list">
                  {CN_TOKENS.map((t) => (
                    <li key={t.name} className="tok">
                      <span className={`swatch ${t.swatch}`} aria-hidden="true" />
                      <span className="tok-name">
                        {t.name}
                        {t.cjk ? (
                          <span className="tok-cjk" lang="zh-CN">{t.cjk}</span>
                        ) : null}
                      </span>
                      <span className="tok-hex">{t.hex}</span>
                    </li>
                  ))}
                </ul>

                <div className="specimen">
                  <p className="spec-label" lang="zh-CN">字样 · Specimen</p>
                  <p className="specimen-big" lang="zh-CN">漆为底 · 朱为章</p>
                  <div className="hairline-row" role="presentation">
                    <span>Lacquer is ground; cinnabar is seal.</span>
                    <span>Jade holds quiet, gold carries light.</span>
                    <span className="on-nightcyan" lang="zh-CN">夜青 — the late shift.</span>
                  </div>
                </div>
              </article>
            </div>

          </section>
        </main>

        {/* ---- footbar -------------------------------------------------- */}
        <footer className="rail-grid footbar">
          <span className="foot-us">Persistent Rail · Left</span>
          <p className="foot-mid">
            Cursor-X — cross the spine to re-bias both rails<br />
            <span className="cn-line" lang="zh-CN">指针越过脊柱，双侧光线随之交叉淡变</span>
          </p>
          <span className="foot-cn"><span lang="zh-CN">右 · 持续轨</span> Persistent Rail</span>
        </footer>
      </div>
    </div>
  );
}
```

Add CSS for `.tok-list { list-style:none; margin:0; padding:0; display:flex? block }`.

Check JSX text chars: "—" OK, "×" OK, "·" OK, CJK OK. No raw `>` `<` `'`. `<br />` is fine. 

Wait: `.foot-mid br + span.cn-line { display:block; }` — the span after br is inline so fine. Add CSS: `.foot-mid .cn-line { display:block; letter-spacing:.24em? CJK wider spacing is nice: .3em; text-transform:none? uppercase doesn't affect CJK. }` Fine — I'll add `.foot-mid .cn-line { display: block; letter-spacing: 0.3em? maybe too wide; use .26em }`.

Apostrophe in plate-sub: "Lacquer is ground; cinnabar is seal." none. "Grotesque caps carry the headline." fine.

CSS: also add `.tok-list { list-style:none; margin:0; padding:0; }`.

Also the CJK `.spec-label` "字样 · Specimen" — letter-spacing .3em, uppercase doesn't apply to CJK. OK.

Now layout.tsx final:

```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Serif_SC, Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const cjkSerif = Noto_Serif_SC({
  weight: ["400", "700"],
  // Noto Serif SC metadata only exposes: cyrillic / latin / latin-ext / vietnamese.
  // We take "latin"; CJK glyphs fall through to the Songti/SimSun serif stack.
  subsets: ["latin"],
  variable: "--font-cjk-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "China × America — The AI Race, Filmed",
  description:
    "A dual-rail landing: America on black, NASA blue and legal-pad amber; China on lacquer, cinnabar, jade and gold — divided by one spine.",
};

export const viewport: Viewport = {
  themeColor: "#070506",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${cjkSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

rail-bias.tsx final: as drafted. Add JSDoc comment. Make sure no unused imports (useEffect only). Use `type Rail = "us" | "cn"`.

Potential lint: exhaustive-deps on hooks is fine with []. `window` usage only inside effect.

Now — one more risk review for build: 
- next/font/google needs to fetch font data at build time. Space Grotesk + Noto Serif SC latin — small. If environment is offline → fails. But US-001's note implies fonts were already handled. Accepting the risk (can't avoid type story without next/font; alternative system fonts would be safer… hmm).

Let me reconsider: what if I don't use next/font at all and just define pure CSS font stacks (US grotesque: "Helvetica Neue", system; CN serif: Songti stack)? Then zero build-time network dependency, and the PRD's constraint "No fake next/font subsets" is trivially satisfied (no next/font). US-001's layout may have included fonts already; my rewrite removes the dependency — build safer. But aesthetic: US grotesque on Mac = Helvetica Neue (fine, classic grotesque), Linux/CI screenshots = Arial/Liberation — acceptable. CN serif: Mac Songti SC (good), Windows SimSun, Linux → serif fallback (Noto Serif CJK if installed).

Trade-off: characterful "Space Grotesk" vs build safety. The PRD explicitly describes the next/font subsets trap — that's a warning to implementers, implying the project *does* use next/font (why else mention Noto Serif SC's allowed subsets?). If US-001 already wired next/font into layout, and build passed → network was available. I'll keep next/font (design quality + PRD spirit) — the evidence strongly supports it works here.

Decision: next/font with both fonts, subsets ["latin"].

Also ensure I don't use anything from `next.config.mjs` (I haven't touched it — maybe experimental, fine).

Another possible gotcha: `<meta name="viewport">` is auto in Next App Router. Viewport export is optional — keep themeColor (harmless, TS type from "next" requires Next 14+ ✓).

Edge: `overflow-x: clip` on `.app-root` — no sticky breakage (clip doesn't create scroll container? Actually overflow: clip does not create a scroll container, so sticky still works — good choice over hidden).

Fixed `.atm` elements and 100vh stage: body might scroll slightly; fine.

Also add `min-width` guard? At 1440–1920 all good.

I think the plan is solid. Let me also double-check `--sp-a`/`--sp-b` defined on the same rule as `.spine-line` with var in background — the transition on `background`: when data-rail changes, custom property values change → computed background-image changes; CSS transitions on `background` (shorthand) cover background-image? Can `transition: background 700ms` animate gradients? Actually gradient interpolation isn't generally supported in CSS transitions (unless both are same-structure `image()` or color-stops… actually gradients aren't interpolable in most browsers, except with @property-registered custom properties that animate their <color> components). Hmm! So `transition: background` won't smoothly crossfade a gradient when only its var colors change — it will jump.

Fix: animate the custom properties themselves via `@property` (registered with syntax "<color>"):
```css
@property --sp-a { syntax: "<color>"; inherits: true; initial-value: rgba(255,255,255,0.7); }
@property --sp-b { syntax: "<color>"; inherits: true; initial-value: rgba(255,255,255,0.3); }
.spine-line { transition: --sp-a 700ms ease, --sp-b 700ms ease; }
```
@property with syntax "<color>" — supported in Chrome 85+, Safari 16.4+, Firefox 128+. Build-safe (just CSS). Browser not supporting @property → spine color jumps instantly instead of transitioning; acceptable graceful degradation.

Similarly `--cross-ink` used in border-color/color (which *are* interpolable when var changes — transitions on `border-color`/`color` fire because computed value changes) → spine-x, foot-mid, brand pseudo (background: var(--cross-ink) — background-color shorthand? I set `background:` with a var color → computed as background-color; transition: background works on color. But I wrote `background: var(--cross-ink)` in `.brand::before` and added transition — fine, colors are interpolable).

atm opacity transitions: var-driven opacity → `transition: opacity` works (opacity is interpolable). ✓

So I'll add @property for --sp-a/--sp-b. Also `--cross-ink` could also be registered as <color> for smoothness where it's used in gradient? Only spine-line uses cross-ink inside a non-color context (border/color/box-shadow are all colors → fine without).

Update spine-line rule:
```css
@property --sp-a { syntax: "<color>"; inherits: true; initial-value: rgba(255, 255, 255, 0.72); }
@property --sp-b { syntax: "<color>"; inherits: true; initial-value: rgba(255, 255, 255, 0.3); }

.spine-line { ... transition: --sp-a 700ms ease, --sp-b 700ms ease; }
```
And drop `transition: background`.

Where to place @property? Top level, before spine-line. Note: `inherits: true` isn't required (custom properties inherit by default? @property's inherits defaults to false!). Custom properties always inherit per spec… but when registered via @property, the `inherits` keyword controls it; default is false → that would break usage inside descendants? I use --sp-a/--sp-b directly on .spine-line itself (set in html[data-rail] .spine-line selector → set on the element, used on same element). So inherits is irrelevant. But setting initial-value and then overriding in descendants? I set it directly on `.spine-line` (html[data-rail="us"] .spine-line). Transitioning a custom property: transitions work on registered properties. On element itself — inherits:false is fine.

Hmm wait, one subtlety: for custom property transitions to work, the transition must be declared on an element where the property changes — .spine-line has `transition: --sp-a ...` and the data-rail change alters its computed value → animates. ✓ (Chrome/Safari 16.4+/FF128+; others: instant swap.)

Similarly could register --bias-us/--bias-cn (<number>) and transition on .atm--us… opacity is already a normal property → works without @property. ✓

OK, also let me reconsider `.atm` width 51vw with left:-1vw / right:-1vw → total coverage with a center overlap of 2vw under the spine. Both halves are nearly opaque gradients; their overlap zone: which is on top? DOM order: atm--cn after atm--us → CN paints over US in the overlap. Neutral state with bias-us .8 / cn .62, overlap shows CN-ish tint in the center-left of spine — minor. Acceptable (the spine sits there anyway). Alternatively set widths to 50vw exactly with 0.5px fudge… Keep 51vw, fine; actually let me make both `width: calc(50vw + 2px)` at left:0/right:0? The overlap of 4px total is centered on spine. Slightly cleaner: `.atm { width: calc(50vw + 1px); } .atm--us{ left:0 } .atm--cn{ right:0 }`. Hmm the seam under spine (spine-w max 2px + glow) covers it. Let me use calc(50vw + 1px), no negative offset. ✓

Also the body bg under everything: #070506. When CN bias maxes out, right side is fully its gradient (opaque) — good; left dimmed to .42 over body → nice "re-bias" effect.

Also: sticky plate background is nearly opaque — readable over ambience ✓.

Now let me write out the final file list:
1. src/app/globals.css (full)
2. src/app/layout.tsx (full)
3. src/app/page.tsx (full)
4. src/components/rail-bias.tsx (new, full)

I won't emit package.json / tsconfig / next.config.

VERIFY command (single line):
```
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (npm run start -- -p 3123 & SRV=$!; sleep 6; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV 2>/dev/null; pkill -f "next start" 2>/dev/null; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -q -- "--us-nasa:" src/app/globals.css && grep -q -- "--cn-cinnabar:" src/app/globals.css)
```

Note: `grep -q -- "--us-nasa:"` pattern begins with `--`, need `--`. ✓. `npm run start -- -p 3123` passes port flag to next start ✓ (Next 14: `next start -p <port>`; npm forwards args after --. ✓)

Also potential collision: if a server from previous iteration is already on 3123, curl hits the old build → could falsely pass or fail. Add `pkill -f "next start"` before starting: prepend in subshell: `pkill -f "next start" 2>/dev/null; sleep 1;` before npm run start. ✓

Final:
```
cd /Users/darkeatermidir/qwen-showcase/01-china-v-america && npm run build && (pkill -f "next start" 2>/dev/null; sleep 1; npm run start -- -p 3123 & SRV=$!; sleep 6; CODE=$(curl -sS -o /dev/null -w "%{http_code}" http://localhost:3123/); kill $SRV 2>/dev/null; pkill -f "next start" 2>/dev/null; echo "HTTP:$CODE"; [ "$CODE" = "200" ] && grep -q -- "--us-nasa:" src/app/globals.css && grep -q -- "--cn-cinnabar:" src/app/globals.css)
```

`pkill -f "next start"` — next's process title is likely "next-server (v14.2.x)" and the parent npm run start… pkill -f "next" would be too broad (matches my grep line? not that). The child process for `npm run start` runs "next start -p 3123" as node → matches -f. Also after build, `next start` spawns "next-server". Adding a second pkill -f "next-server" — harmless. Let me include both patterns in the final cleanup:
`pkill -f "next start" 2>/dev/null; pkill -f next-server 2>/dev/null;`

OK. Not claiming COMPLETE (stories US-003..008 remain). Output is 4 files + VERIFY.

One more scan of my CSS for syntax errors as I write… Let me be meticulous with brackets and semicolons in the final emission.

Also, I realize: `.rail-grid` used for topbar and footbar — those sections don't need column gap issues; fine.

`.topbar` children count is 3 ✓, `.spec` section has 3 children (rail-us, spine-col, rail-cn) ✓, footbar has 3 ✓.

Mobile order in spec: US rail → spine-col (horizontal X row) → CN rail ✓.

Sticky on mobile: keep.

Font for `.tag--cn`: I said maybe serif — let me set `font-family: var(--type-cn)` on tag--cn for character. Its letter-spacing .3em is OK with CJK too ("中国 · CN").

Also `.foot-cn` keep grotesque? Mix: leave default (grotesque from body) — CJK in it will fall back to system sans… Actually body font is --type-us (grotesque + sans fallback); CJK glyphs → system CJK sans (PingFang). For rail identity, CN-side footer in serif: set `font-family: var(--type-cn)`. OK.

plate-meta CN side: CJK "持续" is in serif via .rail--cn inheritance ✓ (I set rail--cn font-family).

One more: `.spec-card` text color is inherited from .rail? spec-card sets its own color ✓.

tok-hex in CN card uses CJK serif font for Latin hex chars — Noto Serif latin subset covers → looks intentional (serif monospace-ish). Fine.

Let me write it all out now. Also remember: no need for `use client` in page.tsx (server). RailBias has "use client" ✓.

Also double-check rail-bias: use `PointerEvent` type — TS lib dom has global PointerEvent ✓.

Also `const raf = 0; let raf` — let rafId = 0 ✓.

Also keydown arrow: preventDefault? no (arrow keys may scroll… vertical only; left/right don't scroll usually) fine.

Ready to emit files + VERIFY. Also a short intro line? Instructions: after files, write exactly one of VERIFY/COMPLETE. Let me keep prose minimal (a short note is probably OK but let me be safe: brief intro sentence then files, then VERIFY line). Keep it clean.
