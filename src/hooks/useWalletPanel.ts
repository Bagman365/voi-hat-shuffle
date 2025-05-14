
import { useState } from 'react';
import walletService, { WalletProvider } from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';

export function useWalletPanel() {
  const { toast } = useToast();
  const [walletOptions, setWalletOptions] = useState<{
    hasVera: boolean;
    hasKibisis: boolean;
  }>({
    hasVera: false,
    hasKibisis: false
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleWalletConnect = async () => {
    const providers = await walletService.checkWalletProviders();
    setWalletOptions(providers);
    setIsDropdownOpen(true);
  };

  const connectWallet = async (provider: WalletProvider) => {
    if (!provider) return;
    
    const walletInfo = await walletService.connectWallet(provider);
    
    if (walletInfo) {
      setIsDropdownOpen(false);
      toast({
        title: `${walletInfo.name} Connected`,
        description: `Successfully connected to ${walletInfo.name} wallet.`,
      });
      return true;
    }
    return false;
  };

  const handleDisconnect = async () => {
    await walletService.disconnect();
    window.location.reload(); // Simple way to reset the app state
  };

  return {
    walletOptions,
    isDropdownOpen,
    setIsDropdownOpen,
    handleWalletConnect,
    connectWallet,
    handleDisconnect
  };
}
