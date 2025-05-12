
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hat from './Hat';
import ResultMessage from './ResultMessage';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameBoardProps {
  isPlaying: boolean;
  shuffleSpeed: 'Normal' | 'Fast' | 'Extreme';
  onGameComplete: (won: boolean) => void;
  wagerAmount: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  isPlaying, 
  shuffleSpeed, 
  onGameComplete,
  wagerAmount
}) => {
  const isMobile = useIsMobile();
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [hatPositions, setHatPositions] = useState<Array<{x: number, y: number}>>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedHat, setSelectedHat] = useState<number | null>(null);
  const [revealedHat, setRevealedHat] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  
  // Calculate hat spacing based on screen size
  useEffect(() => {
    if (isMobile) {
      // Mobile: Use a triangular layout (2 on top, 1 on bottom)
      const topRowY = -80; // Y position for the top row hats
      const bottomRowY = 80; // Y position for the bottom row hat
      const horizontalSpacing = window.innerWidth < 400 ? 90 : 110; // Increase spacing slightly
      
      setHatPositions([
        { x: -horizontalSpacing, y: topRowY },  // Top left hat position
        { x: horizontalSpacing, y: topRowY },   // Top right hat position 
        { x: 0, y: bottomRowY }                 // Bottom center hat position
      ]);
    } else {
      // Desktop: Horizontal layout with more space for larger hats (125% increase)
      const spacing = 700; // Increased from 560 to accommodate 125% larger hats
      setHatPositions([
        { x: -spacing, y: 0 },  // Left hat position
        { x: 0, y: 0 },         // Center hat position
        { x: spacing, y: 0 }    // Right hat position
      ]);
    }
  }, [isMobile]);
  
  // Determine shuffle duration based on speed
  const getShuffleDuration = () => {
    switch(shuffleSpeed) {
      case 'Fast': return 4;
      case 'Extreme': return 2.5;
      default: return 6;
    }
  };
  
  // Start new game when isPlaying changes to true
  useEffect(() => {
    if (isPlaying) {
      startNewGame();
    }
  }, [isPlaying]);
  
  const startNewGame = () => {
    setSelectedHat(null);
    setRevealedHat(null);
    setShowResult(false);
    
    // Randomly select which hat has the ball
    const randomPosition = Math.floor(Math.random() * 3);
    setBallPosition(randomPosition);
    
    // Reset hat positions based on current screen size
    if (isMobile) {
      // Mobile: Use triangular layout (2 on top, 1 on bottom)
      const topRowY = -80;
      const bottomRowY = 80;
      const horizontalSpacing = window.innerWidth < 400 ? 90 : 110; // Increased spacing
      
      setHatPositions([
        { x: -horizontalSpacing, y: topRowY },  // Top left
        { x: horizontalSpacing, y: topRowY },   // Top right
        { x: 0, y: bottomRowY }                 // Bottom center
      ]);
    } else {
      const spacing = 700; // Increased spacing for 125% larger hats
      setHatPositions([
        { x: -spacing, y: 0 },
        { x: 0, y: 0 },
        { x: spacing, y: 0 }
      ]);
    }
    
    // Start shuffling after a brief delay
    setTimeout(() => {
      shuffleHats();
    }, 1000);
  };
  
  // Shuffle animation
  const shuffleHats = () => {
    setIsShuffling(true);
    
    const shuffleDuration = getShuffleDuration() * 1000;
    const shuffleInterval = shuffleSpeed === 'Extreme' ? 150 : 300;
    const shuffleCount = Math.floor(shuffleDuration / shuffleInterval);
    
    let currentCount = 0;
    
    const intervalId = setInterval(() => {
      if (currentCount >= shuffleCount) {
        clearInterval(intervalId);
        setIsShuffling(false);
        return;
      }
      
      setHatPositions(prevPositions => {
        const newPositions = [...prevPositions];
        
        // Randomly select two hats to swap
        const index1 = Math.floor(Math.random() * 3);
        let index2 = Math.floor(Math.random() * 3);
        while (index2 === index1) {
          index2 = Math.floor(Math.random() * 3);
        }
        
        // Swap positions
        const temp = newPositions[index1];
        newPositions[index1] = newPositions[index2];
        newPositions[index2] = temp;
        
        return newPositions;
      });
      
      currentCount++;
    }, shuffleInterval);
  };
  
  // Handle hat selection
  const handleHatSelect = (id: number) => {
    if (isShuffling || selectedHat !== null) return;
    
    setSelectedHat(id);
    setRevealedHat(id);
    
    // Determine if player won
    const hatWithBall = hatPositions.findIndex((pos, index) => {
      return index === ballPosition;
    });
    
    const playerWon = id === hatWithBall;
    setWon(playerWon);
    
    // Show result after hat is revealed
    setTimeout(() => {
      setShowResult(true);
      onGameComplete(playerWon);
    }, 1000);
  };
  
  return (
    <div className={`relative w-full ${isMobile ? 'h-[500px]' : 'h-[650px]'} flex items-center justify-center mb-10`}>
      {/* Game area */}
      <motion.div 
        className="relative w-full max-w-[1200px] h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hats container - centered as a group */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {[0, 1, 2].map((hatId) => (
              <Hat 
                key={hatId}
                id={hatId}
                position={hatPositions[hatId] || { x: (hatId - 1) * 700, y: 0 }}
                hasBall={hatId === ballPosition}
                isRevealed={revealedHat === hatId}
                onSelect={handleHatSelect}
                isSelectable={!isShuffling && selectedHat === null && !isPlaying}
                animationDelay={isMobile ? hatId * 0.2 : 0} // Sequential animation delays on mobile
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Result message */}
      {showResult && (
        <ResultMessage 
          won={won} 
          amount={won ? wagerAmount * 2 : 0} 
          onClose={() => setShowResult(false)} 
        />
      )}
    </div>
  );
};

export default GameBoard;
