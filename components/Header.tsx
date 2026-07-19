'use client';

import React from 'react';

interface HeaderProps {
  infiniteMode: boolean;
  setInfiniteMode: (val: boolean) => void;
  pullsLeft: number;
}

export default function Header({ infiniteMode, setInfiniteMode, pullsLeft }: HeaderProps) {
  return (
    /* Completely removed pt-8 pb-2 and gap-3, replacing them with 0px bounds 
       to instantly force the header to sit higher up on mobile viewports */
    <div 
      className="w-full max-w-xs flex flex-col items-center z-10 shrink-0" 
      style={{ paddingTop: '0px', paddingBottom: '0px', gap: '4px', marginTop: '0px', marginBottom: '0px' }}
    >
      
      {/* Modes Control Toggle Switch */}
      <div 
        className="relative p-1 rounded-2xl flex gap-2 overflow-hidden border border-white/10 shadow-inner scale-95"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      >
        {/* Normal Mode Button */}
        <button
          type="button"
          onClick={() => setInfiniteMode(false)}
          className="px-4 py-1.5 rounded-xl text-xs font-bold z-10 border-0 outline-none select-none transition-all duration-200 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: !infiniteMode ? '#ffffff' : '#262626',
            color: !infiniteMode ? '#000000' : '#a3a3a3'
          }}
        >
          Normal Mode
        </button>

        {/* Infinite Mode Button */}
        <button
          type="button"
          onClick={() => setInfiniteMode(true)}
          className="px-4 py-1.5 rounded-xl text-xs font-bold z-10 border-0 outline-none select-none transition-all duration-200 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: infiniteMode ? '#ffffff' : '#262626',
            color: infiniteMode ? '#000000' : '#a3a3a3'
          }}
        >
          Infinite Mode
        </button>
      </div>

      {/* Main Stats Header Display - Compressed closely to reclaim lower screen room */}
      <div className="text-center">
        <h1 
          className="text-3xl font-extrabold text-[#e53e3e] tracking-wide drop-shadow-md mb-0 pb-0"
          style={{ lineHeight: '1.0' }}
        >
          GACHA HELL
        </h1>
        
        <p 
          className="mt-0.5 text-xs font-bold tracking-wide block"
          style={{ color: '#ffffff' }}
        >
          Pulls Left Today: <span style={{ color: '#ffffff' }}>{infiniteMode ? "∞" : pullsLeft}</span>
        </p>
      </div>
    </div>
  );
}