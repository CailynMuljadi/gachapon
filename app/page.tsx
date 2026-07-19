'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const MAX_PULLS = 5;
const RARE_CHANCE = 0.10;

const PULLABLE_ITEMS = [
  { id: 1, name: "watermelon", type: "normal", filename: "/watermelon.png", quote: "A refreshing waste of 100 Gems." },
  { id: 2, name: "lemonade", type: "normal", filename: "/lemonade.png", quote: "Life gave you lemons; you made Debt." },
  { id: 3, name: "angel", type: "normal", filename: "/angel.png", quote: "An angel investor is not impressed." },
  { id: 4, name: "lock-in", type: "normal", filename: "/lock-in.png", quote: "Locked in? Or just stuck?" },
  { id: 5, name: "one-wish-willow", type: "rare", filename: "/one-wish-willow.png", quote: "This tree's power is slightly greater than zero." },
];

const CAPSULE_SHELLS = [
  { id: 1, initialX: -10, initialY: -50, targetX: -45, targetY: 40, rot: 12 },
  { id: 2, initialX: 5, initialY: -60, targetX: 0, targetY: 45, rot: -45 },
  { id: 3, initialX: 20, initialY: -40, targetX: 45, targetY: 38, rot: 85 },
  { id: 4, initialX: -30, initialY: -55, targetX: -30, targetY: 5, rot: 120 },
  { id: 5, initialX: 35, initialY: -45, targetX: 30, targetY: 10, rot: -90 },
  { id: 6, initialX: -5, initialY: -70, targetX: -5, targetY: -15, rot: 25 },
  { id: 7, initialX: 15, initialY: -65, targetX: 20, targetY: -10, rot: 55 },
];

