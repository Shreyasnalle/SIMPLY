import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Working from "./Working";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import { RuleSpacer } from "@/components/ui/section-frame";
import BeamWordmarkFooter from "@/components/ui/beam-wordmark-footer";

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
        <div id="contact" className="border-t border-white/10">
        <BeamWordmarkFooter
          brand="Simply"
          company="Simply"
          background="#0b0b10"
          ink="#fafafa"
          muted="#b4b4bd"
          accent="#e4e4e7"
          wordTop="#6b6b78"
          wordFoot="#0b0b10"
          fontSans="var(--font-sans)"
          credits={[
            { label: "Simply", tail: " is your AI video learning assistant." },
            { lead: "Learn faster, ", label: "without the ten tabs" },
          ]}
          columns={[
            {
              title: "Our Product",
              links: [
                { label: "How it works", href: "#working" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Contact", href: "#" },
              ],
            },
          ]}
        />
        </div>
      </main>
    </>
  );
}
