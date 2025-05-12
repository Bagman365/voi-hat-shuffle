
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface BallProps {
  visible: boolean;
}

const Ball: React.FC<BallProps> = ({ visible }) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 'w-[clamp(140px,30vw,180px)]' : 'w-[clamp(160px,30vw,240px)]';
  
  return (
    <motion.div
      className={`${size} h-auto`}
      initial={{ scale: 0.1 }}
      animate={{ scale: visible ? [0.1, 1.5, 0.85, 1.1, 0.65] : 0 }}
      transition={{ 
        duration: 1.2,
        times: [0, 0.3, 0.6, 0.8, 1],
        ease: [0.34, 1.8, 0.64, 1] // Exaggerated bounce effect
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
