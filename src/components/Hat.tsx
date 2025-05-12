
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
      className={`relative cursor-pointer transition-transform duration-300 transform ${
        isSelectable ? 'hover:scale-110' : ''
      }`}
      initial={{ scale: 1, y: 0 }}
      animate={{ 
        x: position.x, 
        y: isRevealed ? -50 : position.y, // Combined the y position logic
        scale: isRevealed ? 0.9 : 1,
      }}
      transition={{ duration: 0.4 }}
      onClick={() => isSelectable && onSelect(id)}
      whileHover={isSelectable ? { scale: 1.1, y: -10 } : {}}
      style={{
        width: '200px',  // Increased from 150px
        height: '200px', // Increased from 150px
        position: 'absolute',
      }}
    >
      {/* Hat */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ rotateX: isRevealed ? 45 : 0, y: isRevealed ? -40 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full h-full relative">
          {/* Hat Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[40px] bg-[#9b87f5] dark:bg-[#33C3F0] rounded-full shadow-lg"></div>
          
          {/* Hat Top */}
          <div className="absolute bottom-[35px] left-1/2 transform -translate-x-1/2 w-[140px] h-[100px] bg-[#1A1F2C] rounded-t-[100px] shadow-inner"></div>
          
          {/* VOI Logo on Hat */}
          <div className="absolute bottom-[70px] left-1/2 transform -translate-x-1/2 text-white font-bold text-center text-lg">
            VOI
          </div>
        </div>
      </motion.div>
      
      {/* Ball (only visible when revealed) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[5px] transform -translate-x-1/2 w-[60px] h-[60px] bg-[#D946EF] rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isRevealed ? 0.2 : 0 }}
        />
      )}
    </motion.div>
  );
};

export default Hat;
