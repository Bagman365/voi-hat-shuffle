
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, WalletCards, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import walletService, { WalletProvider } from '@/services/wallet/walletService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ConnectedWalletView from './ConnectedWalletView';
import WalletOptionsView from './WalletOptionsView';
import { useWalletProviders } from '@/hooks/useWalletProviders';

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
  const { getAvailableWalletOptions } = useWalletProviders();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper function to truncate address for display
  const truncateAddress = (addr: string): string => {
    if (!addr || addr.length <= 8) return addr;
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  const handleWalletConnect = async () => {
    setIsDropdownOpen(true);
  };

  const connectWallet = async (provider: WalletProvider) => {
    if (!provider) return;
    
    const walletInfo = await walletService.connectWallet(provider);
    
    if (walletInfo) {
      onConnect();
      setIsDropdownOpen(false);
      toast({
        title: `${walletInfo.name} Connected`,
        description: `Successfully connected to ${walletInfo.name} wallet.`,
      });
    }
  };

  const handleDisconnect = async () => {
    await walletService.disconnect();
    window.location.reload(); // Simple way to reset the app state
  };

  const availableWalletOptions = getAvailableWalletOptions();
  const currentWalletLogo = availableWalletOptions.find(w => 
    w.id === walletService.getCurrentProvider())?.logo || '🟣';

  const walletVersion = "VOI Hat Monte v0.1.0";

  return (
    <div className={cn(
      "wallet-container",
      isMobile ? "flex justify-center mt-2" : "flex justify-end"
    )}>
      {isConnected ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "wallet-pill border-purple-500/60 bg-[#1A1F2C]/90 text-white hover:bg-purple-900/30 hover:border-purple-400",
                "py-1 px-3 h-auto rounded-full transition-all shadow-sm hover:shadow-purple-500/20",
                "flex items-center gap-2 text-sm group"
              )}
            >
              <WalletCards className="h-4 w-4 text-purple-400 group-hover:text-purple-300" />
              <span className="font-medium text-purple-100">{balance} VOI</span>
              <span className="text-gray-400 text-xs">|</span>
              <span className="text-gray-400 text-xs">{truncateAddress(address)}</span>
              <ChevronDown className="h-3 w-3 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] md:w-[300px] bg-[#1A1F2C]/95 backdrop-blur-md border-purple-500/50 text-white p-4 animate-in fade-in-80 slide-in-from-top-5 shadow-xl shadow-purple-500/10 rounded-xl"
            align="end"
            sideOffset={5}
          >
            <ConnectedWalletView
              walletLogo={currentWalletLogo}
              address={address}
              balance={balance}
              onDisconnect={handleDisconnect}
              onClose={() => setIsDropdownOpen(false)}
            />
            <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
              {walletVersion}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              onClick={handleWalletConnect}
              variant="outline" 
              className={cn(
                "wallet-pill border-purple-500 text-white hover:bg-purple-700/30",
                "py-2 px-4 h-auto rounded-full transition-all shadow-sm hover:shadow-purple-500/20",
                "flex items-center gap-2"
              )}
            >
              <Wallet className="h-4 w-4 text-purple-400" />
              Connect Wallet
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] md:w-[320px] bg-[#1A1F2C]/95 backdrop-blur-md border-purple-500/50 text-white p-4 animate-in fade-in-80 slide-in-from-top-5 shadow-xl shadow-purple-500/10 rounded-xl"
            align={isMobile ? "center" : "end"}
            sideOffset={5}
          >
            <WalletOptionsView 
              availableWallets={availableWalletOptions}
              onConnect={connectWallet}
            />
            <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
              {walletVersion}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletPanel;
