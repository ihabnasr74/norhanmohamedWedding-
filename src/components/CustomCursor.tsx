import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!isFinePointer || prefersReducedMotion) return;

    const container = containerRef.current;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!container || !dot || !halo) return;

    let mouseX = -100;
    let mouseY = -100;
    let haloX = -100;
    let haloY = -100;
    let hasMoved = false;
    let isHoveringInteractive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        haloX = mouseX;
        haloY = mouseY;
        container.style.opacity = '1';
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, input, select, textarea');
      isHoveringInteractive = Boolean(interactive);
    };

    const handleMouseLeave = () => {
      container.style.opacity = '0';
      hasMoved = false;
    };

    let rafId = 0;
    const tick = () => {
      if (hasMoved) {
        haloX += (mouseX - haloX) * 0.16;
        haloY += (mouseY - haloY) * 0.16;
        const scale = isHoveringInteractive ? 1.65 : 1;
        halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%) scale(${scale})`;
        halo.style.borderColor = isHoveringInteractive
          ? 'rgba(251, 245, 183, 0.85)'
          : 'rgba(212, 175, 55, 0.42)';
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hidden lg:block pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-0 transition-opacity duration-300"
    >
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FBF5B7] shadow-[0_0_10px_#D4AF37] will-change-transform"
      />
      <div
        ref={haloRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[#D4AF37]/45 transition-[border-color] duration-200 will-change-transform"
      />
    </div>
  );
};
