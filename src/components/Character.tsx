
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface CharacterProps {
  isVisible: boolean;
  isRevealed: boolean;
  isTopLayer?: boolean;
}

const Character: React.FC<CharacterProps> = ({ isVisible, isRevealed, isTopLayer = false }) => {
  const isMobile = useIsMobile();
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      className="absolute left-1/2 bottom-[15px] transform -translate-x-1/2"
      style={{ 
        zIndex: isRevealed ? 60 : 10,
        pointerEvents: 'none'
      }}
      initial={{ scale: 0.1 }}
      animate={{ 
        scale: isRevealed ? [null, 1.1, 0.9, 1.1, 0.9, 1] : 0,
        y: isRevealed ? [null, -10, 5, -10, 5, 0] : 0,
        rotate: isRevealed ? [null, -5, 5, -5, 5, 0] : 0,
        z: isRevealed ? 40 : 0  // Bring forward in 3D space when revealed
      }}
      transition={{ 
        scale: {
          duration: isRevealed ? 2 : 1.2,
          repeat: isRevealed ? Infinity : 0,
          repeatType: "loop",
          times: isRevealed ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.3, 0.6, 0.8, 1],
          ease: "easeInOut",
        },
        y: { 
          duration: isRevealed ? 2 : 1.5,
          repeat: isRevealed ? Infinity : 0,
          repeatType: "loop",
          times: isRevealed ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        },
        rotate: {
          duration: isRevealed ? 2 : 1.5,
          repeat: isRevealed ? Infinity : 0,
          repeatType: "loop",
          times: isRevealed ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        }
      }}
    >
      <div className={`flex items-center justify-center ${isMobile ? 'w-[clamp(140px,30vw,180px)]' : 'w-[clamp(160px,30vw,240px)]'}`}>
        <motion.img 
          src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png" 
          alt="Happy Character" 
          className="w-full h-auto object-contain"
          style={{ 
            position: isRevealed ? 'relative' : 'static',
            zIndex: isRevealed ? 70 : 'auto'
          }}
          animate={{ 
            filter: isRevealed ? [
              'brightness(1) drop-shadow(0 0 0px rgba(217, 70, 239, 0))', 
              'brightness(1.2) drop-shadow(0 0 10px rgba(217, 70, 239, 0.7))',
              'brightness(1) drop-shadow(0 0 5px rgba(217, 70, 239, 0.5))'
            ] : 'brightness(1)'
          }}
          transition={{
            filter: {
              duration: 1.8,
              repeat: isRevealed ? Infinity : 0,
              repeatType: "reverse",
              times: [0, 0.4, 1],
              ease: "easeOut"
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default Character;
