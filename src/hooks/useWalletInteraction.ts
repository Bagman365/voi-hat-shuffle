
import { useState, useEffect } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useToast } from '@/hooks/use-toast';
import { formatAddress } from '@/lib/walletUtils';

export const useWalletInteraction = () => {
  const { activeAccount, activeAccounts } = useWallet();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(100);
  const [walletAddress, setWalletAddress] = useState<string>('0x1234...abcd');
  const { toast } = useToast();

  // Check wallet connection status when the wallet state changes
  useEffect(() => {
    if (activeAccount) {
      setWalletConnected(true);
      setWalletAddress(activeAccount.address);
      
      // For now we'll use a mock balance, but this would be retrieved from the chain
      setBalance(100);
    } else {
      setWalletConnected(false);
    }
  }, [activeAccount]);

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
