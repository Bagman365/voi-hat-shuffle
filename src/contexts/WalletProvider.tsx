
import React, { ReactNode } from 'react';
import {
  WalletProvider as TxnLabWalletProvider,
  PROVIDER_ID as TXN_PROVIDER_ID
} from '@txnlab/use-wallet';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Initialize our supported wallets
  const pera = new PeraWalletConnect();
  const defly = new DeflyWalletConnect();
  const daffi = new DaffiWalletConnect();
  
  // Configure providers
  const providers = [
    { id: TXN_PROVIDER_ID.PERA, client: pera },
    // Uncomment to enable these providers
    // { id: TXN_PROVIDER_ID.DEFLY, client: defly },
    // { id: TXN_PROVIDER_ID.DAFFI, client: daffi },
  ];

  return (
    <TxnLabWalletProvider
      providers={providers}
      nodeConfig={{ 
        network: 'voitest-v1', 
        nodeServer: 'https://testnet-api.voi.nodly.io',
        indexerServer: 'https://testnet-idx.voi.nodly.io'
      }}
    >
      {children}
    </TxnLabWalletProvider>
  );
};

export default WalletProvider;
