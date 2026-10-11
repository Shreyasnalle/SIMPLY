"use client";

import { HorizonGlowHero } from "@/components/ui/horizon-glow-hero";

export default function HorizonGlowHeroDemo() {
  return (
    <HorizonGlowHero
      eyebrow="Your tools, docs and conversations"
      title="Finally in sync"
      className="h-svh"
    >
      <div className="flex gap-3 items-center justify-center">
        <button className="h-10 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 cursor-pointer shadow-sm">
          Get started
        </button>
        <button className="h-10 rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 cursor-pointer shadow-sm">
          Learn more
        </button>
      </div>
    </HorizonGlowHero>
  );
}
