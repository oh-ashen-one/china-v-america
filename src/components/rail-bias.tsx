"use client";

/*
 * US-002 — Cursor-X crossfade.
 * Tracks the pointer against the center spine (50vw). Crossing it flips
 * data-rail on <html>, which crossfades the ambient rail bias, the spine
 * line ink and every --cross-ink surface in globals.css. Arrow keys give
 * keyboard users the same control. Touch is left alone (no scroll hijack).
 */

import { useEffect } from "react";

type Rail = "us" | "cn";

export default function RailBias() {
  useEffect(() => {
    const root = document.documentElement;
    let rafId = 0;

    const setRail = (rail: Rail) => {
      if (root.dataset.rail !== rail) root.dataset.rail = rail;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setRail(e.clientX < window.innerWidth * 0.5 ? "us" : "cn");
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setRail("us");
      if (e.key === "ArrowRight") setRail("cn");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
