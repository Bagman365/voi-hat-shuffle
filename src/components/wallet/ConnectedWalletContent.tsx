
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Copy } from 'lucide-react';
import { formatAddress } from '@/lib/walletUtils';

interface ConnectedWalletContentProps {
  address: string;
  balance: number;
  onCopy: () => void;
  onDisconnect: () => void;
  onClose: () => void;
}

const ConnectedWalletContent: React.FC<ConnectedWalletContentProps> = ({
  address,
  balance,
  onCopy,
  onDisconnect,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-900/70 flex items-center justify-center text-lg">
            🟣
          </div>
          <div>
            <div className="font-medium">Connected Wallet</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              {formatAddress(address)}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
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
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
        VOI Hat Monte v0.1.0
      </div>
    </div>
  );
};

export default ConnectedWalletContent;
