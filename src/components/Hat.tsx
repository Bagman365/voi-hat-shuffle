
import React from 'react';
import { motion } from 'framer-motion';

interface HatProps {
  id: number;
  position: { x: number, y: number };
  hasBall: boolean;
  isRevealed: boolean;
  onSelect: (id: number) => void;
  isSelectable: boolean;
}

const Hat: React.FC<HatProps> = ({ 
  id, 
  position, 
  hasBall, 
  isRevealed, 
  onSelect,
  isSelectable
}) => {
  return (
    <motion.div
      className={`absolute cursor-pointer transition-transform duration-300 transform ${
        isSelectable ? 'hover:scale-110' : ''
      }`}
      initial={{ scale: 1, y: 0 }}
      animate={{ 
        x: position.x, 
        y: isRevealed ? -90 : position.y,
        scale: isRevealed ? 0.9 : 1,
      }}
      transition={{ duration: 0.4 }}
      onClick={() => isSelectable && onSelect(id)}
      whileHover={isSelectable ? { scale: 1.1, y: -10 } : {}}
      style={{
        width: '380px',
        height: '380px',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Hat */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ rotateX: isRevealed ? 45 : 0, y: isRevealed ? -70 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full h-full relative">
          {/* Hat Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[320px] h-[75px] bg-[#9b87f5] dark:bg-[#33C3F0] rounded-full shadow-lg"></div>
          
          {/* Hat Top */}
          <div className="absolute bottom-[70px] left-1/2 transform -translate-x-1/2 w-[280px] h-[210px] bg-[#1A1F2C] rounded-t-[180px] shadow-inner">
            {/* VOI Logo on Hat - Centered in the hat */}
            <div className="absolute w-full flex justify-center items-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
              <img 
                src="/lovable-uploads/43a72a10-c405-466c-afee-171318153c5c.png"
                alt="VOI Logo"
                className="w-[120px] h-auto object-contain"
                style={{ filter: 'brightness(1.2)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Ball (only visible when revealed) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[10px] transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isRevealed ? 0.2 : 0 }}
        >
          <div className="w-[120px] h-[120px] bg-[#D946EF] rounded-full shadow-lg" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Hat;
