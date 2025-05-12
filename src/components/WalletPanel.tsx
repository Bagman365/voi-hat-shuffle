
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface WalletPanelProps {
  isConnected: boolean;
  balance: number;
  address: string;
  onConnect: () => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ 
  isConnected, 
  balance, 
  address,
  onConnect 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg backdrop-blur-sm">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-white">
            <span className="text-sm text-gray-300">Balance:</span>{" "}
            <span className="font-bold">{balance} VOI</span>
          </div>
          <div className="text-xs text-gray-400 truncate max-w-[120px]">
            {address}
          </div>
        </div>
      ) : (
        <Button 
          onClick={onConnect}
          variant="outline" 
          className="border-purple-500 text-white hover:bg-purple-700/30"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletPanel;
