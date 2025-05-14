
import React from 'react';
import { cn } from '@/lib/utils';
import { useWalletPanel } from '@/hooks/useWalletPanel';
import ConnectedWalletDropdown from '@/components/wallet/ConnectedWalletDropdown';
import WalletSelectorDropdown from '@/components/wallet/WalletSelectorDropdown';

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
  const {
    providers,
    isDropdownOpen, 
    setIsDropdownOpen,
    handleWalletConnect,
    connectWallet,
    handleDisconnect
  } = useWalletPanel();

  const handleConnectSuccess = async (providerId: string) => {
    const success = await connectWallet(providerId);
    if (success) {
      onConnect();
    }
  };

  return (
    <div className={cn(
      "wallet-container",
      isMobile ? "flex justify-center mt-2" : "flex justify-end"
    )}>
      {isConnected ? (
        <ConnectedWalletDropdown
          balance={balance}
          address={address}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleDisconnect={handleDisconnect}
          isMobile={isMobile}
        />
      ) : (
        <WalletSelectorDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleWalletConnect={handleWalletConnect}
          connectWallet={handleConnectSuccess}
          isMobile={isMobile}
          providers={providers}
        />
      )}
    </div>
  );
};

export default WalletPanel;
