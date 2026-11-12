import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { RoyalMNMonogram } from './RoyalMNMonogram';

interface WaxSealIntroProps {
  isOpened: boolean;
  onStartOpen: () => void;
  onCompleteOpen: () => void;
}

interface RomanticPetalMote {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  size: number;
  isPetal: boolean;
}

interface AmbientFirefly {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

export const WaxSealIntro: React.FC<WaxSealIntroProps> = ({
  isOpened,
  onStartOpen,
  onCompleteOpen,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const bottomFlapRef = useRef<HTMLDivElement | null>(null);
  const leftWingRef = useRef<HTMLDivElement | null>(null);
  const rightWingRef = useRef<HTMLDivElement | null>(null);
  const seamLine1Ref = useRef<SVGLineElement | null>(null);
  const seamLine2Ref = useRef<SVGLineElement | null>(null);
  const seamLine3Ref = useRef<SVGLineElement | null>(null);
  const seamLine4Ref = useRef<SVGLineElement | null>(null);
  const envelopePocketGlowRef = useRef<HTMLDivElement | null>(null);

  const sealStageRef = useRef<HTMLDivElement | null>(null);
  const sealButtonRef = useRef<HTMLButtonElement | null>(null);
  const intactSealRef = useRef<HTMLDivElement | null>(null);
  const ringLightPathRef = useRef<SVGCircleElement | null>(null);
  const ringLightSecondaryRef = useRef<SVGCircleElement | null>(null);
  const orbitSparkWrapRef = useRef<HTMLDivElement | null>(null);
  const motesWrapRef = useRef<HTMLDivElement | null>(null);
  const promptWrapRef = useRef<HTMLDivElement | null>(null);
  const introFirefliesWrapRef = useRef<HTMLDivElement | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [monogramLit, setMonogramLit] = useState(false);

  // 22 delicate, smaller glowing firefly specks in the background of the Intro screen
  const introFireflies = useMemo<AmbientFirefly[]>(() => {
    const list: AmbientFirefly[] = [];
    for (let i = 0; i < 22; i++) {
      list.push({
        id: i,
        left: `${(i * 23 + (i % 5) * 9) % 92 + 4}%`,
        top: `${(i * 29 + (i % 7) * 7) % 90 + 5}%`,
        size: i % 3 === 0 ? 2.4 : i % 2 === 0 ? 1.9 : 1.5,
        duration: 3.4 + (i % 5) * 0.7,
        delay: (i % 7) * 0.35,
      });
    }
    return list;
  }, []);

  // 32 golden stardust motes that trail behind the unsealing wax seal
  const romanticMotes = useMemo<RomanticPetalMote[]>(() => {
    const items: RomanticPetalMote[] = [];
    for (let i = 0; i < 32; i++) {
      const angle = (Math.PI * 2 * i) / 32 + (i % 3) * 0.2;
      const radius = 65 + ((i * 23) % 130);
      items.push({
        id: i,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius - 45,
        rot: ((i * 53) % 180) - 90,
        scale: 0.65 + ((i * 11) % 8) / 10,
        size: i % 3 === 0 ? 11 : i % 2 === 0 ? 8 : 5,
        isPetal: i % 2 === 0,
      });
    }
    return items;
  }, []);

  // Smooth silk-wave floating motion for the small glowing background specks on the Intro screen
  useEffect(() => {
    if (isOpened) return;
    const wrap = introFirefliesWrapRef.current;
    if (!wrap) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const dots = wrap.querySelectorAll('.intro-ambient-firefly');
      dots.forEach((dot, i) => {
        const dirX = i % 2 === 0 ? 1 : -1;
        const dirY = i % 3 === 0 ? -1 : 1;
        gsap.to(dot, {
          x: dirX * (16 + (i % 5) * 6),
          y: dirY * (14 + (i % 4) * 7),
          opacity: 0.35 + (i % 4) * 0.16,
          duration: 3.2 + (i % 5) * 0.65,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: (i % 6) * 0.25,
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, [isOpened]);

  // 3D Magnetic & Silk-Tilt interaction on the Wax Seal before opening
  useEffect(() => {
    if (isOpened || isAnimating) return;
    const btn = sealButtonRef.current;
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);

      if (dist < 250) {
        const pull = (1 - dist / 250) * 0.24;
        const rotateY = (deltaX / (rect.width / 2)) * 9;
        const rotateX = -(deltaY / (rect.height / 2)) * 9;
        gsap.to(btn, {
          x: deltaX * pull,
          y: deltaY * pull,
          rotateX,
          rotateY,
          duration: 0.7,
          ease: 'power3.out',
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1.0,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [isOpened, isAnimating]);

  const handleSealClick = () => {
    if (isAnimating || isOpened) return;
    setIsAnimating(true);
    onStartOpen();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: 'sine.inOut',
        onComplete: () => {
          onCompleteOpen();
        },
      });
      return;
    }

    const domMotes = motesWrapRef.current?.querySelectorAll('.romantic-floating-mote');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        onCompleteOpen();
      },
    });

    // ACT 1 (0.0s -> 1.0s): Golden Ring Light Circle + Monogram Illumination + Golden Envelope Seams Trace Outward
    tl.to(
      sealButtonRef.current,
      {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 0.94,
        duration: 0.2,
        ease: 'sine.out',
      },
      0
    ).to(
      sealButtonRef.current,
      {
        scale: 1.05,
        duration: 0.65,
        ease: 'back.out(1.6)',
      },
      0.2
    );

    // Golden light beam runs 360° around the circle
    if (ringLightPathRef.current) {
      tl.set(ringLightPathRef.current, { opacity: 1 }, 0.02).fromTo(
        ringLightPathRef.current,
        { strokeDashoffset: 660 },
        {
          strokeDashoffset: 0,
          duration: 0.95,
          ease: 'power2.inOut',
        },
        0.04
      );
    }

    if (ringLightSecondaryRef.current) {
      tl.set(ringLightSecondaryRef.current, { opacity: 0.75 }, 0.06).fromTo(
        ringLightSecondaryRef.current,
        { strokeDashoffset: -660 },
        {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: 'sine.inOut',
        },
        0.06
      );
    }

    if (orbitSparkWrapRef.current) {
      tl.fromTo(
        orbitSparkWrapRef.current,
        { opacity: 0, rotation: 0 },
        {
          opacity: 1,
          rotation: 360,
          duration: 0.98,
          ease: 'power2.inOut',
        },
        0.04
      ).to(
        orbitSparkWrapRef.current,
        { opacity: 0, duration: 0.35, ease: 'sine.out' },
        0.98
      );
    }

    // Illuminate M & N letters and dissolve prompt text cleanly before envelope unfolds
    tl.call(
      () => {
        setMonogramLit(true);
      },
      [],
      0.55
    )
      .to(
        promptWrapRef.current,
        {
          color: '#FFFDF5',
          textShadow: '0 0 20px rgba(255, 245, 190, 0.95)',
          duration: 0.35,
          ease: 'sine.out',
        },
        0.55
      )
      .to(
        promptWrapRef.current,
        {
          opacity: 0,
          y: 14,
          filter: 'blur(5px)',
          duration: 0.45,
          ease: 'power2.in',
        },
        0.82
      );

    // Golden Envelope Flap Seams shoot out from the center seal to the 4 corners (0.68s -> 1.18s)
    const seamLines = [
      seamLine1Ref.current,
      seamLine2Ref.current,
      seamLine3Ref.current,
      seamLine4Ref.current,
    ].filter(Boolean);

    if (seamLines.length > 0) {
      tl.set(seamLines, { opacity: 1 }, 0.68)
        .fromTo(
          seamLines,
          { strokeDashoffset: 90 },
          {
            strokeDashoffset: 0,
            duration: 0.52,
            ease: 'power2.out',
          },
          0.68
        )
        .to(
          seamLines,
          {
            opacity: 0,
            duration: 0.35,
            ease: 'sine.out',
          },
          1.22
        );
    }

    // ACT 2 (1.05s -> 2.85s): The Wax Seal Levitates Upward like a Crown & 4 Envelope Flaps Unfold in 3D Perspective
    if (domMotes && domMotes.length > 0) {
      tl.set(motesWrapRef.current, { opacity: 1 }, 1.0)
        .fromTo(
          domMotes,
          { x: 0, y: 0, scale: 0.2, opacity: 0 },
          {
            x: (i) => romanticMotes[i]?.dx ?? 50,
            y: (i) => romanticMotes[i]?.dy ?? -60,
            rotation: (i) => romanticMotes[i]?.rot ?? 45,
            scale: (i) => romanticMotes[i]?.scale ?? 1,
            opacity: 0.95,
            duration: 1.25,
            stagger: 0.012,
            ease: 'power2.out',
          },
          1.0
        )
        .to(
          domMotes,
          {
            y: (i) => (romanticMotes[i]?.dy ?? -60) - 55,
            opacity: 0,
            duration: 1.0,
            ease: 'sine.inOut',
          },
          2.05
        );
    }

    // Seal rises gracefully upward into the Hero crest position
    tl.to(
      [ringLightPathRef.current, ringLightSecondaryRef.current],
      {
        opacity: 0,
        scale: 1.12,
        duration: 0.55,
        ease: 'sine.out',
      },
      1.05
    ).to(
      sealStageRef.current,
      {
        y: -155,
        scale: 0.76,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 1.35,
        ease: 'power3.inOut',
      },
      1.12
    );

    // Warm golden light spills from inside the envelope pocket
    tl.fromTo(
      envelopePocketGlowRef.current,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 0.95,
        scale: 1.35,
        duration: 1.2,
        ease: 'power2.out',
      },
      1.15
    );

    // 1) Top Royal Triangular Envelope Flap folds open upward in 3D perspective
    tl.to(
      topFlapRef.current,
      {
        rotateX: 165,
        yPercent: -35,
        opacity: 0,
        duration: 1.45,
        ease: 'power3.inOut',
      },
      1.15
    )
      // 2) Left & Right Velvet Envelope Wings fold open outward like origami wings
      .to(
        rightWingRef.current,
        {
          xPercent: 105,
          rotateY: -55,
          opacity: 0,
          duration: 1.65,
          ease: 'power3.inOut',
        },
        1.4
      )
      .to(
        leftWingRef.current,
        {
          xPercent: -105,
          rotateY: 55,
          opacity: 0,
          duration: 1.65,
          ease: 'power3.inOut',
        },
        1.4
      )
      // 3) Bottom Envelope Pocket glides downward as the Invitation Card rises out of it
      .to(
        bottomFlapRef.current,
        {
          yPercent: 105,
          rotateX: -45,
          opacity: 0,
          duration: 1.65,
          ease: 'power3.inOut',
        },
        1.5
      )
      .to(
        envelopePocketGlowRef.current,
        {
          opacity: 0,
          scale: 1.9,
          duration: 1.2,
          ease: 'sine.inOut',
        },
        2.15
      );
  };

  if (isOpened) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      data-testid="wax-seal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      style={{ perspective: '1600px' }}
    >
      {/* Warm Golden Light Inside the Envelope Pocket */}
      <div
        ref={envelopePocketGlowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(255, 249, 215, 0.72) 0%, rgba(212, 175, 55, 0.36) 35%, rgba(92, 10, 26, 0.18) 62%, transparent 82%)',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          3D FOUR-FLAP ROYAL BURGUNDY VELVET ENVELOPE (Seamless while idle, unfolds in 3D on click!)
      ═══════════════════════════════════════════════════════════════════ */}

      {/* 1) LEFT ENVELOPE WING FLAP */}
      <div
        ref={leftWingRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-11 will-change-transform"
        style={{
          transformOrigin: 'left center',
          clipPath: 'polygon(0% 0%, 51% 50%, 0% 100%)',
          background:
            'radial-gradient(circle at 50% 45%, #5C0A1B 0%, #3E0510 48%, #220208 85%, #140104 100%)',
        }}
      >
        {/* Top-Left & Bottom-Left Royal Filigree Corners */}
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-24 sm:h-24 text-[#D4AF37]/40 absolute top-6 left-6 sm:top-10 sm:left-10 -scale-x-100"
          fill="none"
        >
          <path
            d="M95 5 H35 L5 35 V95 M85 15 H42 L15 42 V85"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-24 sm:h-24 text-[#D4AF37]/40 absolute bottom-6 left-6 sm:bottom-10 sm:left-10 -scale-x-100 -rotate-90"
          fill="none"
        >
          <path
            d="M95 5 H35 L5 35 V95 M85 15 H42 L15 42 V85"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* 2) RIGHT ENVELOPE WING FLAP */}
      <div
        ref={rightWingRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-11 will-change-transform"
        style={{
          transformOrigin: 'right center',
          clipPath: 'polygon(100% 0%, 49% 50%, 100% 100%)',
          background:
            'radial-gradient(circle at 50% 45%, #5C0A1B 0%, #3E0510 48%, #220208 85%, #140104 100%)',
        }}
      >
        {/* Top-Right & Bottom-Right Royal Filigree Corners */}
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-24 sm:h-24 text-[#D4AF37]/40 absolute top-6 right-6 sm:top-10 sm:right-10"
          fill="none"
        >
          <path
            d="M95 5 H35 L5 35 V95 M85 15 H42 L15 42 V85"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 sm:w-24 sm:h-24 text-[#D4AF37]/40 absolute bottom-6 right-6 sm:bottom-10 sm:right-10 rotate-90"
          fill="none"
        >
          <path
            d="M95 5 H35 L5 35 V95 M85 15 H42 L15 42 V85"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="20" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* 3) BOTTOM ENVELOPE POCKET FLAP */}
      <div
        ref={bottomFlapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-12 will-change-transform"
        style={{
          transformOrigin: 'bottom center',
          clipPath: 'polygon(0% 100%, 50% 49%, 100% 100%)',
          background:
            'radial-gradient(circle at 50% 45%, #5C0A1B 0%, #3E0510 48%, #220208 85%, #140104 100%)',
        }}
      />

      {/* 4) TOP ROYAL TRIANGULAR ENVELOPE FLAP (Hinges open upward in 3D) */}
      <div
        ref={topFlapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-13 will-change-transform"
        style={{
          transformOrigin: 'top center',
          clipPath: 'polygon(0% 0%, 100% 0%, 50% 51%)',
          background:
            'radial-gradient(circle at 50% 45%, #5C0A1B 0%, #3E0510 48%, #220208 85%, #140104 100%)',
        }}
      />

      {/* GOLDEN ENVELOPE SEAM RAYS (Hidden while idle; trace out from center to 4 corners when seal is touched!) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-14"
      >
        <line
          ref={seamLine1Ref}
          x1="50"
          y1="50"
          x2="0"
          y2="0"
          stroke="#FBF5B7"
          strokeWidth="0.45"
          strokeDasharray="90"
          strokeDashoffset="90"
          className="opacity-0"
        />
        <line
          ref={seamLine2Ref}
          x1="50"
          y1="50"
          x2="100"
          y2="0"
          stroke="#FBF5B7"
          strokeWidth="0.45"
          strokeDasharray="90"
          strokeDashoffset="90"
          className="opacity-0"
        />
        <line
          ref={seamLine3Ref}
          x1="50"
          y1="50"
          x2="0"
          y2="100"
          stroke="#FBF5B7"
          strokeWidth="0.45"
          strokeDasharray="90"
          strokeDashoffset="90"
          className="opacity-0"
        />
        <line
          ref={seamLine4Ref}
          x1="50"
          y1="50"
          x2="100"
          y2="100"
          stroke="#FBF5B7"
          strokeWidth="0.45"
          strokeDasharray="90"
          strokeDashoffset="90"
          className="opacity-0"
        />
      </svg>

      {/* LIVE SMALL GLOWING MOVING FIREFLY SPECKS IN THE BACKGROUND OVER THE BURGUNDY ENVELOPE */}
      <div
        ref={introFirefliesWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-14 overflow-hidden"
      >
        {introFireflies.map((dot) => (
          <span
            key={dot.id}
            className="intro-ambient-firefly absolute rounded-full will-change-transform"
            style={{
              left: dot.left,
              top: dot.top,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              background:
                'radial-gradient(circle, #FFFDF5 0%, #FBF5B7 55%, rgba(212,175,55,0) 100%)',
              boxShadow:
                '0 0 6px 1px rgba(251, 245, 183, 0.65), 0 0 11px 2px rgba(212, 175, 55, 0.3)',
            }}
          />
        ))}
      </div>

      {/* CENTER SMALLER WAX SEAL STAGE */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center">
        <div
          ref={sealStageRef}
          className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 will-change-transform"
        >
          {/* Breathing Ambient Golden Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-full bg-[#D4AF37]/35 blur-2xl animate-seal-glow"
          />

          {/* Orbiting Comet Starlight Spark Around the Circle Rim */}
          <div
            ref={orbitSparkWrapRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 opacity-0 flex items-start justify-center"
          >
            <div
              className="w-5 h-5 -mt-0.5 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, #FFFFFF 0%, #FFF5B8 45%, rgba(212, 175, 55, 0) 100%)',
                boxShadow:
                  '0 0 18px 4px rgba(255, 248, 210, 0.95), 0 0 36px 8px rgba(212, 175, 55, 0.8)',
              }}
            />
          </div>

          {/* Dual Liquid-Gold Light Ring Runners Around the Smaller Circle */}
          <svg
            viewBox="0 0 240 240"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full z-30 -rotate-90 overflow-visible"
          >
            <defs>
              <linearGradient
                id="runnerBeamGradSmall"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="240"
                y2="240"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FFF6C2" />
                <stop offset="75%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9C6F18" />
              </linearGradient>
              <filter id="runnerGlowSmall" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              ref={ringLightPathRef}
              cx="120"
              cy="120"
              r="102"
              fill="none"
              stroke="url(#runnerBeamGradSmall)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="660"
              strokeDashoffset="660"
              filter="url(#runnerGlowSmall)"
              className="opacity-0"
            />
            <circle
              ref={ringLightSecondaryRef}
              cx="120"
              cy="120"
              r="95"
              fill="none"
              stroke="url(#runnerBeamGradSmall)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="660"
              strokeDashoffset="-660"
              filter="url(#runnerGlowSmall)"
              className="opacity-0"
            />
          </svg>

          {/* INTERACTIVE SMALLER WAX SEAL BUTTON */}
          <button
            ref={sealButtonRef}
            type="button"
            onClick={handleSealClick}
            disabled={isAnimating}
            aria-label="المس الختم لفتح الدعوة - Touch the seal to open the invitation"
            data-testid="wax-seal-button"
            className="relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF5B7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#2A050C] group shadow-[0_24px_55px_rgba(8,0,2,0.95)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div ref={intactSealRef} className="w-full h-full rounded-full">
              <RoyalMNMonogram size="seal" isIlluminated={monogramLit} />
            </div>

            {/* GOLDEN STARDUST MOTES ON UNSEALING */}
            <div
              ref={motesWrapRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-0 z-30"
            >
              {romanticMotes.map((mote) => (
                <span
                  key={mote.id}
                  className="romantic-floating-mote absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    width: `${mote.size}px`,
                    height: `${mote.size}px`,
                    background: mote.isPetal
                      ? 'radial-gradient(circle at 35% 35%, #FFF6C8 0%, #D4AF37 55%, rgba(184, 134, 11, 0.18) 100%)'
                      : 'radial-gradient(circle, #FFFDF5 0%, #FBF5B7 60%, transparent 100%)',
                    borderRadius: mote.isPetal
                      ? '62% 38% 68% 32% / 44% 56% 44% 56%'
                      : '9999px',
                    boxShadow: '0 0 18px rgba(251, 245, 183, 0.85)',
                  }}
                />
              ))}
            </div>
          </button>
        </div>

        {/* Bottom Bilingual Prompt (Clean, unboxed typography matching reference) */}
        <div
          ref={promptWrapRef}
          className="mt-6 flex flex-col items-center gap-1.5 text-[#F5E6AD]/90 will-change-transform"
        >
          <p
            className={`text-base sm:text-lg tracking-wide ${
              isAnimating ? '' : 'animate-prompt-fade'
            }`}
            style={{ fontFamily: "'Amiri', serif" }}
          >
            المس الختم لفتح الدعوة
          </p>
          <p
            dir="ltr"
            className={`text-base sm:text-lg italic tracking-wide ${
              isAnimating ? '' : 'animate-prompt-fade'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Touch the seal to open the invitation
          </p>
        </div>
      </div>
    </div>
  );
};
