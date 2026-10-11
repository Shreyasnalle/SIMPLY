import React from "react";
import Head from "next/head";
import { HorizonGlowHero } from "@/components/ui/horizon-glow-hero";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Finally in sync - Simply</title>
        <meta
          name="description"
          content="Your tools, docs and conversations finally in sync."
        />
      </Head>
      <main className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col justify-center">
        {/* Celestial Horizon Glow Hero */}
        <HorizonGlowHero
          eyebrow="Your tools, docs and conversations"
          title="Finally in sync"
          className="h-svh"
        >
          <div className="flex items-center justify-center gap-3">
            <button className="h-10 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 cursor-pointer shadow-sm">
              Get started
            </button>
            <button className="h-10 rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 cursor-pointer shadow-sm">
              Learn more
            </button>
          </div>
        </HorizonGlowHero>
      </main>
    </>
  );
}
