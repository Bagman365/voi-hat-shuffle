
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hat from './Hat';
import ResultMessage from './ResultMessage';

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
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [hatPositions, setHatPositions] = useState<Array<{x: number, y: number}>>([
    { x: -220, y: 0 }, // Adjusted x positions for wider spacing
    { x: 0, y: 0 }, 
    { x: 220, y: 0 }   // Adjusted x positions for wider spacing
  ]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedHat, setSelectedHat] = useState<number | null>(null);
  const [revealedHat, setRevealedHat] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  
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
    
    // Reset hat positions
    setHatPositions([
      { x: -220, y: 0 }, // Adjusted x positions for wider spacing
      { x: 0, y: 0 }, 
      { x: 220, y: 0 }   // Adjusted x positions for wider spacing
    ]);
    
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
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Game area */}
      <motion.div 
        className="relative w-[700px] h-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hats */}
        {[0, 1, 2].map((hatId) => (
          <Hat 
            key={hatId}
            id={hatId}
            position={hatPositions[hatId]}
            hasBall={hatId === ballPosition}
            isRevealed={revealedHat === hatId}
            onSelect={handleHatSelect}
            isSelectable={!isShuffling && selectedHat === null && !isPlaying}
          />
        ))}
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
