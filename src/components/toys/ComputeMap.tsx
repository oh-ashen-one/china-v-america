"use client";

/*
 * US-008 - Toy 3: the compute map. A canvas plot of where the labs sit
 * (US rail left, CN rail right) and which flows cross the spine. Blocked
 * flows are the export-control regime, drawn as severed dashed lines.
 */

import { useEffect, useRef } from "react";

type Node = {
  id: string;
  x: number; /* 0..1 within its half */
  y: number; /* 0..1 vertical */
  rail: "us" | "cn";
  label: string;
  cjk?: string;
  size: number;
};

type Flow = { from: string; to: string; blocked: boolean; weight: number };

const US_NODES: Node[] = [
  { id: "us-0", x: 0.16, y: 0.14, rail: "us", label: "OpenAI", size: 13 },
  { id: "us-1", x: 0.24, y: 0.58, rail: "us", label: "Anthropic", size: 12 },
  { id: "us-2", x: 0.1, y: 0.78, rail: "us", label: "DeepMind", size: 12 },
  { id: "us-3", x: 0.34, y: 0.36, rail: "us", label: "xAI", size: 11 },
  { id: "us-4", x: 0.28, y: 0.86, rail: "us", label: "Meta", size: 12 },
];

const CN_NODES: Node[] = [
  { id: "cn-0", x: 0.7, y: 0.32, rail: "cn", label: "Qwen", cjk: "通义千问", size: 13 },
  { id: "cn-1", x: 0.78, y: 0.52, rail: "cn", label: "DeepSeek", cjk: "深度求索", size: 12 },
  { id: "cn-2", x: 0.84, y: 0.76, rail: "cn", label: "Huawei", cjk: "华为", size: 13 },
];

const FLOWS: Flow[] = [
  { from: "us-0", to: "cn-1", blocked: false, weight: 0.7 },
  { from: "us-3", to: "cn-2", blocked: false, weight: 0.5 },
  { from: "us-4", to: "cn-0", blocked: false, weight: 0.6 },
  { from: "us-1", to: "cn-3", blocked: true, weight: 0.4 },
  { from: "us-2", to: "cn-4", blocked: true, weight: 0.3 },
];

const ALL_NODES = [...US_NODES, ...CN_NODES];

function nodeById(id: string): Node | undefined {
  return ALL_NODES.find((n) => n.id === id);
}

/* Convert normalized coords to canvas pixels. US nodes live in left half,
   CN nodes in right half. The spine is at x = 0.5 of the canvas width. */
function toCanvas(n: Node, w: number, h: number): { x: number; y: number } {
  const x = n.x * w;
  const padY = h * 0.12;
  const y = padY + n.y * (h - padY * 2);
  return { x, y };
}

const MAP_CSS = `
  .cmap { align-items: start; }

  .cm-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(72px, 9vw, 148px) minmax(0, 1fr);
    column-gap: clamp(20px, 3vw, 56px);
    align-items: center;
    margin-bottom: clamp(14px, 2vh, 22px);
  }

  .cm-head-side { margin: 0; font-size: 10.5px; letter-spacing: 0.32em; text-transform: uppercase; }
  .cm-head-us { color: var(--us-nasa-glow); font-family: var(--type-us); justify-self: start; }
  .cm-head-cn { color: var(--cn-gold-hi); font-family: var(--type-cn); letter-spacing: 0.24em; justify-self: end; }

  .cm-head-mid {
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

  .cm-head-x {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: var(--hairline) solid var(--cross-ink);
  }

  .cm-head-x::before, .cm-head-x::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 11px;
    height: var(--hairline);
    background: var(--cross-ink);
  }

  .cm-head-x::before { transform: translate(-50%, -50%) rotate(45deg); }
  .cm-head-x::after  { transform: translate(-50%, -50%) rotate(-45deg); }

  .cm-lead {
    margin: 0;
    padding: 12px 16px;
    border-left: 3px solid var(--cross-ink);
    background: rgba(7, 5, 6, 0.6);
    font-size: 13px;
    line-height: 1.7;
    color: var(--us-ink);
    letter-spacing: 0.02em;
  }

  .cm-canvas-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    border: var(--hairline) solid rgba(143, 168, 205, 0.2);
    background: linear-gradient(90deg, rgba(10, 15, 21, 0.86) 0%, rgba(10, 15, 21, 0.86) 49.5%, rgba(37, 16, 9, 0.88) 50.5%, rgba(37, 16, 9, 0.88) 100%);
  }

  .cm-canvas-wrap canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

  .cm-legend {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 9.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .cm-legend span:nth-child(1) { color: var(--us-nasa-glow); }
  .cm-legend span:nth-child(2) { color: var(--cn-gold-hi); }
  .cm-legend span:nth-child(3) { color: var(--cn-cinnabar); }

  @media (max-width: 1023px) {
    .cm-head { grid-template-columns: minmax(0, 1fr); row-gap: 14px; }
    .cm-head-mid { justify-self: start; }
  }
`;

