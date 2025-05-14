
import { toast } from "@/hooks/use-toast";
import algosdk from 'algosdk';

interface WalletInfo {
  name: string;
  address: string;
  balance: number;
}

export type WalletProvider = 'kibisis' | 'lute' | 'biatec' | 'walletconnect' | null;

class WalletService {
  private currentWallet: WalletInfo | null = null;
  private currentProvider: WalletProvider = null;
  
  public async checkWalletProviders(): Promise<{
    hasVera: boolean;
    hasKibisis: boolean;
  }> {
    // Check for Kibisis wallet (browser extension)
    const hasKibisis = typeof window !== 'undefined' && 'kibisis' in window;
    
    // Check for Vera wallet (typically on mobile devices)
    const hasVera = typeof window !== 'undefined' && 
      (navigator.userAgent.includes('VOIWallet') || 
       navigator.userAgent.includes('PeraWallet') ||
       false);
    
    return { hasVera, hasKibisis };
  }

  public async connectWallet(provider: WalletProvider): Promise<WalletInfo | null> {
    try {
      // Different connection logic based on wallet provider
      switch (provider) {
        case 'kibisis':
          return await this.connectKibisis();
        case 'lute':
          return await this.connectLute();
        case 'biatec':
          return await this.connectBiatec();
        case 'walletconnect':
          return await this.connectWalletConnect();
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

  private async connectKibisis(): Promise<WalletInfo | null> {
    if (typeof window === 'undefined' || !('kibisis' in window)) {
      toast({
        title: "Wallet Not Found",
        description: "Kibisis wallet extension not detected. Please install it first.",
      });
      return null;
    }
    
    try {
      // @ts-ignore - kibisis is injected by the extension
      const accounts = await window.kibisis.connect();
      
      if (accounts && accounts.length > 0) {
        // @ts-ignore - kibisis is injected by the extension
        const balance = await window.kibisis.getBalance(accounts[0]);
        
        this.currentWallet = {
          name: 'Kibisis',
          address: accounts[0],
          balance: balance / 1000000 // Convert from microVOI to VOI
        };
        
        this.currentProvider = 'kibisis';
        return this.currentWallet;
      }
      return null;
    } catch (error) {
      console.error("Kibisis connection error:", error);
      return null;
    }
  }

  private async connectLute(): Promise<WalletInfo | null> {
    // Implementation for Lute wallet
    // Similar to Kibisis but using the Lute API
    this.currentWallet = {
      name: 'Lute',
      address: '0xLute' + Math.floor(Math.random() * 10000),
      balance: 100 // Demo balance
    };
    
    this.currentProvider = 'lute';
    return this.currentWallet;
  }

  private async connectBiatec(): Promise<WalletInfo | null> {
    // Implementation for Biatec wallet
    this.currentWallet = {
      name: 'Biatec',
      address: '0xBiatec' + Math.floor(Math.random() * 10000),
      balance: 100 // Demo balance
    };
    
    this.currentProvider = 'biatec';
    return this.currentWallet;
  }

  private async connectWalletConnect(): Promise<WalletInfo | null> {
    // Implementation for WalletConnect
    this.currentWallet = {
      name: 'WalletConnect',
      address: '0xWC' + Math.floor(Math.random() * 10000),
      balance: 100 // Demo balance
    };
    
    this.currentProvider = 'walletconnect';
    return this.currentWallet;
  }
  
  public async disconnect(): Promise<void> {
    if (this.currentProvider === 'kibisis') {
      try {
        // @ts-ignore - kibisis is injected by the extension
        await window.kibisis.disconnect();
      } catch (error) {
        console.error("Error disconnecting Kibisis:", error);
      }
    }
    // Reset state
    this.currentWallet = null;
    this.currentProvider = null;
  }

  public getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  public getCurrentProvider(): WalletProvider {
    return this.currentProvider;
  }

  // Sign a transaction with the current wallet
  public async signTransaction(transaction: algosdk.Transaction | algosdk.Transaction[]): Promise<Uint8Array> {
    if (!this.currentWallet || !this.currentProvider) {
      throw new Error("No wallet connected");
    }

    const txnsToSign = Array.isArray(transaction) ? transaction : [transaction];
    const encodedTxns = txnsToSign.map(txn => algosdk.encodeUnsignedTransaction(txn));

    try {
      let signedTxns;
      
      switch (this.currentProvider) {
        case 'kibisis':
          // @ts-ignore - kibisis is injected by the extension
          signedTxns = await window.kibisis.signTransaction(encodedTxns);
          break;
        case 'lute':
          // @ts-ignore - lute is injected by the extension
          signedTxns = await window.lute.signTransaction(encodedTxns);
          break;
        // Add cases for other providers
        default:
          throw new Error("Unsupported wallet provider");
      }
      
      return signedTxns;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  }

  // This is a mock function, in a real application this would be called periodically
  public async refreshBalance(): Promise<number | null> {
    if (!this.currentWallet || !this.currentProvider) return null;
    
    try {
      if (this.currentProvider === 'kibisis') {
        // @ts-ignore - kibisis is injected by the extension
        const balance = await window.kibisis.getBalance(this.currentWallet.address);
        this.currentWallet.balance = balance / 1000000; // Convert from microVOI to VOI
        return this.currentWallet.balance;
      } else {
        // For other wallets, use a generic approach
        // In production, this would use the appropriate wallet API
        const response = await fetch(`https://voi-testnet.algorand.network/v2/accounts/${this.currentWallet.address}`);
        const data = await response.json();
        this.currentWallet.balance = data.amount / 1000000;
        return this.currentWallet.balance;
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
      return null;
    }
  }
}

// Create singleton instance
export const walletService = new WalletService();
export default walletService;
