import React from 'react';

interface DobehaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const DobehaLogo: React.FC<DobehaLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  iconOnly = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* High-Tech Isometric Glowing Hexa-D Emblem */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_2px_10px_rgba(99,102,241,0.35)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* High-tech luminous gradients */}
            <linearGradient id="dobeha-grad-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="dobeha-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="dobeha-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Hexagon aura */}
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            fill="url(#dobeha-grad-left)"
            opacity="0.12"
          />

          {/* Outer Isometric Facets forming a high-tech crystal D */}
          {/* Top Plane */}
          <polygon
            points="50,8 86,28 50,49 14,28"
            fill="url(#dobeha-grad-top)"
          />
          {/* Right Plane */}
          <polygon
            points="50,49 86,28 86,72 50,92"
            fill="url(#dobeha-grad-right)"
          />
          {/* Left Plane */}
          <polygon
            points="14,28 50,49 50,92 14,72"
            fill="url(#dobeha-grad-left)"
          />

          {/* Inner Geometric Cutout forming futuristic core */}
          <polygon
            points="50,26 70,37 50,48 30,37"
            fill="#09090b"
            opacity="0.85"
          />
          <polygon
            points="50,48 70,37 70,63 50,74"
            fill="#09090b"
            opacity="0.95"
          />
          <polygon
            points="30,37 50,48 50,74 30,63"
            fill="#09090b"
            opacity="0.9"
          />

          {/* Center Tech Quantum Node */}
          <circle cx="50" cy="50" r="5" fill="#38BDF8" filter="url(#neon-glow)" />
          <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />

          {/* Cybernetic Accent lines */}
          <line x1="50" y1="8" x2="50" y2="26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="86" y1="72" x2="70" y2="63" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="14" y1="72" x2="30" y2="63" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>

      {/* Typography */}
      {showText && !iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-wider">
            <span className={`font-black tracking-tight text-zinc-900 dark:text-white ${textSizes[size]}`}>
              DO
            </span>
            <span className={`font-black tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent ${textSizes[size]}`}>
              BEHA
            </span>
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          </div>
          {showTagline && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 -mt-0.5">
              Cloud Commerce
            </span>
          )}
        </div>
      )}
    </div>
  );
};
