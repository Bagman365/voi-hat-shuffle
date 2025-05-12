
import React from 'react';
import Hat from './Hat';

interface HatsContainerProps {
  hatPositions: Array<{x: number, y: number}>;
  ballPosition: number;
  revealedHat: number | null;
  handleHatSelect: (id: number) => void;
  isShuffling: boolean;
  selectedHat: number | null;
  isPlaying: boolean;
  isMobile: boolean;
}

const HatsContainer: React.FC<HatsContainerProps> = ({
  hatPositions,
  ballPosition,
  revealedHat,
  handleHatSelect,
  isShuffling,
  selectedHat,
  isPlaying,
  isMobile
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {[0, 1, 2].map((hatId) => (
        <Hat 
          key={hatId}
          id={hatId}
          position={hatPositions[hatId] || { x: (hatId - 1) * 350, y: 0 }}
          hasBall={hatId === ballPosition}
          isRevealed={revealedHat === hatId}
          onSelect={handleHatSelect}
          isSelectable={!isShuffling && selectedHat === null && !isPlaying}
          animationDelay={isMobile ? hatId * 0.2 : 0} // Sequential animation delays on mobile
        />
      ))}
    </div>
  );
};

export default HatsContainer;
