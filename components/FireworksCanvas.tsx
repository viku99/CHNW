
import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createFirework = (x: number, y: number) => {
      const colors = ['#fde047', '#f472b6', '#38bdf8', '#fbbf24', '#ffffff', '#a78bfa'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particleCount = 60 + Math.floor(Math.random() * 40);

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color,
          alpha: 1,
          decay: 0.01 + Math.random() * 0.02,
          size: 1 + Math.random() * 2
        });
      }
    };

    const update = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gravity
        p.alpha -= p.decay;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (Math.random() < 0.05) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6
        );
      }

      animationId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', resize);
    resize();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default FireworksCanvas;
