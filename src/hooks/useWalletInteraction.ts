
import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useToast } from '@/hooks/use-toast';

export const useWalletInteraction = () => {
  const [balance, setBalance] = useState<number>(100);
  const { toast } = useToast();
  
  const { 
    activeAccount,
    activeAddress,
    connectedAccounts,
    providers,
    clientStates,
    reconnectProviders,
    disconnect: disconnectWallet
  } = useWallet();

  // Check if any wallet is connected
  const isConnected = connectedAccounts.length > 0;

  // Check wallet connection status on load
  useEffect(() => {
    if (isConnected && activeAccount) {
      // Convert microalgos to algos (or in this case, VOI)
      // The account might have a different property structure in the updated library
      const microAlgos = activeAccount.amount || 0;
      setBalance(microAlgos / 1000000);
    }
    
    // Set up polling to refresh balance periodically
    const balanceInterval = setInterval(() => {
      if (isConnected && activeAccount) {
        const microAlgos = activeAccount.amount || 0;
        setBalance(microAlgos / 1000000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceInterval);
  }, [isConnected, activeAccount]);

  const handleConnectWallet = async (walletType?: string) => {
    try {
      if (walletType && providers[walletType]) {
        await providers[walletType].connect();
      } else {
        // Reconnect all providers if no specific one is specified
        await reconnectProviders();
      }
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
    disconnectWallet
  };
};
