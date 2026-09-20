"use client";

import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx?: number;
  vy?: number;
}

interface DotGridBackgroundProps {
  interactive?: boolean;
}

export default function DotGridBackground({ interactive = false }: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dots: Dot[] = [];
    const DOT_SPACING = 32;
    const DOT_RADIUS = 1.5;
    const INTERACTION_RADIUS = 180;

    let mouse = { x: -1000, y: -1000, lastMove: 0 };
    let animationFrameId: number;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      dots = [];
      for (let x = 0; x < width; x += DOT_SPACING) {
        for (let y = 0; y < height; y += DOT_SPACING) {
          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (interactive) {
        const isMouseMoving = Date.now() - mouse.lastMove < 150;

        dots.forEach((dot) => {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const springForceX = (dot.baseX - dot.x) * 0.025;
          const springForceY = (dot.baseY - dot.y) * 0.025;
          dot.vx = (dot.vx ?? 0) + springForceX;
          dot.vy = (dot.vy ?? 0) + springForceY;

          if (distance < INTERACTION_RADIUS && isMouseMoving) {
            const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
            const angle = Math.random() * Math.PI * 2;
            dot.vx += Math.cos(angle) * force * 2.0;
            dot.vy += Math.sin(angle) * force * 2.0;
          }

          dot.vx *= 0.9;
          dot.vy *= 0.9;
          dot.x += dot.vx;
          dot.y += dot.vy;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = '#fb8569';
          ctx.fill();
        });
      } else {
        ctx.fillStyle = '#fb8569';
        dots.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastMove = Date.now();
    };

    const handleResize = () => {
      init();
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
