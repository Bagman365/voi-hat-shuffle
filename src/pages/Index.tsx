
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GameBoard from '@/components/GameBoard';
import ControlsPanel from '@/components/ControlsPanel';
import StatusPanel from '@/components/StatusPanel';
import WalletPanel from '@/components/WalletPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGameStatus } from '@/hooks/useGameStatus';
import { useWalletInteraction } from '@/hooks/useWalletInteraction';

const Index = () => {
  const isMobile = useIsMobile();
  const [wagerAmount, setWagerAmount] = useState<number>(10);
  
  // Use custom hooks for separated concerns
  const {
    walletConnected,
    balance,
    walletAddress,
    handleConnectWallet,
    updateBalanceForWager,
    updateBalanceForWin
  } = useWalletInteraction();

  const {
    isPlaying,
    shuffleSpeed,
    setShuffleSpeed,
    wins,
    streak,
    handlePlay,
    handleGameComplete
  } = useGameStatus({
    walletConnected,
    balance,
    wagerAmount
  });

  // Wrap game completion handler to also update wallet balance
  const onGameCompleteWithBalance = (won: boolean) => {
    if (won) {
      updateBalanceForWin(wagerAmount * 2);
    }
    handleGameComplete(won);
  };

  // Wrap play handler to also update wallet balance
  const onPlay = () => {
    if (walletConnected && balance >= wagerAmount) {
      updateBalanceForWager(wagerAmount);
    }
    handlePlay();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#0f1218]">
      {/* Header with wallet button - adaptive layout for mobile */}
      <header className="pt-4 md:pt-8 pb-3 md:pb-6 px-4 md:px-6 container mx-auto">
        {/* Mobile layout: stacked */}
        {isMobile ? (
          <div className="flex flex-col gap-4 items-center">
            <motion.h1 
              className="title-text text-center mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              VOI HAT SHUFFLE
            </motion.h1>
            
            <motion.p 
              className="subtitle-text text-gray-400 text-center px-2 max-w-[300px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Find Victor under the hat to WIN
            </motion.p>
            
            <div className="mt-2 w-full flex justify-center">
              <WalletPanel 
                isConnected={walletConnected}
                balance={balance}
                address={walletAddress}
                onConnect={handleConnectWallet}
                isMobile={isMobile}
              />
            </div>
          </div>
        ) : (
          // Desktop layout: wallet aligned with text
          <div className="flex flex-col items-center relative">
            <div className="w-full max-w-4xl mx-auto relative">
              <div className="absolute right-0 top-0">
                <WalletPanel 
                  isConnected={walletConnected}
                  balance={balance}
                  address={walletAddress}
                  onConnect={handleConnectWallet}
                  isMobile={isMobile}
                />
              </div>
            </div>
            
            <motion.h1 
              className="title-text mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              VOI HAT SHUFFLE
            </motion.h1>
            
            <motion.p 
              className="subtitle-text text-gray-400 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Find Victor under the hat to WIN
            </motion.p>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-2 md:px-4 flex flex-col">
        {/* Game board with increased vertical space */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden mb-4 md:mb-10">
          {/* Galaxy background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="stars-bg"></div>
          </div>
          
          <div className="relative z-10 w-full flex justify-center">
            <GameBoard 
              isPlaying={isPlaying} 
              shuffleSpeed={shuffleSpeed}
              onGameComplete={onGameCompleteWithBalance}
              wagerAmount={wagerAmount}
            />
          </div>
        </div>
        
        {/* Controls and status panels - centered as one group */}
        <div className="max-w-3xl mx-auto w-full mb-6 md:mb-8">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 justify-center">
              <StatusPanel wins={wins} streak={streak} />
              <ControlsPanel 
                onPlay={onPlay}
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
      <footer className="py-4 md:py-6 px-4 md:px-6 text-center text-gray-500 text-sm">
        Made with ❤️ for VOI.Network • v0.1.0
      </footer>
    </div>
  );
};

export default Index;
