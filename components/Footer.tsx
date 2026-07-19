'use client';

import React from 'react';

export default function Footer({ dialogue, setDialogue }: { dialogue: string, setDialogue: (val: string) => void }) {
  const quotes = ["Just one more spin...", "Surely the next one is lucky.", "Don't look at your bank account."];
  
  return (
    <div 
      className="w-full max-w-sm flex flex-col items-center z-10 pt-2 text-center shrink-0"
      // Pushed up another 10px (from 5px to 15px) to safely clear phone bottom navigation zones
      style={{ paddingBottom: 'calc(15px + env(safe-area-inset-bottom))' }}
    >
      <p 
        onClick={() => setDialogue(quotes[Math.floor(Math.random()*quotes.length)])} 
        className="text-sm bg-white/10 px-6 py-3 rounded-full mb-1 cursor-pointer"
        style={{ color: '#ffffff' }}
      >
        &ldquo;{dialogue}&rdquo;
      </p>
      
      <p className="text-xs font-bold uppercase rainbow-text tracking-wider">
        Legendary Drops 10%
      </p>
    </div>
  );
}