
import { useState, useEffect } from 'react';
import walletService from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';

export const useWalletInteraction = () => {
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

  const updateBalanceForWager = (amount: number) => {
    setBalance(prev => prev - amount);
  };

  const updateBalanceForWin = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return {
    walletConnected,
    balance, 
    walletAddress,
    handleConnectWallet,
    updateBalanceForWager,
    updateBalanceForWin
  };
};
