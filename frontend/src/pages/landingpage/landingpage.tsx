import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import Working from "./Working";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
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
        <Working />
        <HowItWorks />
        <Features />
        <Pricing />
        <div id="contact">
        <BeamWordmarkFooter
          brand="Simply"
          company="Simply"
          background="#09090b"
          ink="#fafafa"
          muted="#a1a1aa"
          accent="#d4d4d8"
          wordTop="#3f3f46"
          wordFoot="#09090b"
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
