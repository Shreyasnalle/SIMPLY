import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Video from "./Video";
import Pricing from "./Pricing";

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
        <Navbar />
        <Hero className="h-svh" title="Learning should'nt need ten tabs" />
        <Features />
        <Video />
        <Pricing />
      </main>
    </>
  );
}
