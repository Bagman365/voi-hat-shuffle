
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface BallProps {
  visible: boolean;
}

const Ball: React.FC<BallProps> = ({ visible }) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 'w-[60px]' : 'w-[100px]';
  
  return (
    <motion.div
      className={`${size} h-auto`}
      initial={{ scale: 0 }}
      animate={{ scale: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png"
        alt="Happy Character" 
        className="w-full h-auto object-contain"
        style={{ filter: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))' }}
      />
    </motion.div>
  );
};

export default Ball;
