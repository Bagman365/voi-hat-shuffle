
import { useState, useEffect } from 'react';
import { useWallet } from "@txnlab/use-wallet";
import { useToast } from '@/hooks/use-toast';
import algosdk from 'algosdk';

export const useWalletInteraction = () => {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const { toast } = useToast();
  
  const { activeAccount, activeAddress, providers, isActive, getAccountInfo } = useWallet();

  // Check wallet connection status on load
  useEffect(() => {
    const checkCurrentWallet = async () => {
      if (activeAddress && isActive) {
        setWalletConnected(true);
        setWalletAddress(activeAddress);
        
        try {
          // Get account info for balance
          if (activeAccount) {
            const voiBalance = activeAccount.amount ? 
              algosdk.microalgosToAlgos(activeAccount.amount) : 0;
            setBalance(voiBalance);
          } else if (getAccountInfo) {
            const accountInfo = await getAccountInfo(activeAddress);
            const voiBalance = accountInfo ? 
              algosdk.microalgosToAlgos(accountInfo.amount) : 0;
            setBalance(voiBalance);
          }
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          setBalance(0);
        }
      } else {
        setWalletConnected(false);
        setWalletAddress('');
        setBalance(0);
      }
    };
    
    checkCurrentWallet();
    
    // Set up polling to refresh balance periodically
    const balanceInterval = setInterval(async () => {
      if (walletConnected && activeAddress) {
        try {
          if (getAccountInfo) {
            const accountInfo = await getAccountInfo(activeAddress);
            const voiBalance = accountInfo ? 
              algosdk.microalgosToAlgos(accountInfo.amount) : 0;
            setBalance(voiBalance);
          }
        } catch (error) {
          console.error("Error refreshing balance:", error);
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(balanceInterval);
  }, [activeAddress, activeAccount, isActive, getAccountInfo, walletConnected]);

  const handleConnectWallet = async () => {
    // This function is mostly for compatibility with the existing codebase
    // The actual connection is handled by the WalletProvider
    if (activeAddress) {
      setWalletConnected(true);
      setWalletAddress(activeAddress);
      
      try {
        if (activeAccount) {
          const voiBalance = activeAccount.amount ? 
            algosdk.microalgosToAlgos(activeAccount.amount) : 0;
          setBalance(voiBalance);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setBalance(0);
      }
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
