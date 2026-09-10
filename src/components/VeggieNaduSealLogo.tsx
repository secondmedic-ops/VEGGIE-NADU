import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const VeggieNaduSealLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 52,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Outer Circular Rim */}
        <circle cx="60" cy="60" r="58" fill="#FAF8F5" stroke="#1B4332" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="#D49726" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1B4332" strokeWidth="1.5" />

        {/* Leafy Ring Accents */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <path
            key={i}
            d="M 60 8 C 62 11, 62 14, 60 16 C 58 14, 58 11, 60 8 Z"
            fill="#1B4332"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}

        {/* Inner Sunken Produce Badge */}
        <circle cx="60" cy="60" r="41" fill="#F4F0E8" stroke="#1B4332" strokeWidth="1.2" />

        {/* Center Produce Line Art: Banana Leaf, Coconut, & Fresh Vegetables */}
        {/* Curved Banana Leaf */}
        <path
          d="M 38 72 C 36 50, 52 38, 78 35 C 75 48, 62 70, 38 72 Z"
          fill="#2D6A4F"
          fillOpacity="0.15"
          stroke="#1B4332"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M 38 72 Q 56 54 78 35" stroke="#D49726" strokeWidth="1.2" />
        <path d="M 48 62 L 53 58" stroke="#1B4332" strokeWidth="1" />
        <path d="M 54 55 L 61 52" stroke="#1B4332" strokeWidth="1" />
        <path d="M 62 48 L 70 45" stroke="#1B4332" strokeWidth="1" />

        {/* Fresh Bell Veggie / Small Shallot */}
        <path
          d="M 45 74 C 42 66, 52 64, 58 68 C 62 71, 61 79, 52 82 C 45 81, 44 76, 45 74 Z"
          fill="#FAF8F5"
          stroke="#1B4332"
          strokeWidth="1.4"
        />
        <path d="M 52 64 Q 53 60 55 58" stroke="#1B4332" strokeWidth="1.2" strokeLinecap="round" />

        {/* Fresh Half Coconut / Produce Outline */}
        <path
          d="M 62 76 C 62 67, 76 67, 78 76 C 78 84, 62 84, 62 76 Z"
          fill="#FAF8F5"
          stroke="#1B4332"
          strokeWidth="1.4"
        />
        <circle cx="70" cy="75" r="4" fill="#E8DEC8" stroke="#D49726" strokeWidth="1" />

        {/* Est. Nerul Banner ribbon */}
        <rect x="36" y="87" width="48" height="12" rx="3" fill="#1B4332" />
        <text
          x="60"
          y="95.5"
          textAnchor="middle"
          fill="#FAF8F5"
          fontSize="6.5"
          fontWeight="bold"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          EST. NERUL
        </text>

        {/* Arching Star Accents */}
        <circle cx="34" cy="60" r="1.5" fill="#D49726" />
        <circle cx="86" cy="60" r="1.5" fill="#D49726" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-serif-title font-bold text-xl tracking-tight text-[#1B4332] leading-none">
            VEGGIE NADU
          </span>
          <span className="text-[10px] tracking-wider uppercase text-[#D49726] font-semibold mt-1">
            Greens • Produce • Spices
          </span>
        </div>
      )}
    </div>
  );
};
