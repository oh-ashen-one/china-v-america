"use client";

import { useEffect, useState } from "react";

/**
 * The four custom loaders, used by the boot sequence and the arena.
 * Pure CSS (see globals.css .l-seal / .l-die / .l-rings / .l-scan).
 */

export type LdrKind = "seal" | "die" | "rings" | "scan";

export const LDR_KINDS: LdrKind[] = ["seal", "die", "rings", "scan"];

export function Ldr({
  kind,
  glyph = "算",
  className = "",
}: {
  kind: LdrKind;
  glyph?: string;
  className?: string;
}) {
  const needsGlyph = kind === "seal" || kind === "rings";
  return (
    <div className={`ldr l-${kind} ${className}`} aria-hidden="true">
      {needsGlyph ? <span className="g">{glyph}</span> : null}
    </div>
  );
}

/** cycles through all four kinds on an interval — the "calibrating" slot */
export function LdrCycler({ active, glyph = "算" }: { active: boolean; glyph?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % LDR_KINDS.length), 1700);
    return () => window.clearInterval(id);
  }, [active]);
  return <Ldr kind={LDR_KINDS[i]} glyph={glyph} />;
}
