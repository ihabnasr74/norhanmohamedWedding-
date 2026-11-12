import React, { useState } from 'react';

interface RoyalMNMonogramProps {
  size?: 'seal' | 'hero' | 'footer';
  isIlluminated?: boolean;
  className?: string;
}

const SEAL_IMAGE_PATH =
  '/assets/aistudio/Elegant_M_and_N_Burgundy_Wax_Seal_Monogram_a8a9fe3e.png';

/**
 * Renders the exact M & N Burgundy & Gold Monogram from the user's attached
 * reference image (/assets/aistudio/Elegant_M_and_N_Burgundy_Wax_Seal_Monogram_a8a9fe3e.png),
 * with a crisp userSpaceOnUse SVG fallback.
 */
export const RoyalMNMonogram: React.FC<RoyalMNMonogramProps> = ({
  size = 'hero',
  isIlluminated = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensions =
    size === 'seal'
      ? 'w-full h-full'
      : size === 'hero'
      ? 'w-32 h-32 sm:w-36 sm:h-36'
      : 'w-20 h-20 sm:w-24 sm:h-24';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none ${dimensions} ${className}`}
      style={{
        filter: isIlluminated
          ? 'drop-shadow(0 0 28px rgba(255, 245, 192, 0.98)) drop-shadow(0 0 55px rgba(212, 175, 55, 0.75)) brightness(1.28) contrast(1.06)'
          : 'drop-shadow(0 14px 32px rgba(10, 1, 3, 0.9))',
        transform: isIlluminated ? 'scale(1.04)' : 'scale(1)',
        transition:
          'filter 1.25s cubic-bezier(0.22, 1, 0.36, 1), transform 1.25s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {!imgError ? (
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center border border-[#D4AF37]/55 shadow-[inset_0_0_20px_rgba(0,0,0,0.75)]">
          {/* Exact circular crop of the user's uploaded Burgundy M & N Wax Seal image */}
          <img
            src={SEAL_IMAGE_PATH}
            alt="شعار محمد ونورهان M & N"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-1000 ease-out"
            style={{
              objectPosition: '50% 50.8%',
              transform:
                size === 'seal'
                  ? isIlluminated
                    ? 'scale(1.38)'
                    : 'scale(1.34)'
                  : 'scale(1.72)',
            }}
          />
          {/* Soft golden inner luminescence when illuminated */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-1000 ease-out"
            style={{
              opacity: isIlluminated ? 1 : 0,
              background:
                'radial-gradient(circle at 50% 48%, rgba(255, 250, 220, 0.42) 0%, rgba(212, 175, 55, 0.22) 48%, transparent 76%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Silky diagonal liquid-gold shimmer sweep across the M & N letters */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(115deg, transparent 20%, rgba(255, 250, 215, 0.08) 38%, rgba(255, 252, 235, 0.72) 50%, rgba(212, 175, 55, 0.15) 62%, transparent 80%)',
              transform: isIlluminated
                ? 'translateX(115%) rotate(12deg)'
                : 'translateX(-115%) rotate(12deg)',
              transition: 'transform 1.45s cubic-bezier(0.22, 1, 0.36, 1)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      ) : (
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full overflow-visible"
          aria-label="شعار محمد ونورهان M & N"
        >
          <defs>
            <linearGradient
              id="royalMetallicGoldUser"
              gradientUnits="userSpaceOnUse"
              x1="30"
              y1="30"
              x2="270"
              y2="270"
            >
              <stop offset="0%" stopColor="#9C6F18" />
              <stop offset="25%" stopColor="#F8E7A1" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="75%" stopColor="#FFF5C2" />
              <stop offset="100%" stopColor="#855B0F" />
            </linearGradient>
            <radialGradient id="burgundyVelvetWellFallback" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#580815" />
              <stop offset="65%" stopColor="#38040B" />
              <stop offset="100%" stopColor="#210105" />
            </radialGradient>
          </defs>

          <circle
            cx="150"
            cy="150"
            r="134"
            fill="url(#burgundyVelvetWellFallback)"
            stroke="url(#royalMetallicGoldUser)"
            strokeWidth="4.5"
          />
          <circle
            cx="150"
            cy="150"
            r="125"
            fill="none"
            stroke="url(#royalMetallicGoldUser)"
            strokeWidth="1.8"
          />

          {/* Intertwined M & N using userSpaceOnUse gradient */}
          <path
            d="M84 190 V92 H102 L134 158 L166 92 H182 V190"
            fill="none"
            stroke="url(#royalMetallicGoldUser)"
            strokeWidth="8"
          />
          <path
            d="M144 212 V118 L206 210 V118"
            fill="none"
            stroke="url(#royalMetallicGoldUser)"
            strokeWidth="8"
          />
        </svg>
      )}
    </div>
  );
};
