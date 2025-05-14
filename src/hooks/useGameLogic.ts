
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import blockchainService from '@/services/blockchainService';
import { useToast } from '@/hooks/use-toast';

interface GameLogicProps {
  isPlaying: boolean;
  shuffleSpeed: 'Normal' | 'Fast' | 'Extreme';
  onGameComplete: (won: boolean) => void;
  wagerAmount: number;
}

export const useGameLogic = ({ 
  isPlaying, 
  shuffleSpeed, 
  onGameComplete,
  wagerAmount
}: GameLogicProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Game state variables
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [hatPositions, setHatPositions] = useState<Array<{x: number, y: number}>>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [selectedHat, setSelectedHat] = useState<number | null>(null);
  const [revealedHat, setRevealedHat] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  
  // Blockchain-related state
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [isBetting, setIsBetting] = useState<boolean>(false);

  // Calculate hat spacing based on screen size
  useEffect(() => {
    if (isMobile) {
      // Mobile: Use a triangular layout (2 on top, 1 on bottom)
      const topRowY = -100;
      const bottomRowY = 100;
      const horizontalSpacing = window.innerWidth < 400 ? 90 : 120;
      
      setHatPositions([
        { x: -horizontalSpacing, y: topRowY },
        { x: horizontalSpacing, y: topRowY },
        { x: 0, y: bottomRowY }
      ]);
    } else {
      // Desktop: Horizontal layout with more space
      const spacing = 350;
      setHatPositions([
        { x: -spacing, y: 0 },
        { x: 0, y: 0 },
        { x: spacing, y: 0 }
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
  
  // Calculate position of the ball based on blockchain result
  const calculateBallPositionFromHash = (hash: string): number => {
    // Use the verification hash from the blockchain to determine ball position
    // This provides provable randomness
    const hashValue = parseInt(hash.substring(0, 8), 16);
    return hashValue % 3; // 0, 1, or 2
  };
  
  const startNewGame = async () => {
    setSelectedHat(null);
    setRevealedHat(null);
    setShowResult(false);
    setVerificationHash(null);
    setVerificationUrl(null);
    setCurrentTxId(null);
    
    // Reset hat positions based on current screen size
    if (isMobile) {
      const topRowY = -80;
      const bottomRowY = 80;
      const horizontalSpacing = window.innerWidth < 400 ? 80 : 100;
      
      setHatPositions([
        { x: -horizontalSpacing, y: topRowY },
        { x: horizontalSpacing, y: topRowY },
        { x: 0, y: bottomRowY }
      ]);
    } else {
      const spacing = 490;
      setHatPositions([
        { x: -spacing, y: 0 },
        { x: 0, y: 0 },
        { x: spacing, y: 0 }
      ]);
    }
    
    // Start with a random position for visual effect
    // The actual result will come from the blockchain
    const initialRandomPosition = Math.floor(Math.random() * 3);
    setBallPosition(initialRandomPosition);
    
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
  
  // Handle hat selection - integrates with blockchain
  const handleHatSelect = async (id: number) => {
    if (isShuffling || selectedHat !== null || isBetting) return;
    
    try {
      // Set betting state to prevent multiple selections
      setIsBetting(true);
      setSelectedHat(id);
      
      // Place bet on blockchain
      const txId = await blockchainService.placeBet(wagerAmount, id);
      setCurrentTxId(txId);
      
      // Set verification URL for the transaction
      setVerificationUrl(blockchainService.getExplorerUrl(txId));
      
      // Wait for the shuffling animation to complete before revealing
      setTimeout(async () => {
        try {
          // Get the game result from blockchain
          const result = await blockchainService.getGameResult(txId);
          
          if (result) {
            setVerificationHash(result.verificationHash);
            
            // Calculate the hat with the ball using blockchain data
            const blockchainBallPosition = calculateBallPositionFromHash(result.verificationHash);
            setBallPosition(blockchainBallPosition);
            
            // Determine if player won
            const playerWon = id === blockchainBallPosition;
            setWon(playerWon);
            
            // Reveal hat
            setRevealedHat(id);
            
            // Show result after hat is revealed
            setTimeout(async () => {
              setShowResult(true);
              
              // If won, claim winnings
              if (playerWon) {
                await blockchainService.claimWinnings(txId);
              }
              
              onGameComplete(playerWon);
              setIsBetting(false);
            }, 1000);
          } else {
            // Handle error getting result
            toast({
              title: "Error",
              description: "Could not get game result from blockchain.",
              variant: "destructive"
            });
            setIsBetting(false);
          }
        } catch (error) {
          console.error("Error revealing result:", error);
          toast({
            title: "Error",
            description: "Failed to process game result. Please try again.",
            variant: "destructive"
          });
          setIsBetting(false);
        }
      }, getShuffleDuration() * 1000 + 500);
      
    } catch (error) {
      console.error("Error placing bet:", error);
      setSelectedHat(null);
      setIsBetting(false);
      toast({
        title: "Bet Failed",
        description: "Failed to place bet. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
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
  };
};
