
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import walletService, { WalletProvider } from '@/services/walletService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [walletOptions, setWalletOptions] = useState<{
    hasVera: boolean;
    hasKibisis: boolean;
  }>({
    hasVera: false,
    hasKibisis: false
  });

  const handleWalletConnect = async () => {
    const providers = await walletService.checkWalletProviders();
    setWalletOptions(providers);
    
    // If only one option available, connect directly
    if (providers.hasKibisis && !providers.hasVera) {
      connectWallet('kibisis');
    } else if (providers.hasVera && !providers.hasKibisis) {
      connectWallet('vera');
    } else if (providers.hasKibisis || providers.hasVera) {
      // If multiple options or need to show installation prompt
      setShowWalletOptions(true);
    } else {
      // No wallets detected
      toast({
        title: "No Wallets Detected",
        description: "Please install Kibisis extension or Vera mobile wallet.",
      });
    }
  };

  const connectWallet = async (provider: WalletProvider) => {
    if (!provider) return;
    
    const walletInfo = await walletService.connectWallet(provider);
    
    if (walletInfo) {
      onConnect();
      setShowWalletOptions(false);
      toast({
        title: `${walletInfo.name} Connected`,
        description: `Successfully connected to ${walletInfo.name} wallet.`,
      });
    }
  };

  const handleDisconnect = async () => {
    await walletService.disconnect();
    window.location.reload(); // Simple way to reset the app state
  };

  // Helper function to truncate address for display
  const truncateAddress = (addr: string): string => {
    if (addr.length <= 8) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-row items-center gap-3 justify-end">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-white">
              <span className="text-sm text-gray-300">Balance:</span>{" "}
              <span className="font-bold">{balance} VOI</span>
            </div>
            <div className="text-xs text-gray-400 truncate max-w-[120px]">
              {truncateAddress(address)}
            </div>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="border-red-500 text-white hover:bg-red-700/30"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleWalletConnect}
          variant="outline" 
          className="border-purple-500 text-white hover:bg-purple-700/30"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}

      {/* Wallet Selection Dialog */}
      <Dialog open={showWalletOptions} onOpenChange={setShowWalletOptions}>
        <DialogContent className="bg-gray-900 border-purple-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Connect Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a wallet to connect to the VOI Hat Monte game.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 py-4">
            {walletOptions.hasKibisis && (
              <Button
                onClick={() => connectWallet('kibisis')}
                variant="outline"
                className="border-purple-500 bg-purple-900/20 hover:bg-purple-700/30"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Kibisis
              </Button>
            )}
            
            {walletOptions.hasVera && (
              <Button
                onClick={() => connectWallet('vera')}
                variant="outline"
                className="border-purple-500 bg-purple-900/20 hover:bg-purple-700/30"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Vera Wallet
              </Button>
            )}
            
            {!walletOptions.hasKibisis && (
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4 text-sm">
                <h3 className="font-semibold text-gray-300">Kibisis Not Detected</h3>
                <p className="mt-1 text-gray-400">
                  For desktop browsers, we recommend installing the Kibisis wallet extension.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-blue-600 hover:bg-blue-700/30"
                  onClick={() => window.open('https://github.com/TxnLab/kibisis', '_blank')}
                >
                  Get Kibisis
                </Button>
              </div>
            )}
            
            {!walletOptions.hasVera && (
              <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4 text-sm">
                <h3 className="font-semibold text-gray-300">Vera/Pera Wallet Not Detected</h3>
                <p className="mt-1 text-gray-400">
                  For mobile devices, we recommend using the Vera wallet app.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-blue-600 hover:bg-blue-700/30"
                  onClick={() => window.open('https://perawallet.app/download/', '_blank')}
                >
                  Get Vera Wallet
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPanel;
