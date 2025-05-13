
import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { formatAddress, formatAssetBalance } from '@/lib/walletUtils';

export const useWalletInteraction = () => {
  const { activeAccount, providers, isReady } = useWallet();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(100);
  const [walletAddress, setWalletAddress] = useState<string>('0x1234...abcd');
  const { toast } = useToast();

  // Check wallet connection status when the wallet state changes
  useEffect(() => {
    if (isReady && activeAccount) {
      setWalletConnected(true);
      setWalletAddress(activeAccount.address);
      
      // For now we'll use a mock balance, but this would be retrieved from the chain
      setBalance(100);
    } else {
      setWalletConnected(false);
    }
  }, [activeAccount, isReady]);

  const handleConnectWallet = async () => {
    // This is just a stub now - actual connection will be handled by WalletPanel
    // using the useWallet hook directly
    setWalletConnected(true);
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

// Helper functions for formatting
<lov-write file_path="src/lib/walletUtils.ts">
/**
 * Format a wallet address for display by truncating the middle
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 8) return address;
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

/**
 * Format an asset balance with proper decimal places
 */
export const formatAssetBalance = (balance: number, decimals: number = 6): string => {
  return (balance / Math.pow(10, decimals)).toFixed(decimals);
};
