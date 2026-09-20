"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DotGridBackground from '@/components/DotGridBackground';
import ProductivityVisualizer from '@/components/ProductivityVisualizer';
interface AuthResponse {
  success: boolean;
  user_id?: string;
  email?: string;
  name?: string;
  mobile_number?: string;
  access_token?: string;
  error?: string;
  message?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [transitionState, setTransitionState] = useState<'idle' | 'sweeping-in' | 'sweeping-out'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_BASE = 'https://simply-kwrn.onrender.com';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result: AuthResponse = await res.json();
      if (result.success && result.user_id && result.email) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('email', result.email);
        localStorage.setItem('login_timestamp', Date.now().toString());
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token);
        }
        router.push('/');
      } else {
        setErrorMessage(result.error || 'Sign in failed');
      }
    } catch {
      setErrorMessage('Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, mobile_number: mobileNumber }),
      });
      const result: AuthResponse = await res.json();
      if (result.success && result.user_id && result.email) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('email', result.email);
        localStorage.setItem('login_timestamp', Date.now().toString());
        if (name) localStorage.setItem('name', name);
        if (mobileNumber) localStorage.setItem('mobile_number', mobileNumber);
        router.push('/');
      } else {
        setErrorMessage(result.error || 'Sign up failed');
      }
    } catch {
      setErrorMessage('Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleForm = (targetSignUp: boolean) => {
    if (transitionState !== 'idle') return;
    setErrorMessage('');
    setEmail('');
    setPassword('');
    setName('');
    setMobileNumber('');
    setConfirmPassword('');
    setTransitionState('sweeping-in');
    setTimeout(() => {
      setIsSignUp(targetSignUp);
      setTransitionState('sweeping-out');
    }, 600);
    setTimeout(() => {
      setTransitionState('idle');
    }, 1200);
  };

  return (
    <div className="relative w-screen h-screen bg-simply-dark text-simply-coral font-satoshi overflow-hidden flex items-center justify-center p-4">
      <DotGridBackground interactive />

      <div className="relative z-10 w-[90%] max-w-[850px] min-h-[75%] bg-simply-dark rounded-[24px] p-8 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border-[1.5px] border-simply-coral/20 flex flex-col justify-center overflow-hidden">
        {/* Sweeping Transition Curtain */}
        <div
          className="absolute inset-0 bg-simply-coral z-20 pointer-events-none transition-transform duration-600 ease-[cubic-bezier(0.7,0,0.3,1)]"
          style={{
            transform: transitionState === 'sweeping-in' ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: transitionState === 'sweeping-in' ? 'left' : 'right',
            transition: transitionState === 'idle' ? 'none' : 'transform 0.6s cubic-bezier(0.7, 0, 0.3, 1)',
          }}
        />

        {/* Back Link */}
        <div className="absolute top-5 left-7 z-10">
          <Link
            href="/"
            className="text-simply-coral no-underline text-xs md:text-sm font-semibold tracking-[0.15em] uppercase hover:opacity-80 transition-opacity"
          >
            ← BACK TO LANDING
          </Link>
        </div>

        <div className={`flex flex-col md:flex-row items-stretch justify-between w-full pt-6 ${isSignUp ? 'md:flex-row-reverse' : ''}`}>
          {/* Left Column: Brand & Visualizer */}
          <div className={`flex-1 flex flex-col justify-center text-left ${isSignUp ? 'md:pl-6' : 'md:pr-6'} mb-6 md:mb-0`}>
            <Link href="/" className="no-underline">
              <h1 className="text-3xl md:text-5xl font-normal leading-none tracking-[0.15em] uppercase m-0 mb-4 cursor-pointer text-simply-coral">
                SIMPLY
              </h1>
            </Link>
            <p className="text-sm md:text-base leading-relaxed opacity-80 mb-5 tracking-[0.05em] text-simply-cream">
              Your learning shouldn't require ten tabs. Process transcripts, query concepts and extract cited insights right where you watch.
            </p>
            <ProductivityVisualizer />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1.5px] bg-simply-coral/30 my-0 mx-8" />
          <div className="block md:hidden h-[1.5px] w-full bg-simply-coral/30 my-6" />

          {/* Right Column: Form */}
          <div className="flex-1 flex flex-col justify-center">
            {!isSignUp ? (
              <>
                <h2 className="text-2xl font-normal mb-6 tracking-[0.15em] uppercase text-center">
                  SIGN IN
                </h2>

                <form onSubmit={handleSignIn} className="w-full">
                  <input
                    type="email"
                    placeholder="EMAIL ID"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {errorMessage && (
                    <div className="text-danger-light text-xs text-center mb-4 tracking-wider">
                      {errorMessage}
                    </div>
                  )}

                  <button type="submit" className="btn-sweep w-full" disabled={isLoading}>
                    {isLoading ? 'SIGNING IN...' : 'CONTINUE'}
                  </button>
                </form>

                <div
                  onClick={() => handleToggleForm(true)}
                  className="mt-6 text-xs text-center cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity"
                >
                  <span className="text-simply-cream/80">Don't have an account? </span>
                  <span className="text-simply-coral font-bold underline">
                    create a new one here
                  </span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-normal mb-5 tracking-[0.15em] uppercase text-center">
                  CREATE ACCOUNT
                </h2>

                <form onSubmit={handleSignUp} className="w-full">
                  <input
                    type="text"
                    placeholder="NAME"
                    className="input-field mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="MOBILE NUMBER"
                    className="input-field mb-3"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="EMAIL ID"
                    className="input-field mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    className="input-field mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="CONFIRM PASSWORD"
                    className="input-field mb-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  {errorMessage && (
                    <div className="text-danger-light text-xs text-center mb-4 tracking-wider">
                      {errorMessage}
                    </div>
                  )}

                  <button type="submit" className="btn-sweep w-full" disabled={isLoading}>
                    {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
                  </button>
                </form>

                <div
                  onClick={() => handleToggleForm(false)}
                  className="mt-5 text-xs text-center cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity"
                >
                  <span className="text-simply-cream/80">Already have an account? </span>
                  <span className="text-simply-coral font-bold underline">
                    sign in here
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
