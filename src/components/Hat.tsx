
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
    (window.innerWidth < 400 ? 140 : 160) : // Reduced hat size on mobile
    300; // Size on desktop
  
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
      
      {/* Happy character (replacing the ball) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2"
          initial={{ scale: 0.2 }}
          animate={{ 
            scale: isRevealed ? [0.2, 1.2, 1] : 0,
            y: isRevealed ? 5 : 0
          }}
          transition={{ 
            scale: {
              duration: 0.6,
              times: [0, 0.5, 1],
              ease: [0.34, 1.56, 0.64, 1], // Bounce/pop effect with cubic-bezier
            },
            y: { 
              duration: 0.4, 
              delay: isRevealed ? 0.2 : 0 
            }
          }}
        >
          <div className={`flex items-center justify-center ${isMobile ? 'w-[clamp(60px,20vw,80px)]' : 'w-[clamp(80px,10vw,120px)]'}`}>
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
