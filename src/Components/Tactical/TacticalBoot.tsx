"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Boot sequence. The first ~1.6s of the site.
 *
 * Design intent: it should read as a system coming online, not as a spinner.
 * Short, hard-edged, and it ends on a diagonal wipe rather than a fade so the
 * hero arrives with a cut instead of a dissolve.
 *
 * Two rules it must never break:
 *  1. It NEVER gates content. The hero renders underneath from the first frame;
 *     this is an overlay that leaves. If the animation dies, a hard timeout
 *     still tears it down, so the page can't be held hostage by a failed
 *     transition (docs/HANDOFF.md — a hidden-then-reveal pair once shipped a
 *     completely blank hero).
 *  2. Reduced motion skips it entirely — no flash, no delay.
 *
 * Skippable on any click or key. Nobody should be forced to watch it twice.
 */

const LINES = [
  "LINK ESTABLISHED",
  "CH.01 / 2026",
  "SUBJECT-01 // オキソ",
  "ARCHIVE MOUNTED",
];

/** Total time before the overlay is gone no matter what. */
const HARD_TIMEOUT_MS = 3200;

export default function TacticalBoot() {
  const reduced = useReducedMotion();
  /* 'up' → 'leaving' → 'gone'.
     Unmounting is driven by a TIMER, never by the exit animation finishing.
     AnimatePresence was used first and the overlay stuck permanently whenever
     rAF was starved (background tab, throttled renderer): the exit animation
     never completed, so the component never unmounted and the whole site sat
     behind a black screen. An entry sequence must not be able to trap the page. */
  const [phase, setPhase] = useState<"up" | "leaving" | "gone">("up");
  const [pct, setPct] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("leaving");
    window.setTimeout(() => setPhase("gone"), 700);
  };

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }

    // Counter: pure state on one leaf node, no layout thrash.
    const started = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - started) / 900);
      setPct(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const close = window.setTimeout(finish, 1500);
    const hard = window.setTimeout(finish, HARD_TIMEOUT_MS);

    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(close);
      window.clearTimeout(hard);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [reduced]);

  if (reduced || phase === "gone") return null;

  return (
    <motion.div
      className="tac-boot"
      aria-hidden
      initial={{ clipPath: "polygon(0 0, 130% 0, 100% 100%, 0 100%)" }}
      animate={
        phase === "leaving"
          ? { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }
          : { clipPath: "polygon(0 0, 130% 0, 100% 100%, 0 100%)" }
      }
      transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="tac-boot-inner">
            <div className="tac-boot-head">
              <span className="tac-boot-mark" />
              <span>OKISO SYSTEM</span>
            </div>

            <ul className="tac-boot-lines">
              {LINES.map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.13, duration: 0.28, ease: "easeOut" }}
                >
                  <span className="tac-boot-ok">OK</span>
                  {l}
                </motion.li>
              ))}
            </ul>

            <div className="tac-boot-meter">
              <motion.span
                className="tac-boot-meter-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
        <div className="tac-boot-pct">{String(pct).padStart(3, "0")}</div>
      </div>
    </motion.div>
  );
}
