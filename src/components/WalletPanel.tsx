import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Plus, Copy, ChevronDown, WalletCards } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import walletService, { WalletProvider } from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
    hasLute: boolean;
    hasDefly: boolean;
    hasPera: boolean;
  }>({
    hasVera: false,
    hasKibisis: false,
    hasLute: false,
    hasDefly: false,
    hasPera: false
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check available wallets on component mount
  useEffect(() => {
    const checkAvailableWallets = async () => {
      const providers = await walletService.checkWalletProviders();
      setWalletOptions(providers);
    };
    
    checkAvailableWallets();
  }, []);

  // Helper function to truncate address for display
  const truncateAddress = (addr: string): string => {
    if (!addr || addr.length <= 8) return addr;
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  // Wallet options for the dropdown
  const getAvailableWalletOptions = () => {
    const options = [
      { 
        name: 'Kibisis', 
        id: 'kibisis', 
        logo: '🟣', 
        available: walletOptions.hasKibisis,
        recommended: true
      },
      { 
        name: 'Lute', 
        id: 'lute', 
        logo: '🟣', 
        available: walletOptions.hasLute 
      },
      { 
        name: 'Pera', 
        id: 'pera', 
        logo: '🔵', 
        available: walletOptions.hasPera 
      },
      { 
        name: 'Defly', 
        id: 'defly', 
        logo: '🔵', 
        available: walletOptions.hasDefly 
      },
      { 
        name: 'BiatecWallet', 
        id: 'biatec', 
        logo: '🔵', 
        available: false 
      },
      { 
        name: 'WalletConnect', 
        id: 'walletconnect', 
        logo: '🔵', 
        available: false 
      },
    ];

    // If on mobile, add Vera wallet
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      options.unshift({ 
        name: 'Vera', 
        id: 'vera', 
        logo: '🟣', 
        available: walletOptions.hasVera,
        recommended: true
      });
    }

    // Show available wallets first, then others
    return options.sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return 0;
    });
  };

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
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-900/70 flex items-center justify-center text-lg">
                    {getAvailableWalletOptions().find(w => w.id === walletService.getCurrentProvider())?.logo || '🟣'}
                  </div>
                  <div>
                    <div className="font-medium">Connected Wallet</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      {truncateAddress(address)}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard();
                        }}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-purple-300">
                  {balance} VOI
                </div>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-purple-500 bg-purple-900/20 hover:bg-purple-700/30"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="outline"
                    className="border-none bg-transparent hover:bg-transparent p-0 h-auto text-xs text-gray-400 hover:text-gray-300"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
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
            <div className="space-y-4">
              <div className="text-center border-b border-purple-500/20 pb-3">
                <h3 className="font-medium text-lg">Connect Wallet</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Choose your preferred wallet to play with VOI
                </p>
              </div>
              
              <div className="space-y-3">
                {getAvailableWalletOptions().map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/30 text-lg">
                        {wallet.logo}
                      </div>
                      <div>
                        <span className="font-medium">{wallet.name}</span>
                        {wallet.recommended && (
                          <span className="ml-2 bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                        {!wallet.available && (
                          <div className="text-xs text-gray-400">
                            Not installed
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => connectWallet(wallet.id as WalletProvider)}
                      variant="outline"
                      size="sm"
                      disabled={!wallet.available}
                      className="border-purple-500 bg-transparent hover:bg-purple-700/30 rounded-full w-24"
                    >
                      Connect
                      <Plus className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
              VOI Hat Monte v0.1.0
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default WalletPanel;
