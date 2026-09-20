"use client";

import React from 'react';
import Link from 'next/link';
import DotGridBackground from '@/components/DotGridBackground';

export default function SummaryPage() {
  return (
    <div className="relative w-full min-h-screen bg-simply-dark text-simply-coral font-satoshi flex items-center justify-center p-6 md:p-10 box-border">
      <DotGridBackground />

      <div className="relative z-10 w-[90%] max-w-5xl bg-simply-dark rounded-[24px] p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-simply-coral/20">
        {/* Back Link */}
        <div className="relative inline-block group mb-6">
          <Link
            href="/"
            className="text-simply-coral text-xs md:text-sm font-semibold tracking-[0.15em] uppercase pb-1 inline-block no-underline"
          >
            ← BACK TO LANDING
          </Link>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-simply-coral scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
        </div>

        <div className="text-center mb-10 mt-2">
          <h1 className="text-3xl md:text-5xl font-normal tracking-[0.1em] uppercase mb-3">
            Video Summarization
          </h1>
          <p className="text-base md:text-lg opacity-80 max-w-xl mx-auto text-simply-cream">
            Condense long form lecture videos and presentations into high impact outlines and actionable takeaways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* How it works */}
          <div>
            <h2 className="text-xl font-medium mb-5 tracking-[0.1em] uppercase">
              How it works
            </h2>
            <div className="flex flex-col gap-5">
              <div className="step-card">
                <span className="text-xs text-simply-coral font-bold block mb-1">STEP 01</span>
                <h3 className="text-base font-bold mb-2 text-white">Intent Routing</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  If your request contains summary triggers (e.g. &quot;summarize&quot;, &quot;outline&quot;) the Query Router shifts the task to the Summary Pipeline.
                </p>
              </div>

              <div className="step-card">
                <span className="text-xs text-simply-coral font-bold block mb-1">STEP 02</span>
                <h3 className="text-base font-bold mb-2 text-white">Dynamic Map-Reduce</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  The entire transcript is divided into blocks. The model summarizes each block independently and then rolls them into a master summary.
                </p>
              </div>

              <div className="step-card">
                <span className="text-xs text-simply-coral font-bold block mb-1">STEP 03</span>
                <h3 className="text-base font-bold mb-2 text-white">Structured Output</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  Output is formatted with bulleted key takeaways, core conceptual terms and chronological timestamps for easy navigation.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Example */}
          <div className="flex flex-col">
            <h2 className="text-xl font-medium mb-5 tracking-[0.1em] uppercase">
              Summary Example
            </h2>
            <div className="step-card flex-1 flex flex-col justify-between">
              <div>
                <p className="font-bold text-sm mb-2 text-white">User Question:</p>
                <div className="italic opacity-90 bg-simply-coral/10 p-3 rounded mb-5 text-sm">
                  &quot;Summary of this machine learning video&quot;
                </div>

                <p className="font-bold text-sm mb-2 text-white">Generated Output:</p>
                <div className="bg-simply-dark/80 border-l-4 border-simply-coral p-4 rounded mt-3">
                  <p className="text-xs md:text-sm opacity-80 leading-relaxed mb-3 text-simply-cream">
                    The video provides a clear and well-organized conceptual walkthrough of standard supervised machine learning workflows. The speaker explains the role of labeled datasets, training sets and the primary distinctions between regression and classification tasks.
                  </p>
                  <p className="text-xs md:text-sm opacity-80 leading-relaxed m-0 text-simply-cream">
                    Additionally, it covers model evaluation using performance metrics like Mean Squared Error (MSE), alongside weight optimization mechanics using Gradient Descent.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-simply-coral/15">
                <p className="font-bold text-sm mb-2 text-white">Key Takeaway:</p>
                <p className="text-sm opacity-90 leading-relaxed m-0 text-simply-cream">
                  The video provides a high-level conceptual walkthrough of standard supervised learning algorithms and optimization mechanics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
