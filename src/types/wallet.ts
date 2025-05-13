
export interface WalletInfo {
  name: string;
  address: string;
  balance: number;
}

export type WalletProvider = 'vera' | 'kibisis' | 'pera' | 'defly' | 'walletconnect' | 'lute' | 'biatec' | null;

export interface WalletProviderOption {
  name: string;
  id: string;
  logo: string;
  available: boolean;
  recommended?: boolean;
}
