import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Navigation, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';

export const VenueSpotlight: React.FC = () => {
  const mapBtnRef = useRef<HTMLAnchorElement | null>(null);

  // Magnetic hover effect on the redesigned Map Infographic CTA
  useEffect(() => {
    const btn = mapBtnRef.current;
    if (!btn) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < 150) {
        gsap.to(btn, {
          x: dx * 0.22,
          y: dy * 0.22,
          duration: 0.35,
          ease: 'power3.out',
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    };

    const handleLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    btn.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section
      id="venue-section"
      aria-labelledby="venue-heading"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-5xl mx-auto"
    >
      {/* Dramatic Ambient Spotlight Behind the Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[22rem] h-[22rem] sm:w-[34rem] sm:h-[34rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(251,245,183,0.55) 0%, rgba(212,175,55,0.22) 45%, rgba(42,5,12,0) 75%)',
          }}
        />
      </div>

      <div className="relative z-10 royal-glass-card rounded-3xl p-8 sm:p-14 md:p-16 text-center overflow-hidden border-[#D4AF37]/40">
        {/* SVG Art-Deco Frame Drawn Around Venue Card */}
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 sm:inset-5 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] h-[calc(100%-1.5rem)] sm:h-[calc(100%-2.5rem)] text-[#D4AF37]/30"
        >
          <rect
            x="2"
            y="2"
            width="796"
            height="496"
            rx="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="svg-draw-path"
          />
        </svg>

        {/* Diamond Facet Emblem */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#FBF5B7]/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,245,183,0.3)]">
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="w-8 h-8 text-[#FBF5B7]"
            fill="none"
          >
            <polygon
              points="20,12 44,12 56,26 32,54 8,26"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8 26 H56 M20 12 L26 26 L32 54 L38 26 L44 12"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </svg>
        </div>

        <span className="text-xs sm:text-sm font-kufi text-[#D4AF37] tracking-widest block mb-3">
          وجهةُ الاحتفالِ الرئيسيّ
        </span>

        {/* Hall Name with Diamond Shimmer Effect */}
        <h2
          id="venue-heading"
          data-testid="venue-hall-name"
          className="font-ruqaa text-4xl sm:text-6xl md:text-7xl font-bold text-diamond-shimmer py-2 leading-relaxed"
        >
          {CONFIG.mainVenue.hallName}
        </h2>

        <p className="mt-4 text-xl sm:text-2xl font-kufi text-[#F7F3E8] font-medium">
          {CONFIG.mainVenue.clubName}
        </p>

        {/* Location & Date Metadata (8:00 PM removed as requested) */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base text-[#F5E6AD]/85 font-tajawal">
          <span>{CONFIG.mainVenue.address}</span>
          <span aria-hidden="true">·</span>
          <span>{CONFIG.weddingDateDisplay}</span>
        </div>

        {/* Redesigned Architectural Route Infographic & Map Portal */}
        <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-[#24030A]/75 border border-[#D4AF37]/35 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(251,245,183,0.15)]">
          {/* Interactive Route Infographic SVG */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-5 px-2">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#FBF5B7]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-kufi text-[#F5E6AD]/75">نقطة الانطلاق</span>
            </div>

            {/* Golden Dotted Route Path Infographic */}
            <div className="flex-1 flex flex-col items-center">
              <svg
                viewBox="0 0 240 42"
                aria-hidden="true"
                className="w-full h-9 text-[#D4AF37] overflow-visible"
                fill="none"
              >
                <path
                  d="M 8 28 Q 65 4 120 22 T 232 16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="5 5"
                />
                <circle cx="65" cy="16" r="3" fill="#FBF5B7" />
                <circle cx="120" cy="22" r="3.5" fill="#D4AF37" />
                <circle cx="178" cy="26" r="3" fill="#FBF5B7" />
              </svg>
              <span className="text-[11px] font-tajawal text-[#F7F3E8]/70">
                المشاية السفلية — المنصورة
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#FBF5B7] to-[#B8860B] flex items-center justify-center text-[#24030A] shadow-[0_0_20px_rgba(212,175,55,0.65)]">
                {/* Custom Architectural Pin SVG */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L19 9C19 14.25 12 21 12 21C12 21 5 14.25 5 9L12 2Z" />
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[11px] font-kufi text-[#FBF5B7]">القاعة الماسية</span>
            </div>
          </div>

          {/* New Luxury Glass & Gold Pill Map Button with Navigation Icon */}
          <a
            ref={mapBtnRef}
            href={CONFIG.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="venue-map-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 px-9 py-3.5 rounded-full bg-gradient-to-r from-[#4A0816] via-[#6B0E22] to-[#4A0816] border-2 border-[#FBF5B7]/80 text-[#FBF5B7] font-kufi font-semibold text-sm sm:text-base shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.35)] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:via-[#FBF5B7] hover:to-[#D4AF37] hover:text-[#24030A] transition-all duration-300 whitespace-nowrap shrink-0 group"
          >
            <span className="w-7 h-7 rounded-full bg-[#FBF5B7]/20 group-hover:bg-[#24030A]/15 flex items-center justify-center transition-colors">
              <Navigation className="w-4 h-4 -rotate-45" />
            </span>
            <span>افتح الموقع على الخريطة</span>
          </a>
        </div>
      </div>
    </section>
  );
};
