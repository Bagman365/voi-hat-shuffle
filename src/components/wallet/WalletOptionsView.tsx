
import React from 'react';
import WalletOption from './WalletOption';
import { WalletProvider } from '@/types/wallet';

interface WalletOptionsViewProps {
  availableWallets: Array<{
    name: string;
    id: string;
    logo: string;
    available: boolean;
    recommended?: boolean;
  }>;
  onConnect: (provider: WalletProvider) => Promise<void>;
}

const WalletOptionsView: React.FC<WalletOptionsViewProps> = ({
  availableWallets,
  onConnect
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center border-b border-purple-500/20 pb-3">
        <h3 className="font-medium text-lg">Connect Wallet</h3>
        <p className="text-xs text-gray-400 mt-1">
          Choose your preferred wallet to play with VOI
        </p>
      </div>
      
      <div className="space-y-3">
        {availableWallets.map((wallet) => (
          <WalletOption
            key={wallet.id}
            id={wallet.id}
            name={wallet.name}
            logo={wallet.logo}
            available={wallet.available}
            recommended={wallet.recommended}
            onConnect={onConnect}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletOptionsView;
