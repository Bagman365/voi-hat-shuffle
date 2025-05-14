
import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useToast } from '@/hooks/use-toast';

export const useWalletInteraction = () => {
  const [balance, setBalance] = useState<number>(100);
  const { toast } = useToast();
  
  const { 
    activeAccount,
    activeAddress,
    isConnected,
    connect,
    disconnect
  } = useWallet();

  // Check wallet connection status on load
  useEffect(() => {
    if (isConnected && activeAccount) {
      if (activeAccount.amount !== undefined) {
        // Convert from microalgos to algos (or in this case, VOI)
        setBalance(activeAccount.amount / 1000000);
      }
    }
    
    // Set up polling to refresh balance periodically
    const balanceInterval = setInterval(() => {
      if (isConnected && activeAccount && activeAccount.amount !== undefined) {
        setBalance(activeAccount.amount / 1000000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceInterval);
  }, [isConnected, activeAccount]);

  const handleConnectWallet = async (walletType?: string) => {
    try {
      await connect(walletType);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateBalanceForWager = (amount: number) => {
    setBalance(prev => prev - amount);
  };

  const updateBalanceForWin = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return {
    walletConnected: isConnected,
    balance, 
    walletAddress: activeAddress || '0x1234...abcd',
    handleConnectWallet,
    updateBalanceForWager,
    updateBalanceForWin,
    disconnectWallet: disconnect
  };
};
