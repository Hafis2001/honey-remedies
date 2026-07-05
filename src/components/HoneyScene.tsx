"use client";

import { useEffect, useRef } from "react";

export default function HoneyScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // --- Hexagon particles (floating honeycomb cells) ---
    type Hex = {
      x: number; y: number; size: number; alpha: number;
      speed: number; drift: number; rot: number; rotSpeed: number;
    };
    const hexagons: Hex[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 18 + Math.random() * 48,
      alpha: 0.04 + Math.random() * 0.14,
      speed: 0.12 + Math.random() * 0.28,
      drift: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.006,
    }));

    // --- Honey drip drops ---
    type Drop = {
      x: number; y: number; vy: number;
      radius: number; alpha: number; stretch: number;
    };
    const drops: Drop[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      vy: 0.8 + Math.random() * 1.4,
      radius: 5 + Math.random() * 14,
      alpha: 0.55 + Math.random() * 0.35,
      stretch: 1 + Math.random() * 1.6,
    }));

    // --- Honey drip trails from top ---
    type Trail = { x: number; progress: number; speed: number; width: number };
    const trails: Trail[] = Array.from({ length: 7 }, (_, i) => ({
      x: (width / 8) * (i + 1) + (Math.random() - 0.5) * 80,
      progress: Math.random() * 0.6,
      speed: 0.0008 + Math.random() * 0.0012,
      width: 6 + Math.random() * 14,
    }));

    // --- Shimmer particles (dust/bokeh) ---
    type Shimmer = { x: number; y: number; r: number; a: number; phase: number; speed: number };
    const shimmers: Shimmer[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 3,
      a: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
    }));

    function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, alpha: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.18})`;
      ctx.fill();
      ctx.restore();
    }

    function drawDrop(ctx: CanvasRenderingContext2D, drop: Drop) {
      const grad = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.radius * drop.stretch);
      grad.addColorStop(0, `rgba(251, 211, 24, ${drop.alpha})`);
      grad.addColorStop(0.5, `rgba(217, 119, 6, ${drop.alpha * 0.85})`);
      grad.addColorStop(1, `rgba(180, 83, 9, 0)`);
      ctx.save();
      ctx.scale(1, drop.stretch);
      ctx.beginPath();
      ctx.arc(drop.x, drop.y / drop.stretch, drop.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    function drawTrail(ctx: CanvasRenderingContext2D, trail: Trail) {
      const trailH = height * trail.progress;
      const grad = ctx.createLinearGradient(0, 0, 0, trailH);
      grad.addColorStop(0, `rgba(251, 191, 36, 0)`);
      grad.addColorStop(0.6, `rgba(217, 119, 6, 0.55)`);
      grad.addColorStop(1, `rgba(180, 83, 9, 0.7)`);
      ctx.beginPath();
      ctx.moveTo(trail.x, 0);
      // Bezier wiggle for realistic drip
      ctx.bezierCurveTo(
        trail.x + 8, trailH * 0.3,
        trail.x - 6, trailH * 0.6,
        trail.x, trailH
      );
      ctx.strokeStyle = grad;
      ctx.lineWidth = trail.width;
      ctx.lineCap = "round";
      ctx.stroke();

      // Bulging drip tip
      ctx.beginPath();
      ctx.arc(trail.x, trailH, trail.width * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 119, 6, 0.8)`;
      ctx.fill();
    }

    let frame = 0;
    function animate() {
      animationId = requestAnimationFrame(animate);
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Floating hexagons
      for (const hex of hexagons) {
        hex.y -= hex.speed;
        hex.x += hex.drift;
        hex.rot += hex.rotSpeed;
        if (hex.y < -hex.size * 2) hex.y = height + hex.size;
        if (hex.x < -hex.size * 2) hex.x = width + hex.size;
        if (hex.x > width + hex.size * 2) hex.x = -hex.size;
        drawHex(ctx, hex.x, hex.y, hex.size, hex.rot, hex.alpha);
      }

      // Honey drip drops falling
      for (const drop of drops) {
        drop.y += drop.vy;
        if (drop.y > height + drop.radius * 3) {
          drop.y = -drop.radius * 3;
          drop.x = Math.random() * width;
        }
        drawDrop(ctx, drop);
      }

      // Honey trails from top
      for (const trail of trails) {
        trail.progress += trail.speed;
        if (trail.progress > 1.1) {
          trail.progress = 0;
          trail.x = Math.random() * width;
        }
        drawTrail(ctx, trail);
      }

      // Shimmer bokeh
      for (const s of shimmers) {
        s.a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + frame * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 211, 24, ${s.a * 0.5})`;
        ctx.fill();
        s.y -= 0.06;
        if (s.y < -10) s.y = height + 10;
      }
    }

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
