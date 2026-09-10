import React from 'react';

interface SealDividerProps {
  className?: string;
  icon?: 'leaf' | 'seal' | 'sparkle';
}

export const SealDivider: React.FC<SealDividerProps> = ({ 
  className = '',
  icon = 'leaf'
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-[#D49726]/60 to-[#1B4332]/40" />
      
      {icon === 'leaf' && (
        <div className="flex items-center gap-1.5 text-[#1B4332]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D49726]" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D49726]" />
        </div>
      )}

      {icon === 'seal' && (
        <div className="w-6 h-6 rounded-full border border-[#1B4332] bg-[#FAF8F5] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#D49726]" />
        </div>
      )}

      <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-[#D49726]/60 to-[#1B4332]/40" />
    </div>
  );
};
