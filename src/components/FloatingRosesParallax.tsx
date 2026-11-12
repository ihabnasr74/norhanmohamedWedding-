import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GLOSSY_COUPLE_ASSET =
  '/assets/aistudio/Glossy_Couple_with_Rose_Bouquet_3ed4e808.png';

interface ExtractedCoupleFigures {
  groomUrl: string | null;
  brideUrl: string | null;
}

/**
 * Extracts the 3D Glossy Groom (left figure in reference) and 3D Glossy Bride with Rose Bouquet (right figure in reference)
 * from /assets/aistudio/Glossy_Couple_with_Rose_Bouquet_3ed4e808.png, preserving its native high-resolution alpha channel.
 */
function useExtractedCoupleFigures(src: string): ExtractedCoupleFigures {
  const [assets, setAssets] = useState<ExtractedCoupleFigures>({
    groomUrl: null,
    brideUrl: null,
  });

  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;
      try {
        const fullW = img.naturalWidth || img.width;
        const fullH = img.naturalHeight || img.height;

        const cropFigure = (
          cropX: number,
          cropY: number,
          cropW: number,
          cropH: number
        ): string => {
          const canvas = document.createElement('canvas');
          canvas.width = cropW;
          canvas.height = cropH;
          const ctx = canvas.getContext('2d');
          if (!ctx) return '';

          ctx.clearRect(0, 0, cropW, cropH);
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropW,
            cropH,
            0,
            0,
            cropW,
            cropH
          );

          return canvas.toDataURL('image/png');
        };

        // Left figure in reference: Glossy 3D Groom (x: 18.5%..46.7% of image width)
        const groomUrl = cropFigure(
          Math.round(fullW * 0.185),
          Math.round(fullH * 0.004),
          Math.round(fullW * 0.282),
          Math.round(fullH * 0.992)
        );

        // Right figure in reference: Glossy 3D Bride with Red Rose Bouquet (x: 47.8%..84.3% of image width)
        const brideUrl = cropFigure(
          Math.round(fullW * 0.478),
          Math.round(fullH * 0.015),
          Math.round(fullW * 0.365),
          Math.round(fullH * 0.981)
        );

        if (!isCancelled) {
          setAssets({ groomUrl, brideUrl });
        }
      } catch {
        if (!isCancelled) {
          setAssets({ groomUrl: null, brideUrl: null });
        }
      }
    };

    img.src = src;
    return () => {
      isCancelled = true;
    };
  }, [src]);

  return assets;
}

/**
 * Renders the 3D Glossy Groom and 3D Glossy Bride with Rose Bouquet
 * moving along the exact choreographed, curved waltz S-trajectories
 * synchronized with the user's scroll across the entire invitation.
 */
