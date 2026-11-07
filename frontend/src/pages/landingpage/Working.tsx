import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { SectionFrame } from "@/components/ui/section-frame";

// Replace with your demo video (file in /public, or an embed URL).
const VIDEO_SRC = "/demo.mp4";
const VIDEO_POSTER = "";

export function Working() {
  const [failed, setFailed] = React.useState(false);

  return (
    <SectionFrame id="working">
      <SectionHeader
        eyebrow="Demo"
        title="See Simply in action"
        description="What Simply offers and how to use it, in under two minutes."
      />
      <div className="px-5 pb-10 sm:px-8">
        <Reveal delay={0.1} y={32} className="relative">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-card p-1.5 sm:p-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
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
    </SectionFrame>
  );
}

export default Working;
