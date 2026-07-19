'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import MiddleChamber from '@/components/MiddleChamber';
import Footer from '@/components/Footer';
import PopupReveal from '@/components/PopupReveal';

export interface GachaItem {
  id: number;
  name: string;
  type: 'normal' | 'rare';
  filename: string;
  quote: string;
}

const PULLABLE_ITEMS: GachaItem[] = [
  { id: 1, name: "watermelon", type: "normal", filename: "/watermelon.png", quote: "Sike, it's a dragon fruit (it's slightly purple)" },
  { id: 2, name: "Lemonade", type: "normal", filename: "/lemonade.png", quote: "To remind you of your severe pc buying spree (i also just like the logo)" },
  { id: 3, name: "Jungwon", type: "normal", filename: "/angel.png", quote: "The only time you get to pull him." },
  { id: 4, name: "lock-in", type: "normal", filename: "/lock-in.png", quote: "Snoopy will only come when you lock in" },
  { id: 5, name: "one-wish-willow", type: "rare", filename: "/one-wish-willow.png", quote: "take a pic and send this to me ig" },
];

const STAR_POSITIONS = [
  { top: '12%', left: '15%', delay: '0s' },
  { top: '22%', left: '78%', delay: '1.4s' },
  { top: '45%', left: '10%', delay: '0.8s' },
  { top: '60%', left: '88%', delay: '2.2s' },
  { top: '72%', left: '22%', delay: '0.4s' },
  { top: '88%', left: '70%', delay: '1.8s' },
  { top: '32%', left: '65%', delay: '1.1s' }
];

export default function Home() {
  const [pullsLeft, setPullsLeft] = useState(5);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const [machineAnimation, setMachineAnimation] = useState<'idle' | 'twisting' | 'dropping' | 'revealing'>('idle');
  const [rolledItem, setRolledItem] = useState<GachaItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showBlockerPopup, setShowBlockerPopup] = useState(false);
  const [dialogue, setDialogue] = useState("Your Gems are safe with me.");

  useEffect(() => {
    if (infiniteMode) {
      setPullsLeft(999);
      return;
    }
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const storedData = JSON.parse(localStorage.getItem('gacha_tracker') || '{}');
    if (storedData.date === dateStr) {
      setPullsLeft(Math.max(0, 5 - (storedData.pulls || 0)));
    } else {
      setPullsLeft(5);
    }
  }, [infiniteMode]);

  const triggerGachaPull = () => {
    if (!infiniteMode && pullsLeft <= 0) {
      setShowBlockerPopup(true);
      return;
    }

    if (machineAnimation !== 'idle') return;

    setMachineAnimation('twisting');

    if (!infiniteMode) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const storedData = JSON.parse(localStorage.getItem('gacha_tracker') || '{}');
      const newPullsUsed = (storedData.date === dateStr ? storedData.pulls || 0 : 0) + 1;
      localStorage.setItem('gacha_tracker', JSON.stringify({ date: dateStr, pulls: newPullsUsed }));
      setPullsLeft(5 - newPullsUsed);
    } else {
      setPullsLeft(prev => prev - 1);
    }

    const isRare = Math.random() < 0.10;
    const rolled = isRare
      ? PULLABLE_ITEMS.find(i => i.type === 'rare')!
      : PULLABLE_ITEMS.filter(i => i.type === 'normal')[Math.floor(Math.random() * 4)];

    setRolledItem(rolled);

    setTimeout(() => {
      setMachineAnimation('dropping');
    }, 500);

    setTimeout(() => {
      setMachineAnimation('revealing');
      setShowPopup(true);
    }, 2200); 
  };

  return (
    <main className="fixed inset-0 bg-gradient-to-b from-[#0a0f1d] to-[#02050b] text-white flex flex-col justify-between items-center p-6 select-none overflow-hidden touch-none w-full h-full">
      
      {/* Global CSS Injector for the Blocker Modal's Slower Rainbow Button Style */}
      <style>{`
        @keyframes modal-rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-modal-rainbow {
          background: linear-gradient(90deg, #ff2a5f, #ff7e40, #ffeb3b, #2196f3, #9c27b0, #ff2a5f);
          background-size: 200% 200%;
          animation: modal-rainbow 8s ease infinite;
        }
      `}</style>

      {/* Background Matrix Starfield Layout */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        {STAR_POSITIONS.map((pos, idx) => (
          <div key={idx} className="star" style={{ top: pos.top, left: pos.left, animationDelay: pos.delay }} />
        ))}
        <div className="shooting-star" style={{ top: '10%', left: '30%', animationDelay: '1.5s' }} />
        <div className="shooting-star" style={{ top: '40%', left: '60%', animationDelay: '6.5s' }} />
      </div>

      <Header 
        infiniteMode={infiniteMode} 
        setInfiniteMode={setInfiniteMode} 
        pullsLeft={pullsLeft} 
      />

      <MiddleChamber 
        machineAnimation={machineAnimation} 
        onTwist={triggerGachaPull} 
      />

      <Footer 
        dialogue={dialogue} 
        setDialogue={setDialogue} 
      />

      <PopupReveal 
        show={showPopup} 
        item={rolledItem} 
        onClose={() => {
          setShowPopup(false);
          setMachineAnimation('idle');
          setDialogue('"Wow. You actually pulled it. Disappointing."');
        }} 
      />

      {/* Normal Mode Pull Exhaustion Interception Modal Pop-up */}
      <AnimatePresence>
        {showBlockerPopup && (
          // Viewport dimming panel forced to overlay everything smoothly at 50% opacity
          <div 
            className="fixed inset-0 z-[999999] flex items-center justify-center w-full h-full p-6 backdrop-blur-xs select-none"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="absolute inset-0 z-0 cursor-default" onClick={() => setShowBlockerPopup(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[320px] p-6 text-center shadow-2xl z-10"
              style={{
                // Explicit mid-gray layout gradient configuration (White to Solid Dark Gray)
                background: 'linear-gradient(180deg, #ffffff 0%, #737373 100%)',
                borderRadius: '24px',
                border: 'none',
                outline: 'none'
              }}
            >
              <h3 className="text-xl font-extrabold mb-2 tracking-wide" style={{ color: '#e53e3e' }}>
                OUT OF PULLS!
              </h3>
              
              <p className="text-sm font-bold leading-relaxed" style={{ color: '#111827' }}>
                "You have no pulls left today. Try again tomorrow and heal your gacha sickness."
              </p>

              {/* Explicit structural layout block separating warning panel and dynamic rainbow button */}
              <div style={{ height: '20px', width: '100%', display: 'block' }} />

              <button 
                onClick={() => setShowBlockerPopup(false)}
                className="w-full animate-modal-rainbow text-white font-extrabold py-4 rounded-full shadow-lg active:scale-95 transition-transform border-0 outline-none cursor-pointer text-base"
              >
                I Will Heal My Gacha Addiction
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}