import React from "react";
import Head from "next/head";
import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Features from "./features/Features";
import Video from "./video/Video";
import Pricing from "./pricing/Pricing";

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
