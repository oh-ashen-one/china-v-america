/*
 * US-004 - Hero Thesis + CTA.
 *
 * One sharp sentence about the compute race, split across both rails:
 * grotesque on the America side (left), Song serif on the China side
 * (right). The CTA "Enter the comparison" sits ON the spine, straddling
 * both rails, so entering means crossing the line. Not a centered SaaS
 * slab: the thesis is anchored to each rail's edge and the button lives
 * in the gap where the fixed spine passes. All styling is scoped to this
 * component's style tag; globals.css stays untouched.
 */

const HERO_CSS = `
  .hero { align-items: start; }

  #spec { scroll-margin-top: 24px; }

  .hero-side {
    display: flex;
    flex-direction: column;
    gap: clamp(14px, 2.2vh, 24px);
    min-width: 0;
    padding-block: clamp(10px, 2vh, 26px);
  }

  .hero-us {
    align-items: flex-start;
    text-align: left;
    padding-right: clamp(70px, 9vw, 150px);
  }

  .hero-cn {
    align-items: flex-end;
    text-align: right;
    padding-left: clamp(70px, 9vw, 150px);
  }

  .hero-kicker {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 10.5px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
  }

  .hero-us .hero-kicker { color: var(--us-nasa-glow); font-family: var(--type-us); }
  .hero-cn .hero-kicker { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; }

  .hero-us .hero-kicker::before {
    content: "";
    width: clamp(22px, 3vw, 54px);
    height: var(--hairline);
    background: var(--us-nasa);
  }

  .hero-cn .hero-kicker::after {
    content: "";
    width: clamp(22px, 3vw, 54px);
    height: var(--hairline);
    background: var(--cn-gold);
  }

  .hero-headline { margin: 0; font-weight: 700; }

  .hero-headline--us {
    font-family: var(--type-us);
    font-size: clamp(30px, 3.5vw, 58px);
    line-height: 1.06;
    letter-spacing: -0.01em;
    color: var(--us-ink);
  }

  .hl-us { color: var(--us-amber); }

  .hero-headline--cn {
    font-family: var(--type-cn);
    font-size: clamp(26px, 3vw, 50px);
    line-height: 1.4;
    letter-spacing: 0.16em;
    color: var(--cn-ink);
  }

  .hl-cn { color: var(--cn-gold-hi); }

  .hero-sub {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--us-dim);
  }

  .hero-cn .hero-sub {
    font-family: var(--type-cn);
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: none;
    color: var(--cn-dim);
  }

  .hero-spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding-block: clamp(10px, 2vh, 26px);
  }

  .hero-x {
    position: relative;
    width: 30px;
    height: 30px;
    margin-top: 14px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
    transition: border-color 600ms ease;
  }

  .hero-x::before, .hero-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 13px;
    height: var(--hairline);
    background: var(--cross-ink);
    transition: background 600ms ease;
  }

  .hero-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .hero-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  .cta {
    position: relative;
    justify-self: center;
    width: max-content;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 22px;
    margin-top: clamp(8px, 3vh, 26px);
    border: var(--hairline) solid var(--cross-ink);
    background: rgba(6, 5, 7, 0.88);
    color: #f2ede3;
    font-family: var(--type-us);
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    white-space: nowrap;
    text-decoration: none;
    transition: border-color 500ms ease, box-shadow 500ms ease, color 500ms ease;
  }

  .cta::before {
    content: "";
    position: absolute;
    top: -1px;
    bottom: -1px;
    left: 0;
    width: 3px;
    background: var(--us-nasa);
  }

  .cta::after {
    content: "";
    position: absolute;
    top: -1px;
    bottom: -1px;
    right: 0;
    width: 3px;
    background: var(--cn-gold-hi);
  }

  .cta:hover, .cta:focus-visible {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 24px rgba(143, 177, 255, 0.3), 0 0 60px rgba(210, 169, 79, 0.22);
  }

  .hero-hint {
    margin: 0;
    font-family: var(--type-cn);
    font-size: 10.5px;
    letter-spacing: 0.24em;
    color: var(--cn-dim);
  }

  @media (max-width: 1023px) {
    .hero-us, .hero-cn {
      align-items: flex-start;
      text-align: left;
      padding-right: 0;
      padding-left: 0;
    }

    .cta { margin-top: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cta, .hero-x, .hero-x::before, .hero-x::after { transition: none; }
  }
`;

export default function Hero() {
  return (
    <section className="rail-grid hero" aria-label="The thesis">
      <style>{HERO_CSS}</style>

      {/* AMERICA half of the thesis: left-anchored, grotesque */}
      <div className="hero-side hero-us">
        <p className="hero-kicker">Thesis · 01</p>
        <h1 className="hero-headline hero-headline--us">
          Two civilizations are racing to build{" "}
          <span className="hl-us">the machine</span> that builds everything else.
        </h1>
        <p className="hero-sub">One spine · two rails · no neutral ground</p>
      </div>

      {/* CTA on the spine: straddles both rails, so entering crosses the line */}
      <div className="hero-spine">
        <span className="hero-x" aria-hidden="true" />
        <a className="cta" href="#spec">Enter the comparison</a>
        <p className="hero-hint" lang="zh-CN">进入对照 · 双轨</p>
      </div>

      {/* CHINA half: right-anchored, Song serif */}
      <div className="hero-side hero-cn">
        <p className="hero-kicker" lang="zh-CN">论点 · 壹</p>
        <p className="hero-headline hero-headline--cn" lang="zh-CN">
          两个文明，同时锻造<span className="hl-cn">下一台机器</span>。
        </p>
        <p className="hero-sub" lang="zh-CN">一条脊柱 · 两条轨道</p>
      </div>
    </section>
  );
}
