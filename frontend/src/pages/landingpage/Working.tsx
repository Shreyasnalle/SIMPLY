import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";

// Replace with your demo video (file in /public, or an embed URL).
const VIDEO_SRC = "/demo.mp4";
const VIDEO_POSTER = "";

export function Working() {
  const [failed, setFailed] = React.useState(false);

  return (
    <section
      id="working"
      className="relative w-full scroll-mt-24 bg-background px-4 py-24 sm:px-8 sm:py-32"
    >
      <div aria-hidden className="bg-grid-faint pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Demo"
          title="See Simply in action"
          description="What Simply offers and how to use it, in under two minutes."
        />

        <Reveal delay={0.1} y={32} className="relative mt-14">
          {/* soft glow behind the player */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-0 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)] blur-2xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-1.5 shadow-2xl shadow-black/60 sm:rounded-3xl sm:p-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl">
              {failed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <span className="flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
                    <svg viewBox="0 0 24 24" className="ml-0.5 size-6 fill-current">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-sm">Demo video coming soon</span>
                </div>
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={VIDEO_SRC}
                  poster={VIDEO_POSTER || undefined}
                  controls
                  preload="metadata"
                  playsInline
                  onError={() => setFailed(true)}
                />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Working;
