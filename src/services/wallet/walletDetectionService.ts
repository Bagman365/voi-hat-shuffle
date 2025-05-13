
import { BaseWalletService } from "./baseWalletService";

export class WalletDetectionService extends BaseWalletService {
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
}
