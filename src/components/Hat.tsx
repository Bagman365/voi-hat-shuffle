
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
        y: position.y,
        scale: isRevealed ? 0.9 : 1,
        y: isRevealed ? -50 : 0,
      }}
      transition={{ duration: 0.4 }}
      onClick={() => isSelectable && onSelect(id)}
      whileHover={isSelectable ? { scale: 1.1, y: -10 } : {}}
      style={{
        width: '150px',
        height: '150px',
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
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[30px] bg-[#9b87f5] dark:bg-[#33C3F0] rounded-full shadow-lg"></div>
          
          {/* Hat Top */}
          <div className="absolute bottom-[25px] left-1/2 transform -translate-x-1/2 w-[100px] h-[80px] bg-[#1A1F2C] rounded-t-[100px] shadow-inner"></div>
          
          {/* VOI Logo on Hat */}
          <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 text-white font-bold text-center text-sm">
            VOI
          </div>
        </div>
      </motion.div>
      
      {/* Ball (only visible when revealed) */}
      {hasBall && (
        <motion.div
          className="absolute left-1/2 bottom-[5px] transform -translate-x-1/2 w-[40px] h-[40px] bg-[#D946EF] rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isRevealed ? 0.2 : 0 }}
        />
      )}
    </motion.div>
  );
};

export default Hat;
