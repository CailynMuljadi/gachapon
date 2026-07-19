'use client';

import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface MiddleProps {
  machineAnimation: 'idle' | 'twisting' | 'dropping' | 'revealing';
  onTwist: () => void;
}

const CAPSULE_SHELLS = [
  { id: 1, targetX: -60, targetY: 10, rot: 12 },
  { id: 2, targetX: -20, targetY: 15, rot: -45 },
  { id: 3, targetX: 20, targetY: 8, rot: 85 },
  { id: 4, targetX: 60, targetY: 12, rot: 120 },
  { id: 5, targetX: -40, targetY: 35, rot: -90 },
  { id: 6, targetX: 0, targetY: 38, rot: 25 },
  { id: 7, targetX: 40, targetY: 36, rot: 55 },
];

export default function MiddleChamber({ machineAnimation, onTwist }: MiddleProps) {
  const buttonControls = useAnimation();

  const handleLocalClick = async () => {
    if (machineAnimation !== 'idle') return;
    await buttonControls.start({ rotate: 180, transition: { duration: 0.3, ease: "easeInOut" } });
    onTwist();
    await buttonControls.start({ rotate: 0, transition: { duration: 0.2, ease: "easeInOut" } });
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center my-auto z-10 shrink-0">
      
      {/* Rectangular window - Keeps overflow-hidden to contain the background shells */}
      <div className="absolute w-[72%] h-[42%] top-[8%] bg-white/5 backdrop-blur-xs shadow-inner overflow-hidden flex items-center justify-center z-0">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {CAPSULE_SHELLS.map((shell) => (
            <motion.img 
              key={shell.id} 
              src="/pull.png" 
              alt="Capsule" 
              className="absolute w-[44px] h-[44px] object-contain drop-shadow" 
              // Changed "+ 60px" to "+ 40px" to shift the entire group up by 20px
              style={{ left: `calc(50% - 22px + ${shell.targetX}px)`, top: `calc(50% - 22px + ${shell.targetY}px + 40px)` }} 
              animate={machineAnimation === "twisting" ? { x: [0, 10, 0], y: [0, -20, 0], rotate: [shell.rot, shell.rot + 180, shell.rot + 360] } : {}} 
            />
          ))}
        </div>
      </div>

      {/* Dropping Capsule */}
      <AnimatePresence>
        {machineAnimation === "dropping" && (
          <motion.img
            src="/pull.png"
            alt="Dropped casing"
            className="absolute z-5 w-[52px] h-[52px] object-contain drop-shadow-lg"
            initial={{ x: 0, y: -40 }}
            animate={{ 
              x: [0, 40, 50], 
              y: [-40, 60, 160],
              rotate: [0, 200, 420] 
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <img src="/gachapon.png" alt="Overlay" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />

      {/* Button wrapper container */}
      <div 
        className="absolute left-[22.7%] bottom-[21.5%] w-[84px] h-[84px] z-20 flex items-center justify-center"
        style={{ transform: 'translate(-10px, -25px)' }}
      >
        <motion.img 
          src="/twisting-button.png" 
          alt="Button" 
          animate={buttonControls}
          onClick={handleLocalClick}
          className={`w-full h-full object-contain cursor-pointer active:scale-95 transition-transform ${machineAnimation !== 'idle' ? 'cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}