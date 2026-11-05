import type { AppProps } from "next/app";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "@/global.css";

export default function App({ Component, pageProps }: AppProps) {
  // Smooth, inertial scrolling: the page keeps gliding a little after the
  // user stops scrolling instead of halting instantly.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <Component {...pageProps} />;
}
