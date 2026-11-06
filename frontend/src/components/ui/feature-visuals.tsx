import * as React from "react";
import { cn } from "@/lib/utils";

const shell = "flex h-full w-full flex-col justify-center gap-3 p-6 sm:p-8";
const bubble = "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] leading-relaxed text-zinc-300";
const chip = "inline-flex items-center rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-zinc-200";

export function AskVisual() {
  return (
    <div className={shell}>
      <div className={cn(bubble, "ml-auto max-w-[80%] bg-white/10 text-zinc-100")}>
        Why does the gradient go to zero at a minimum?
      </div>
      <div className={cn(bubble, "max-w-[90%]")}>
        At a minimum the slope is flat, so the derivative is 0. The lecturer shows this on the
        parabola example <span className={chip}>12:40</span> and recaps it in the summary{" "}
        <span className={chip}>31:05</span>.
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs text-zinc-500">
        Ask anything about this video…
      </div>
    </div>
  );
}

export function VoiceVisual() {
  const bars = [14, 28, 40, 22, 52, 34, 60, 30, 44, 18, 36, 24, 48, 20, 32];
  return (
    <div className={cn(shell, "items-center")}>
      <div className="flex h-20 items-center gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: h, animationDelay: `${i * 90}ms` }}
            className="w-1.5 animate-pulse rounded-full bg-gradient-to-t from-zinc-500 to-white"
          />
        ))}
      </div>
      <p className="text-sm text-zinc-300">&ldquo;Explain backpropagation like I&apos;m new to this.&rdquo;</p>
      <div className="flex gap-2 text-[11px] text-zinc-400">
        <span className={chip}>Hold Space to talk</span>
        <span className={chip}>Read aloud · 1.25×</span>
      </div>
    </div>
  );
}

export function WebVisual() {
  return (
    <div className={shell}>
      <div className="flex gap-1 self-start rounded-full border border-white/10 bg-black/30 p-1 text-xs">
        <span className="rounded-full bg-white px-3 py-1 font-medium text-black">Video + Web</span>
        <span className="px-3 py-1 text-zinc-500">Video only</span>
      </div>
      <div className={bubble}>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">From the video</p>
        Adam combines momentum with adaptive rates <span className={chip}>18:22</span>
      </div>
      <div className={bubble}>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">From the web</p>
        The original paper was published in 2014 <span className={chip}>arxiv.org</span>
      </div>
    </div>
  );
}

export function ExportVisual() {
  const files = [
    ["DOC", "Chapter notes + glossary"],
    ["PPT", "12-slide deck from the lecture"],
    ["XLS", "Formulas & comparison tables"],
    ["PDF", "One-page revision cheat sheet"],
  ];
  return (
    <div className={shell}>
      {files.map(([ext, name]) => (
        <div key={ext} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 font-mono text-[11px] font-semibold text-white">
            {ext}
          </span>
          <span className="text-sm text-zinc-200">{name}</span>
          <span className="ml-auto text-xs text-zinc-500">Download</span>
        </div>
      ))}
    </div>
  );
}

export function QuizVisual() {
  return (
    <div className={shell}>
      <p className="text-sm font-medium text-zinc-100">Q3. What does the learning rate control?</p>
      {[
        ["The step size of each update", true],
        ["The number of layers", false],
        ["The size of the dataset", false],
      ].map(([t, ok]) => (
        <div
          key={String(t)}
          className={cn(
            "rounded-xl border px-4 py-2.5 text-[13px]",
            ok ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/[0.03] text-zinc-400",
          )}
        >
          {t as string}
        </div>
      ))}
      <p className="text-xs text-zinc-500">Next review in 3 days · 7 flashcards saved</p>
    </div>
  );
}

export function LevelVisual() {
  return (
    <div className={shell}>
      <div className="flex flex-wrap gap-2 text-xs">
        {["Like I'm 5", "High school", "Undergrad", "Expert"].map((l, i) => (
          <span
            key={l}
            className={cn(
              "rounded-full border px-3 py-1",
              i === 1 ? "border-white bg-white text-black" : "border-white/15 text-zinc-400",
            )}
          >
            {l}
          </span>
        ))}
      </div>
      <div className={bubble}>
        Think of a neural network as a team that guesses, checks the answer, and adjusts a little
        after every mistake until the guesses get good.
      </div>
    </div>
  );
}
