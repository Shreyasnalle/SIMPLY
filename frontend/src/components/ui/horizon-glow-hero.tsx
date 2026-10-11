"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ── types ───────────────────────────────────────────────────── */

export interface HorizonGlowHeroProps {
  /** Small line above the headline. */
  eyebrow?: React.ReactNode;
  /** The headline. */
  title: React.ReactNode;
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
  "conic-gradient(from 0deg at 50% 50%, #ffffff 0deg, var(--color-chart-2) 10deg, var(--color-chart-1) 60deg, var(--color-chart-1) 180deg, var(--color-chart-5) 180deg, var(--color-chart-5) 300deg, var(--color-chart-3) 350deg, #ffffff 360deg)";

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
 * A dark "planet horizon" hero. As the section scrolls, a halo swells behind
 * the arc, a colour rim wipes on from left to right and saturates, and the
 * headline un-blurs into place above it.
 */
export function HorizonGlowHero({
  eyebrow,
  title,
  children,
  rimGradient = DEFAULT_RIM,
  className,
}: HorizonGlowHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const still = Boolean(prefersReducedMotion);
  const sectionRef = React.useRef<HTMLElement>(null);
  const edgeId = React.useId();

  const progress = useMotionValue(0);

  useIsomorphicLayoutEffect(() => {
    if (still) {
      progress.set(1);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const win = el.ownerDocument.defaultView ?? window;

    // Detect standalone/fixed viewport height mode vs scroll scrub mode
    const isFixedViewport =
      el.offsetHeight <= win.innerHeight + 10 ||
      className?.includes("h-svh") ||
      className?.includes("h-screen");

    if (isFixedViewport) {
      const controls = animate(progress, 1, { duration: 1.8, ease: "easeOut" });
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
  }, [still, progress, className]);

  /* timeline — each layer owns a slice of the scroll */
  const edgeOpacity = useStep(progress, [0, 0.2], [0, 1]);
  const haloOpacity = useStep(progress, [0.05, 0.45], [0, 1]);
  const haloScale = useStep(progress, [0.05, 0.45], [0.84, 1]);

  const rimOpacity = useStep(progress, [0.1, 0.25], [0, 1]);
  const wipe = useStep(progress, [0.1, 0.65], [0, 1]);
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
      className={cn("relative h-[250vh] w-full bg-background", className)}
    >
      <div
        className="sticky top-0 h-svh min-h-[40rem] w-full overflow-hidden"
        style={
          {
            containerType: "inline-size",
            "--orb": "max(135cqw, 56rem)",
            "--cap": "clamp(13rem, 42%, 22rem)",
          } as React.CSSProperties
        }
      >
        {/* hairline texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-foreground/[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 8px)",
          }}
        />

        {/* falling streaks */}
        {!still && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {STREAKS.map((s) => (
              <motion.div
                key={s.left}
                className="absolute top-0 h-[360px] w-0.5 origin-top-left"
                style={{
                  left: s.left,
                  scaleX: s.scaleX,
                  scaleY: s.scaleY,
                  background:
                    "linear-gradient(transparent, color-mix(in oklab, var(--color-foreground) 50%, transparent) 50%, transparent)",
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
        )}

        {/* headline — sits 4rem above the top of the arc */}
        <div
          className="absolute inset-x-0 z-20 flex flex-col items-center px-6"
          style={{ bottom: "calc(var(--cap) + 4rem)" }}
        >
          <motion.div
            style={{ y: textY }}
            className="flex max-w-full flex-col items-center gap-1 text-center"
          >
            {eyebrow && (
              <motion.p
                style={{ opacity: eyebrowOpacity, filter: eyebrowFilter }}
                className="text-sm text-muted-foreground will-change-[filter,opacity] sm:text-base"
              >
                {eyebrow}
              </motion.p>
            )}
            <motion.h2
              style={{ opacity: titleOpacity, filter: titleFilter }}
              className="max-w-full text-balance text-[40px] font-semibold leading-none tracking-[-0.024em] text-foreground will-change-[filter,opacity] sm:text-[48px] md:text-[56px] lg:text-[72px] xl:text-[96px]"
            >
              {title}
            </motion.h2>
            {children && (
              <motion.div
                style={{ opacity: titleOpacity, filter: titleFilter }}
                className="mt-6"
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

        {/* planet + colour rim, fading out into the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to top, transparent 0, #000 64px)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0, #000 64px)",
          }}
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

// --- Demo ---

export function HorizonGlowHeroDemo() {
  return (
    <HorizonGlowHero
      eyebrow="Your tools, docs and conversations"
      title="Finally in sync"
      className="h-svh"
    >
      <div className="flex gap-3">
        <button className="h-10 rounded-md bg-white px-5 text-sm font-medium text-black transition-opacity hover:opacity-90 cursor-pointer shadow-sm">
          Get started
        </button>
        <button className="h-10 rounded-md border border-neutral-800 bg-neutral-900/80 px-5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800 cursor-pointer">
          Learn more
        </button>
      </div>
    </HorizonGlowHero>
  );
}

export default HorizonGlowHero;
