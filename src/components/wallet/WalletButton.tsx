
import React from 'react';
import { Button } from '@/components/ui/button';
import { WalletCards, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatAddress } from '@/lib/walletUtils';

interface WalletButtonProps {
  balance: number;
  address: string;
  className?: string;
  isDropdownOpen?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({ 
  balance, 
  address,
  className,
  isDropdownOpen = false
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "wallet-pill border-purple-500/60 bg-[#1A1F2C]/90 text-white hover:bg-purple-900/30 hover:border-purple-400",
        "py-1 px-3 h-auto rounded-full transition-all shadow-sm hover:shadow-purple-500/20",
        "flex items-center gap-2 text-sm group",
        className
      )}
    >
      <WalletCards className="h-4 w-4 text-purple-400 group-hover:text-purple-300" />
      <span className="font-medium text-purple-100">{balance} VOI</span>
      <span className="text-gray-400 text-xs">|</span>
      <span className="text-gray-400 text-xs">{formatAddress(address)}</span>
      <ChevronDown className={cn(
        "h-3 w-3 text-gray-400 transition-transform group-data-[state=open]:rotate-180"
      )} />
    </Button>
  );
};

export default WalletButton;
