import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Copy, ChevronDown, WalletCards } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ConnectedWalletProps {
  balance: number;
  address: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  onDisconnect: () => void;
  isMobile?: boolean;
}

const ConnectedWallet: React.FC<ConnectedWalletProps> = ({
  balance,
  address,
  isDropdownOpen,
  setIsDropdownOpen,
  onDisconnect,
  isMobile = false
}) => {
  const { toast } = useToast();

  // Helper function to truncate address for display
  const truncateAddress = (addr: string): string => {
    if (addr.length <= 8) return addr;
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
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
                🟣
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
              onClick={onDisconnect}
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
  );
};

export default ConnectedWallet;
