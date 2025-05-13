
import { toast } from "@/hooks/use-toast";

interface WalletInfo {
  name: string;
  address: string;
  balance: number;
}

export type WalletProvider = 'vera' | 'kibisis' | null;

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
    // This is a simplified check - actual implementation depends on Vera's detection method
    const hasVera = typeof window !== 'undefined' && 
      (navigator.userAgent.includes('VOIWallet') || 
       navigator.userAgent.includes('PeraWallet') ||
       // Additional checks for Vera/Pera wallet here
       false);
    
    return { hasVera, hasKibisis };
  }

  public async connectWallet(provider: WalletProvider): Promise<WalletInfo | null> {
    try {
      if (provider === 'kibisis') {
        return await this.connectKibisis();
      } else if (provider === 'vera') {
        return await this.connectVera();
      }
      return null;
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
  
  private async connectVera(): Promise<WalletInfo | null> {
    // Simplified implementation for Vera/Pera wallet
    // In a production app, you would use the official Pera SDK or VOI-specific SDK
    
    // If on mobile, attempt to deep link to Vera wallet
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      try {
        // Simulated connection - in reality, this would use the Pera/Vera SDK
        // This is a placeholder to demonstrate the flow
        this.currentWallet = {
          name: 'Vera',
          address: '0xvera' + Math.floor(Math.random() * 10000),
          balance: 100 // Demo balance
        };
        
        this.currentProvider = 'vera';
        return this.currentWallet;
      } catch (error) {
        console.error("Vera connection error:", error);
        
        // If failed, suggest opening the app or installing it
        window.location.href = 'https://perawallet.app/download/';
        return null;
      }
    } else {
      toast({
        title: "Mobile Wallet",
        description: "Vera wallet is primarily for mobile devices. Please use Kibisis on desktop.",
      });
      return null;
    }
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

  // This is a mock function, in a real application this would be called periodically
  public async refreshBalance(): Promise<number | null> {
    if (!this.currentWallet || !this.currentProvider) return null;
    
    try {
      if (this.currentProvider === 'kibisis') {
        // @ts-ignore - kibisis is injected by the extension
        const balance = await window.kibisis.getBalance(this.currentWallet.address);
        this.currentWallet.balance = balance / 1000000; // Convert from microVOI to VOI
        return this.currentWallet.balance;
      } else if (this.currentProvider === 'vera') {
        // In a real implementation, this would use the Vera/Pera SDK
        // Mock implementation for demo
        this.currentWallet.balance = Math.floor(Math.random() * 200);
        return this.currentWallet.balance;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing balance:", error);
      return null;
    }
  }
}

// Create singleton instance
export const walletService = new WalletService();
export default walletService;
