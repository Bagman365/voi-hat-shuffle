
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Confetti from 'react-confetti';

interface HatProps {
  id: number;
  position: { x: number, y: number };
  hasBall: boolean;
  isRevealed: boolean;
  onSelect: (id: number) => void;
  isSelectable: boolean;
  animationDelay?: number;
}

const Hat: React.FC<HatProps> = ({ 
  id, 
  position, 
  hasBall, 
  isRevealed, 
  onSelect,
  isSelectable,
  animationDelay = 0
}) => {
  const isMobile = useIsMobile();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiComplete, setConfettiComplete] = useState(false);
  const [showRays, setShowRays] = useState(false);
  
  // Calculate size based on screen size
  const hatSize = isMobile ? 
    (window.innerWidth < 400 ? 140 : 160) : // Reduced hat size on mobile
    300; // Size on desktop
  
  // Reset effects when revealed state changes
  useEffect(() => {
    if (isRevealed && hasBall) {
      setShowConfetti(true);
      setShowRays(true);
      // Auto-hide effects after animation completes
      const timer = setTimeout(() => {
        setConfettiComplete(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
      setShowRays(false);
      setConfettiComplete(false);
    }
  }, [isRevealed, hasBall]);
  
  return (
    <motion.div
      className={`absolute cursor-pointer transition-transform duration-300 transform ${
        isSelectable ? 'hover:scale-110' : ''
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        x: position.x, 
        y: isRevealed ? -70 : position.y,
        scale: isRevealed ? (isMobile ? 0.8 : 0.9) : 1,
        opacity: 1
      }}
      transition={{ 
        duration: 0.5, 
        delay: animationDelay,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      onClick={() => isSelectable && onSelect(id)}
      whileHover={isSelectable && !isMobile ? { scale: 1.12, y: -15, rotateX: 5, rotateY: 5, z: 10 } : {}}
      style={{
        width: `${hatSize}px`,
        height: `${hatSize}px`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Hat */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ 
          rotateX: isRevealed ? 60 : 0, 
          y: isRevealed ? -60 : 0,
          z: isRevealed ? 40 : 0
        }}
        transition={{ 
          duration: 0.4, 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        <div className="w-full h-full relative flex items-center justify-center">
          {/* VOI Hat Image */}
          <img 
            src="/lovable-uploads/33d63168-809a-455d-b6ef-d99fb90765fc.png" 
            alt="VOI Hat" 
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
      
      {/* Confetti when correct hat is revealed */}
      {showConfetti && hasBall && isRevealed && !confettiComplete && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth > 768 ? 300 : 250}
            height={window.innerHeight > 768 ? 300 : 250}
            recycle={false}
            numberOfPieces={150}
            gravity={0.25}
            colors={['#9b87f5', '#7E69AB', '#ffffff', '#ffdf00']} // VOI brand colors + white + yellow
            initialVelocityY={-5}
            initialVelocityX={2}
            confettiSource={{
              x: window.innerWidth > 768 ? 150 : 125,
              y: window.innerHeight > 768 ? 150 : 125,
              w: 0,
              h: 0
            }}
          />
        </div>
      )}
      
      {/* Light rays effect when correct hat is revealed */}
      {showRays && hasBall && isRevealed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-40">
          <div className="absolute inset-0 animate-rays">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-[#9b87f5] via-[#D946EF] to-transparent"
                style={{ 
                  transform: `rotate(${i * 30}deg)`, 
                  transformOrigin: 'left center',
                  opacity: 0.7,
                  animationDelay: `${i * 0.1}s`,
                  animation: 'rayGrow 2s ease-out'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Happy character with exaggerated animation */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2 z-10"
          initial={{ scale: 0.1 }}
          animate={{ 
            scale: isRevealed ? [0.1, 1.5, 0.85, 1.1, 0.65] : 0,
            y: isRevealed ? [0, 20, -30, 5, 0] : 0,
            rotate: isRevealed ? [0, -10, 15, -5, 0] : 0
          }}
          transition={{ 
            scale: {
              duration: 1.2,
              times: [0, 0.3, 0.6, 0.8, 1],
              ease: [0.34, 1.8, 0.64, 1], // Exaggerated bounce effect with cubic-bezier
            },
            y: { 
              duration: 1.5,
              times: [0, 0.2, 0.5, 0.8, 1],
              ease: "easeInOut"
            },
            rotate: {
              duration: 1.5,
              times: [0, 0.2, 0.5, 0.8, 1],
              ease: "easeInOut"
            }
          }}
        >
          <div className={`flex items-center justify-center ${isMobile ? 'w-[clamp(140px,30vw,180px)]' : 'w-[clamp(160px,30vw,240px)]'}`}>
            <motion.img 
              src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png" 
              alt="Happy Character" 
              className="w-full h-auto object-contain"
              animate={{ 
                filter: isRevealed ? [
                  'brightness(1) drop-shadow(0 0 0px rgba(217, 70, 239, 0))', 
                  'brightness(1.3) drop-shadow(0 0 15px rgba(217, 70, 239, 0.8))',
                  'brightness(1.1) drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))'
                ] : 'brightness(1)'
              }}
              transition={{
                filter: {
                  duration: 1.8,
                  times: [0, 0.4, 1],
                  ease: "easeOut"
                }
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Sparkles around the Happy character */}
      {hasBall && isRevealed && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                x: Math.cos(i * Math.PI / 4) * (isMobile ? 60 : 100),
                y: Math.sin(i * Math.PI / 4) * (isMobile ? 60 : 100),
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.1 + 0.3,
                repeat: 1,
                repeatDelay: 0.5
              }}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Hat;
