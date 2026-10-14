"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { TextLoop } from "@/components/text-loop";

/* ── types ───────────────────────────────────────────────────── */

export interface HorizonGlowHeroProps {
  /** Small line above the headline. */
  eyebrow?: React.ReactNode;
  /** The headline. */
  title?: React.ReactNode;
  /** Optional content under the headline (CTAs, a form…). */
  children?: React.ReactNode;
  /**
   * Conic gradient painted on the planet's rim. 0deg is the top of the
   * horizon; the wipe opens it from the left (180–360deg) first. Defaults to
   * the shadcn chart tokens.
   */
  rimGradient?: string;
  className?: string;
}

/* ── constants ───────────────────────────────────────────────── */

// Built from shadcn chart tokens so the rim follows the host theme: in the
// default dark palette that reads blue on the right, red on the left and
// yellow near the top — like light catching a planet's atmosphere.
const DEFAULT_RIM =
  "conic-gradient(from 0deg at 50% 50%, var(--color-foreground) 0deg, var(--color-chart-2) 10deg, var(--color-chart-1) 60deg, var(--color-chart-1) 180deg, var(--color-chart-5) 180deg, var(--color-chart-5) 300deg, var(--color-chart-3) 350deg, var(--color-foreground) 360deg)";

// Dims the rim right at the top of the arc so the brightest white doesn't
// punch a hole in the headline above it.
const RIM_MASK =
  "conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.4) 0deg, #000 35deg, #000 325deg, rgba(0,0,0,0.4) 360deg)";

// Falling light streaks. Fixed values (not Math.random) so server and client
// render the same markup.
const STREAKS = [
  { left: "2%", scaleX: 0.68, scaleY: 0.79, peak: 0.2, duration: 7, delay: 0 },
  {
    left: "10%",
    scaleX: 0.54,
    scaleY: 0.65,
    peak: 0.16,
    duration: 9,
    delay: 3.2,
  },
  {
    left: "29%",
    scaleX: 0.63,
    scaleY: 0.92,
    peak: 0.22,
    duration: 8,
    delay: 1.4,
  },
  {
    left: "41%",
    scaleX: 1,
    scaleY: 0.66,
    peak: 0.21,
    duration: 10,
    delay: 5.1,
  },
  {
    left: "67%",
    scaleX: 0.71,
    scaleY: 0.65,
    peak: 0.26,
    duration: 7.5,
    delay: 2.3,
  },
  {
    left: "81%",
    scaleX: 0.86,
    scaleY: 0.9,
    peak: 0.18,
    duration: 8.5,
    delay: 4.4,
  },
];

/* ── helpers ─────────────────────────────────────────────────── */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Maps a slice of the scroll progress onto an output range. */
function useStep<T extends number>(
  progress: MotionValue<number>,
  [from, to]: [number, number],
  output: [T, T],
) {
  return useTransform(progress, [from, to], output, { clamp: true });
}

/**
 * A square that shares the planet's centre. Every layer (glow, disk, rim)
 * renders one of these, so they stay concentric at any size. `grow` pushes
 * the edge outward by a CSS length.
 */
