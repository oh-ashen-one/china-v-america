"use client";

/**
 * World engine — the single source of runtime state for the film.
 *  - cursor X → `--wx` crossfade (rAF, zero React re-renders)
 *  - scroll progress → `--sp` (spine node)
 *  - localStorage prefs: grain / letterbox / art direction / rail focus
 *  - synthesized sound ticks (WebAudio), muted by default
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Time = "night" | "day";
export type RailFocus = "auto" | "us" | "cn";

export interface Prefs {
  sound: boolean;   // default OFF — the film is silent until invited in
  grain: boolean;
  letterbox: boolean;
  time: Time;
  rail: RailFocus;
}

const DEFAULTS: Prefs = { sound: false, grain: true, letterbox: true, time: "night", rail: "auto" };
const PREFS_KEY = "cc26.prefs";
const BOOT_KEY = "cc26.boot-seen";

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULTS, ...p };
  } catch {
    return DEFAULTS;
  }
}

function savePrefs(p: Prefs) {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — fine for the film */
  }
}

/* ------------------------------------------------- boot memory ---------- */
export function bootWasSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false;
  }
}
export function markBootSeen() {
  try {
    window.localStorage.setItem(BOOT_KEY, "1");
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------- sound engine ---------- */
export type Tick = "hover" | "token" | "scrub" | "stamp" | "ui";

interface TickSpec {
  f: number;
  d: number; // seconds
  g: number; // peak gain
  type: OscillatorType;
}

const SPECS: Record<Tick, TickSpec> = {
  hover: { f: 1180, d: 0.035, g: 0.026, type: "sine" },
  token: { f: 740, d: 0.03, g: 0.018, type: "square" },
  scrub: { f: 196, d: 0.05, g: 0.03, type: "triangle" },
  stamp: { f: 1240, d: 0.09, g: 0.05, type: "sine" },
  ui: { f: 620, d: 0.045, g: 0.03, type: "sine" },
};

export class SoundEngine {
  on = false;
  private ctx: AudioContext | null = null;
  private last: Partial<Record<Tick, number>> = {};

  setOn(v: boolean) {
    this.on = v;
    if (v) this.unlock();
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx ??= new AC();
      return this.ctx;
    } catch {
      return null;
    }
  }

  /** call on first user gesture so Chrome/iOS resume the context */
  unlock() {
    const c = this.ensure();
    if (c && c.state === "suspended") void c.resume().catch(() => {});
  }

  tick(t: Tick) {
    if (!this.on) return;
    const c = this.ensure();
    if (!c || c.state !== "running") {
      this.unlock(); // audible on the next event after resume
      return;
    }
    const now = performance.now();
    const minGap = t === "token" ? 26 : t === "scrub" ? 70 : 34;
    if (now - ((this.last[t] as number) ?? 0) < minGap) return;
    this.last[t] = now;

    const s = SPECS[t];
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    if (t === "token") {
      osc.frequency.setValueAtTime(s.f + Math.random() * 260, t0);
    } else if (t === "stamp") {
      osc.frequency.setValueAtTime(s.f, t0);
      osc.frequency.exponentialRampToValueAtTime(312, t0 + s.d);
    } else {
      osc.frequency.setValueAtTime(s.f, t0);
    }

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(s.g, t0 + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, t0 + s.d);

    osc.type = s.type;
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + s.d + 0.02);
  }
}

/* ------------------------------------------------- context --------------- */
interface WorldValue {
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  sound: SoundEngine;
  bootDone: boolean;
  markBootDone: () => void;
}

const WorldCtx = createContext<WorldValue | null>(null);

export function useWorld(): WorldValue {
  const v = useContext(WorldCtx);
  if (!v) throw new Error("useWorld must be used inside <WorldProvider>");
  return v;
}

