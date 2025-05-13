
import { toast } from "@/hooks/use-toast";
import { WalletInfo, WalletProvider } from "@/types/wallet";
import { getAlgodClient } from "@/utils/algodClient";
import { BaseWalletService } from "./baseWalletService";

export class WalletConnectors extends BaseWalletService {
  async connectKibisis(): Promise<WalletInfo | null> {
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
        
        // Fix for bigint division
        const balanceNumber = typeof balance === 'bigint' 
          ? Number(balance) / 1000000 
          : balance / 1000000;
        
        this.currentWallet = {
          name: 'Kibisis',
          address: accounts[0],
          balance: balanceNumber
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
  
  async connectLute(): Promise<WalletInfo | null> {
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
        
        // Fix for bigint division
        const balance = typeof accountInfo.amount === 'bigint'
          ? Number(accountInfo.amount) / 1000000
          : accountInfo.amount / 1000000;
        
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
  
  async connectVera(): Promise<WalletInfo | null> {
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
  
  async connectPera(): Promise<WalletInfo | null> {
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
        
        // Fix for bigint division
        const balance = typeof accountInfo.amount === 'bigint'
          ? Number(accountInfo.amount) / 1000000
          : accountInfo.amount / 1000000;
        
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
  
  async connectDefly(): Promise<WalletInfo | null> {
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
        
        // Fix for bigint division
        const balance = typeof accountInfo.amount === 'bigint'
          ? Number(accountInfo.amount) / 1000000
          : accountInfo.amount / 1000000;
        
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
  
  async connectBiatec(): Promise<WalletInfo | null> {
    // This is a placeholder for Biatec wallet connection
    toast({
      title: "Wallet Implementation",
      description: "Biatec wallet connection is not fully implemented yet.",
    });
    return null;
  }
  
  async connectWalletConnect(): Promise<WalletInfo | null> {
    // This is a placeholder for WalletConnect connection
    toast({
      title: "Wallet Implementation",
      description: "WalletConnect integration is not fully implemented yet.",
    });
    return null;
  }
}
