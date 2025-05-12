
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // Calculate size based on screen size
  const hatSize = isMobile ? 
    (window.innerWidth < 400 ? 220 : 260) : // Smaller hats on mobile
    390; // Original size on desktop
  
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
        <div className="w-full h-full relative">
          {/* Hat Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[20%] bg-[#9b87f5] dark:bg-[#33C3F0] rounded-full shadow-lg"></div>
          
          {/* Hat Top */}
          <div className="absolute bottom-[19%] left-1/2 transform -translate-x-1/2 w-[70%] h-[55%] bg-[#1A1F2C] rounded-t-[180px] shadow-inner"></div>
          
          {/* VOI Logo on Hat */}
          <div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 text-white font-bold text-center text-3xl md:text-3xl text-[min(3vw,24px)]">
            VOI
          </div>
        </div>
      </motion.div>
      
      {/* Ball (only visible when revealed) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ 
            scale: isRevealed ? 1 : 0,
            y: isRevealed ? 5 : 0
          }}
          transition={{ 
            duration: 0.4, 
            delay: isRevealed ? 0.2 : 0,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <div className={`${isMobile ? 'w-[80px] h-[80px]' : 'w-[130px] h-[130px]'} bg-[#D946EF] rounded-full shadow-lg flex items-center justify-center`}>
            <div className={`${isMobile ? 'w-[70px] h-[70px]' : 'w-[120px] h-[120px]'} bg-[#D946EF] rounded-full shadow-inner glow-effect`}></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Hat;
