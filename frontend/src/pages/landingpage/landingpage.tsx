import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Working from "./Working";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import { RuleSpacer } from "@/components/ui/section-frame";
import SiteFooter from "@/components/site-footer";

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
        <Hero className="h-svh" title="Learning shouldn't need ten tabs" />
        <div className="bg-stripes-side py-16 sm:py-24">
        <Working />
        <RuleSpacer height={80} />
        <HowItWorks />
        <RuleSpacer height={80} />
        <Features />
        <RuleSpacer height={80} />
        <Pricing />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
