
import { toast } from "@/hooks/use-toast";
import { getAlgodClient } from '@/utils/algodClient';

interface WalletInfo {
  name: string;
  address: string;
  balance: number;
}

export type WalletProvider = 'vera' | 'kibisis' | 'pera' | 'defly' | 'walletconnect' | 'lute' | 'biatec' | null;

class WalletService {
  private currentWallet: WalletInfo | null = null;
  private currentProvider: WalletProvider = null;
  
  public async checkWalletProviders(): Promise<{
    hasVera: boolean;
    hasKibisis: boolean;
    hasLute: boolean;
    hasDefly: boolean;
    hasPera: boolean;
  }> {
    // Check for Kibisis wallet (browser extension)
    const hasKibisis = typeof window !== 'undefined' && 'kibisis' in window;
    
    // Check for Vera wallet (typically on mobile devices)
    const hasVera = typeof window !== 'undefined' && 
      (navigator.userAgent.includes('VOIWallet') || 
       // Additional checks for Vera wallet here
       false);
       
    // Check for other wallets
    const hasLute = typeof window !== 'undefined' && 'algorand_lute' in window;
    const hasDefly = typeof window !== 'undefined' && 'algorand_defly' in window;
    const hasPera = typeof window !== 'undefined' && 'algorand_pera' in window;
    
    return { hasVera, hasKibisis, hasLute, hasDefly, hasPera };
  }