export default function Page() {
  const [pullsLeft, setPullsLeft] = useState(5);
  const [rolledItem, setRolledItem] = useState<typeof PULLABLE_ITEMS[0] | null>(null);
  const [dialogue, setDialogue] = useState("Your Gems are safe with me.");
  const [machineAnimation, setMachineAnimation] = useState("idle");
  const [showRevealSequence, setShowRevealSequence] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rareCutscene, setRareCutscene] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonControls = useAnimation();

  useEffect(() => {
    if (infiniteMode) {
      setPullsLeft(999);
      return;
    }
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const storedData = JSON.parse(localStorage.getItem('gacha_tracker') || '{}');
    if (storedData.date === dateStr) {
      setPullsLeft(Math.max(0, MAX_PULLS - (storedData.pulls || 0)));
    } else {
      setPullsLeft(MAX_PULLS);
    }
  }, [infiniteMode]);

  const handleResetLimit = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    localStorage.setItem('gacha_tracker', JSON.stringify({ date: dateStr, pulls: 0 }));
    setPullsLeft(5);
    setInfiniteMode(false);
    setDialogue("Limits wiped. Ready for despair.");
  };

  const handleVideoEnd = () => {
    setRareCutscene(false);
    setDialogue("You watched the whole thing. You truly are lost.");
  };

  const handleTwistAndSpin = async () => {
    if ((pullsLeft <= 0 && !infiniteMode) || machineAnimation !== "idle") return;

    setMachineAnimation("twisting");

    await buttonControls.start({ rotate: 180, transition: { duration: 0.3, ease: "easeInOut" } });
    await buttonControls.start({ rotate: 0, transition: { duration: 0.2, ease: "easeInOut" } });

    if (!infiniteMode) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      const storedData = JSON.parse(localStorage.getItem('gacha_tracker') || '{}');
      const newPullsUsed = (storedData.date === dateStr ? storedData.pulls || 0 : 0) + 1;
      localStorage.setItem('gacha_tracker', JSON.stringify({ date: dateStr, pulls: newPullsUsed }));
      setPullsLeft(MAX_PULLS - newPullsUsed);
    } else {
      setPullsLeft(prev => prev - 1);
    }

    const isRare = Math.random() < RARE_CHANCE;
    const rolled = isRare
      ? PULLABLE_ITEMS.find(i => i.type === 'rare')!
      : PULLABLE_ITEMS.filter(i => i.type === 'normal')[Math.floor(Math.random() * (PULLABLE_ITEMS.length - 1))];
    
    setRolledItem(rolled);
    setMachineAnimation("dropping");

    setTimeout(() => {
      setMachineAnimation("revealing");
      setShowRevealSequence(true);
    }, 1400);
  };

  const finalizeReveal = () => {
    setShowRevealSequence(false);
    setMachineAnimation("idle");
    setDialogue("Wow. You actually pulled it. Disappointing.");
    setIsFlipped(false);
    
    if (rolledItem?.type === "rare") {
      setRareCutscene(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
        }
      }, 50);
    }
  };

  return (
    <main className="fixed inset-0 bg-gradient-to-b from-white to-[#dcf0f2] text-gray-800 flex flex-col justify-between items-center p-6 select-none overflow-hidden touch-none" style={{ fontFamily: "'Sour Gummy', sans-serif" }}>
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="star" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
        <div className="star" style={{ top: '25%', left: '75%', animationDelay: '1.5s' }}></div>
        <div className="star" style={{ top: '45%', left: '10%', animationDelay: '0.8s' }}></div>
        <div className="star" style={{ top: '60%', left: '85%', animationDelay: '2.2s' }}></div>
        <div className="star" style={{ top: '75%', left: '30%', animationDelay: '0.4s' }}></div>
        <div className="star" style={{ top: '85%', left: '65%', animationDelay: '1.8s' }}></div>
      </div>

      <div className="absolute top-2 left-2 z-50 flex gap-2">
        <button onClick={handleResetLimit} className="bg-red-500/20 text-red-700 text-[10px] px-2 py-1 rounded-full border border-red-500/40 font-mono">Reset Limit</button>
        <button onClick={() => setInfiniteMode(!infiniteMode)} className={`text-[10px] px-2 py-1 rounded-full border font-mono ${infiniteMode ? 'bg-teal-600 text-white border-teal-700' : 'bg-gray-200 text-gray-600'}`}>
          {infiniteMode ? "Infinite: ON" : "Infinite: OFF"}
        </button>
      </div>

      <div className="w-full text-center pt-8 z-10">
        <h1 className="text-5xl font-extrabold text-[#e53e3e] tracking-wide drop-shadow-sm">GACHA HELL</h1>
        <p className="text-gray-600 mt-2 text-lg">Pulls Left Today: <span className="font-bold text-[#008080]">{infiniteMode ? "∞" : pullsLeft}</span></p>
      </div>

      <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center my-auto z-10 scale-110">
        <div className="absolute w-[72%] h-[42%] top-[12%] rounded-t-full bg-white/60 shadow-inner overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {CAPSULE_SHELLS.map((shell) => (
              <motion.img 
                key={shell.id}
                src="/pull.png" 
                alt="Gacha Capsule"
                className="absolute w-[52px] h-[52px] object-contain drop-shadow"
                style={{
                  left: `calc(50% - 26px + ${shell.targetX}px)`,
                  top: `calc(50% - 26px + ${shell.targetY}px)`,
                }}
                initial={{ 
                  x: shell.initialX, 
                  y: shell.initialY - 120, 
                  rotate: 0 
                }}
                animate={machineAnimation === "twisting" ? {
                  x: [shell.initialX, shell.initialX + (Math.random() * 30 - 15), shell.initialX],
                  y: [shell.targetY, shell.targetY - 40, shell.targetY],
                  rotate: [shell.rot, shell.rot + 180, shell.rot + 360],
                  transition: { duration: 0.6, ease: "easeInOut" }
                } : {
                  x: 0,
                  y: 0,
                  rotate: shell.rot,
                  transition: { type: "spring", damping: 10, stiffness: 60, delay: shell.id * 0.05 }
                }}
              />
            ))}
          </div>

          <AnimatePresence>
            {machineAnimation === "dropping" && (
              <motion.img
                src="/pull.png"
                alt="Dropped casing"
                className="absolute z-20 w-[62px] h-[62px] object-contain drop-shadow-lg"
                initial={{ x: 0, y: 20, rotate: 0, opacity: 1 }}
                animate={{ 
                  x: [0, 45, 45],
                  y: [20, 75, 175], 
                  rotate: [0, 180, 360],
                  scale: [1, 0.95, 0.9]
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </div>

        <img src="/gachapon.png" alt="Gachapon Outer Layout" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />

        <div className="absolute left-[24.5%] bottom-[24.5%] w-[92px] h-[92px] z-20 flex items-center justify-center">
          <motion.img 
            src="/twisting-button.png" 
            alt="Twist Handle" 
            animate={buttonControls}
            onClick={handleTwistAndSpin}
            className={`w-full h-full object-contain cursor-pointer active:scale-95 transition-transform ${machineAnimation !== "idle" ? 'cursor-not-allowed' : ''}`}
          />
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center z-10 pb-8">
        <p className="text-center text-base font-medium text-gray-700 bg-white/95 px-6 py-3 rounded-full border-2 border-[#008080]/30 shadow-sm max-w-[85%]">
          &ldquo;{dialogue}&rdquo;
        </p>
      </div>
      
      <AnimatePresence>
        {showRevealSequence && rolledItem && (
          <motion.div className="fixed inset-0 z-50 flex flex-col pointer-events-none" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} >
            
            <motion.div className="fixed inset-0 bg-black/90 pointer-events-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

            <div className="absolute inset-0 flex flex-col">
              <motion.div className="flex-1 bg-black z-20 origin-top" initial={{ scaleY: 1 }} animate={{ scaleY: 0, transition: { delay: 0.8, duration: 1.1, ease: [0.77, 0, 0.175, 1] } }} />
              <motion.div className="flex-1 bg-black z-20 origin-bottom" initial={{ scaleY: 1 }} animate={{ scaleY: 0, transition: { delay: 0.8, duration: 1.1, ease: [0.77, 0, 0.175, 1] } }} />
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-center p-10 pointer-events-auto z-10" onClick={() => setIsFlipped(!isFlipped)}>
              <div className="perspective-1000 w-[260px] aspect-square flex items-center justify-center">
                <motion.div className="relative w-full h-full preserve-3d cursor-pointer" initial={false} animate={{ rotateY: isFlipped ? 180 : 0, transition: { duration: 0.6 } }} >
                  
                  <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                    <motion.img
                      src={rolledItem.filename}
                      alt={rolledItem.name}
                      className="w-full h-full object-contain"
                      initial={{ scale: 0.2, filter: 'brightness(0%)' }}
                      animate={[
                        { scale: 1, filter: 'brightness(0%)', transition: { delay: 0.2, duration: 0.3 } }, 
                        { x: [0, -12, 12, -6, 6, 0], transition: { delay: 0.6, duration: 0.4, ease: "linear" } }, 
                        { filter: 'brightness(100%)', transition: { delay: 1.1, duration: 0.4 } }, 
                      ] as any}
                    />
                  </div>

                  <div className="absolute inset-0 backface-hidden rotateY-180 bg-black border-4 border-gray-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white" >
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{rolledItem.type === "rare" ? "SSS Rare" : "Normal Drop"}</p>
                    <p className="text-2xl font-extrabold text-[#e53e3e] leading-tight">YOU WASTED <br/>YOUR LIFE</p>
                    <p className="mt-4 text-sm font-medium text-gray-400 italic">"{rolledItem.quote}"</p>
                  </div>
                </motion.div>
              </div>
              
              <AnimatePresence>
                {!isFlipped && (
                  <motion.div className="absolute bottom-10 w-full max-w-sm z-30 px-6" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 1.4 } }} exit={{ y: 40, opacity: 0 }} >
                    <p className="text-center text-sm font-medium text-gray-600 bg-white p-4 rounded-3xl border border-gray-200 shadow-xl" style={{ fontFamily: "'Sour Gummy', sans-serif" }}>
                      You obtained: <span className="font-bold text-[#008080] capitalize">{rolledItem.name}</span>. <br/> Tap the item to inspect your failure.
                    </p>
                    <button onClick={(e) => { e.stopPropagation(); finalizeReveal(); }} className="mt-4 w-full bg-[#008080] text-white py-4 rounded-full font-bold text-lg shadow-md active:scale-95 transition-transform" style={{ fontFamily: "'Sour Gummy', sans-serif" }}>OK (Continue Hell)</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {rareCutscene && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline onEnded={handleVideoEnd} >
            <source src="/ragebait.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs tracking-widest uppercase z-10"> UNSKIPPABLE RARE DROP </div>
        </div>
      )}

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotateY-180 { transform: rotateY(180deg); }

        body, button, p, h1 {
          font-family: 'Sour Gummy', sans-serif !important;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #008080;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(0, 128, 128, 0.4);
          animation: twinkle 3s infinite ease-in-out;
          opacity: 0;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </main>
  );
}