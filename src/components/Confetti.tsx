
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active: boolean;
  position: { x: number, y: number };
}

const Confetti: React.FC<ConfettiProps> = ({ active, position }) => {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (active) {
      // Reset state when activated
      setComplete(false);
      
      // Auto-hide effects after animation completes
      const timer = setTimeout(() => {
        setComplete(true);
      }, 3500); // Slightly longer than fireworks duration
      return () => clearTimeout(timer);
    } else {
      setComplete(false);
    }
  }, [active]);

  if (!active || complete) return null;

  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
        gravity={0.15}
        colors={['#9b87f5', '#7E69AB', '#ffffff', '#ffdf00', '#ff9900', '#8f44fd']} 
        initialVelocityY={-8}
        confettiSource={{
          x: position.x,
          y: position.y - 100,
          w: 0,
          h: 0
        }}
      />
    </div>
  );
};

export default Confetti;
