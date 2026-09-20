"use client";

import React from 'react';
import Link from 'next/link';
import DotGridBackground from '@/components/DotGridBackground';

export default function RetrievalPage() {
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
            Semantic Retrieval
          </h1>
          <p className="text-base md:text-lg opacity-80 max-w-xl mx-auto text-simply-cream">
            Finds precise segments in transcripts and extract cited insights instantly from videos.
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
                <h3 className="text-base font-bold mb-2 text-white">Transcript Chunking</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  The video transcript is parsed and grouped into cohesive and semantic blocks of text to maintain logical context.
                </p>
              </div>

              <div className="step-card">
                <span className="text-xs text-simply-coral font-bold block mb-1">STEP 02</span>
                <h3 className="text-base font-bold mb-2 text-white">Vector Embeddings</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  Each block is converted into a vector embedding. When you search, your query is also embedded to search for semantic matches.
                </p>
              </div>

              <div className="step-card">
                <span className="text-xs text-simply-coral font-bold block mb-1">STEP 03</span>
                <h3 className="text-base font-bold mb-2 text-white">Top-K Matching & RAG</h3>
                <p className="text-sm opacity-70 leading-relaxed text-simply-cream m-0">
                  The RAG pipeline extracts the top 5 most relevant segments and feeds them into the model to construct a cited answer.
                </p>
              </div>
            </div>
          </div>

          {/* Retrieval Example */}
          <div className="flex flex-col">
            <h2 className="text-xl font-medium mb-5 tracking-[0.1em] uppercase">
              Retrieval Example
            </h2>
            <div className="step-card flex-1 flex flex-col justify-between">
              <div>
                <p className="font-bold text-sm mb-2 text-white">User Question:</p>
                <div className="italic opacity-90 bg-simply-coral/10 p-3 rounded mb-5 text-sm">
                  &quot;What is pydantic?&quot;
                </div>

                <p className="font-bold text-sm mb-2 text-white">Retrieved Transcript segment:</p>
                <div className="bg-simply-dark/80 border-l-4 border-simply-coral p-4 rounded mt-3">
                  <span className="text-xs text-simply-coral font-bold block mb-1">[01:12 - 01:45]</span>
                  <p className="text-xs md:text-sm opacity-80 leading-relaxed m-0 text-simply-cream">
                    &quot;...Pydantic is a data validation and settings management library for Python. It enforces type hints at runtime and provides user-friendly errors when data is invalid...&quot;
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-simply-coral/15">
                <p className="font-bold text-sm mb-2 text-white">Generated Answer:</p>
                <p className="text-sm opacity-90 leading-relaxed m-0 text-simply-cream">
                  Pydantic is a Python library used for data validation and settings management. It enforces type hints at runtime and generates user-friendly validation errors when data is invalid{' '}
                  <span className="text-simply-coral font-bold">[01:12]</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
