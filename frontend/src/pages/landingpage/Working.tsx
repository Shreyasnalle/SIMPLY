import React from "react";

// Replace with your demo video (file in /public, or an embed URL).
const VIDEO_SRC = "/demo.mp4";
const VIDEO_POSTER = "";

export function Working() {
  return (
    <section
      id="working"
      className="relative w-full bg-background px-4 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          See Simply in action
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/60 sm:text-lg">
          What Simply offers and how to use it, in under two minutes.
        </p>

        {/* Video container */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
          <div className="relative aspect-video w-full">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={VIDEO_POSTER || undefined}
              controls
              preload="metadata"
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Working;
