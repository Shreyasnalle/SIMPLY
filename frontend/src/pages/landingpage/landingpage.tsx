import React from "react";
import Head from "next/head";
import HorizonGlowHero from "@/components/HorizonGlowHero";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Simply</title>
      </Head>
      <main className="m-0 w-full bg-background p-0">
        <HorizonGlowHero className="h-svh" />
      </main>
    </>
  );
}
