
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Confetti from './Confetti';
import Sparkles from './Sparkles';
import Character from './Character';
import HatImage from './HatImage';
import Fireworks from './Fireworks';

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
  
  // Calculate size based on screen size
  const hatSize = isMobile ? 
    (window.innerWidth < 400 ? 140 : 160) : // Reduced hat size on mobile
    300; // Size on desktop
  
  // Show confetti when revealed and has ball
  React.useEffect(() => {
    if (isRevealed && hasBall) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
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
      {/* Hat Image */}
      <HatImage isRevealed={isRevealed} />
      
      {/* Confetti effect */}
      <Confetti 
        active={showConfetti && hasBall && isRevealed} 
        position={position} 
      />
      
      {/* Character */}
      <Character 
        isVisible={hasBall} 
        isRevealed={isRevealed} 
      />

      {/* Sparkles */}
      <Sparkles active={hasBall && isRevealed} />
      
      {/* Fireworks */}
      <Fireworks active={hasBall && isRevealed} />
    </motion.div>
  );
};

export default Hat;
