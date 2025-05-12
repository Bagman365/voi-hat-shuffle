
import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import ControlsPanel from '@/components/ControlsPanel';
import StatusPanel from '@/components/StatusPanel';
import WalletPanel from '@/components/WalletPanel';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wagerAmount, setWagerAmount] = useState<number>(10);
  const [shuffleSpeed, setShuffleSpeed] = useState<'Normal' | 'Fast' | 'Extreme'>('Normal');
  const [wins, setWins] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(100);
  const [walletAddress, setWalletAddress] = useState<string>('0x1234...abcd');
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
    
    // Deduct wager from balance
    setBalance(prev => prev - wagerAmount);
    setIsPlaying(true);
  };

  const handleGameComplete = (won: boolean) => {
    if (won) {
      setWins(prev => prev + 1);
      setStreak(prev => prev + 1);
      setBalance(prev => prev + (wagerAmount * 2));
      
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

  const handleConnectWallet = () => {
    setWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your VOI wallet has been connected successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#0f1218]">
      {/* Header */}
      <header className="pt-6 pb-4 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text mb-2">
          VOI Hat Monte
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Find the ball under the hat and win $VOI
        </p>
      </header>
      
      {/* Main content - Game Board First */}
      <main className="flex-1 container mx-auto px-4 flex flex-col">
        {/* Game board */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden mb-6">
          {/* Galaxy background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="stars-bg"></div>
          </div>
          
          <div className="relative z-10 w-full">
            <GameBoard 
              isPlaying={isPlaying} 
              shuffleSpeed={shuffleSpeed}
              onGameComplete={handleGameComplete}
              wagerAmount={wagerAmount}
            />
          </div>
        </div>
        
        {/* Controls and status panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatusPanel wins={wins} streak={streak} />
          <ControlsPanel 
            onPlay={handlePlay}
            isPlaying={isPlaying}
            wagerAmount={wagerAmount}
            onWagerChange={setWagerAmount}
            shuffleSpeed={shuffleSpeed}
            onShuffleSpeedChange={setShuffleSpeed}
          />
          <WalletPanel 
            isConnected={walletConnected}
            balance={balance}
            address={walletAddress}
            onConnect={handleConnectWallet}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-gray-500 text-sm">
        Made with ❤️ for VOI.Network • v0.1.0
      </footer>
    </div>
  );
};

export default Index;
