
import { toast } from "@/hooks/use-toast";
import { WalletInfo, WalletProvider } from "@/types/wallet";
import { getAlgodClient } from "@/utils/algodClient";
import slotMachineService from "../slotMachineService";

export class BaseWalletService {
  protected currentWallet: WalletInfo | null = null;
  protected currentProvider: WalletProvider = null;

  public getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  public getCurrentProvider(): WalletProvider {
    return this.currentProvider;
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

  public async refreshBalance(): Promise<number | null> {
    if (!this.currentWallet || !this.currentProvider) return null;
    
    try {
      const algod = getAlgodClient();
      
      if (this.currentProvider === 'kibisis') {
        try {
          // @ts-ignore - kibisis is injected by the extension
          const balance = await window.kibisis.getBalance(this.currentWallet.address);
          
          // Fix for bigint division
          this.currentWallet.balance = typeof balance === 'bigint'
            ? Number(balance) / 1000000
            : balance / 1000000;
            
          return this.currentWallet.balance;
        } catch (error) {
          console.error("Error refreshing Kibisis balance:", error);
        }
      }
      
      // Fallback to algod for other wallets
      try {
        const accountInfo = await algod.accountInformation(this.currentWallet.address).do();
        
        // Fix for bigint division
        this.currentWallet.balance = typeof accountInfo.amount === 'bigint'
          ? Number(accountInfo.amount) / 1000000
          : accountInfo.amount / 1000000;
          
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
