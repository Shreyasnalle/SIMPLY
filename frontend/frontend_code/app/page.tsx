"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DotGridBackground from '@/components/DotGridBackground';
import PricingVisual from '@/components/PricingVisual';

export default function LandingPage() {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
      const ts = localStorage.getItem('login_timestamp');
      const logged = localStorage.getItem('isLoggedIn') === 'true';
      if (logged && ts && Date.now() - parseInt(ts, 10) < SESSION_DURATION_MS) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  const handleProtectedAction = (e: React.MouseEvent, defaultTargetUrl?: string) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = '/account';
    } else if (defaultTargetUrl) {
      window.location.href = defaultTargetUrl;
    }
  };

  const navItem = (text: string, targetId: string) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (targetId !== 'contact') {
          setActiveHighlight(targetId);
          setTimeout(() => setActiveHighlight(null), 1000);
        }
      }
    };

    return (
      <div className="relative inline-block group">
        <a
          href={`#${targetId}`}
          onClick={handleClick}
          className="relative text-simply-coral text-base font-semibold tracking-[0.25em] uppercase pb-1 inline-block"
        >
          {text}
        </a>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-simply-coral scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-simply-dark text-simply-coral font-satoshi overflow-x-hidden">
      <DotGridBackground interactive />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-[4.5rem] px-12 py-7 flex justify-between items-center z-20 bg-simply-dark/90 backdrop-blur-sm shadow-[0_0.25px_3px_rgba(255,201,159,0.33)]">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-[0.15em] uppercase text-simply-coral no-underline cursor-pointer"
        >
          SIMPLY
        </Link>

        <nav className="flex items-center gap-[2vw]">
          {navItem('[ ABOUT ]', 'about')}
          {navItem('NAVIGATION', 'navigation')}
          {navItem('PRICING', 'pricing')}
          {navItem('CONTACT', 'contact')}

          {isLoggedIn ? (
            <Link href="/settings" className="btn-sweep text-sm py-2 px-4">
              PROFILE
            </Link>
          ) : (
            <Link href="/account" className="btn-sweep text-sm py-2 px-4">
              SIGN IN/SIGN UP
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col justify-center items-center min-h-screen px-[8vw] pt-20 text-center gap-8">
        <h1 className="text-[clamp(3.5rem,7.5vw,10rem)] font-normal tracking-[0.05em] leading-[0.9] flex flex-col m-0">
          <span>Learning shouldn't need ten tabs</span>
        </h1>
        <p className="text-[clamp(0.95rem,1.5vw,1.35rem)] font-medium tracking-[0.08em] m-0 text-simply-cream/90">
          No more tab switching for getting answers
        </p>
      </main>

      {/* About Section */}
      <section className="relative z-10 w-[90%] max-w-6xl mx-auto mb-24 bg-simply-dark rounded-[24px] p-12 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-simply-coral/20">
        <div
          id="about"
          className="transition-transform duration-700 ease-out"
          style={{
            transform: activeHighlight === 'about' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="flex justify-between items-baseline w-full text-base font-bold tracking-[0.15em]">
            <span>ABOUT</span>
            <span>PART [01]</span>
          </div>
          <div className="h-[1.5px] bg-simply-coral/20 w-full my-4 mb-14" />

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 text-left">
              <h2 className="text-4xl lg:text-5xl font-normal mb-6 leading-tight tracking-[0.15em]">
                SIMPLY by the numbers
              </h2>
              <p className="tracking-[0.1em] text-lg leading-relaxed text-simply-cream/80 mb-5">
                Simply is a modern RAG-based learning assistant designed specifically for YouTube videos. It allows you to query, answers, summarize and extract core insights from videos without the tedious tab switching.
              </p>
              <p className="tracking-[0.1em] text-base leading-relaxed text-simply-cream/70 m-0">
                Built to streamline your learning pipeline, it processes transcripts, understands it and answers where you watch.
              </p>
            </div>

            <div className="flex-1 flex justify-center items-center w-full">
              <div className="border border-simply-coral/30 rounded-2xl w-full max-w-md p-10 text-center flex flex-col items-center justify-center gap-5 bg-white/[0.01]">
                <span className="text-lg opacity-70 tracking-[0.15em]">PRODUCTIVITY</span>
                <div className="w-[1px] h-10 bg-simply-coral/30" />
                <div className="inline-flex border border-simply-coral/30 rounded-lg overflow-hidden">
                  <span className="bg-simply-coral text-simply-dark py-4 px-6 text-2xl font-bold tracking-[0.2em]">
                    10X
                  </span>
                  <span className="py-4 px-6 text-2xl font-bold tracking-[0.2em] text-simply-coral">
                    FASTER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24" />

        {/* Navigation Section */}
        <div
          id="navigation"
          className="transition-transform duration-700 ease-out"
          style={{
            transform: activeHighlight === 'navigation' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="flex justify-between items-baseline w-full text-base font-bold tracking-[0.15em]">
            <span>NAVIGATION</span>
            <span>PART [02]</span>
          </div>
          <div className="h-[1.5px] bg-simply-coral/20 w-full my-4 mb-14" />

          <div className="border-[1.5px] border-simply-coral/30 rounded-[24px] py-16 px-10 text-center flex flex-col items-center justify-center gap-8">
            <h3 className="text-[clamp(1.8rem,3vw,2.75rem)] font-normal leading-snug m-0 max-w-3xl tracking-[0.12em]">
              "Download SIMPLY from browser extensions"
            </h3>

            <a
              href="#"
              onClick={(e) => handleProtectedAction(e)}
              className="btn-sweep py-3 px-8 text-base font-bold tracking-[0.3em]"
            >
              GET EXTENSION
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative z-10 w-[90%] max-w-4xl mx-auto mb-24 bg-simply-dark rounded-[24px] p-12 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-simply-coral/20 transition-transform duration-700 ease-out"
        style={{
          transform: activeHighlight === 'pricing' ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div className="flex justify-between items-baseline w-full text-base font-bold tracking-[0.15em]">
          <span>PRICING</span>
          <span>PART [04]</span>
        </div>
        <div className="h-[1.5px] bg-simply-coral/20 w-full my-4 mb-12" />

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Student Plan */}
          <div className="flex-1 max-w-sm bg-white/[0.015] border-[1.5px] border-simply-coral/30 rounded-[24px] p-8 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 tracking-[0.05em]">STUDENT</h3>
              <p className="text-sm opacity-70 m-0 text-simply-cream">
                Perfect for getting started with SIMPLY
              </p>
            </div>

            <div className="flex flex-col items-start gap-1">
              <div className="relative inline-block">
                <span className="text-4xl font-bold text-simply-coral/30">
                  $2<span className="text-base font-normal">/mo</span>
                </span>
                <div className="absolute top-[55%] -left-[5%] w-[110%] h-[2.5px] bg-simply-coral -rotate-12" />
              </div>
              <span className="text-5xl font-extrabold text-simply-coral leading-none">FREE</span>
            </div>

            <a
              href="#"
              onClick={(e) => handleProtectedAction(e)}
              className="btn-sweep w-full py-3 px-5 text-sm font-bold text-center tracking-[0.25em]"
            >
              GET STARTED
            </a>
          </div>

          {/* Institutions Plan */}
          <div className="flex-1 max-w-sm bg-white/[0.015] border-[1.5px] border-simply-coral/15 rounded-[24px] p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-2xl font-bold mb-2 tracking-[0.05em]">INSTITUTIONS</h3>
              <p className="text-sm opacity-70 m-0 text-simply-cream">
                Scale learning across your organization
              </p>
            </div>

            <div className="w-full border-[1.5px] border-dashed border-simply-coral/25 rounded py-3 text-center text-sm font-bold uppercase tracking-[0.3em] text-simply-coral/50">
              COMING SOON
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 w-full bg-simply-dark px-12 py-10 text-simply-coral">
        <div className="h-[1.5px] bg-simply-coral/25 w-full mb-6" />

        <div className="flex justify-between items-center flex-wrap gap-5 text-sm font-medium tracking-[0.08em]">
          <Link href="/" className="text-xl font-extrabold tracking-[0.15em] text-simply-coral no-underline">
            SIMPLY
          </Link>

          <div className="flex gap-4">
            <a
              href="https://github.com/Shreyasnalle/SIMPLY"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 inline-flex items-center gap-1"
            >
              <span>[ </span>
              <svg height="15" width="15" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span> ]</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shreyas-nalle-0697bb371/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <span>[ <span className="font-bold">in</span> ]</span>
            </a>
            <a
              href="https://x.com/ShreyasNalle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <span>[ <span className="font-bold">𝕏</span> ]</span>
            </a>
          </div>
        </div>

        <div className="h-[1.5px] bg-simply-coral/25 w-full my-6" />

        <div className="text-left mb-8">
          <h4 className="text-base font-bold tracking-[0.15em] uppercase mb-4">FEATURES</h4>
          <div className="flex gap-8 flex-wrap text-sm font-semibold tracking-[0.1em]">
            <Link href="/features/retrieval" className="opacity-80 hover:opacity-100 transition-opacity">
              RETRIEVAL
            </Link>
            <Link href="/features/summary" className="opacity-80 hover:opacity-100 transition-opacity">
              SUMMARY
            </Link>
          </div>
        </div>

        <div className="h-[1px] bg-simply-coral/10 w-full mb-6" />

        <div className="flex gap-4 justify-start items-center text-xs opacity-70 tracking-[0.05em]">
          <Link href="/policies" className="hover:opacity-100 transition-opacity">
            POLICIES
          </Link>
          <span>Made with <span className="text-red-500">❤️</span> by Shreyas Nalle</span>
        </div>
      </footer>
    </div>
  );
}