export default function ComputeMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      /* spine */
      const midX = w / 2;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(midX, h * 0.06);
      ctx.lineTo(midX, h * 0.94);
      ctx.stroke();
      ctx.setLineDash([]);

      /* flows */
      for (const f of FLOWS) {
        const a = nodeById(f.from);
        const b = nodeById(f.to);
        if (!a || !b) continue;
        const pa = toCanvas(a, w, h);
        const pb = toCanvas(b, w, h);

        if (f.blocked) {
          ctx.strokeStyle = "rgba(222, 74, 47, 0.55)";
          ctx.setLineDash([3, 6]);
        } else {
          ctx.strokeStyle = `rgba(143, 168, 205, ${0.2 + f.weight * 0.4})`;
          ctx.setLineDash([]);
        }
        ctx.lineWidth = 1 + f.weight * 1.4;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        const cx = (pa.x + pb.x) / 2;
        ctx.quadraticCurveTo(cx, Math.min(pa.y, pb.y) - h * 0.08, pb.x, pb.y);
        ctx.stroke();
        ctx.setLineDash([]);

        if (f.blocked) {
          const bx = cx;
          const by = Math.min(pa.y, pb.y) - h * 0.04;
          ctx.strokeStyle = "rgba(222, 74, 47, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(bx - 6, by - 6);
          ctx.lineTo(bx + 6, by + 6);
          ctx.moveTo(bx + 6, by - 6);
          ctx.lineTo(bx - 6, by + 6);
          ctx.stroke();
        }
      }

      /* nodes */
      for (const n of ALL_NODES) {
        const p = toCanvas(n, w, h);
        const r = n.size;

        if (n.rail === "us") {
          ctx.fillStyle = "#2f5fc2";
        } else {
          ctx.fillStyle = "#de4a2f";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = n.rail === "us" ? "rgba(143, 177, 255, 0.8)" : "rgba(240, 212, 141, 0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.55 + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = n.rail === "us" ? "#e9eef6" : "#f3e9d7";
        ctx.font = `${n.size - 1}px "Space Grotesk", sans-serif`;
        ctx.textAlign = n.rail === "us" ? "right" : "left";
        ctx.textBaseline = "middle";
        const labelX = n.rail === "us" ? p.x - r * 0.55 - 8 : p.x + r * 0.55 + 8;
        ctx.fillText(n.label, labelX, p.y);

        if (n.cjk) {
          ctx.fillStyle = "rgba(210, 169, 79, 0.8)";
          ctx.font = `${n.size - 2}px "Noto Serif SC", serif`;
          ctx.fillText(n.cjk, labelX, p.y + n.size * 0.85);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="compute-map" className="rail-grid cmap" aria-label="Toy: the compute map">
      <style>{MAP_CSS}</style>

      <div className="cm-head">
        <p className="cm-head-side cm-head-us">Toy 03 · Compute Map</p>
        <div className="cm-head-mid" aria-hidden="true">
          <span className="cm-head-x" />
          <span>Flows</span>
        </div>
        <p className="cm-head-side cm-head-cn" lang="zh-CN">算力地图 · 叁</p>
      </div>

      <p className="cm-lead">
        Where the labs sit, and which flows still cross the spine. The severed lines are the
        export-control regime: chips that were supposed to move east and do not. Estimates labeled EST.
      </p>

      <div className="cm-canvas-wrap">
        <canvas ref={canvasRef} aria-label="Canvas map of US and CN compute labs with cross-spine flows" />
      </div>

      <div className="cm-legend">
        <span>US rail · left</span>
        <span lang="zh-CN">CN 轨 · 右</span>
        <span>Blocked = export control</span>
      </div>
    </section>
  );
}
