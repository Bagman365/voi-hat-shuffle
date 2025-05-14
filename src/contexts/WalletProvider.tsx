
import React, { ReactNode } from 'react';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { Provider } from '@txnlab/use-wallet-react';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const wallets = [
    { id: 'pera', name: 'Pera Wallet', connector: PeraWalletConnect }, 
    { id: 'defly', name: 'Defly Wallet', connector: DeflyWalletConnect },
    { id: 'daffi', name: 'Daffi Wallet', connector: DaffiWalletConnect }
  ];

  return (
    <Provider
      wallets={wallets}
      nodeConfig={{ 
        network: 'voitest-v1', 
        nodeServer: 'https://testnet-api.voi.nodly.io',
        indexerServer: 'https://testnet-idx.voi.nodly.io'
      }}
    >
      {children}
    </Provider>
  );
};

export default WalletProvider;
