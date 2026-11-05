'use client';

import React from 'react';

export function PawIcon({ className = 'w-6 h-6', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="6" cy="8" rx="2" ry="3" />
      <ellipse cx="11" cy="5" rx="2" ry="3" />
      <ellipse cx="16" cy="6" rx="2" ry="3" />
      <ellipse cx="20" cy="10" rx="1.8" ry="2.5" />
      <path d="M12.5 10C9 10 7 13.5 7 16.5C7 19.5 9.5 21 12.5 21C15.5 21 18 19.5 18 16.5C18 13.5 16 10 12.5 10Z" />
    </svg>
  );
}

export function PetWorldLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Heart-Paw Green Shield Badge */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#28843c] text-white shadow-md shadow-emerald-900/10 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg">
          {/* Main paw heart pad */}
          <path
            d="M16 26.5C13.5 24 9 19.8 9 15.5C9 12.5 11.2 10.5 14 10.5C14.8 10.5 15.5 10.8 16 11.3C16.5 10.8 17.2 10.5 18 10.5C20.8 10.5 23 12.5 23 15.5C23 19.8 18.5 24 16 26.5Z"
            fill="currentColor"
          />
          {/* Paw toe dots */}
          <circle cx="10" cy="8.5" r="2.2" fill="currentColor" />
          <circle cx="14" cy="5.8" r="2.2" fill="currentColor" />
          <circle cx="18" cy="5.8" r="2.2" fill="currentColor" />
          <circle cx="22" cy="8.5" r="2.2" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tight text-[#113d22] leading-none font-sans">
          Pet<span className="text-[#277438]">World</span>
        </span>
        <span className="text-[10px] font-medium text-stone-500 tracking-wider mt-0.5">
          Care More. Love More.
        </span>
      </div>
    </div>
  );
}
