
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseGameStatusProps {
  walletConnected: boolean;
  balance: number;
  wagerAmount: number;
}

export const useGameStatus = ({ walletConnected, balance, wagerAmount }: UseGameStatusProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shuffleSpeed, setShuffleSpeed] = useState<'Normal' | 'Fast' | 'Extreme'>('Normal');
  const [wins, setWins] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const { toast } = useToast();

  // Simulate game timer
  useEffect(() => {
    let gameTimer: NodeJS.Timeout;
    
    if (isPlaying) {
      const duration = 
        shuffleSpeed === 'Normal' ? 6000 : 
        shuffleSpeed === 'Fast' ? 4000 : 2500;
        
      gameTimer = setTimeout(() => {
        setIsPlaying(false);
      }, duration + 500);
    }
    
    return () => {
      if (gameTimer) clearTimeout(gameTimer);
    };
  }, [isPlaying, shuffleSpeed]);

  const handlePlay = () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to play with real VOI tokens.",
      });
      return;
    }
    
    if (balance < wagerAmount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough VOI tokens for this wager.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
  };

  const handleGameComplete = (won: boolean) => {
    if (won) {
      setWins(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      toast({
        title: "You Won!",
        description: `+${wagerAmount * 2} VOI has been added to your balance.`,
      });
    } else {
      setStreak(0);
      
      toast({
        title: "Better Luck Next Time",
        description: "Try again for a chance to win.",
      });
    }
  };

  return {
    isPlaying,
    setIsPlaying,
    shuffleSpeed,
    setShuffleSpeed,
    wins,
    streak,
    handlePlay,
    handleGameComplete
  };
};
