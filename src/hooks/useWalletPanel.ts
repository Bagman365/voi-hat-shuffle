
import { useState } from 'react';
import { useWalletContext } from "@txnlab/use-wallet";
import { useToast } from '@/hooks/use-toast';

export function useWalletPanel() {
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { providers, connect, disconnect, isActive } = useWalletContext();

  const handleWalletConnect = async () => {
    setIsDropdownOpen(true);
  };

  const connectWallet = async (providerId: string) => {
    try {
      await connect(providerId);
      setIsDropdownOpen(false);
      
      const provider = providers.find(p => p.metadata.id === providerId);
      if (provider) {
        toast({
          title: `${provider.metadata.name} Connected`,
          description: `Successfully connected to ${provider.metadata.name} wallet.`,
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    providers,
    isDropdownOpen,
    setIsDropdownOpen,
    handleWalletConnect,
    connectWallet,
    handleDisconnect
  };
}
