"use client";
import type React from "react";
interface ShinyButtonProps { children: React.ReactNode; onClick?: () => void; className?: string; }
export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  return <><style jsx>{`@property --gradient-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
    .shiny-cta { --highlight: #8484ff; isolation:isolate; position:relative; overflow:hidden; cursor:pointer; padding:1rem 2rem; border:1px solid transparent; border-radius:360px; color:#fff; font-family:var(--font-sans); font-size:1rem; font-weight:600; background:linear-gradient(#101013,#101013) padding-box,conic-gradient(from var(--gradient-angle),transparent,#fff 10%,#4444ff 20%,transparent 30%) border-box; box-shadow:inset 0 0 0 1px #1a1818; animation:gradient-angle 3s linear infinite; transition:transform 200ms ease,filter 200ms ease; }
    .shiny-cta:hover { transform:translateY(-2px); filter:brightness(1.15); } .shiny-cta::before { content:""; position:absolute; inset:2px; z-index:-1; border-radius:inherit; opacity:.35; background:radial-gradient(circle at 2px 2px,#fff 1px,transparent 1px); background-size:5px 5px; } .shiny-cta span { position:relative; z-index:1; } @keyframes gradient-angle { to { --gradient-angle:360deg; } }`}</style><button type="button" className={`shiny-cta ${className}`} onClick={onClick}><span>{children}</span></button></>;
}
