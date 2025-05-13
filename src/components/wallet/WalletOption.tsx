import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WalletProvider } from '@/types/wallet';

interface WalletOptionProps {
  id: string;
  name: string;
  logo: string;
  available: boolean;
  recommended?: boolean;
  onConnect: (provider: WalletProvider) => void;
}

const WalletOption: React.FC<WalletOptionProps> = ({
  id,
  name,
  logo,
  available,
  recommended = false,
  onConnect
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/30 text-lg">
          {logo}
        </div>
        <div>
          <span className="font-medium">{name}</span>
          {recommended && (
            <span className="ml-2 bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
              Recommended
            </span>
          )}
          {!available && (
            <div className="text-xs text-gray-400">
              Not installed
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={() => onConnect(id as WalletProvider)}
        variant="outline"
        size="sm"
        disabled={!available}
        className="border-purple-500 bg-transparent hover:bg-purple-700/30 rounded-full w-24"
      >
        Connect
        <Plus className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default WalletOption;
