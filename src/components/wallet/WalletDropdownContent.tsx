
import React from 'react';
import { Button } from '@/components/ui/button';
import WalletProviderItem from './WalletProviderItem';

interface WalletDropdownContentProps {
  providers: any[];
  onConnect: (providerId: string) => void;
  onClose: () => void;
}

const WalletDropdownContent: React.FC<WalletDropdownContentProps> = ({
  providers,
  onConnect,
  onClose
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
        {providers?.map((provider) => (
          <WalletProviderItem
            key={provider.id}
            provider={provider}
            onConnect={onConnect}
          />
        ))}
      </div>
      
      <div className="text-xs text-center text-gray-400 mt-4 pt-3 border-t border-purple-500/20">
        VOI Hat Monte v0.1.0
      </div>
    </div>
  );
};

export default WalletDropdownContent;
