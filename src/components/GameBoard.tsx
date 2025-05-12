
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
      // Mobile: Stack hats vertically or in compact grid
      if (window.innerWidth < 400) {
        // Extra small screens, stack vertically
        setHatPositions([
          { x: 0, y: -180 },  // Top hat position
          { x: 0, y: 0 },     // Middle hat position
          { x: 0, y: 180 }    // Bottom hat position
        ]);
      } else {
        // Small screens, triangular layout
        setHatPositions([
          { x: -120, y: -50 },  // Top left hat position
          { x: 120, y: -50 },   // Top right hat position 
          { x: 0, y: 120 }      // Bottom center hat position
        ]);
      }
    } else {
      // Desktop: Horizontal layout with more space
      const spacing = 490;
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
      if (window.innerWidth < 400) {
        // Extra small screens
        setHatPositions([
          { x: 0, y: -180 },
          { x: 0, y: 0 },
          { x: 0, y: 180 }
        ]);
      } else {
        // Small screens, triangular layout
        setHatPositions([
          { x: -120, y: -50 },
          { x: 120, y: -50 },
          { x: 0, y: 120 }
        ]);
      }
    } else {
      const spacing = 490;
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
    <div className={`relative w-full ${isMobile ? 'h-[750px]' : 'h-[650px]'} flex items-center justify-center`}>
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
                position={hatPositions[hatId] || { x: (hatId - 1) * 490, y: 0 }}
                hasBall={hatId === ballPosition}
                isRevealed={revealedHat === hatId}
                onSelect={handleHatSelect}
                isSelectable={!isShuffling && selectedHat === null && !isPlaying}
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
