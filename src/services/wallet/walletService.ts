
import { toast } from "@/hooks/use-toast";
import { WalletInfo, WalletProvider } from "@/types/wallet";
import { WalletConnectors } from "./walletConnectors";
import { WalletDetectionService } from "./walletDetectionService";
import slotMachineService from "../slotMachineService";

class WalletService extends WalletDetectionService {
  private walletConnectors: WalletConnectors;
  
  constructor() {
    super();
    this.walletConnectors = new WalletConnectors();
  }

  public async connectWallet(provider: WalletProvider): Promise<WalletInfo | null> {
    try {
      // Reset any existing wallet connection
      await this.disconnect();
      
      switch(provider) {
        case 'kibisis':
          return await this.walletConnectors.connectKibisis();
        case 'vera':
          return await this.walletConnectors.connectVera();
        case 'lute':
          return await this.walletConnectors.connectLute();
        case 'defly':
          return await this.walletConnectors.connectDefly();
        case 'pera':
          return await this.walletConnectors.connectPera();
        case 'biatec':
          return await this.walletConnectors.connectBiatec();
        case 'walletconnect':
          return await this.walletConnectors.connectWalletConnect();
        default:
          return null;
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }
}

// Create singleton instance
export const walletService = new WalletService();
export default walletService;
export type { WalletProvider } from "@/types/wallet";