export function readVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** target world focus set externally (rail switcher / command palette) */
type RailTargetEvent = Event & { detail: number };
export function pushRailTarget(v: number) {
  window.dispatchEvent(new CustomEvent("cc26:rail", { detail: v }));
}

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULTS);
  const [bootDone, setBootDone] = useState(false);
  const soundRef = useRef<SoundEngine | null>(null);
  if (!soundRef.current) soundRef.current = new SoundEngine();

  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  /* hydrate prefs once */
  useEffect(() => {
    setPrefsState(loadPrefs());
  }, []);

  /* apply prefs to <html> + sound engine */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.time = prefs.time;
    root.dataset.grain = prefs.grain ? "on" : "off";
    root.dataset.letterbox = prefs.letterbox ? "on" : "off";
    root.dataset.rail = prefs.rail;
    soundRef.current!.setOn(prefs.sound);
  }, [prefs]);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  /* ---------- the rAF loop: --wx (world) + --sp (scroll) ---------- */
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let wx = 0; // current, eased toward target
    const tgt = { v: 0 }; // mutable target shared with listeners

    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const onMove = (e: PointerEvent) => {
      if (!finePointer.matches || prefsRef.current.rail !== "auto") return;
      tgt.v = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    };

    const onRail = (e: Event) => {
      tgt.v = (e as RailTargetEvent).detail;
    };

    /* keep target coherent when the rail pref itself changes */
    const syncFromPrefs = () => {
      if (prefsRef.current.rail === "us") tgt.v = 0;
      else if (prefsRef.current.rail === "cn") tgt.v = 1;
    };

    const teleUs = document.getElementById("tele-us");
    const teleCn = document.getElementById("tele-cn");
    let lastPct = -1;

    const loop = () => {
      raf = requestAnimationFrame(loop);

      const k = prm.matches ? 1 : 0.075; // reduced motion: snap, no easing drift
      const next = wx + (tgt.v - wx) * k;
      if (Math.abs(next - wx) > 0.0015) {
        wx = next;
        root.style.setProperty("--wx", wx.toFixed(4));

        const usPct = Math.round((1 - wx) * 100);
        if (usPct !== lastPct) {
          lastPct = usPct;
          if (teleUs) teleUs.textContent = String(usPct).padStart(3, "0") + "%";
          if (teleCn) teleCn.textContent = String(100 - usPct).padStart(3, "0") + "%";
        }
      }

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 4) {
        const nsp = Math.min(1, Math.max(0, window.scrollY / max));
        if (Math.abs(nsp - ((root as unknown as { __cc26sp?: number }).__cc26sp ?? -1)) > 0.004) {
          (root as unknown as { __cc26sp: number }).__cc26sp = nsp;
          root.style.setProperty("--sp", nsp.toFixed(4));
        }
      }
    };

    syncFromPrefs();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("cc26:rail" as never, onRail);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("cc26:rail" as never, onRail);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* rail pref changes → nudge the loop's target */
  useEffect(() => {
    if (prefs.rail === "us") pushRailTarget(0);
    else if (prefs.rail === "cn") pushRailTarget(1);
  }, [prefs.rail]);

  /* gesture unlock for WebAudio */
  useEffect(() => {
    const unlock = () => soundRef.current!.unlock();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  /* global reveal observer (boot-gated reveals opt in via data-rv-gate) */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv:not([data-rv-gate])"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const markBootDone = useCallback(() => setBootDone(true), []);
  const sound = useMemo(() => soundRef.current!, []);

  return (
    <WorldCtx.Provider value={{ prefs, setPrefs, sound, bootDone, markBootDone }}>
      {children}
    </WorldCtx.Provider>
  );
}

/* ------------------------------------------------- hooks ---------------- */
export function usePRM(): boolean {
  const [prm, setPrm] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrm(m.matches);
    const f = (e: MediaQueryListEvent) => setPrm(e.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return prm;
}

/** boot-gated reveal: watch an element, add .is-in only once `armed` is true */
export function useGateReveal<T extends HTMLElement>(ref: React.RefObject<T | null>, armed: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, armed]);
}
