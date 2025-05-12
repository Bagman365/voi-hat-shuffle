
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
      className={`${size} h-auto relative`}
      initial={{ scale: 0.1 }}
      animate={{ 
        scale: visible ? [0.1, 1.5, 0.85, 1.1, 0.65] : 0,
        y: visible ? [0, 20, -30, 5, 0] : 0,
        rotate: visible ? [0, -10, 15, -5, 0] : 0
      }}
      transition={{ 
        scale: {
          duration: 1.2,
          times: [0, 0.3, 0.6, 0.8, 1],
          ease: [0.34, 1.8, 0.64, 1]
        },
        y: { 
          duration: 1.5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        },
        rotate: {
          duration: 1.5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut"
        }
      }}
    >
      {/* Sparkles around the Happy character */}
      {visible && (
        <div className="absolute left-1/2 top-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                x: Math.cos(i * Math.PI / 4) * (isMobile ? 50 : 80),
                y: Math.sin(i * Math.PI / 4) * (isMobile ? 50 : 80),
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.1 + 0.3,
                repeat: 1,
                repeatDelay: 0.5
              }}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>
      )}
      
      <motion.img 
        src="/lovable-uploads/109f7437-56fb-49eb-be2e-e5d8c0fe3780.png"
        alt="Happy Character" 
        className="w-full h-auto object-contain"
        animate={{ 
          filter: visible ? [
            'brightness(1) drop-shadow(0 0 0px rgba(217, 70, 239, 0))', 
            'brightness(1.3) drop-shadow(0 0 15px rgba(217, 70, 239, 0.8))',
            'brightness(1.1) drop-shadow(0 0 8px rgba(217, 70, 239, 0.6))'
          ] : 'brightness(1)'
        }}
        transition={{
          filter: {
            duration: 1.8,
            times: [0, 0.4, 1],
            ease: "easeOut"
          }
        }}
      />
    </motion.div>
  );
};

export default Ball;
