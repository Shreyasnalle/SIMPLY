"use client";

import React, { useEffect, useRef } from 'react';

interface Column {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScale: number;
  currentScale: number;
  dotOffset: number;
  hovered: boolean;
}

export default function ProductivityVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 380;
    const height = 280;
    canvas.width = width;
    canvas.height = height;

    const columns: Column[] = [
      { id: 0, x: 85, y: 215, width: 76, height: 110, targetScale: 1, currentScale: 1, dotOffset: 0, hovered: false },
      { id: 1, x: 190, y: 215, width: 76, height: 180, targetScale: 1, currentScale: 1, dotOffset: 0, hovered: false },
      { id: 2, x: 295, y: 215, width: 76, height: 145, targetScale: 1, currentScale: 1, dotOffset: 0, hovered: false },
    ];

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.moveTo(20, 202);
      ctx.lineTo(360, 202);
      ctx.strokeStyle = '#fb8569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      columns.forEach((col) => {
        const isHovered =
          mouse.x >= col.x - col.width / 2 - 10 &&
          mouse.x <= col.x + col.width / 2 + 10 &&
          mouse.y >= col.y - col.height - 30 &&
          mouse.y <= col.y + 10;

        col.hovered = isHovered;
        col.targetScale = isHovered ? 1.12 : 1.0;
        col.currentScale += (col.targetScale - col.currentScale) * 0.15;

        if (isHovered) {
          col.dotOffset += 0.8;
        } else {
          col.dotOffset += 0.05;
        }

        const s = col.currentScale;
        const W = col.width * s;
        const H = col.height * s;
        const skew = W * 0.35;

        const topPeak = { x: col.x, y: col.y - H };
        const topLeft = { x: col.x - W / 2, y: col.y - H + skew / 2 };
        const topBottom = { x: col.x, y: col.y - H + skew };
        const topRight = { x: col.x + W / 2, y: col.y - H + skew / 2 };

        const bottomCenter = { x: col.x, y: col.y };
        const bottomLeft = { x: col.x - W / 2, y: col.y - skew / 2 };
        const bottomRight = { x: col.x + W / 2, y: col.y - skew / 2 };

        ctx.save();
        ctx.beginPath();
        const centerY = col.y - skew / 2;
        ctx.ellipse(col.x, centerY, W / 2, skew / 2, 0, 0, 2 * Math.PI);
        const shadowGrad = ctx.createRadialGradient(col.x, centerY, 0, col.x, centerY, W / 2);
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        shadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.35)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.fill();
        ctx.restore();

        // Left face
        ctx.beginPath();
        ctx.moveTo(topLeft.x, topLeft.y);
        ctx.lineTo(topBottom.x, topBottom.y);
        ctx.lineTo(bottomCenter.x, bottomCenter.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y);
        ctx.closePath();

        const leftGrad = ctx.createLinearGradient(topLeft.x, topLeft.y, bottomCenter.x, bottomCenter.y);
        leftGrad.addColorStop(0, '#242424');
        leftGrad.addColorStop(1, '#101010');
        ctx.fillStyle = leftGrad;
        ctx.fill();

        ctx.strokeStyle = '#fb8569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(topLeft.x, topLeft.y);
        ctx.lineTo(topBottom.x, topBottom.y);
        ctx.lineTo(bottomCenter.x, bottomCenter.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = '#fb8569';
        const numDotCols = 5;
        const dotSpacingY = 12;
        for (let c = 0; c < numDotCols; c++) {
          const u = (c + 0.5) / numDotCols;
          const dx = -W / 2 + u * (W / 2);
          const px = col.x + dx;

          const yTop = topLeft.y * (1 - u) + topBottom.y * u;
          const yBottom = bottomLeft.y * (1 - u) + bottomCenter.y * u;

          const startY = yBottom - (col.dotOffset % dotSpacingY);
          for (let py = startY; py >= yTop; py -= dotSpacingY) {
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        // Right face
        ctx.beginPath();
        ctx.moveTo(topBottom.x, topBottom.y);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomCenter.x, bottomCenter.y);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(topBottom.x, topBottom.y, bottomRight.x, bottomRight.y);
        rightGrad.addColorStop(0, '#1a1a1a');
        rightGrad.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = rightGrad;
        ctx.fill();

        ctx.strokeStyle = '#fb8569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(topBottom.x, topBottom.y);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomCenter.x, bottomCenter.y);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = 'rgba(251, 133, 105, 0.75)';
        for (let c = 0; c < numDotCols; c++) {
          const u = (c + 0.5) / numDotCols;
          const px = col.x + u * (W / 2);

          const yTop = topBottom.y * (1 - u) + topRight.y * u;
          const yBottom = bottomCenter.y * (1 - u) + bottomRight.y * u;

          const startY = yBottom - (col.dotOffset % dotSpacingY);
          for (let py = startY; py >= yTop; py -= dotSpacingY) {
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        // Top face
        ctx.beginPath();
        ctx.moveTo(topPeak.x, topPeak.y);
        ctx.lineTo(topLeft.x, topLeft.y);
        ctx.lineTo(topBottom.x, topBottom.y);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.closePath();

        const topGrad = ctx.createLinearGradient(topLeft.x, topLeft.y, topRight.x, topRight.y);
        topGrad.addColorStop(0, '#ffac99');
        topGrad.addColorStop(1, '#fb8569');
        ctx.fillStyle = topGrad;
        ctx.fill();

        ctx.strokeStyle = '#fb8569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(topBottom.x, topBottom.y);
        ctx.lineTo(bottomCenter.x, bottomCenter.y);
        ctx.strokeStyle = 'rgba(251, 133, 105, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto mt-5 max-w-full h-auto cursor-pointer relative z-[2]"
    />
  );
}
