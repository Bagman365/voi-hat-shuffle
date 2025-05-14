
import React from 'react';
import { motion } from 'framer-motion';
import ResultMessage from './ResultMessage';
import HatsContainer from './HatsContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGameLogic } from '@/hooks/useGameLogic';

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
  
  // Use the game logic hook to manage game state
  const {
    hatPositions,
    ballPosition,
    isShuffling,
    selectedHat,
    revealedHat,
    showResult,
    won,
    handleHatSelect,
    setShowResult,
    verificationHash,
    verificationUrl,
    isBetting
  } = useGameLogic({
    isPlaying,
    shuffleSpeed,
    onGameComplete,
    wagerAmount
  });
  
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
          <HatsContainer
            hatPositions={hatPositions}
            ballPosition={ballPosition}
            revealedHat={revealedHat}
            handleHatSelect={handleHatSelect}
            isShuffling={isShuffling}
            selectedHat={selectedHat}
            isPlaying={isPlaying || isBetting}
            isMobile={isMobile}
          />
        </div>
      </motion.div>
      
      {/* Result message */}
      {showResult && (
        <ResultMessage 
          won={won} 
          amount={won ? wagerAmount * 2 : 0} 
          onClose={() => setShowResult(false)} 
          transactionId={verificationHash || undefined}
          verificationUrl={verificationUrl || undefined}
        />
      )}
    </div>
  );
};

export default GameBoard;
