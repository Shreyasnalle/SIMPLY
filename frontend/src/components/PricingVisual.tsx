"use client";

import React, { useEffect, useRef } from 'react';

export default function PricingVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const homeX = width / 2;
    const homeY = height / 2;

    const ball = { x: homeX, y: homeY, targetX: homeX, targetY: homeY };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      ball.targetX = homeX + (localX - homeX) * 0.2;
      ball.targetY = homeY + (localY - homeY) * 0.2;

      const dx = ball.targetX - homeX;
      const dy = ball.targetY - homeY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 35) {
        ball.targetX = homeX + (dx / dist) * 35;
        ball.targetY = homeY + (dy / dist) * 35;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ball.x += (ball.targetX - ball.x) * 0.5;
      ball.y += (ball.targetY - ball.y) * 0.5;

      ctx.fillStyle = 'rgba(251, 133, 105, 0.15)';
      const dotSpacing = 16;
      for (let x = dotSpacing / 2; x < width; x += dotSpacing) {
        for (let y = dotSpacing / 2; y < height; y += dotSpacing) {
          const dx = x - homeX;
          const dy = y - homeY;
          if (dx * dx + dy * dy < 142 * 142) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const numCircles = 8;
      const baseRadius = 15;
      const spacing = 16;

      for (let i = numCircles - 1; i >= 0; i--) {
        const radius = baseRadius + i * spacing;
        const factor = (numCircles - i) / numCircles;

        const cx = homeX + (ball.x - homeX) * factor;
        const cy = homeY + (ball.y - homeY) * factor;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);

        if (i === 0) {
          ctx.fillStyle = '#fb8569';
          ctx.fill();
        } else {
          ctx.strokeStyle = 'rgba(251, 133, 105, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[300px] h-[300px] opacity-95 rounded-full border-[1.5px] border-[#fb8569]/45 box-border"
    />
  );
}
