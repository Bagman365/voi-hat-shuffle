import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import ControlsPanel from '@/components/ControlsPanel';
import StatusPanel from '@/components/StatusPanel';
import WalletPanel from '@/components/WalletPanel';
import { useToast } from '@/components/ui/use-toast';
import walletService from '@/services/walletService';

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

  // Check wallet connection status on load
  useEffect(() => {
    const checkCurrentWallet = async () => {
      const currentWallet = walletService.getCurrentWallet();
      if (currentWallet) {
        setWalletConnected(true);
        setBalance(currentWallet.balance);
        setWalletAddress(currentWallet.address);
      }
    };
    
    checkCurrentWallet();
    
    // Set up polling to refresh balance periodically
    const balanceInterval = setInterval(async () => {
      if (walletConnected) {
        const newBalance = await walletService.refreshBalance();
        if (newBalance !== null) {
          setBalance(newBalance);
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceInterval);
  }, [walletConnected]);

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

  const handleConnectWallet = async () => {
    // Let WalletPanel handle the connection flow
    setWalletConnected(true);
    
    // Update address and balance with actual wallet info
    const wallet = walletService.getCurrentWallet();
    if (wallet) {
      setWalletAddress(wallet.address);
      setBalance(wallet.balance);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#0f1218]">
      {/* Header with wallet button in top right */}
      <header className="pt-8 pb-6 px-6 flex items-center justify-between">
        <div className="flex-1">
          {/* Empty div for flex spacing */}
        </div>
        
        <div className="flex-1 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text mb-2">
            VOI HAT MONTE
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto">
            Find the ball under the hat and win $VOI
          </p>
        </div>
        
        <div className="flex-1 flex justify-end items-start">
          <WalletPanel 
            isConnected={walletConnected}
            balance={balance}
            address={walletAddress}
            onConnect={handleConnectWallet}
          />
        </div>
      </header>
      
      {/* Main content - Game Board First */}
      <main className="flex-1 container mx-auto px-4 flex flex-col">
        {/* Game board with increased vertical space */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden mb-10">
          {/* Galaxy background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="stars-bg"></div>
          </div>
          
          <div className="relative z-10 w-full flex justify-center">
            <GameBoard 
              isPlaying={isPlaying} 
              shuffleSpeed={shuffleSpeed}
              onGameComplete={handleGameComplete}
              wagerAmount={wagerAmount}
            />
          </div>
        </div>
        
        {/* Controls and status panels - centered as one group */}
        <div className="max-w-3xl mx-auto w-full mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <StatusPanel wins={wins} streak={streak} />
              <ControlsPanel 
                onPlay={handlePlay}
                isPlaying={isPlaying}
                wagerAmount={wagerAmount}
                onWagerChange={setWagerAmount}
                shuffleSpeed={shuffleSpeed}
                onShuffleSpeedChange={setShuffleSpeed}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-6 text-center text-gray-500 text-sm">
        Made with ❤️ for VOI.Network • v0.1.0
      </footer>
    </div>
  );
};

export default Index;
