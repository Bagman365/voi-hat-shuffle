
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
    side: 'left' | 'right';
  }>>([]);
  
  // Generate firework positions
  useEffect(() => {
    if (active) {
      // Create fireworks from both left and right sides
      const newFireworks = Array.from({ length: 30 }, (_, i) => {
        const side = i % 2 === 0 ? 'left' : 'right';
        return {
          id: i,
          // Position based on side (left or right)
          x: side === 'left' 
            ? Math.random() * -300 - 50  // Left side: -350 to -50
            : Math.random() * 300 + 50,  // Right side: 50 to 350
          y: Math.random() * -250 - 50,  // -300 to -50 (above)
          size: Math.random() * 10 + 5,  // 5-15px
          color: [
            'rgba(255, 0, 120, 0.9)', 
            'rgba(50, 255, 120, 0.9)', 
            'rgba(120, 80, 255, 0.9)', 
            'rgba(255, 200, 0, 0.9)',
            'rgba(255, 255, 255, 0.9)'
          ][Math.floor(Math.random() * 5)],
          delay: Math.random() * 0.8,  // Staggered delays for more natural effect
          side,
        };
      });
      
      setFireworks(newFireworks);
      
      // Reset after animation completes
      const timer = setTimeout(() => {
        setFireworks([]);
      }, 2500); // Animation lasts ~2.5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setFireworks([]);
    }
  }, [active]);
  
  if (!active || fireworks.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 90 }}>
      {fireworks.map((fw) => (
        <motion.div
          key={fw.id}
          className="absolute left-1/2 bottom-1/3 rounded-full"
          initial={{ 
            x: fw.side === 'left' ? -200 : 200, 
            y: 50, 
            scale: 0, 
            opacity: 0 
          }}
          animate={{ 
            x: fw.x,
            y: fw.y,
            scale: [0, 1.2, 0.8, 0],
            opacity: [0, 1, 0.8, 0]
          }}
          transition={{ 
            duration: 2, 
            delay: fw.delay,
            times: [0, 0.2, 0.8, 1],
            ease: "easeOut" 
          }}
          style={{
            width: `${fw.size}px`,
            height: `${fw.size}px`,
            backgroundColor: fw.color,
            boxShadow: `0 0 12px 4px ${fw.color}`
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks;
