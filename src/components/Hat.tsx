
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
  
  // Calculate size based on screen size
  const hatSize = isMobile ? 
    (window.innerWidth < 400 ? 140 : 160) : // Reduced hat size on mobile
    300; // Size on desktop
  
  // Reset confetti when revealed state changes
  useEffect(() => {
    if (isRevealed && hasBall) {
      setShowConfetti(true);
      // Auto-hide confetti after animation completes
      const timer = setTimeout(() => {
        setConfettiComplete(true);
      }, 4000); // Longer confetti duration (4 seconds)
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
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
      
      {/* Full-screen Confetti when correct hat is revealed */}
      {showConfetti && hasBall && isRevealed && !confettiComplete && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            colors={['#9b87f5', '#7E69AB', '#ffffff', '#ffdf00', '#D6BCFA']} // VOI brand colors + white + gold
            confettiSource={{
              x: window.innerWidth / 2,
              y: -50, // Start slightly above screen for dramatic effect
              w: window.innerWidth,
              h: 0
            }}
            tweenDuration={5000}
            initialVelocityY={3}
            initialVelocityX={2}
          />
        </div>
      )}
      
      {/* Local Confetti burst around the Happy character for added effect */}
      {showConfetti && hasBall && isRevealed && !confettiComplete && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
          <Confetti
            width={window.innerWidth > 768 ? 300 : 250}
            height={window.innerHeight > 768 ? 300 : 250}
            recycle={false}
            numberOfPieces={80}
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
      
      {/* Happy character with exaggerated animation */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2 z-10"
          initial={{ scale: 0.1 }}
          animate={{ 
            scale: isRevealed ? [0.1, 1.5, 0.85, 1.1, 0.65] : 0,
            y: isRevealed ? 5 : 0
          }}
          transition={{ 
            scale: {
              duration: 1.2,
              times: [0, 0.3, 0.6, 0.8, 1],
              ease: [0.34, 1.8, 0.64, 1], // Exaggerated bounce effect with cubic-bezier
            },
            y: { 
              duration: 0.4, 
              delay: isRevealed ? 0.2 : 0 
            }
          }}
        >
          <div className={`flex items-center justify-center ${isMobile ? 'w-[clamp(140px,30vw,180px)]' : 'w-[clamp(160px,30vw,240px)]'}`}>
            <img 
              src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png" 
              alt="Happy Character" 
              className="w-full h-auto object-contain"
              style={{ 
                filter: isRevealed ? 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6)) drop-shadow(0 0 12px rgba(255, 202, 40, 0.4))' : 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))',
                transition: 'filter 0.3s ease-in-out'
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Hat;
