import React, { useEffect, useRef } from 'react';
import { getOptimalParticleCount } from '../utils/invitationLogic';

interface GoldDustCanvasProps {
  burstSignal: number;
  scrollProgress: number;
}

interface DustParticle {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  driftVx: number;
  driftVy: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitAngle: number;
  orbitSpeed: number;
  waveFreq: number;
  wavePhase: number;
  depth: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  isStarGlint: boolean;
  color: string;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  color: string;
}

const GOLD_PALETTE = [
  '255, 248, 205', // Radiant Warm Starlight
  '212, 175, 55',  // Royal Champagne Gold
  '251, 245, 183', // Luminous Light Gold
  '255, 232, 198', // Soft Rose-Champagne
];

export const GoldDustCanvas: React.FC<GoldDustCanvasProps> = ({
  burstSignal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstSignalRef = useRef<number>(0);
  const spawnBurstRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const createAmbientParticles = (): DustParticle[] => {
      const count = getOptimalParticleCount(width, prefersReducedMotion);
      const list: DustParticle[] = [];
      for (let i = 0; i < count; i++) {
        const isStarGlint = i % 7 === 0;
        const depth = 0.35 + ((i * 17) % 65) / 100; // 0.35 (far) to 1.0 (near)
        const baseAlpha = (0.35 + Math.random() * 0.42) * (0.55 + depth * 0.45);
        // Smaller, delicate pinpoint sizes (0.48px to 1.08px core)
        const radius = (0.48 + Math.random() * 0.58) * (0.7 + depth * 0.35);

        const anchorX = Math.random() * width;
        const anchorY = Math.random() * height;
        const orbitAngle = Math.random() * Math.PI * 2;
        const orbitRadiusX = 14 + Math.random() * 34;
        const orbitRadiusY = 10 + Math.random() * 26;

        list.push({
          anchorX,
          anchorY,
          x: anchorX,
          y: anchorY,
          driftVx: (Math.random() - 0.42) * 0.16 * depth,
          driftVy: (-0.09 - Math.random() * 0.15) * depth,
          orbitRadiusX,
          orbitRadiusY,
          orbitAngle,
          orbitSpeed: (0.005 + Math.random() * 0.009) * (i % 2 === 0 ? 1 : -1),
          waveFreq: 0.003 + Math.random() * 0.004,
          wavePhase: Math.random() * Math.PI * 2,
          depth,
          radius,
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          pulseOffset: Math.random() * Math.PI * 2,
          isStarGlint,
          color: GOLD_PALETTE[i % GOLD_PALETTE.length],
        });
      }
      return list;
    };

    let particles = createAmbientParticles();
    const burstParticles: BurstParticle[] = [];

    // Delicate golden stardust burst on envelope open
    spawnBurstRef.current = () => {
      if (prefersReducedMotion) return;
      const centerX = width / 2;
      const centerY = height / 2;
      const bloomCount = width < 768 ? 36 : 56;

      for (let i = 0; i < bloomCount; i++) {
        const angle = (Math.PI * 2 * i) / bloomCount + (Math.random() - 0.5) * 0.45;
        const speed = 0.45 + Math.random() * 1.65;
        burstParticles.push({
          x: centerX + (Math.random() - 0.5) * 55,
          y: centerY + (Math.random() - 0.5) * 55,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.35,
          size: 0.9 + Math.random() * 1.4,
          alpha: 0.85,
          decay: 0.0035 + Math.random() * 0.004,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
          color: GOLD_PALETTE[i % GOLD_PALETTE.length],
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = createAmbientParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      scrollVelocity = Math.max(-14, Math.min(14, currentY - lastScrollY));
      lastScrollY = currentY;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let frameId = 0;
    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;
      scrollVelocity *= 0.93;

      const offsetX = ((mouseX - width / 2) / width) * 14;
      const offsetY = ((mouseY - height / 2) / height) * 14;

      // Render delicate, small glowing specks moving on smooth Lissajous orbital + silk flow-field currents
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.orbitAngle += p.orbitSpeed;

          // Silk curl-flow field + gentle drift of the orbital anchor
          const flowCurlX =
            Math.sin(p.anchorY * p.waveFreq + tick * 0.008 + p.wavePhase) *
            0.22 *
            p.depth;
          const flowCurlY =
            Math.cos(p.anchorX * p.waveFreq + tick * 0.007 + p.wavePhase) *
            0.18 *
            p.depth;

          p.anchorX += p.driftVx + flowCurlX;
          p.anchorY += p.driftVy + flowCurlY - scrollVelocity * 0.055 * p.depth;

          // Wrap anchor smoothly around viewport edges with margin
          const margin = 45;
          if (p.anchorY < -margin) p.anchorY = height + margin;
          if (p.anchorY > height + margin) p.anchorY = -margin;
          if (p.anchorX < -margin) p.anchorX = width + margin;
          if (p.anchorX > width + margin) p.anchorX = -margin;

          // Figure-8 / Lissajous orbital offset around the smoothly drifting anchor
          p.x =
            p.anchorX +
            Math.cos(p.orbitAngle) * p.orbitRadiusX +
            Math.sin(p.orbitAngle * 2) * (p.orbitRadiusX * 0.22);
          p.y =
            p.anchorY +
            Math.sin(p.orbitAngle) * p.orbitRadiusY +
            Math.cos(p.orbitAngle * 2) * (p.orbitRadiusY * 0.18);

          p.alpha =
            p.baseAlpha +
            Math.sin(tick * p.pulseSpeed + p.pulseOffset) * (p.baseAlpha * 0.45);
        }

        const drawX = p.x + offsetX * p.depth;
        const drawY = p.y + offsetY * p.depth;
        const clampedAlpha = Math.max(0.08, Math.min(0.92, p.alpha));

        // Tight, delicate golden aura + tiny pinpoint core
        const glowRadius = p.radius * 2.0;
        const glowGrad = ctx.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          glowRadius
        );
        glowGrad.addColorStop(0, `rgba(255, 253, 240, ${clampedAlpha})`);
        glowGrad.addColorStop(0.45, `rgba(${p.color}, ${clampedAlpha * 0.48})`);
        glowGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint star core
        ctx.fillStyle = `rgba(255, 254, 245, ${Math.min(1, clampedAlpha * 1.1)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (p.isStarGlint) {
          const rayLen =
            p.radius * (1.45 + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.4);
          ctx.strokeStyle = `rgba(255, 253, 240, ${clampedAlpha * 0.72})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(drawX - rayLen, drawY);
          ctx.lineTo(drawX + rayLen, drawY);
          ctx.moveTo(drawX, drawY - rayLen);
          ctx.lineTo(drawX, drawY + rayLen);
          ctx.stroke();
        }
      }

      // Render delicate floating stardust on envelope open
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const b = burstParticles[i];
        b.x += b.vx + Math.sin(tick * 0.02 + i) * 0.16;
        b.y += b.vy;
        b.vx *= 0.994;
        b.vy *= 0.995;
        b.rotation += b.vRot;
        b.alpha -= b.decay;

        if (b.alpha <= 0.01) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 1.6);
        grad.addColorStop(0, `rgba(255, 253, 240, ${b.alpha})`);
        grad.addColorStop(0.45, `rgba(${b.color}, ${b.alpha * 0.65})`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, b.size * 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (burstSignal > burstSignalRef.current) {
      burstSignalRef.current = burstSignal;
      spawnBurstRef.current?.();
    }
  }, [burstSignal]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="gold-dust-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[2] w-full h-full"
    />
  );
};
