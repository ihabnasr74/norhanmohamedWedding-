import React, { useEffect, useState } from 'react';
import {
  calculateCountdown,
  CountdownState,
  formatTwoDigits,
} from '../utils/invitationLogic';
import { CONFIG } from '../config';

interface FlipUnitProps {
  value: number;
  label: string;
  testId: string;
}

const FlipUnit: React.FC<FlipUnitProps> = ({ value, label, testId }) => {
  const formatted = value >= 100 ? `${value}` : formatTwoDigits(value);
  const [prevValue, setPrevValue] = useState(formatted);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (formatted !== prevValue) {
      setIsFlipping(true);
      const timer = window.setTimeout(() => {
        setPrevValue(formatted);
        setIsFlipping(false);
      }, 280);
      return () => window.clearTimeout(timer);
    }
  }, [formatted, prevValue]);

  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center justify-center"
    >
      <div
        className="relative w-20 h-24 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-2xl royal-glass-card flex items-center justify-center overflow-hidden shadow-[0_18px_40px_rgba(18,2,6,0.75)]"
        style={{ perspective: '600px' }}
      >
        {/* Subtle horizontal split line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent z-10"
        />

        {/* Corner Art-Deco accents */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#D4AF37]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#D4AF37]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#D4AF37]/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#D4AF37]/45"
        />

        <span
          className={`font-monogram text-3xl sm:text-5xl md:text-6xl font-bold text-metallic-gold tabular-nums tracking-tight transition-transform duration-300 will-change-transform ${
            isFlipping
              ? 'scale-90 -translate-y-1 opacity-80'
              : 'scale-100 translate-y-0 opacity-100'
          }`}
        >
          {formatted}
        </span>
      </div>
      <span className="mt-3 text-xs sm:text-sm md:text-base font-kufi text-[#F5E6AD]/85 tracking-wide">
        {label}
      </span>
    </div>
  );
};

export const FlipCountdown: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownState>(() =>
    calculateCountdown(Date.now(), CONFIG.weddingDateIsoCairo)
  );

  useEffect(() => {
    const update = () => {
      setCountdown(calculateCountdown(Date.now(), CONFIG.weddingDateIsoCairo));
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="countdown-section"
      aria-labelledby="countdown-heading"
      className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-5xl mx-auto text-center"
    >
      <div className="parallax-layer-slow mb-14 flex flex-col items-center">
        <span className="text-xs sm:text-sm font-kufi text-[#D4AF37] tracking-widest mb-3">
          العدّ التنازلي لليلةِ العُمر
        </span>
        <h2
          id="countdown-heading"
          className="font-ruqaa text-3xl sm:text-5xl text-metallic-gold leading-relaxed pb-2"
          style={{ textWrap: 'balance' }}
        >
          موعدنا مع فرحتنا
        </h2>

        {/* Professional Luxury Editorial Lockup for "الثلاثاء 24 نوفمبر 2026" */}
        <div
          data-testid="countdown-date-showcase"
          className="mt-6 inline-flex flex-col items-center px-8 py-4 rounded-2xl royal-glass-card border border-[#D4AF37]/45 shadow-[0_12px_35px_rgba(20,2,6,0.65)]"
        >
          <div className="flex items-center gap-3 sm:gap-5">
            <span
              aria-hidden="true"
              className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"
            />
            <span className="font-kufi text-lg sm:text-2xl font-semibold text-metallic-gold tracking-wide">
              {CONFIG.weddingDateDisplay}
            </span>
            <span
              aria-hidden="true"
              className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"
            />
          </div>
          <span
            dir="ltr"
            className="mt-1.5 font-monogram italic text-xs sm:text-sm text-[#F5E6AD]/75 tracking-[0.22em]"
          >
            24 · NOVEMBER · 2026
          </span>
        </div>
      </div>

      {/* 4 Flip Cards Grid (Days, Hours, Minutes, Seconds) */}
      <div
        data-testid="countdown-grid"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center max-w-3xl mx-auto"
      >
        <FlipUnit
          value={countdown.days}
          label="يومًا"
          testId="countdown-days"
        />
        <FlipUnit
          value={countdown.hours}
          label="ساعة"
          testId="countdown-hours"
        />
        <FlipUnit
          value={countdown.minutes}
          label="دقيقة"
          testId="countdown-minutes"
        />
        <FlipUnit
          value={countdown.seconds}
          label="ثانية"
          testId="countdown-seconds"
        />
      </div>

      {countdown.isComplete && (
        <p className="mt-8 text-lg font-kufi text-[#FBF5B7]">
          حلّت ليلة الزفاف المباركة — أهلًا بكم في فرحتنا!
        </p>
      )}
    </section>
  );
};
