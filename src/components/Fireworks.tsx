
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FireworksProps {
  active: boolean;
}

const Fireworks: React.FC<FireworksProps> = ({ active }) => {
  const [fireworks, setFireworks] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
  }>>([]);
  
  // Generate firework positions
  useEffect(() => {
    if (active) {
      const newFireworks = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // -100 to 100
        y: Math.random() * -150 - 50,  // -200 to -50 (above the hat)
        size: Math.random() * 8 + 4,   // 4-12px
        color: [
          'rgba(255, 0, 120, 0.8)', 
          'rgba(50, 255, 120, 0.8)', 
          'rgba(120, 80, 255, 0.8)', 
          'rgba(255, 200, 0, 0.8)'
        ][Math.floor(Math.random() * 4)],
        delay: Math.random() * 1.5  // Staggered delays
      }));
      
      setFireworks(newFireworks);
      
      // Reset after animation completes
      const timer = setTimeout(() => {
        setFireworks([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setFireworks([]);
    }
  }, [active]);
  
  if (!active || fireworks.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 80 }}>
      {fireworks.map((fw) => (
        <motion.div
          key={fw.id}
          className="absolute left-1/2 bottom-1/3 rounded-full"
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 0, 
            opacity: 0 
          }}
          animate={{ 
            x: fw.x,
            y: fw.y,
            scale: [0, 1, 0.5, 0],
            opacity: [0, 1, 0.8, 0]
          }}
          transition={{ 
            duration: 1.5, 
            delay: fw.delay,
            times: [0, 0.2, 0.8, 1],
            ease: "easeOut" 
          }}
          style={{
            width: `${fw.size}px`,
            height: `${fw.size}px`,
            backgroundColor: fw.color,
            boxShadow: `0 0 8px 2px ${fw.color}`
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;
