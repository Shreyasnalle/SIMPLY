"use client";

import { motion } from "motion/react";

// Same hairline grid + falling light streaks as the landing-page hero.
const STREAKS = [
  { left: "2%", scaleY: 0.79, peak: 0.2, duration: 7, delay: 0 },
  { left: "10%", scaleY: 0.65, peak: 0.16, duration: 9, delay: 3.2 },
  { left: "29%", scaleY: 0.92, peak: 0.22, duration: 8, delay: 1.4 },
  { left: "41%", scaleY: 0.66, peak: 0.21, duration: 10, delay: 5.1 },
  { left: "67%", scaleY: 0.65, peak: 0.26, duration: 7.5, delay: 2.3 },
  { left: "81%", scaleY: 0.9, peak: 0.18, duration: 8.5, delay: 4.4 },
  { left: "93%", scaleY: 0.7, peak: 0.18, duration: 9, delay: 6 },
];

export function LineBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          color: "color-mix(in oklab, var(--foreground) 9%, transparent)",
          backgroundImage:
            "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 10px)",
        }}
      />
      <div className="absolute inset-0 motion-reduce:hidden">
        {STREAKS.map((s) => (
          <motion.div
            key={s.left}
            className="absolute top-0 h-[360px] w-px origin-top-left"
            style={{
              left: `round(down, ${s.left}, 10px)`,
              scaleY: s.scaleY,
              background:
                "linear-gradient(transparent, color-mix(in oklab, var(--foreground) 85%, transparent) 50%, transparent)",
            }}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: ["-100%", "260%"], opacity: [0, s.peak, 0] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    </div>
  );
}