export const FloatingRosesParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groomSuitWrapRef = useRef<HTMLDivElement | null>(null);
  const brideDressWrapRef = useRef<HTMLDivElement | null>(null);
  const groomFloatInnerRef = useRef<HTMLDivElement | null>(null);
  const brideFloatInnerRef = useRef<HTMLDivElement | null>(null);

  const { groomUrl, brideUrl } = useExtractedCoupleFigures(GLOSSY_COUPLE_ASSET);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Continuous weightless 3D levitation & subtle tilt even when scroll is paused
      if (groomFloatInnerRef.current) {
        gsap.to(groomFloatInnerRef.current, {
          y: -10,
          rotation: 2.5,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (brideFloatInnerRef.current) {
        gsap.to(brideFloatInnerRef.current, {
          y: 10,
          rotation: -2.5,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // CHOREOGRAPHED CURVED WALTZ PARALLAX FOR GROOM (Right Side)
      // Moves along a multi-waypoint S-curve waltz path across the 5 sections
      if (groomSuitWrapRef.current) {
        gsap.set(groomSuitWrapRef.current, {
          x: '0vw',
          y: '11vh',
          rotation: -8,
          rotateY: -14,
          scale: 1,
        });

        gsap.to(groomSuitWrapRef.current, {
          keyframes: [
            // Stage 1: Sweep gracefully inward toward the Romantic Verse card
            {
              x: '-13vw',
              y: '27vh',
              rotation: 9,
              rotateY: 16,
              scale: 1.06,
              ease: 'sine.inOut',
            },
            // Stage 2: Arc outward around the Countdown clock
            {
              x: '-2vw',
              y: '46vh',
              rotation: -12,
              rotateY: -18,
              scale: 0.96,
              ease: 'sine.inOut',
            },
            // Stage 3: Glide inward in a diagonal waltz across the Celebrations Timeline
            {
              x: '-16vw',
              y: '63vh',
              rotation: 11,
              rotateY: 12,
              scale: 1.05,
              ease: 'sine.inOut',
            },
            // Stage 4: Meet in harmony near the Wedding Venue & Finale
            {
              x: '-21vw',
              y: '74vh',
              rotation: -4,
              rotateY: -8,
              scale: 1.08,
              ease: 'sine.inOut',
            },
          ],
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      }

      // CHOREOGRAPHED CURVED WALTZ PARALLAX FOR BRIDE WITH ROSE BOUQUET (Left Side)
      // Mirrors and dances with the Groom along a complementary S-curve path
      if (brideDressWrapRef.current) {
        gsap.set(brideDressWrapRef.current, {
          x: '0vw',
          y: '42vh',
          rotation: 8,
          rotateY: 14,
          scale: 1,
        });

        gsap.to(brideDressWrapRef.current, {
          keyframes: [
            // Stage 1: Sweep inward to face the Groom across the Romantic Verse
            {
              x: '13vw',
              y: '26vh',
              rotation: -9,
              rotateY: -16,
              scale: 1.06,
              ease: 'sine.inOut',
            },
            // Stage 2: Arc outward around the Countdown clock
            {
              x: '2vw',
              y: '48vh',
              rotation: 12,
              rotateY: 18,
              scale: 0.96,
              ease: 'sine.inOut',
            },
            // Stage 3: Glide inward across the Celebrations Timeline
            {
              x: '16vw',
              y: '62vh',
              rotation: -11,
              rotateY: -12,
              scale: 1.05,
              ease: 'sine.inOut',
            },
            // Stage 4: Settle gracefully beside the Groom at the Finale
            {
              x: '21vw',
              y: '74vh',
              rotation: 4,
              rotateY: 8,
              scale: 1.08,
              ease: 'sine.inOut',
            },
          ],
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="floating-roses-parallax"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-25 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* 1) 3D GLOSSY GROOM FIGURE (Right Side — Curved Waltz Path) */}
      <div
        ref={groomSuitWrapRef}
        data-testid="parallax-groom-suit"
        className="fixed top-0 right-2 sm:right-6 md:right-12 w-28 h-44 sm:w-36 sm:h-56 md:w-44 md:h-64 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={groomFloatInnerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Soft Golden Halo Behind the Groom */}
          <div
            className="absolute inset-3 rounded-full opacity-50 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(212, 175, 55, 0.42) 0%, rgba(251, 245, 183, 0.14) 55%, transparent 78%)',
            }}
          />
          {groomUrl && (
            <img
              src={groomUrl}
              alt=""
              className="relative z-10 w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_18px_28px_rgba(8,0,3,0.9)]"
            />
          )}
        </div>
      </div>

      {/* 2) 3D GLOSSY BRIDE WITH ROSE BOUQUET (Left Side — Curved Waltz Path) */}
      <div
        ref={brideDressWrapRef}
        data-testid="parallax-bride-dress"
        className="fixed top-0 left-2 sm:left-6 md:left-12 w-28 h-44 sm:w-36 sm:h-56 md:w-44 md:h-64 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={brideFloatInnerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Soft Warm Pearl-Gold Halo Behind the Bride */}
          <div
            className="absolute inset-3 rounded-full opacity-55 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 248, 215, 0.45) 0%, rgba(212, 175, 55, 0.16) 55%, transparent 78%)',
            }}
          />
          {brideUrl && (
            <img
              src={brideUrl}
              alt=""
              className="relative z-10 w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_18px_28px_rgba(8,0,3,0.9)]"
            />
          )}
        </div>
      </div>
    </div>
  );
};
