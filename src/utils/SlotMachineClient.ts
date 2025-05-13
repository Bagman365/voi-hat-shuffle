
// SlotMachineClient.ts
// Integration with VOI SlotMachine contract using MimirAPI

import algosdk from "algosdk";
import axios from "axios";

interface SpinResult {
  txId: string;
  return?: string;
  success: boolean;
  error?: string;
}

export class SlotMachineClient {
  private appId: number;
  private algod: algosdk.Algodv2;
  private indexer: algosdk.Indexer;
  private wallet: any;
  private paymentAmount: number = 0;
  private mimirApiEndpoint: string = "https://voi-mainnet-mimirapi.nftnavigator.xyz";

  constructor(appId: number, algod: algosdk.Algodv2, indexer: algosdk.Indexer, wallet: any) {
    this.appId = appId;
    this.algod = algod;
    this.indexer = indexer;
    this.wallet = wallet;
  }

  async setPaymentAmount(amount: number) {
    this.paymentAmount = amount;
  }

  async spin(betAmount: number, gameId?: number): Promise<SpinResult> {
    try {
      console.log(`Spinning with bet: ${betAmount}, index: ${gameId || 0}`);
      
      if (!this.wallet || !this.wallet.address) {
        throw new Error("No wallet connected");
      }

      // 1. Construct transaction parameters
      const params = await this.algod.getTransactionParams().do();
      const senderAddress = this.wallet.address;
      
      // 2. Create application call transaction
      const betTx = algosdk.makeApplicationCallTxnFromObject({
        sender: senderAddress,
        appIndex: this.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new TextEncoder().encode("bet"),
          algosdk.encodeUint64(betAmount),
          algosdk.encodeUint64(gameId || 0)
        ],
        suggestedParams: params,
      });

      // 3. Create payment transaction for the bet amount
      const paymentTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: senderAddress,
        to: algosdk.getApplicationAddress(this.appId),
        amount: betAmount + 1000, // Add 1000 microVOI for box storage
        suggestedParams: params,
      });

      // 4. Group the transactions
      const txns = [betTx, paymentTx];
      algosdk.assignGroupID(txns);
      
      // 5. Sign transactions with wallet
      let signedTxns;
      try {
        if (this.wallet.signTransaction) {
          // If using custom wallet implementation
          signedTxns = await this.wallet.signTransaction(txns);
        } else {
          // Try using MimirAPI approach with Kibisis
          // @ts-ignore - kibisis is injected by the extension
          signedTxns = await window.kibisis.signTransactions(txns.map(txn => algosdk.encodeUnsignedTransaction(txn)));
        }
      } catch (error) {
        console.error("Error signing transaction:", error);
        return { txId: '', success: false, error: "Failed to sign transactions" };
      }

      // 6. Submit to network
      const response = await this.algod.sendRawTransaction(signedTxns).do();
      
      // 7. Wait for confirmation
      await algosdk.waitForConfirmation(this.algod, response.txid, 10);
      
      // 8. Return bet key
      return { 
        txId: response.txid, 
        success: true,
        return: `bet_${response.txid}` 
      };
    } catch (error) {
      console.error("Error in spin:", error);
      return { 
        txId: '', 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Method to check bet result using MimirAPI
  async checkBetResult(txId: string): Promise<{
    success: boolean;
    payout: number;
    error?: string;
  }> {
    try {
      const response = await axios.get(`${this.mimirApiEndpoint}/v1/slot/${this.appId}/bet/${txId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          payout: response.data.payout || 0
        };
      }
      
      return {
        success: false,
        payout: 0,
        error: "No payout information found"
      };
    } catch (error) {
      console.error("Error checking bet result:", error);
      return {
        success: false,
        payout: 0,
        error: error instanceof Error ? error.message : "Failed to check bet result"
      };
    }
  }

  // Method to claim winnings
  async claimWinnings(txId: string): Promise<{
    success: boolean;
    claimTxId?: string;
    error?: string;
  }> {
    try {
      if (!this.wallet || !this.wallet.address) {
        throw new Error("No wallet connected");
      }

      // 1. Construct transaction parameters
      const params = await this.algod.getTransactionParams().do();
      const senderAddress = this.wallet.address;
      
      // 2. Create application call transaction for claiming
      const claimTx = algosdk.makeApplicationCallTxnFromObject({
        sender: senderAddress,
        appIndex: this.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new TextEncoder().encode("claim"),
          new Uint8Array(Buffer.from(txId.replace('bet_', '')))
        ],
        suggestedParams: params,
      });

      // 3. Sign transaction with wallet
      let signedTxn;
      try {
        if (this.wallet.signTransaction) {
          // If using custom wallet implementation
          signedTxn = await this.wallet.signTransaction([claimTx]);
        } else {
          // Try using MimirAPI approach with Kibisis
          // @ts-ignore - kibisis is injected by the extension
          signedTxn = await window.kibisis.signTransactions([algosdk.encodeUnsignedTransaction(claimTx)]);
        }
      } catch (error) {
        console.error("Error signing claim transaction:", error);
        return { success: false, error: "Failed to sign claim transaction" };
      }

      // 4. Submit to network
      const response = await this.algod.sendRawTransaction(signedTxn).do();
      
      // 5. Wait for confirmation
      await algosdk.waitForConfirmation(this.algod, response.txid, 10);
      
      return {
        success: true,
        claimTxId: response.txid
      };
    } catch (error) {
      console.error("Error in claim:", error);
      return { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during claim"
      };
    }
  }
}
