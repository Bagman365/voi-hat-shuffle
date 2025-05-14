
import React, { useState } from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ConnectedWallet from './wallet/ConnectedWallet';
import WalletSelector from './wallet/WalletSelector';

interface WalletPanelProps {
  isConnected: boolean;
  balance: number;
  address: string;
  onConnect: () => void;
  isMobile?: boolean;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ 
  isConnected, 
  balance, 
  address,
  onConnect,
  isMobile = false
}) => {
  const { toast } = useToast();
  const { wallets, disconnect } = useWallet();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const connectWallet = async (providerId: string) => {
    try {
      const selectedWallet = wallets.find(wallet => wallet.id === providerId);
      if (selectedWallet) {
        await selectedWallet.connect();
        onConnect();
        setIsDropdownOpen(false);
        toast({
          title: `Wallet Connected`,
          description: `Successfully connected to wallet.`,
        });
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

  const handleDisconnect = async () => {
    await disconnect();
    window.location.reload(); // Simple way to reset the app state
  };

  return (
    <div className={cn(
      "wallet-container",
      isMobile ? "flex justify-center mt-2" : "flex justify-end"
    )}>
      {isConnected ? (
        <ConnectedWallet 
          balance={balance}
          address={address}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onDisconnect={handleDisconnect}
          isMobile={isMobile}
        />
      ) : (
        <WalletSelector 
          onConnect={onConnect}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          connectWallet={connectWallet}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default WalletPanel;
