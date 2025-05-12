
import React from 'react';
import { motion } from 'framer-motion';

interface HatImageProps {
  isRevealed: boolean;
}

const HatImage: React.FC<HatImageProps> = ({ isRevealed }) => {
  return (
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
  );
};

export default HatImage;
