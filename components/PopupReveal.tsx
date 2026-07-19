'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocalGachaItem {
  id: number;
  name: string;
  type: 'normal' | 'rare';
  filename: string;
  quote: string;
}

interface PopupProps {
  show: boolean;
  item: LocalGachaItem | null;
  onClose: () => void;
}

export default function PopupReveal({ show, item, onClose }: PopupProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (show && item?.type === 'rare') {
      setIsPlayingVideo(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
        }
      }, 50);
    } else {
      setIsPlayingVideo(false);
    }
    setIsFlipped(false);
  }, [show, item]);

  if (!show || !item) return null;

  return (
    // Explicit fixed viewport layer covering the entire window monitor frame
    <div className="fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center pointer-events-auto">
      
      {/* Embedded CSS Engine for Smooth Animations */}
      <style>{`
        @keyframes slow-rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes smooth-sheen {
          0% { transform: translateX(-150%) rotate(-25deg); }
          100% { transform: translateX(250%) rotate(-25deg); }
        }
        .animate-rainbow-slow {
          background: linear-gradient(90deg, #ff2a5f, #ff7e40, #ffeb3b, #2196f3, #9c27b0, #ff2a5f);
          background-size: 200% 200%;
          animation: slow-rainbow 8s ease infinite;
        }
        .holographic-sheen-shine {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 30%,
            rgba(33, 150, 243, 0.3) 50%,
            rgba(156, 39, 176, 0.3) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          width: 250%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          animation: smooth-sheen 4s linear infinite;
        }
      `}</style>

      {/* Fullscreen Video Layer Override */}
      {isPlayingVideo ? (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center w-full h-full">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline onEnded={() => setIsPlayingVideo(false)} >
            <source src="/ragebait.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs tracking-widest uppercase z-10"> UNSKIPPABLE RARE DROP </div>
        </div>
      ) : (
        
        /* Fullscreen dimming overlay layer completely isolating header, chamber, and footer components */
        <div 
          className="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center p-6 select-none backdrop-blur-xs"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // True 50% opacity black layout mask override
        >
          {/* Background interceptor mask */}
          <div className="absolute inset-0 z-0 cursor-default" onClick={onClose} />
          
          {/* Main Container Workspace Panel Layout */}
          <div className="relative w-full max-w-[340px] flex flex-col items-center justify-center z-10">
            
            {/* Card Object Container Box Area */}
            <div 
              className="perspective-1000 w-[250px] flex items-center justify-center cursor-pointer z-10"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div className="relative w-full preserve-3d flex items-center justify-center" initial={false} animate={{ rotateY: isFlipped ? 180 : 0, transition: { duration: 0.6 } }} >
                
                {/* FRONT FACE */}
                <div className="backface-hidden flex items-center justify-center w-full h-full">
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={item.filename}
                      alt={item.name}
                      className="w-full max-h-[250px] object-contain z-10"
                      style={{ border: 'none', outline: 'none' }}
                      initial={{ scale: 0.2, filter: 'brightness(0%)' }}
                      animate={[
                        { scale: 1, filter: 'brightness(0%)', transition: { duration: 0.3 } }, 
                        { x: [0, -12, 12, -6, 6, 0], transition: { delay: 0.1, duration: 0.4, ease: "linear" } }, 
                        { filter: 'brightness(100%)', transition: { delay: 0.6, duration: 0.4 } }, 
                      ] as any}
                    />
                    {item.type === 'rare' && (
                      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-color-dodge holographic-sheen-shine" />
                    )}
                  </div>
                </div>

                {/* BACK FACE - Swapped out gradient background rule for pure rainbow engine */}
                <div className="absolute inset-0 backface-hidden rotateY-180 flex items-center justify-center">
                  <div 
                    className="w-full h-full min-h-[220px] flex flex-col justify-center items-center p-6 text-center shadow-2xl animate-rainbow-slow"
                    style={{ 
                      borderRadius: '24px',
                      opacity: 1,
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    <p className="text-xs font-mono font-bold uppercase tracking-widest mb-1 animate-pulse" style={{ color: '#ffffff' }}>
                      {item.type === "rare" ? "SSS Rare" : "Normal Drop"}
                    </p>
                    <p className="text-2xl font-extrabold leading-tight tracking-tight mb-2 drop-shadow-md" style={{ color: '#ffffff' }}>
                      YOU WASTED <br/>YOUR LIFE
                    </p>
                    <p className="text-xs font-semibold italic mt-2 border-t border-white/30 pt-3" style={{ color: '#ffffff' }}>
                      "{item.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Hardcoded spacing barrier blocking the details box from sliding beneath the card asset */}
            <div style={{ height: '24px', width: '100%', display: 'block' }} />

            {/* Bottom Content Actions Group */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div key="front-desc" className="w-full flex flex-col" initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 15, opacity: 0 }}>
                    
                    {/* Obtained Details Card */}
                    <div 
                      className="w-full p-5 text-center shadow-xl block"
                      style={{ 
                        background: 'linear-gradient(180deg, #ffffff 0%, #888888 100%)', 
                        borderRadius: '16px',
                        opacity: 1, 
                        color: '#111827',
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      <span className="font-semibold text-sm">You obtained:</span>{' '}
                      <span className="underline capitalize text-amber-950 font-extrabold text-base">{item.name}</span>. <br/>
                      <span className="text-xs font-bold mt-2 block" style={{ color: '#111827' }}>
                        Tap the item to inspect the result<br/>of your addiction.
                      </span>
                    </div>

                    {/* Hardcoded spacing block forcing exactly 24px layout space between card display and action button */}
                    <div style={{ height: '24px', width: '100%', display: 'block' }} />

                    {/* Action Execution Button */}
                    <button 
                      onClick={onClose} 
                      className="w-full animate-rainbow-slow text-white py-4 rounded-full font-extrabold text-lg shadow-lg active:scale-95 transition-transform border-0 outline-none cursor-pointer"
                    >
                      OK (Continue Gacha Hell)
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="back-desc" className="w-full flex flex-col" initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 15, opacity: 0 }}>
                    
                    {/* Despair Details Card */}
                    <div 
                      className="w-full p-5 text-center shadow-xl block"
                      style={{ 
                        background: 'linear-gradient(180deg, #ffffff 0%, #888888 100%)', 
                        borderRadius: '16px',
                        opacity: 1, 
                        color: '#111827',
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      <span className="text-[#e53e3e] font-extrabold text-base block mb-0.5">DON'T try again.</span>
                      <span className="text-xs font-bold block mt-1" style={{ color: '#111827' }}>
                        Tap card workspace again to flip back.
                      </span>
                    </div>

                    {/* Hardcoded spacing block forcing exactly 24px layout space between card display and action button */}
                    <div style={{ height: '24px', width: '100%', display: 'block' }} />

                    {/* Action Execution Button */}
                    <button 
                      onClick={onClose} 
                      className="w-full animate-rainbow-slow text-white py-4 rounded-full font-extrabold text-lg shadow-lg active:scale-95 transition-transform border-0 outline-none cursor-pointer"
                    >
                      OK (Continue Gacha Hell)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}