
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from '@txnlab/use-wallet-react';
import { cn } from '@/lib/utils';

interface WalletSelectorProps {
  onConnect: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  connectWallet: (providerId: string) => Promise<void>;
  isMobile?: boolean;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({
  onConnect,
  isDropdownOpen, 
  setIsDropdownOpen,
  connectWallet,
  isMobile = false
}) => {
  const { wallets } = useWallet();

  const handleWalletConnect = async () => {
    setIsDropdownOpen(true);
  };

  // Map of provider names to emojis
  const walletEmojis: Record<string, string> = {
    'pera': '🟣',
    'defly': '🔵',
    'daffi': '🟡',
  };

  return (
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
            {wallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/30 text-lg">
                    {walletEmojis[wallet.id] || '👛'}
                  </div>
                  <span className="font-medium">{wallet.name}</span>
                </div>
                <Button
                  onClick={() => connectWallet(wallet.id)}
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
        </div>
        <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
          VOI Hat Monte v0.1.0
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletSelector;