function Orb({
  grow = "0px",
  className,
  style,
  children,
}: {
  grow?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const size = `calc(var(--orb) + 2 * ${grow})`;
  return (
    <div
      className={cn("absolute left-1/2", className)}
      style={{
        width: size,
        height: size,
        marginLeft: `calc(${size} / -2)`,
        top: `calc(100% - var(--cap) - ${grow})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── component ───────────────────────────────────────────────── */

/**
 * A "planet horizon" hero. As the section scrolls (or once on mount when it
 * fits the viewport), a halo swells behind the arc and a colour rim wipes on
 * from left to right and saturates, while light streaks fall behind it.
 *
 * The arc is sized so the globe meets the bottom-left and bottom-right
 * corners of the section exactly.
 *
 * Honours `prefers-reduced-motion`: renders fully revealed, no streaks, no
 * scroll listener.
 */
export function HorizonGlowHero({
  eyebrow,
  title,
  children,
  rimGradient = DEFAULT_RIM,
  className,
}: HorizonGlowHeroProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const edgeId = React.useId();

  // 0 → 1 as the section scrolls through.
  const progress = useMotionValue(0);

  useIsomorphicLayoutEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      progress.set(1);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const win = el.ownerDocument.defaultView ?? window;
    // No scroll room (e.g. `className="h-svh"`): nothing to scrub, so play
    // the reveal once on mount instead of sitting blank at progress 0.
    if (el.offsetHeight <= win.innerHeight) {
      const controls = animate(progress, 1, { duration: 2.4, ease: "easeOut" });
      return () => controls.stop();
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, rect.height - win.innerHeight);
      progress.set(Math.min(1, Math.max(0, -rect.top / travel)));
    };
    const onScroll = () => {
      if (!raf) raf = win.requestAnimationFrame(update);
    };
    update();
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onScroll);
    return () => {
      win.removeEventListener("scroll", onScroll);
      win.removeEventListener("resize", onScroll);
      if (raf) win.cancelAnimationFrame(raf);
    };
  }, [progress]);

  /* timeline — each layer owns a slice of the scroll */
  const edgeOpacity = useStep(progress, [0, 0.2], [0, 1]);
  const haloOpacity = useStep(progress, [0.05, 0.45], [0, 1]);
  const haloScale = useStep(progress, [0.05, 0.45], [0.84, 1]);

  const rimOpacity = useStep(progress, [0.1, 0.25], [0, 1]);
  const wipe = useStep(progress, [0.1, 0.65], [0, 1]);
  // Right edge of the clip slides from 100% to -64px, opening the colour
  // left → right. The -64px margins leave room for the blur to bleed.
  const rimClip = useTransform(
    wipe,
    (t) => `inset(-64px calc(${(1 - t) * 100}% - ${t * 64}px) -64px -64px)`,
  );
  const rimHue = useStep(progress, [0.1, 0.8], [-40, 0]);
  const rimSat = useStep(progress, [0.1, 0.8], [0.35, 1.25]);
  const rimFilter = useMotionTemplate`hue-rotate(${rimHue}deg) saturate(${rimSat})`;

  const eyebrowOpacity = useStep(progress, [0.35, 0.55], [0, 1]);
  const eyebrowBlur = useStep(progress, [0.35, 0.55], [1.5, 0]);
  const titleOpacity = useStep(progress, [0.45, 0.7], [0, 1]);
  const titleBlur = useStep(progress, [0.45, 0.7], [2.5, 0]);
  const textY = useStep(progress, [0.35, 0.7], [4, 0]);
  const eyebrowFilter = useTransform(eyebrowBlur, (b) => `blur(${b}px)`);
  const titleFilter = useTransform(titleBlur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className={cn("relative m-0 h-[250vh] w-full bg-background p-0", className)}
    >
      <div
        className="sticky top-0 m-0 h-svh min-h-[40rem] w-full overflow-hidden p-0"
        style={
          {
            // Planet geometry, in cqw so it scales with the page width. A cap
            // of 20cqw with a diameter of 145cqw makes the circle pass through
            // the bottom-left and bottom-right corners exactly:
            //   D = (W²/4 + h²) / h  with h = 0.2W  →  D = 1.45W
            containerType: "inline-size",
            "--orb": "145cqw",
            "--cap": "20cqw",
          } as React.CSSProperties
        }
      >
        {/* hairline texture — 1px lines every 10px, faintly visible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            color: "color-mix(in oklab, var(--color-foreground) 9%, transparent)",
            backgroundImage:
              "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 10px)",
          }}
        />

        {/* falling light that runs down the hairlines themselves: each streak
            is snapped to a hairline column (multiples of the 10px spacing) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
        >
          {STREAKS.map((s) => (
            <motion.div
              key={s.left}
              className="absolute top-0 h-[360px] w-px origin-top-left"
              style={{
                left: `round(down, ${s.left}, 10px)`,
                scaleY: s.scaleY,
                background:
                  "linear-gradient(transparent, color-mix(in oklab, var(--color-foreground) 85%, transparent) 50%, transparent)",
              }}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: ["-100%", "260%"], opacity: [0, s.peak, 0] }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Headline — always rendered, split into two stacked lines */}
        <div
          className="absolute inset-x-0 z-40 flex flex-col items-center px-6"
          style={{ bottom: "calc(var(--cap) + 3rem)" }}
        >
          <motion.div
            style={{ y: textY }}
            className="relative z-40 flex w-full max-w-5xl flex-col items-center gap-2 text-center"
          >
            {eyebrow && (
              <motion.p
                style={{ opacity: eyebrowOpacity, filter: eyebrowFilter }}
                className="text-sm text-muted-foreground will-change-[filter,opacity] sm:text-base"
              >
                {eyebrow}
              </motion.p>
            )}

            <div className="flex w-full flex-col items-center">
              {/* Line 1 — static, always in place */}
              <motion.h1
                style={{ opacity: titleOpacity, filter: titleFilter }}
                className="w-full font-serif font-normal text-foreground will-change-[filter,opacity] text-[clamp(2.2rem,5.5vw,6rem)] leading-[1.1] tracking-[-0.015em]"
              >
                Learning shouldn&apos;t need
              </motion.h1>

              {/* Line 2 — rotating tags, fixed below line 1 */}
              <motion.div
                style={{ opacity: titleOpacity, filter: titleFilter }}
                className="w-full will-change-[filter,opacity]"
              >
                <TextLoop
                  staticText=""
                  rotatingTexts={[
                    "ten tabs",
                    "vague answers",
                    "rewinding twice",
                  ]}
                  interval={3000}
                  className="text-[clamp(2.2rem,5.5vw,6rem)] leading-[1.1] justify-center"
                />
              </motion.div>
            </div>

            {children && (
              <motion.div
                style={{ opacity: titleOpacity, filter: titleFilter }}
                className="mt-4"
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* halo behind the arc */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          <Orb grow="calc(var(--orb) * 0.15)">
            <motion.div
              className="size-full will-change-[transform,opacity]"
              style={{
                opacity: haloOpacity,
                scale: haloScale,
                backgroundImage: `radial-gradient(circle closest-side, transparent 64%, ${[
                  [4, 71],
                  [12, 74.5],
                  [16, 75.5],
                  [12.5, 77.5],
                  [7, 80.5],
                  [3.5, 85],
                  [1.5, 91],
                ]
                  .map(
                    ([a, at]) =>
                      `color-mix(in oklab, var(--color-foreground) ${a}%, transparent) ${at}%`,
                  )
                  .join(", ")}, transparent 98%)`,
              }}
            />
          </Orb>
        </div>

        {/* planet + colour rim (no bottom fade, so it reaches the corners) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 will-change-[opacity,clip-path]"
            style={{ opacity: rimOpacity, clipPath: rimClip }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ filter: rimFilter }}
            >
              {/* wide soft bloom, then a tighter bright line */}
              {[
                { blur: 10, opacity: 0.45, grow: "3px" },
                { blur: 2, opacity: 1, grow: "2px" },
              ].map((l) => (
                <div
                  key={l.blur}
                  className="absolute inset-0"
                  style={{ filter: `blur(${l.blur}px)`, opacity: l.opacity }}
                >
                  <Orb
                    grow={l.grow}
                    className="rounded-full"
                    style={{
                      backgroundImage: rimGradient,
                      maskImage: RIM_MASK,
                      WebkitMaskImage: RIM_MASK,
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* the planet itself — covers the rim so only its edge glows */}
          <div className="absolute inset-0" style={{ filter: "blur(0.5px)" }}>
            <Orb className="rounded-full bg-background" />
          </div>

          <Orb>
            <motion.svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 size-full overflow-visible"
              style={{ opacity: edgeOpacity }}
            >
              <defs>
                <linearGradient id={edgeId} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0"
                    stopColor="var(--color-foreground)"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="0.33"
                    stopColor="var(--color-foreground)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="500"
                cy="500"
                r="500"
                fill="none"
                stroke={`url(#${edgeId})`}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>
          </Orb>
        </div>
      </div>
    </section>
  );
}

export default HorizonGlowHero;
