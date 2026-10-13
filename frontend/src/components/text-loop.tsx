"use client";

import React, { useEffect, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface TextLoopProps {
  /** Text that stays fixed before the rotating word(s). */
  staticText?: string;
  /** Array of strings to rotate through. */
  rotatingTexts?: string[];
  className?: string;
  /** Interval in ms between word swaps. */
  interval?: number;
  transition?: Transition;
  staticTextClassName?: string;
  rotatingTextClassName?: string;
  /** Override the faint background highlight behind the rotating word. */
  backgroundClassName?: string;
  cursorClassName?: string;
}

export function TextLoop({
  staticText = "Design",
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 3000,
  transition = { duration: 0.7, ease: "easeInOut" },
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [rotatingTexts.length, interval]);

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "flex flex-row flex-wrap items-center justify-center w-full font-serif font-normal tracking-[-0.015em]",
          className,
        )}
      >
        {/* Static prefix — hidden when empty */}
        {staticText && (
          <span
            className={cn(
              "whitespace-nowrap text-foreground",
              staticTextClassName,
            )}
          >
            {staticText}
          </span>
        )}

        {/* Rotating word container */}
        <div className={cn("relative flex items-center", staticText && "ml-[0.28em]")}>
          <AnimatePresence mode="wait">
            <m.div
              key={rotatingTexts[index]}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition}
              className="overflow-hidden whitespace-nowrap relative"
            >
              {/* Faint dark background highlight — uses --secondary (#27272A) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-sm",
                  "bg-gradient-to-r from-transparent via-secondary/60 to-secondary/80",
                  backgroundClassName,
                )}
              />

              {/* Rotating word — muted-foreground (#A1A1AA) for contrast against white static text */}
              <span
                className={cn(
                  "relative text-muted-foreground pr-[0.15em]",
                  rotatingTextClassName,
                )}
              >
                {rotatingTexts[index]}
              </span>
            </m.div>
          </AnimatePresence>

          {/* Blinking cursor — muted-foreground grey */}
          <m.div
            className={cn(
              "w-[2px] md:w-[3px] bg-muted-foreground h-[0.85em]",
              cursorClassName,
            )}
            animate={{ opacity: [1, 0.1] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    </LazyMotion>
  );
}

export default TextLoop;

// --- Demo (not called in production landing page) ---
export function TextLoopDemo() {
  return (
    <div className="flex min-h-[350px] w-full items-center justify-center p-8 bg-background">
      <TextLoop
        staticText="Learning shouldn't need"
        rotatingTexts={[
          "ten tabs",
          "rewinding twice",
          "context aware answers",
          "generic teaching",
        ]}
        className="text-[clamp(2rem,6vw,5rem)]"
      />
    </div>
  );
}
