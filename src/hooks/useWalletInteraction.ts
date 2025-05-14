
import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useToast } from '@/hooks/use-toast';

export const useWalletInteraction = () => {
  const [balance, setBalance] = useState<number>(100);
  const { toast } = useToast();
  
  const { 
    activeAccount,
    activeAddress,
    isActive,
    getAlgodClient,
    wallets,
    disconnect
  } = useWallet();

  // Check if wallet is connected
  const isConnected = isActive;

  // Check wallet connection status on load
  useEffect(() => {
    if (isConnected && activeAccount) {
      // Convert microalgos to algos (or in this case, VOI)
      // The account structure was changed in newer versions
      const microAlgos = activeAccount.amount ? activeAccount.amount : 0;
      setBalance(microAlgos / 1000000);
    }
    
    // Set up polling to refresh balance periodically
    const balanceInterval = setInterval(() => {
      if (isConnected && activeAccount) {
        const microAlgos = activeAccount.amount ? activeAccount.amount : 0;
        setBalance(microAlgos / 1000000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceInterval);
  }, [isConnected, activeAccount]);

  const handleConnectWallet = async (walletType?: string) => {
    try {
      if (walletType) {
        const wallet = wallets.find(w => w.id === walletType);
        if (wallet) {
          await wallet.connect();
        }
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
    disconnectWallet: disconnect
  };
};
