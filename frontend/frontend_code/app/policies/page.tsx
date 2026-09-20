"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import DotGridBackground from '@/components/DotGridBackground';

export default function PoliciesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-simply-dark text-simply-coral font-satoshi flex flex-col items-center p-6 md:p-10 box-border">
      <DotGridBackground />

      <div className="relative z-10 w-[90%] max-w-4xl bg-simply-dark rounded-[24px] pt-16 pb-12 px-6 md:px-12 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-simply-coral/20">
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

        <div className="text-center mb-12 mt-4">
          <h1 className="text-3xl md:text-5xl font-normal tracking-[0.15em] uppercase mb-3">
            PRIVACY POLICY
          </h1>
          <p className="text-base text-simply-cream/70 m-0">Last updated: July 26, 2026</p>
        </div>

        <div className="space-y-6 text-simply-cream/90 text-sm md:text-base leading-relaxed">
          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">1. OVERVIEW</h3>
            <p className="m-0">
              Simply (&quot;we,&quot; &quot;our,&quot; or &quot;the extension&quot;) is a browser extension that helps users ask questions, get summaries, and understand concepts from YouTube videos without leaving the page. This policy explains what information we collect, how we use it, and how it is protected.
            </p>
          </div>

          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">2. INFORMATION WE COLLECT</h3>
            <ul className="list-disc pl-6 space-y-2 m-0">
              <li>
                <strong>Account Information:</strong> When you register, we collect your name, email address, and mobile number.
              </li>
              <li>
                <strong>Video Context Data:</strong> Captions and video metadata are extracted strictly to answer your queries and generate summaries.
              </li>
              <li>
                <strong>Chat History:</strong> Queries and responses are stored in encrypted format to provide session continuity.
              </li>
            </ul>
          </div>

          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">3. HOW WE USE YOUR INFORMATION</h3>
            <p className="mb-3">We use the information above solely to:</p>
            <ul className="list-disc pl-6 space-y-2 m-0">
              <li>Authenticate your account and maintain session security.</li>
              <li>Process video transcripts through RAG pipelines to return accurate answers.</li>
              <li>Improve response latency and model comprehension.</li>
            </ul>
            <p className="mt-3 m-0">
              We do not use your data for advertising, profiling, or any purpose unrelated to providing core functionality.
            </p>
          </div>

          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">4. THIRD-PARTY SERVICES</h3>
            <p className="mb-3">We use the following trusted third-party services to operate Simply:</p>
            <ul className="list-disc pl-6 space-y-2 m-0">
              <li>
                <strong>Supabase:</strong> Authentication and vector database storage (PostgreSQL with pgvector).
              </li>
              <li>
                <strong>Groq API:</strong> High-speed LLM inference for response generation.
              </li>
              <li>
                <strong>Hugging Face:</strong> Inference API for BAAI/bge-small-en-v1.5 embedding models.
              </li>
            </ul>
            <p className="mt-3 m-0">
              We do not sell, rent, or share your personal information with any other third party.
            </p>
          </div>

          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">5. DATA RETENTION & DELETION</h3>
            <p className="m-0">
              We retain your account information and chat history for as long as your account remains active. You may request deletion of your account and associated data at any time from your account settings or by contacting us.
            </p>
          </div>

          <div className="step-card">
            <h3 className="text-simply-coral text-lg font-bold mb-3">6. SECURITY & CONTACT</h3>
            <p className="mb-3">
              We take reasonable technical measures to protect your data, including encrypted password storage and secure, authenticated database access.
            </p>
            <p className="m-0">
              If you have questions about this privacy policy or your data, contact us at:{' '}
              <a href="mailto:shreyas.nalle7@gmail.com" className="text-simply-coral underline">
                shreyas.nalle7@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
