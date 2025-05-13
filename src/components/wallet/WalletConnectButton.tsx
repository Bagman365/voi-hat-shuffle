
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletConnectButtonProps {
  onClick: () => void;
  className?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  onClick, 
  className 
}) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline" 
      className={cn(
        "wallet-pill border-purple-500 text-white hover:bg-purple-900/30 hover:border-purple-400",
        "py-2 px-4 h-auto rounded-full transition-all shadow-sm hover:shadow-purple-500/20",
        "flex items-center gap-2",
        className
      )}
    >
      <Wallet className="h-4 w-4 text-purple-400" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnectButton;
