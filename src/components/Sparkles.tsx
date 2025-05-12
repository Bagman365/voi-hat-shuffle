
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface SparklesProps {
  active: boolean;
}

const Sparkles: React.FC<SparklesProps> = ({ active }) => {
  const isMobile = useIsMobile();
  
  if (!active) return null;
  
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 70 }}>
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
            x: Math.cos(i * Math.PI / 4) * (isMobile ? 60 : 100),
            y: Math.sin(i * Math.PI / 4) * (isMobile ? 60 : 100),
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            delay: i * 0.1 + 0.3,
            repeat: Infinity,
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
  );
};

export default Sparkles;
