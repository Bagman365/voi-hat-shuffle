
import algosdk from 'algosdk';
import { toast } from "@/hooks/use-toast";
import walletService from './walletService';

// AVMSatoshiDice contract constants
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with the actual contract address
const NETWORK_PROVIDER = "https://voi-testnet.algorand.network"; // VOI Testnet - replace with mainnet when ready
const GAME_APP_ID = 12345; // Replace with the actual application ID

interface GameResult {
  won: boolean;
  amount: number;
  transactionId: string;
  verificationHash: string;
}

class BlockchainService {
  private client: algosdk.Algodv2;
  
  constructor() {
    // Initialize the Algorand client for VOI network
    this.client = new algosdk.Algodv2("", NETWORK_PROVIDER, "");
  }
  
  // Method to place a bet on the AVMSatoshiDice contract
  public async placeBet(amount: number, selectedHat: number): Promise<string> {
    try {
      const wallet = walletService.getCurrentWallet();
      
      if (!wallet) {
        throw new Error("No wallet connected");
      }
      
      const params = await this.client.getTransactionParams().do();
      
      // Prepare application call to the SatoshiDice contract
      const appArgs = [
        new Uint8Array(Buffer.from("bet")), // Method name
        algosdk.encodeUint64(amount * 1000000), // Convert VOI to microVOI
        algosdk.encodeUint64(selectedHat) // Hat selection (0, 1, or 2)
      ];

      // Create the transaction
      const txn = algosdk.makeApplicationNoOpTxn(
        wallet.address,
        params,
        GAME_APP_ID,
        appArgs,
        undefined,
        undefined,
        [algosdk.getApplicationAddress(GAME_APP_ID)], // App account to receive the funds
        undefined,
        undefined,
        undefined,
        [algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: wallet.address,
          to: algosdk.getApplicationAddress(GAME_APP_ID),
          amount: amount * 1000000, // microVOI
          suggestedParams: params
        })]
      );

      // Sign and send the transaction using our wallet service
      const signedTxn = await walletService.signTransaction(txn);
      const response = await this.client.sendRawTransaction(signedTxn).do();
      
      toast({
        title: "Bet Placed",
        description: `Successfully placed bet of ${amount} VOI. Waiting for confirmation...`,
      });
      
      // Return the transaction ID for tracking
      return response.txId;
    } catch (error) {
      console.error("Error placing bet:", error);
      toast({
        title: "Bet Failed",
        description: "Failed to place bet on blockchain. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Get the result of a game using the transaction ID
  public async getGameResult(txId: string): Promise<GameResult | null> {
    try {
      // Wait for the transaction to be confirmed
      await this.waitForConfirmation(txId);
      
      // Query the contract for the game result
      // For AVMSatoshiDice, we need to check the state of the game using the transaction ID
      
      // In a real implementation, you would query the contract's global state
      // or use indexer to find event logs related to this transaction
      
      // For this demo, we'll simulate an API call to get the result
      const response = await fetch(`${NETWORK_PROVIDER}/v2/transactions/${txId}`);
      const txInfo = await response.json();
      
      // Parse the transaction logs to find the game result
      // The AVMSatoshiDice contract would emit events with the result
      
      // For simplicity in this demo, we'll generate a random result
      // In production, this should come from the blockchain
      const won = Math.random() < 0.33; // 1/3 chance of winning
      
      // Ensure the amount is always a number
      const betAmount = typeof txInfo.amount === 'string' 
        ? parseInt(txInfo.amount, 10) 
        : txInfo.amount || 0;
      
      return {
        won,
        amount: won ? (betAmount / 1000000) * 3 : 0, // Triple the bet if won
        transactionId: txId,
        // Ensure verification hash is always a string
        verificationHash: `${txInfo.block || ''}${txInfo.intra || ''}` // Simplified verification hash
      };
    } catch (error) {
      console.error("Error getting game result:", error);
      return null;
    }
  }
  
  // Method to claim winnings if the game was won
  public async claimWinnings(txId: string): Promise<boolean> {
    try {
      const wallet = walletService.getCurrentWallet();
      
      if (!wallet) {
        throw new Error("No wallet connected");
      }
      
      const params = await this.client.getTransactionParams().do();
      
      // Prepare application call to claim winnings
      const appArgs = [
        new Uint8Array(Buffer.from("claim")),
        new Uint8Array(Buffer.from(txId)) // The original transaction ID
      ];

      // Create the transaction
      const txn = algosdk.makeApplicationNoOpTxn(
        wallet.address,
        params,
        GAME_APP_ID,
        appArgs
      );
      
      // Sign and send the transaction
      const signedTxn = await walletService.signTransaction(txn);
      const response = await this.client.sendRawTransaction(signedTxn).do();
      
      await this.waitForConfirmation(response.txId);
      
      toast({
        title: "Winnings Claimed",
        description: "You've successfully claimed your winnings!",
      });
      
      return true;
    } catch (error) {
      console.error("Error claiming winnings:", error);
      toast({
        title: "Claim Failed",
        description: "Failed to claim winnings. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  // Helper method to wait for a transaction to be confirmed
  private async waitForConfirmation(txId: string): Promise<void> {
    let status = await this.client.status().do();
    let lastRound = status["last-round"];
    
    while (true) {
      const pendingInfo = await this.client.pendingTransactionInformation(txId).do();
      
      if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
        // Transaction confirmed
        break;
      }
      
      lastRound++;
      await this.client.statusAfterBlock(lastRound).do();
    }
  }
  
  // Get blockchain explorer URL for transaction verification
  public getExplorerUrl(txId: string): string {
    return `https://voi-explorer.com/tx/${txId}`;
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;
