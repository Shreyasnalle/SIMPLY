import React from "react";
import Head from "next/head";
import HorizonGlowHero from "@/components/HorizonGlowHero";
import ResizableNavbar from "@/components/resizable-navbar-demo";

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
        />
      </main>
    </>
  );
}
