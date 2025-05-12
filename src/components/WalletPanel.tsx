
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import walletService, { WalletProvider } from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';

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

  // Helper function to truncate address for display
  const truncateAddress = (addr: string): string => {
    if (addr.length <= 8) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  // Wallet options for the dropdown
  const walletOptions1 = [
    { name: 'Kibisis', id: 'kibisis', logo: '🟣' },
    { name: 'Lute', id: 'lute', logo: '🟣' },
    { name: 'BiatecWallet', id: 'biatec', logo: '🔵' },
    { name: 'WalletConnect', id: 'walletconnect', logo: '🔵' },
  ];

  return (
    <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-row items-center gap-3 justify-end'}`}>
      {isConnected ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div className={`flex ${isMobile ? 'flex-col items-center gap-2' : 'items-center gap-3'} cursor-pointer`}>
              <div className={`flex flex-col ${isMobile ? 'items-center text-center' : 'items-end'}`}>
                <div className="text-white">
                  <span className="text-sm text-gray-300">Balance:</span>{" "}
                  <span className="font-bold">{balance} VOI</span>
                </div>
                <div className="text-xs text-gray-400 truncate max-w-[140px]">
                  {truncateAddress(address)}
                </div>
              </div>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className="border-red-500 text-white hover:bg-red-700/30"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1A1F2C] border-purple-500/50 text-white p-2 shadow-xl shadow-purple-500/10">
            <div className="py-2 px-2">
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full border-purple-500 bg-purple-900/20 hover:bg-purple-700/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">
              VOI Hat Monte v0.1.0
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              onClick={handleWalletConnect}
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className={`border-purple-500 text-white hover:bg-purple-700/30 hover:shadow-md hover:shadow-purple-500/20 ${isMobile ? 'px-3 py-1 text-sm' : ''}`}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[280px] md:w-[320px] bg-[#1A1F2C] border-purple-500/50 text-white p-3 animate-in fade-in-80 slide-in-from-top-5 shadow-xl shadow-purple-500/10"
            align="center"
            sideOffset={5}
          >
            <div className="space-y-3">
              {walletOptions1.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/30 text-lg">
                      {wallet.logo}
                    </div>
                    <span className="font-medium">{wallet.name}</span>
                  </div>
                  <Button
                    onClick={() => connectWallet(wallet.id as WalletProvider)}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 bg-transparent hover:bg-purple-700/30 rounded-full w-24"
                  >
                    Connect
                    <Plus className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-xs text-center text-gray-400 mt-4 py-1">
              VOI Hat Monte v0.1.0
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletPanel;
