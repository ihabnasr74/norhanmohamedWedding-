import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CelebrationItem, CONFIG } from '../config';

gsap.registerPlugin(ScrollTrigger);

const CelebrationIcon: React.FC<{ type: CelebrationItem['iconType'] }> = ({
  type,
}) => {
  if (type === 'henna') {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#FBF5B7]"
        fill="none"
      >
        <path
          d="M32 10 C38 22 46 28 46 39 C46 47 39.8 53 32 53 C24.2 53 18 47 18 39 C18 28 26 22 32 10 Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M32 18 C24 24 10 26 10 38 C10 46 18 51 28 52 M32 18 C40 24 54 26 54 38 C54 46 46 51 36 52"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="37" r="4" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#FBF5B7]"
        fill="none"
      >
        <path
          d="M32 52 C32 52 12 39 12 24 C12 16.5 17.8 11 25 11 C28.8 11 31.2 13 32 15.5 C32.8 13 35.2 11 39 11 C46.2 11 52 16.5 52 24 C52 39 32 52 32 52 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M23 23 C23 19.5 25.5 17 28.5 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="w-9 h-9 sm:w-10 sm:h-10 text-[#FBF5B7]"
      fill="none"
    >
      <path
        d="M10 46 L14 22 L26 33 L32 16 L38 33 L50 22 L54 46 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 51 H52"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="12" r="2.5" fill="currentColor" />
      <circle cx="13" cy="18" r="2" fill="currentColor" />
      <circle cx="51" cy="18" r="2" fill="currentColor" />
    </svg>
  );
};

export const CelebrationsTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'bottom 65%',
              scrub: 1.2,
            },
          }
        );
      }

      const cardRight = section.querySelector('.timeline-card-bride');
      if (cardRight) {
        gsap.fromTo(
          cardRight,
          { x: 90, opacity: 0.15 },
          {
            x: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRight,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 1.1,
            },
          }
        );
      }

      const cardLeft = section.querySelector('.timeline-card-groom');
      if (cardLeft) {
        gsap.fromTo(
          cardLeft,
          { x: -90, opacity: 0.15 },
          {
            x: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardLeft,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 1.1,
            },
          }
        );
      }

      const cardWedding = section.querySelector('.timeline-card-wedding');
      if (cardWedding) {
        gsap.fromTo(
          cardWedding,
          { scale: 0.84, y: 50, opacity: 0.15 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardWedding,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 1.2,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="timeline-section"
      aria-label="مواعيد الاحتفالات"
      className="relative py-20 sm:py-28 px-4 sm:px-8 max-w-5xl mx-auto"
    >
      {/* Timeline Container */}
      <div className="relative">
        {/* Background Static Hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 bottom-4 right-6 sm:right-1/2 sm:translate-x-1/2 w-[2px] bg-[#D4AF37]/20"
        />

        {/* Self-Drawing Golden Vertical Line */}
        <div
          ref={progressLineRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-4 bottom-4 right-6 sm:right-1/2 sm:translate-x-1/2 w-[2px] bg-gradient-to-b from-[#FBF5B7] via-[#D4AF37] to-[#FBF5B7] shadow-[0_0_15px_#D4AF37] origin-top will-change-transform"
        />

        <div className="space-y-12 sm:space-y-16">
          {CONFIG.celebrations.map((item, idx) => {
            const isMain = Boolean(item.isMainWedding);
            const animClass =
              item.id === 'bride-henna'
                ? 'timeline-card-bride'
                : item.id === 'groom-henna'
                ? 'timeline-card-groom'
                : 'timeline-card-wedding';

            const layoutClass = isMain
              ? 'sm:mx-auto sm:max-w-2xl'
              : idx === 0
              ? 'sm:w-[45%] sm:mr-0 sm:ml-auto'
              : 'sm:w-[45%] sm:ml-0 sm:mr-auto';

            return (
              <div
                key={item.id}
                data-testid={`timeline-card-${item.id}`}
                className={`relative pr-14 sm:pr-0 ${layoutClass} ${animClass} will-change-transform`}
              >
                {/* Golden Node on the Timeline */}
                <div
                  aria-hidden="true"
                  className={`
                    absolute right-3.5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2
                    ${isMain ? '-top-5 w-10 h-10' : 'top-8 w-5 h-5'}
                    rounded-full bg-[#3A0612] border-2 border-[#FBF5B7] shadow-[0_0_20px_rgba(212,175,55,0.85)] z-20 flex items-center justify-center
                  `}
                >
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>

                {/* Card Surface */}
                <article
                  className={`royal-glass-card rounded-2xl p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1 ${
                    isMain
                      ? 'border-[#FBF5B7]/60 shadow-[0_24px_70px_rgba(212,175,55,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] text-center pt-10'
                      : 'hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 mb-4 ${
                      isMain ? 'flex-col justify-center' : 'justify-start'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                      <CelebrationIcon type={item.iconType} />
                    </div>
                    <div>
                      {item.subtitle && (
                        <span className="text-xs font-kufi text-[#D4AF37] tracking-wider block mb-1">
                          {item.subtitle}
                        </span>
                      )}
                      <h3 className="font-ruqaa text-2xl sm:text-3xl text-metallic-gold">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Large Day & Date */}
                  <p className="text-xl sm:text-2xl font-kufi font-semibold text-[#F7F3E8] mt-3 mb-2">
                    {item.dayAndDate}
                  </p>

                  {/* Location */}
                  <p className="text-sm sm:text-base text-[#F7F3E8]/85 font-tajawal leading-relaxed">
                    {item.location}
                  </p>

                  <div
                    className={`mt-4 pt-4 border-t border-[#D4AF37]/20 flex items-center gap-2 text-xs sm:text-sm text-[#F5E6AD]/80 font-tajawal ${
                      isMain ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <span>تشريفكم يزيدنا بهجةً وسرورًا</span>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
