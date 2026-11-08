import React from "react";
import Head from "next/head";
import Navbar from "@/pages/landingpage/Navbar";
import SiteFooter from "@/components/site-footer";
import { SectionFrame, RuleSpacer } from "@/components/ui/section-frame";
import { LineBackground } from "@/components/ui/line-background";

export function InfoPage({
  title,
  eyebrow,
  heading,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{`${title} - Simply`}</title>
        <meta name="description" content={description} />
      </Head>
      <main className="relative m-0 min-h-screen w-full overflow-x-hidden bg-background p-0">
        <Navbar />
        <header className="relative flex min-h-[46vh] flex-col items-center justify-end px-6 pb-14 pt-36 text-center">
          <LineBackground />
          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
            <h1 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.1] tracking-[-0.015em] text-foreground">
              {heading}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </header>
        <div className="bg-stripes-side pb-16 sm:pb-24">
          <RuleSpacer height={40} />
          {children}
        </div>
        <SiteFooter />
      </main>
    </>
  );
}

/** A ruled content block in the same frame the landing page uses. */
export function Block({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <SectionFrame id={id} innerClassName="px-6 py-12 sm:px-12 sm:py-16">
      {title && (
        <h2 className="mb-6 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">{title}</h2>
      )}
      {children}
    </SectionFrame>
  );
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6">
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
