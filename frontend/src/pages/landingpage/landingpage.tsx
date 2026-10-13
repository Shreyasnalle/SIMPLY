import React from "react";
import Head from "next/head";
import HorizonGlowHero from "@/components/HorizonGlowHero";
import ResizableNavbar from "@/components/resizable-navbar-demo";
import { ShinyButton } from "@/components/ui/shiny-button";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Simply - AI Video Learning Assistant</title>
        <meta
          name="description"
          content="Simply - AI Video Learning Assistant"
        />
      </Head>
      <main className="relative m-0 w-full min-h-screen bg-background p-0 overflow-x-hidden">
        {/* Resizable Navbar */}
        <ResizableNavbar />

        {/* Celestial Horizon Glow Hero */}
        <HorizonGlowHero
          className="h-svh"
          title="Learning should'nt need ten tabs"
        >
          <p className="max-w-2xl px-4 font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
            Simply provides an in-tab YouTube extension, specifically curated
            for educational purposes, with the capabilities to support theory,
            coding, math, diagrammatic video lectures, and live streams as
            well—more capable than YouTube&apos;s own video RAG.
          </p>
          <ShinyButton className="mt-5">Get Extension</ShinyButton>
        </HorizonGlowHero>
      </main>
    </>
  );
}
