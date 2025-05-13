
import walletService from './wallet/walletService';
import { getAlgodClient, getIndexerClient } from '@/utils/algodClient';
import { SlotMachineClient } from '@/utils/SlotMachineClient';

// Interface for spin results
interface SpinResult {
  betKey: string;
  success: boolean;
  message?: string;
}

class SlotMachineService {
  private readonly slotAppId: number = 40048754; // VOI SlotMachine mainnet contract
  private slotMachineClient: SlotMachineClient | null = null;
  private lastBetResults: Map<string, number> = new Map();
  
  /**
   * Get or initialize the SlotMachine client
   */
  private getClient(): SlotMachineClient {
    if (!this.slotMachineClient) {
      const algod = getAlgodClient();
      const indexer = getIndexerClient();
      const wallet = walletService.getCurrentWallet();
      this.slotMachineClient = new SlotMachineClient(this.slotAppId, algod, indexer, wallet);
    }
    return this.slotMachineClient;
  }
  
  /**
   * Initiates a spin on the slot machine smart contract
   * @param betAmount - Amount to bet in microVOI (1 VOI = 1,000,000 microVOI)
   * @param gameId - Optional game ID for tracking
   * @returns Promise with the bet key if successful
   */
  public async spin(betAmount: number, gameId?: number): Promise<SpinResult> {
    try {
      // Check if wallet is connected
      const wallet = walletService.getCurrentWallet();
      if (!wallet) {
        return { 
          betKey: '', 
          success: false,
          message: 'Wallet not connected'
        };
      }
      
      // Convert VOI to microVOI if not already in microVOI format
      const microBetAmount = betAmount * 1000000;
      
      // Log spin attempt
      console.log(`Attempting bet of ${microBetAmount} microVOI on app ${this.slotAppId}`);
      
      try {
        // Get client and set payment amount
        const client = this.getClient();
        await client.setPaymentAmount(microBetAmount + 1000); // Add box fee
        
        // Attempt spin
        const result = await client.spin(microBetAmount, gameId);
        
        if (!result.success) {
          return {
            betKey: '',
            success: false,
            message: result.error || 'Transaction failed'
          };
        }
        
        return { 
          betKey: result.return || `bet_${result.txId}`,
          success: true 
        };
      } catch (error) {
        console.error("Error in contract interaction:", error);
        return {
          betKey: '',
          success: false,
          message: error instanceof Error ? error.message : 'Contract interaction failed'
        };
      }
    } catch (error) {
      console.error("Error in slot machine spin:", error);
      return {
        betKey: '',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  /**
   * Fetches the result of a previous spin
   * @param betKey - The bet key returned from spin()
   * @returns The payout amount in microVOI, or 0 if lost
   */
  public async fetchPayout(betKey: string): Promise<number> {
    // Check if we already have this result cached
    if (this.lastBetResults.has(betKey)) {
      return this.lastBetResults.get(betKey) || 0;
    }
    
    try {
      const txId = betKey.replace('bet_', '');
      const client = this.getClient();
      const result = await client.checkBetResult(txId);
      
      if (result.success) {
        // Cache the result
        this.lastBetResults.set(betKey, result.payout);
        return result.payout;
      }
      
      return 0; // No payout
    } catch (error) {
      console.error("Error fetching payout:", error);
      
      // For development fallback, create a random result
      if (process.env.NODE_ENV !== 'production') {
        const didWin = Math.random() > 0.5;
        if (didWin) {
          const payout = Math.floor(Math.random() * 5000000) + 1000000; // 1-6 VOI
          this.lastBetResults.set(betKey, payout);
          return payout;
        }
      }
      
      return 0;
    }
  }
  
  /**
   * Claims winnings from a winning spin
   * @param betKey - The bet key returned from spin()
   * @returns Success status and amount claimed
   */
  public async claim(betKey: string): Promise<{success: boolean, amount: number}> {
    try {
      const payout = await this.fetchPayout(betKey);
      
      if (payout <= 0) {
        return {
          success: false,
          amount: 0
        };
      }
      
      // Attempt to claim the winnings
      const txId = betKey.replace('bet_', '');
      const client = this.getClient();
      const result = await client.claimWinnings(txId);
      
      if (result.success) {
        // Remove from cache after successful claim
        this.lastBetResults.delete(betKey);
        
        return {
          success: true,
          amount: payout
        };
      }
      
      return {
        success: false,
        amount: 0
      };
    } catch (error) {
      console.error("Error claiming winnings:", error);
      return {
        success: false,
        amount: 0
      };
    }
  }

  // Reset the client when wallet changes
  public resetClient() {
    this.slotMachineClient = null;
  }
}

// Create singleton instance
export const slotMachineService = new SlotMachineService();
export default slotMachineService;
