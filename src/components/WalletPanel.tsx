
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useWallet } from '@txnlab/use-wallet-react';
import WalletConnectButton from '@/components/wallet/WalletConnectButton';
import WalletButton from '@/components/wallet/WalletButton';
import ConnectedWalletContent from '@/components/wallet/ConnectedWalletContent';
import WalletDropdownContent from '@/components/wallet/WalletDropdownContent';

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
  const { activeAccount, connectedWallets, connectors } = useWallet();
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use the connected account if available, otherwise use props
  const connectedAddress = activeAccount?.address || address;
  const isWalletConnected = !!activeAccount || isConnected;

  const handleWalletConnect = async () => {
    setIsDropdownOpen(true);
  };

  const connectWallet = async (providerId: string) => {
    try {
      const selectedConnector = connectors.find(c => c.id === providerId);
      if (selectedConnector) {
        await selectedConnector.connect();
        onConnect();
        setIsDropdownOpen(false);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to wallet.",
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const activeConnector = connectedWallets[0];
      if (activeConnector) {
        await activeConnector.disconnect();
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(connectedAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div className={cn(
      "wallet-container",
      isMobile ? "flex justify-center mt-2" : "flex justify-end"
    )}>
      {isWalletConnected ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <WalletButton 
              balance={balance} 
              address={connectedAddress}
              isDropdownOpen={isDropdownOpen} 
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] md:w-[300px] bg-[#1A1F2C]/95 backdrop-blur-md border-purple-500/50 text-white p-4 animate-in fade-in-80 slide-in-from-top-5 shadow-xl shadow-purple-500/10 rounded-xl"
            align="end"
            sideOffset={5}
          >
            <ConnectedWalletContent
              address={connectedAddress}
              balance={balance}
              onCopy={copyToClipboard}
              onDisconnect={handleDisconnect}
              onClose={() => setIsDropdownOpen(false)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <WalletConnectButton onClick={handleWalletConnect} />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] md:w-[320px] bg-[#1A1F2C]/95 backdrop-blur-md border-purple-500/50 text-white p-4 animate-in fade-in-80 slide-in-from-top-5 shadow-xl shadow-purple-500/10 rounded-xl"
            align={isMobile ? "center" : "end"}
            sideOffset={5}
          >
            <WalletDropdownContent
              providers={connectors}
              onConnect={connectWallet}
              onClose={() => setIsDropdownOpen(false)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletPanel;
