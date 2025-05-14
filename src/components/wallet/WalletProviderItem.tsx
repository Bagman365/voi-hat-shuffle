
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WalletProviderItemProps {
  provider: {
    id: string;
    name: string;
    icon?: string;
  };
  onConnect: (id: string) => void;
}

const WalletProviderItem: React.FC<WalletProviderItemProps> = ({ 
  provider, 
  onConnect 
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/30 text-lg">
          {provider.icon ? (
            <img 
              src={provider.icon} 
              alt={provider.name} 
              className="w-6 h-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="purple"><circle cx="12" cy="12" r="10"/></svg>';
              }}
            />
          ) : (
            // Fallback icon
            <span className="text-purple-300">📱</span>
          )}
        </div>
        <span className="font-medium">{provider.name}</span>
      </div>
      <Button
        onClick={() => onConnect(provider.id)}
        variant="outline"
        size="sm"
        className="border-purple-500 bg-transparent hover:bg-purple-700/30 rounded-full w-24"
      >
        Connect
        <Plus className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default WalletProviderItem;
