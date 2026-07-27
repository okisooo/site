"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Entry sequence. A crimson iris + assembling wordmark, then a split-door
 * reveal (two panels part vertically). Runs once per mount; under reduced
 * motion it resolves instantly so nothing is gated behind animation.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rm = useReducedMotion();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (rm) {
      setShow(false);
      onDone();
      return;
    }
    const t = setTimeout(() => {
      setShow(false);
      onDone();
    }, 1850);
    return () => clearTimeout(t);
  }, [rm, onDone]);

  if (rm) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" aria-hidden>
          {/* split doors */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[var(--rn-ink)]"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--rn-ink)]"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* center seam glow */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--rn-brass)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {/* Wordmark. The seam is fixed at viewport 50% (both doors are h-1/2),
              so the TITLE — not this block — is what has to be centred on it, or
              the split lands above the letterforms.
              Two corrections:
              1. "Table Open" is taken out of flow (absolute), otherwise its
                 height + gap sits inside the centred block and pushes the h2 down.
              2. `leading-none` plus a -0.05em nudge ON THE H2. Measured on Playfair
                 Display: at 60px the cap-height centre falls 3px BELOW the line-box
                 centre (ascent 44, so cap centre is 33px from the box top vs 30px
                 for the box). 3/60 = 0.05em, and being em-based it holds at both
                 the text-4xl and md:text-6xl sizes.
                 The nudge must sit on the h2, not this wrapper — `em` resolves
                 against the element's OWN font-size, and the wrapper inherits 16px,
                 which would apply 0.8px instead of 3px. */}
          <motion.div
            className="relative z-10 text-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="rn-mono absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-[var(--rn-brass)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Table Open
            </motion.div>
            <motion.h2
              className="-translate-y-[0.05em] text-4xl font-black uppercase leading-none tracking-tighter text-[var(--rn-ivory)] md:text-6xl"
              initial={{ letterSpacing: "0.4em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Rouge<span className="text-[var(--rn-oxblood)]">&amp;</span>Noir
            </motion.h2>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