  public async connectWallet(provider: WalletProvider): Promise<WalletInfo | null> {
    try {
      // Reset any existing wallet connection
      await this.disconnect();
      
      switch(provider) {
        case 'kibisis':
          return await this.connectKibisis();
        case 'vera':
          return await this.connectVera();
        case 'lute':
          return await this.connectLute();
        case 'defly':
          return await this.connectDefly();
        case 'pera':
          return await this.connectPera();
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
    if (typeof window === 'undefined' || !('algorand_lute' in window)) {
      toast({
        title: "Wallet Not Found",
        description: "Lute wallet extension not detected. Please install it first.",
      });
      return null;
    }
    
    try {
      // @ts-ignore - algorand_lute is injected by the extension
      const accounts = await window.algorand_lute.enable();
      
      if (accounts && accounts.length > 0) {
        const algod = getAlgodClient();
        const accountInfo = await algod.accountInformation(accounts[0]).do();
        const balance = accountInfo.amount / 1000000; // Convert from microVOI to VOI
        
        this.currentWallet = {
          name: 'Lute',
          address: accounts[0],
          balance: balance
        };
        
        this.currentProvider = 'lute';
        return this.currentWallet;
      }
      return null;
    } catch (error) {
      console.error("Lute connection error:", error);
      return null;
    }
  }
  
  private async connectVera(): Promise<WalletInfo | null> {
    // Simulated connection - replace with actual Vera wallet SDK when available
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      try {
        // Placeholder for actual Vera connection
        // In a real implementation, this would use the Vera SDK
        this.currentWallet = {
          name: 'Vera',
          address: 'vera_wallet_address',
          balance: 100 // Demo balance
        };
        
        this.currentProvider = 'vera';
        return this.currentWallet;
      } catch (error) {
        console.error("Vera connection error:", error);
        return null;
      }
    } else {
      toast({
        title: "Mobile Wallet",
        description: "Vera wallet is primarily for mobile devices. Please use another wallet on desktop.",
      });
      return null;
    }
  }
  
  private async connectPera(): Promise<WalletInfo | null> {
    if (typeof window === 'undefined' || !('algorand_pera' in window)) {
      toast({
        title: "Wallet Not Found",
        description: "Pera wallet extension not detected.",
      });
      return null;
    }
    
    try {
      // @ts-ignore - algorand_pera is injected by the extension
      const accounts = await window.algorand_pera.enable();
      
      if (accounts && accounts.length > 0) {
        const algod = getAlgodClient();
        const accountInfo = await algod.accountInformation(accounts[0]).do();
        const balance = accountInfo.amount / 1000000; // Convert from microVOI to VOI
        
        this.currentWallet = {
          name: 'Pera',
          address: accounts[0],
          balance: balance
        };
        
        this.currentProvider = 'pera';
        return this.currentWallet;
      }
      return null;
    } catch (error) {
      console.error("Pera connection error:", error);
      return null;
    }
  }
  
  private async connectDefly(): Promise<WalletInfo | null> {
    if (typeof window === 'undefined' || !('algorand_defly' in window)) {
      toast({
        title: "Wallet Not Found",
        description: "Defly wallet extension not detected.",
      });
      return null;
    }
    
    try {
      // @ts-ignore - algorand_defly is injected by the extension
      const accounts = await window.algorand_defly.enable();
      
      if (accounts && accounts.length > 0) {
        const algod = getAlgodClient();
        const accountInfo = await algod.accountInformation(accounts[0]).do();
        const balance = accountInfo.amount / 1000000; // Convert from microVOI to VOI
        
        this.currentWallet = {
          name: 'Defly',
          address: accounts[0],
          balance: balance
        };
        
        this.currentProvider = 'defly';
        return this.currentWallet;
      }
      return null;
    } catch (error) {
      console.error("Defly connection error:", error);
      return null;
    }
  }
  
  private async connectBiatec(): Promise<WalletInfo | null> {
    // This is a placeholder for Biatec wallet connection
    toast({
      title: "Wallet Implementation",
      description: "Biatec wallet connection is not fully implemented yet.",
    });
    return null;
  }
  
  private async connectWalletConnect(): Promise<WalletInfo | null> {
    // This is a placeholder for WalletConnect connection
    toast({
      title: "Wallet Implementation",
      description: "WalletConnect integration is not fully implemented yet.",
    });
    return null;
  }
  
  public async disconnect(): Promise<void> {
    if (this.currentProvider === 'kibisis') {
      try {
        // @ts-ignore - kibisis is injected by the extension
        await window.kibisis.disconnect();
      } catch (error) {
        console.error("Error disconnecting Kibisis:", error);
      }
    } else if (this.currentProvider === 'lute') {
      // Add disconnect logic for Lute wallet
    } else if (this.currentProvider === 'pera') {
      // Add disconnect logic for Pera wallet
    } else if (this.currentProvider === 'defly') {
      // Add disconnect logic for Defly wallet
    }
    
    // Reset state
    this.currentWallet = null;
    this.currentProvider = null;
    
    // Reset the slot machine client
    slotMachineService.resetClient();
  }

  public getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  public getCurrentProvider(): WalletProvider {
    return this.currentProvider;
  }

  public async refreshBalance(): Promise<number | null> {
    if (!this.currentWallet || !this.currentProvider) return null;
    
    try {
      const algod = getAlgodClient();
      
      if (this.currentProvider === 'kibisis') {
        try {
          // @ts-ignore - kibisis is injected by the extension
          const balance = await window.kibisis.getBalance(this.currentWallet.address);
          this.currentWallet.balance = balance / 1000000; // Convert from microVOI to VOI
          return this.currentWallet.balance;
        } catch (error) {
          console.error("Error refreshing Kibisis balance:", error);
        }
      }
      
      // Fallback to algod for other wallets
      try {
        const accountInfo = await algod.accountInformation(this.currentWallet.address).do();
        this.currentWallet.balance = accountInfo.amount / 1000000;
        return this.currentWallet.balance;
      } catch (error) {
        console.error("Error refreshing balance via algod:", error);
      }
      
      return null;
    } catch (error) {
      console.error("Error refreshing balance:", error);
      return null;
    }
  }
}

// Import slot machine service to avoid circular dependency
import slotMachineService from './slotMachineService';

// Create singleton instance
export const walletService = new WalletService();
export default walletService;
