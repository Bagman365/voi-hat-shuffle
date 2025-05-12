
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
      initial={{ scale: 0.2 }}
      animate={{ scale: visible ? [0.2, 1.2, 1] : 0 }}
      transition={{ 
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: [0.34, 1.56, 0.64, 1] // Bounce/pop effect
      }}
    >
      <img 
        src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png"
        alt="Happy Character" 
        className="w-full h-auto object-contain"
        style={{ 
          filter: visible ? 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6)) drop-shadow(0 0 12px rgba(255, 202, 40, 0.4))' : 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))',
          transition: 'filter 0.3s ease-in-out'
        }}
      />
    </motion.div>
  );
};

export default Ball;
