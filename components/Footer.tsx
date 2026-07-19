'use client';

import React from 'react';

export default function Footer({ dialogue, setDialogue }: { dialogue: string, setDialogue: (val: string) => void }) {
  const quotes = ["Just one more spin...", "Surely the next one is lucky.", "Don't look at your bank account."];
  
  return (
    <div className="w-full max-w-sm flex flex-col items-center z-10 pb-6 pt-2 text-center shrink-0">
      <p 
        onClick={() => setDialogue(quotes[Math.floor(Math.random()*quotes.length)])} 
        className="text-sm bg-white/10 px-6 py-3 rounded-full mb-4 cursor-pointer"
        // Inline style forces the dialogue text color to be white, ignoring global styles
        style={{ color: '#ffffff' }}
      >
        &ldquo;{dialogue}&rdquo;
      </p>
      
      {/* If your rainbow-text class relies on an animated text color mask, keep it. 
          Otherwise, if it is turning completely black, we can safeguard it with an inline style or keep it as is: */}
      <p className="text-xs font-bold uppercase rainbow-text">
        Legendary Drops 10%
      </p>
    </div>
  );
}