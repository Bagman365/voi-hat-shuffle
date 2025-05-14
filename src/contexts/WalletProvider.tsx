
import React, { ReactNode } from 'react';
import { WalletProvider as TxnLabWalletProvider } from '@txnlab/use-wallet';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <TxnLabWalletProvider
      wallets={[
        { id: 'pera', name: 'Pera Wallet' }, 
        { id: 'defly', name: 'Defly Wallet' },
        { id: 'daffi', name: 'Daffi Wallet' }
      ]}
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
